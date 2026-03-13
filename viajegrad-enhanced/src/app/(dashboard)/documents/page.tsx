"use client";

import { useState, useRef } from "react";
import { Upload, Download, Trash2, FileText, File, Image, Table, Search, Eye, FolderOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge, EmptyState } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useLang } from "@/lib/i18n";
import { formatDate, formatFileSize, cn } from "@/lib/utils";
import type { Document, DocumentCategory } from "@/types";

const MOCK_DOCS: Document[] = [
  { id: "1", name: "Modelo de autorización.pdf",       description: "Autorización de padres para el viaje",           storage_path: "", public_url: "#", file_size: 245000,  file_type: "application/pdf",          category: "consent",  uploaded_by: "u1", uploaded_at: "2025-04-08T10:00:00Z", uploader: { id: "u1", full_name: "María García"    } },
  { id: "2", name: "Informe presupuesto Q1.xlsx",      description: "Resumen financiero del primer trimestre",        storage_path: "", public_url: "#", file_size: 128000,  file_type: "application/vnd.ms-excel", category: "budget",   uploaded_by: "u1", uploaded_at: "2025-04-05T14:00:00Z", uploader: { id: "u1", full_name: "Ana López"        } },
  { id: "3", name: "Contrato hotel - Punta Cana.pdf",  description: "Contrato firmado con el resort",                 storage_path: "", public_url: "#", file_size: 1200000, file_type: "application/pdf",          category: "contract", uploaded_by: "u2", uploaded_at: "2025-04-01T09:00:00Z", uploader: { id: "u2", full_name: "Pedro Martínez"  } },
  { id: "4", name: "Acta reunión marzo.docx",          description: "Notas de la reunión de planificación de marzo",  storage_path: "", public_url: "#", file_size: 56000,   file_type: "application/msword",       category: "report",   uploaded_by: "u2", uploaded_at: "2025-03-25T17:00:00Z", uploader: { id: "u2", full_name: "Carlos R."       } },
  { id: "5", name: "Ficha médica en blanco.pdf",       description: "Formulario de información médica del alumno",    storage_path: "", public_url: "#", file_size: 89000,   file_type: "application/pdf",          category: "consent",  uploaded_by: "u3", uploaded_at: "2025-03-20T11:00:00Z", uploader: { id: "u3", full_name: "Lucía F."        } },
  { id: "6", name: "Listado de participantes.xlsx",    description: "48 alumnos y familias confirmados",              storage_path: "", public_url: "#", file_size: 72000,   file_type: "application/vnd.ms-excel", category: "report",   uploaded_by: "u3", uploaded_at: "2025-03-18T08:30:00Z", uploader: { id: "u3", full_name: "María García"    } },
];

const CATEGORY_BADGE: Record<DocumentCategory, "default" | "success" | "info" | "warning" | "danger"> = {
  contract: "info", report: "default", budget: "success", consent: "warning", other: "default",
};

const CATEGORY_EMOJIS: Record<DocumentCategory, string> = {
  contract: "📝", report: "📊", budget: "💰", consent: "✅", other: "📄",
};

function FileIcon({ fileType }: { fileType: string }) {
  if (fileType.includes("pdf"))                                   return <FileText size={20} className="text-red-500" />;
  if (fileType.includes("image"))                                 return <Image    size={20} className="text-purple-500" />;
  if (fileType.includes("excel") || fileType.includes("spread")) return <Table    size={20} className="text-emerald-500" />;
  return                                                                 <File     size={20} className="text-blue-500" />;
}

