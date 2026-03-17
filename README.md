### Mini Website Builder

**Mini Website Builder** is a drag‑and‑drop Next.js app for composing simple landing pages from reusable sections (header, hero, CTA, footer, contact, about, etc.), with live preview, per‑section editing, theming, and auto‑persistence.

---

### Tech stack

- **Framework**: Next.js (App Router, TypeScript)
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
# or
yarn install
```

**Run in development**

```bash
npm run dev
```

Then open `http://localhost:3000`.

**Production build**

```bash
npm run build
npm start
```

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

#### Light/Dark theme via context

- `ThemeContext` (`components/ThemeContext.tsx`) exposes:
  - `theme: 'light' | 'dark'`
  - `toggleTheme()`
- `ClientLayout` wraps the app in `ThemeProvider`.
- `page.tsx`, `SectionEditor`, and `PreviewArea` use `useTheme()` to:
  - Switch backgrounds and text colors.
  - Adjust card, header, footer, and form styling for each theme.

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

- `app/layout.tsx` – Root layout, loads global CSS and wraps children in `ClientLayout`.
- `app/page.tsx` – Main builder page:
  - Manages `sections`, DnD, theme toggle, persistence, and the editor modal.
- `app/globals.css` – Tailwind base import + global styles, scrollbars, glass effects, animations, and theme‑aware body rules.
- `components/ClientLayout.tsx` – Global UI effects (custom cursor, background blobs) + `ThemeProvider`.
- `components/ThemeContext.tsx` – Theme context and `useTheme` hook.
- `components/PreviewArea.tsx` – Renders all sections and their visual variants based on `Section['type']` and theme.
- `components/SectionEditor.tsx` – Modal editor with per‑type forms and inline preview.
- `components/ExportImport.tsx` – JSON export/import UI + GSAP animations and feedback toasts.
- `data/templates.ts` – Default content for each section type.
- `types/index.ts` – `Section` and `WebsiteConfig` TypeScript interfaces.

---

### Extending the builder

To add a new section type:

1. Add the literal to `Section['type']` in `types/index.ts`.
2. Provide default content in `data/templates.ts`.
3. Add it to `sectionTypes` in `app/page.tsx`.
4. Implement its preview in `renderSectionPreview` in `components/PreviewArea.tsx`.
5. Add a `case` in `renderFieldsByType` in `components/SectionEditor.tsx` for a tailored edit form.
