### Mini Website Builder

**Mini Website Builder** is a drag‑and‑drop Next.js app for composing simple landing pages from reusable sections (header, hero, CTA, footer, contact, about, etc.), with live preview, per‑section editing, theming, and auto‑persistence.

---

### Tech stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS + custom CSS utilities (`glass-effect`, animations)
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`
- **Icons & Animations**:
  - `lucide-react` for icons
  - `gsap` for entrance / interaction animations
- **State & Theming**:
  - React hooks
  - Custom `ThemeContext` (light/dark mode)
- **Persistence**:
  - `localStorage` (`mini-builder:sections`)
  - JSON import/export

---

### Getting started

**Install dependencies**

```bash
npm install
```

**Run in development**

```bash
npm run dev
```

Then open `http://localhost:3000`.

---

### Main features

#### Section library & drag‑and‑drop

- Sidebar “Section library” lists available section types:
  - `header`, `hero`, `cta`, `footer`, `contact`, `about`, etc.
- Clicking a section adds it to the page (defaults from `data/templates.ts`).
- Sections are sortable via drag‑and‑drop in the preview area.

#### Component‑aware Section Editor

Click the edit icon on any section to open the **Section Editor** modal:

- **Header**:
  - Logo / site name
  - Background color
  - Nav labels (Home, About, Services, Contact)
  - Header button text
- **Hero**:
  - Headline
  - Subheading
  - Background color
  - Hero image URL
  - Primary button label
- **CTA**:
  - Title
  - Description
  - Button label
- **Contact**:
  - Title
  - Helper text
  - Submit button label (used in the contact form preview)
- **About / Footer / Generic**:
  - Title + description and/or footer text

Changes are saved into `sections` state and immediately reflected in the preview.

#### Persistence & JSON import/export

- **Auto‑save**:
  - Every time `sections` changes, the app writes:
    - `localStorage['mini-builder:sections'] = JSON.stringify({ sections })`
  - On mount, it loads from this key if present so you can continue editing after closing the app.
- **Export/Import** (`components/ExportImport.tsx`):
  - Export current layout to a `.json` config file.
  - Import a previously saved `.json` to restore a layout.

---

### Code structure
```bash
├── app
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── ClientLayout.tsx
│   ├── ExportImport.tsx
│   ├── PreviewArea.tsx
│   ├── SectionEditor.tsx
│   └── ThemeContext.tsx
├── data
│   └── templates.ts
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── tsconfig.json
└── types
    └── index.ts
```
