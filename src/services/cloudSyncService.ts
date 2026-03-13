import { supabase } from "./supabase";
import type { CloudConnection, CloudProvider, SyncResult } from "@/types";

// ─── OAuth URLs ───────────────────────────────────────────────────────────────
// These redirect to your app's OAuth callback route
const OAUTH_CONFIGS = {
  google_drive: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "https://www.googleapis.com/auth/drive.file",
    uploadUrl: (fileId?: string) =>
      fileId
        ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
        : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    createFolderUrl: "https://www.googleapis.com/drive/v3/files",
  },
  onedrive: {
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    scope: "Files.ReadWrite offline_access",
    uploadUrl: (folderId: string, filename: string) =>
      `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}:/${filename}:/content`,
    createFolderUrl: "https://graph.microsoft.com/v1.0/me/drive/root/children",
  },
};

export const cloudSyncService = {

  // ── Connection management ──────────────────────────────────────────────────

  async getConnections(userId: string): Promise<CloudConnection[]> {
    const { data, error } = await supabase
      .from("user_cloud_connections")
      .select("*")
      .eq("user_id", userId)
      .order("connected_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getConnection(userId: string, provider: CloudProvider): Promise<CloudConnection | null> {
    const { data } = await supabase
      .from("user_cloud_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("provider", provider)
      .single();
    return data ?? null;
  },

  async saveConnection(
    userId: string,
    provider: CloudProvider,
    tokens: { access_token: string; refresh_token?: string },
    folder?: { id: string; name: string }
  ): Promise<CloudConnection> {
    const payload = {
      user_id: userId,
      provider,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? null,
      folder_id: folder?.id ?? null,
      folder_name: folder?.name ?? null,
      connected_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("user_cloud_connections")
      .upsert(payload, { onConflict: "user_id,provider" })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async disconnect(userId: string, provider: CloudProvider): Promise<void> {
    const { error } = await supabase
      .from("user_cloud_connections")
      .delete()
      .eq("user_id", userId)
      .eq("provider", provider);
    if (error) throw error;
  },

  // ── OAuth initiation ───────────────────────────────────────────────────────
  // Call this to open the OAuth popup/redirect

  getOAuthUrl(provider: CloudProvider, redirectUri: string, clientId: string): string {
    const cfg = OAUTH_CONFIGS[provider];
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: cfg.scope,
      access_type: "offline",
      prompt: "consent",
    });
    return `${cfg.authUrl}?${params.toString()}`;
  },

  // ── Folder management ──────────────────────────────────────────────────────

  async createGoogleDriveFolder(accessToken: string, folderName: string): Promise<{ id: string; name: string }> {
    const res = await fetch(OAUTH_CONFIGS.google_drive.createFolderUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      }),
    });
    if (!res.ok) throw new Error("Error al crear carpeta en Google Drive");
    const data = await res.json();
    return { id: data.id, name: data.name };
  },

  async createOneDriveFolder(accessToken: string, folderName: string): Promise<{ id: string; name: string }> {
    const res = await fetch(OAUTH_CONFIGS.onedrive.createFolderUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: folderName,
        folder: {},
        "@microsoft.graph.conflictBehavior": "rename",
      }),
    });
    if (!res.ok) throw new Error("Error al crear carpeta en OneDrive");
    const data = await res.json();
    return { id: data.id, name: data.name };
  },

  // ── File upload ────────────────────────────────────────────────────────────

  async uploadFileToGoogleDrive(
    accessToken: string,
    folderId: string,
    file: { name: string; url: string; mimeType: string }
  ): Promise<boolean> {
    try {
      // Fetch the file content from Supabase Storage
      const fileRes = await fetch(file.url);
      const blob = await fileRes.blob();

      const metadata = {
        name: file.name,
        parents: [folderId],
      };

      const form = new FormData();
      form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      form.append("file", blob, file.name);

      const res = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form,
        }
      );
      return res.ok;
    } catch {
      return false;
    }
  },

  async uploadFileToOneDrive(
    accessToken: string,
    folderId: string,
    file: { name: string; url: string }
  ): Promise<boolean> {
    try {
      const fileRes = await fetch(file.url);
      const blob = await fileRes.blob();

      const res = await fetch(
        `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}:/${file.name}:/content`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/octet-stream",
          },
          body: blob,
        }
      );
      return res.ok;
    } catch {
      return false;
    }
  },

  // ── Sync gallery ──────────────────────────────────────────────────────────

  async syncGallery(
    userId: string,
    provider: CloudProvider,
    items: Array<{ id: string; public_url: string; type: string; uploaded_at: string }>
  ): Promise<SyncResult> {
    const connection = await this.getConnection(userId, provider);
    if (!connection) throw new Error(`No hay conexión con ${provider}`);

    const { access_token, folder_id } = connection;
    if (!folder_id) throw new Error("No hay carpeta configurada");

    let synced = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const item of items) {
      const filename = `galeria_${item.id}.${item.type === "video" ? "mp4" : "jpg"}`;
      try {
        const ok = provider === "google_drive"
          ? await this.uploadFileToGoogleDrive(access_token, folder_id, {
              name: filename,
              url: item.public_url,
              mimeType: item.type === "video" ? "video/mp4" : "image/jpeg",
            })
          : await this.uploadFileToOneDrive(access_token, folder_id, {
              name: filename,
              url: item.public_url,
            });

        if (ok) synced++; else { failed++; errors.push(filename); }
      } catch (e: any) {
        failed++;
        errors.push(`${filename}: ${e.message}`);
      }
    }

    // Update last_sync_at
    await supabase
      .from("user_cloud_connections")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", connection.id);

    return {
      provider,
      synced_files: synced,
      failed_files: failed,
      synced_at: new Date().toISOString(),
      errors,
    };
  },

  // ── Sync documents ────────────────────────────────────────────────────────

  async syncDocuments(
    userId: string,
    provider: CloudProvider,
    docs: Array<{ id: string; name: string; public_url: string; file_type: string }>
  ): Promise<SyncResult> {
    const connection = await this.getConnection(userId, provider);
    if (!connection) throw new Error(`No hay conexión con ${provider}`);

    const { access_token, folder_id } = connection;
    if (!folder_id) throw new Error("No hay carpeta configurada");

    let synced = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const doc of docs) {
      try {
        const ok = provider === "google_drive"
          ? await this.uploadFileToGoogleDrive(access_token, folder_id, {
              name: doc.name,
              url: doc.public_url,
              mimeType: doc.file_type,
            })
          : await this.uploadFileToOneDrive(access_token, folder_id, {
              name: doc.name,
              url: doc.public_url,
            });

        if (ok) synced++; else { failed++; errors.push(doc.name); }
      } catch (e: any) {
        failed++;
        errors.push(`${doc.name}: ${e.message}`);
      }
    }

    await supabase
      .from("user_cloud_connections")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", connection.id);

    return {
      provider,
      synced_files: synced,
      failed_files: failed,
      synced_at: new Date().toISOString(),
      errors,
    };
  },
};
