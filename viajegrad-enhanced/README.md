# 🎓 ViajeGrad — Graduation Trip Organizer

A full-stack collaborative platform for parents to organize their children's school graduation trip. Built with **Next.js 15**, **TypeScript**, **TailwindCSS**, and **Supabase**.

---

## 🚀 Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Framework    | Next.js 15 (App Router)        |
| Language     | TypeScript                     |
| Styling      | TailwindCSS                    |
| Database     | Supabase (PostgreSQL)          |
| Auth         | Supabase Auth                  |
| Storage      | Supabase Storage               |
| Fonts        | Playfair Display + DM Sans     |
| i18n         | Built-in ES/PT support         |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          # Authentication page
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard layout (sidebar + topnav)
│   │   ├── dashboard/page.tsx      # Home dashboard
│   │   ├── events/page.tsx         # Events management
│   │   ├── finance/page.tsx        # Financial tracking
│   │   ├── commissions/page.tsx    # Work groups/commissions
│   │   ├── gallery/page.tsx        # Photo & video gallery
│   │   ├── documents/page.tsx      # Document repository
│   │   ├── games/page.tsx          # Leaderboard & pools
│   │   └── profile/page.tsx        # User profile
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                    # Root redirect
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx             # Left navigation sidebar
│   │   └── TopNav.tsx              # Top navigation bar
│   └── ui/
│       ├── index.tsx               # Badge, Avatar, Modal, StatCard, EmptyState, Skeleton
│       ├── Card.tsx                # Card + CardHeader components
│       ├── Button.tsx              # Button variants
│       └── LangSwitcher.tsx        # ES/PT language switcher
│
├── hooks/
│   ├── useAuth.ts                  # Auth state + sign in/out/up
│   ├── useEvents.ts                # Events CRUD
│   └── useData.ts                  # Finance, Gallery, Documents, Games
│
├── services/
│   ├── supabase.ts                 # Supabase client + storage helpers
│   ├── eventsService.ts            # Events API calls
│   ├── financeService.ts           # Finance API calls
│   ├── galleryService.ts           # Gallery upload/delete
│   ├── documentsService.ts         # Documents upload/delete/download
│   └── gamesService.ts             # Pools + leaderboard
│
├── types/
│   └── index.ts                    # All TypeScript interfaces
│
└── lib/
    ├── utils.ts                    # cn(), formatCurrency(), formatDate()...
    └── i18n/
        ├── index.tsx               # LangProvider + useLang hook
        ├── es.ts                   # Spanish translations
        └── pt.ts                   # Portuguese translations
```

---

## ⚡ Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd viajegrad
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set up Supabase

Run the SQL schema in your Supabase project:

```bash
# Open Supabase dashboard > SQL Editor
# Paste and run the contents of: supabase-schema.sql
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Supabase Tables

| Table               | Description                          |
|---------------------|--------------------------------------|
| `users`             | User profiles (extends auth.users)   |
| `events`            | Events (fundraising, trips, etc.)    |
| `event_participants`| Event attendance                     |
| `transactions`      | Financial income/expenses            |
| `commissions`       | Work groups                          |
| `commission_members`| Commission membership                |
| `commission_tasks`  | Tasks within commissions             |
| `gallery_items`     | Photos and videos                    |
| `documents`         | Shared files                         |
| `pools`             | Games/raffles/challenges             |
| `pool_participants` | Pool entries                         |
| `leaderboard`       | View: aggregated scores              |
| `activity_feed`     | Recent activity log                  |

---

## 🎨 Design System

### Colors
- **Navy** (`navy-*`): Primary UI color for text, backgrounds
- **Amber** (`amber-*`): Brand accent, CTAs, highlights
- **Cream** (`cream-*`): Light backgrounds, borders
- **Coral** (`coral-*`): Danger/error states

### Typography
- **Display**: Playfair Display (serif) — headings, logo
- **Body**: DM Sans — UI text, labels, paragraphs

### Components
- `<Card>` / `<CardHeader>` — main content containers
- `<Button>` — primary, secondary, outline, danger variants
- `<Badge>` — status indicators
- `<Avatar>` — user avatars with initials fallback
- `<Modal>` — dialog overlay
- `<StatCard>` — KPI tiles
- `<EmptyState>` — zero state placeholder
- `<Skeleton>` — loading placeholder

---

## 🌍 Internationalization

The app supports **Spanish (es)** and **Portuguese (pt)**. Language preference is stored in `localStorage`.

```tsx
import { useLang } from "@/lib/i18n";

function MyComponent() {
  const { t, lang, setLang } = useLang();
  return <h1>{t.dashboard.stats.totalRaised}</h1>;
}
```

---

## 🔐 Authentication Flow

1. User lands on `/login`
2. Signs in with email/password via Supabase Auth
3. Auth state managed by `useAuth()` hook
4. Dashboard layout reads auth state; redirects to `/login` if unauthenticated
5. User profile loaded from `public.users` table via `fetchProfile()`

---

## 📊 Supabase API Usage Examples

### Fetch upcoming events
```ts
const { data } = await supabase
  .from("events")
  .select("*")
  .gte("date", new Date().toISOString())
  .eq("status", "upcoming")
  .order("date", { ascending: true })
  .limit(5);
```

### Add a transaction
```ts
const { data } = await supabase
  .from("transactions")
  .insert({ type: "income", amount: 500, description: "Bingo proceeds", responsible_id: userId, date: new Date().toISOString() })
  .select()
  .single();
```

### Upload a photo
```ts
const { data } = await supabase.storage
  .from("gallery")
  .upload(`${userId}/${Date.now()}.jpg`, file, { upsert: true });

const { data: { publicUrl } } = supabase.storage
  .from("gallery")
  .getPublicUrl(data.path);
```

---

## 🏗️ Production Checklist

- [ ] Set Supabase RLS policies for each table
- [ ] Configure Supabase Storage bucket policies
- [ ] Add `middleware.ts` for auth-protected routes
- [ ] Set up Supabase email templates
- [ ] Add error boundaries
- [ ] Set up Vercel/Netlify deployment
- [ ] Configure `next.config.ts` image domains
- [ ] Run `npm run build` to verify no TypeScript errors

---

## 📄 License

MIT — built for ViajeGrad 2025 🎓
