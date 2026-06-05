# 🎨 Shadcn UI & TypeScript Setup Guide

This guide explains how to set up the `catchup-app` project for Shadcn UI, Tailwind CSS, and TypeScript.

---

## 1. Prerequisites Installation

If starting from scratch, you need to install TypeScript, Tailwind CSS, PostCSS, Autoprefixer, and other required typings:

```bash
# Install Tailwind CSS and its PostCSS integration
npm install tailwindcss postcss autoprefixer @tailwindcss/postcss

# Install TypeScript and Vite TypeScript plugin support
npm install -D typescript @types/react @types/react-dom @types/node
```

---

## 2. Configuration Files

### A. TypeScript Setup (`tsconfig.json`)
Configure the compiler options to support Vite path aliases (e.g. `@/*` maps to `src/*`):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Aliasing */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### B. Tailwind CSS Setup (`tailwind.config.js` and `postcss.config.js`)
Initialize Tailwind configuration to search files for Tailwind classes:

`tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

`postcss.config.js` (for Tailwind v4 compatibility):
```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
}
```

Import Tailwind directives at the top of your main stylesheet (`src/index.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### C. Vite Alias Resolution (`vite.config.ts`)
Enable Vite to resolve TypeScript path aliases correctly:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

---

## 3. Initializing Shadcn UI (`components.json`)

To initialize Shadcn UI structure, run the initialization command:

```bash
npx shadcn@latest init
```

This generates a `components.json` configuration file in the project root:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## 4. Default Paths for Components and Styles

- **Default Path for UI Components:** `src/components/ui/`
- **Default Path for Styles:** `src/index.css`

### Why is `/components/ui/` important?

1. **Separation of Concerns:** It separates project-specific page layouts and feature components (e.g. `Sidebar.jsx`, `MetricCard.jsx`) from raw, reusable primitive UI components (e.g. `Button`, `Input`, `Dialog`).
2. **CLI Automation:** The Shadcn CLI depends on the configurations in `components.json`. If you run `npx shadcn@latest add button`, it automatically looks up the `aliases.components` path and creates the component in the designated `ui/` directory. Changing this path layout breaks the automation registry tools.
3. **Ecosystem Conventions:** Standardizing on `components/ui` makes importing community-designed layouts and code templates seamless without requiring manual adjustment of import paths.
