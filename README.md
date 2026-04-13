# Cinqa Tracker

Internal content tracking app built with Next.js 14, Supabase, and Tailwind CSS.

---

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Postgres + Google OAuth)
- **Tailwind CSS**
- **@dnd-kit** — drag-to-reorder columns
- **SheetJS (xlsx)** — Excel export

---

## Setup Guide

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New Project.

### 2. Run the SQL schema

In Supabase Studio → **SQL Editor**, run these files in order:

1. `supabase/schema.sql` — creates tables + auth trigger
2. `supabase/rls.sql` — enables RLS + policies
3. (optional) `supabase/seed.sql` — inserts sample ai-influencer data

### 3. Enable Google OAuth

In Supabase Dashboard → **Authentication → Providers → Google**:
- Enable Google provider
- Add your Google OAuth **Client ID** and **Client Secret** (from [console.cloud.google.com](https://console.cloud.google.com))

### 4. Configure redirect URLs

In Supabase Dashboard → **Authentication → URL Configuration**:
- **Site URL**: `http://localhost:3000` (dev) or your production domain
- **Redirect URLs**: Add `http://localhost:3000/auth/callback`

In Google Cloud Console → OAuth 2.0 credentials:
- Authorized redirect URIs: `https://<your-project>.supabase.co/auth/v1/callback`

### 5. Copy env vars

```bash
cp .env.example .env.local
```

Fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourcompany.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 6. Install and run

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

---

## Granting Admin Access

After your first sign-in, grant yourself admin access in Supabase Studio → SQL Editor:

```sql
update profiles set role = 'admin' where email = 'your@email.com';
```

Then refresh the app — the sidebar will show **+ New List** and **Users** links.

---

## Features

| Feature | Who |
|---|---|
| View all lists & records | Everyone |
| Edit cell values inline | Everyone |
| Create / delete lists | Admin |
| Add / edit / delete columns | Admin |
| Drag-reorder columns | Admin |
| Export CSV / Excel | Admin |
| Manage user roles | Admin |

### Column types

- **Text** — plain text
- **Number** — numeric input
- **URL** — clickable link
- **Date** — date picker
- **Checkbox** — true/false toggle
- **Dropdown** — custom options list
- **Status** — colored pill badges
- **User** — team member assignee picker

---

## Routes

| Route | Description |
|---|---|
| `/login` | Google sign-in page |
| `/` | Redirects to first list |
| `/list/[id]` | Table view for a list |
| `/users` | Admin user management |

---

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── auth/            # Google sign-in button
│   ├── column/          # Column edit modal + options menu
│   ├── export/          # CSV/Excel export menu
│   ├── layout/          # AppShell + Sidebar
│   ├── modals/          # New List Wizard (3-step)
│   ├── table/           # ListTable + all cell types
│   ├── ui/              # Design system primitives
│   └── users/           # User management table
├── lib/
│   ├── actions/         # Next.js Server Actions
│   ├── export/          # Export utilities
│   ├── hooks/           # React hooks
│   ├── supabase/        # Client factory (3 variants)
│   └── utils/           # Color maps, formatters
├── middleware.ts         # Route protection
└── types/               # TypeScript types
supabase/
├── schema.sql
├── rls.sql
└── seed.sql
```