function DocRow({ doc, catLabel }: { doc: Document; catLabel: string }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-cream-50 transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center flex-shrink-0">
        <FileIcon fileType={doc.file_type} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-navy-800 truncate">{doc.name}</p>
          <Badge variant={CATEGORY_BADGE[doc.category]}>
            {CATEGORY_EMOJIS[doc.category]} {catLabel}
          </Badge>
        </div>
        {doc.description && (
          <p className="text-xs text-navy-400 mt-0.5 truncate">{doc.description}</p>
        )}
        <div className="flex items-center gap-3 mt-1 text-[11px] text-navy-400">
          <span>{formatFileSize(doc.file_size)}</span>
          <span>·</span>
          <span>{(doc.uploader as { full_name: string })?.full_name}</span>
          <span>·</span>
          <span>{formatDate(doc.uploaded_at)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 rounded-lg text-navy-300 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Preview">
          <Eye size={14} />
        </button>
        <button className="p-2 rounded-lg text-navy-300 hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Descargar">
          <Download size={14} />
        </button>
        <button className="p-2 rounded-lg text-navy-300 hover:bg-red-50 hover:text-red-500 transition-colors" title="Eliminar">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const { t }  = useLang();
  const d      = t.documents;

  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState<DocumentCategory | "all">("all");
  const inputRef                  = useRef<HTMLInputElement>(null);

  const cats: Array<DocumentCategory | "all"> = ["all", "contract", "report", "budget", "consent", "other"];

  const filtered = MOCK_DOCS.filter(doc => {
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === "all" || doc.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalSize = MOCK_DOCS.reduce((s, doc) => s + doc.file_size, 0);

  return (
    <div className="space-y-5 page-enter">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: d.stats.total,     value: MOCK_DOCS.length,                                          emoji: "📁", color: "text-navy-800"    },
          { label: d.stats.contracts, value: MOCK_DOCS.filter(x => x.category === "contract").length,   emoji: "📝", color: "text-blue-600"    },
          { label: d.stats.consents,  value: MOCK_DOCS.filter(x => x.category === "consent").length,    emoji: "✅", color: "text-amber-600"   },
          { label: "Tamaño total",    value: formatFileSize(totalSize),                                  emoji: "💾", color: "text-emerald-600" },
        ].map(({ label, value, emoji, color }) => (
          <Card key={label} padding="sm" className="text-center hover:shadow-card-hover transition-all">
            <p className="text-xl mb-1">{emoji}</p>
            <p className={cn("text-xl font-bold", color)}>{value}</p>
            <p className="text-xs text-navy-400 mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-cream-200 rounded-xl px-3 py-2 flex-1 min-w-[200px] shadow-card">
          <Search size={14} className="text-navy-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={d.searchPlaceholder}
            className="bg-transparent text-sm text-navy-700 placeholder:text-navy-300 outline-none flex-1"
          />
        </div>

        {/* Category filter chips */}
        <div className="flex gap-1.5 flex-wrap">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                filterCat === c
                  ? "bg-navy-900 text-white border-navy-900"
                  : "bg-white border-cream-200 text-navy-500 hover:border-navy-300"
              )}
            >
              {c === "all" ? "Todos" : `${CATEGORY_EMOJIS[c as DocumentCategory]} ${d.categories[c]}`}
            </button>
          ))}
        </div>

        <input ref={inputRef} type="file" multiple className="hidden" />
        <Button icon={<Upload size={14} />} onClick={() => inputRef.current?.click()}>{d.upload}</Button>
      </div>

      {/* Document list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={24} />}
          title={d.empty.title}
          description={d.empty.desc}
          action={<Button icon={<Upload size={14} />}>{d.upload}</Button>}
        />
      ) : (
        <Card padding="none">
          <div className="divide-y divide-cream-100">
            {filtered.map(doc => (
              <DocRow key={doc.id} doc={doc} catLabel={d.categories[doc.category]} />
            ))}
          </div>
          <div className="px-5 py-3 border-t border-cream-100 flex items-center justify-between">
            <p className="text-xs text-navy-400">{filtered.length} archivo{filtered.length !== 1 ? "s" : ""}</p>
            {filterCat !== "all" && (
              <button onClick={() => setFilterCat("all")} className="text-xs text-amber-500 hover:text-amber-600 font-medium">
                Ver todos
              </button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
