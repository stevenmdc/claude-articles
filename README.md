# Claude Articles

A Next.js application replicating the Claude Articles layout with a clean, professional design.

## Features

- 🎨 Cream navbar (#f0f0eb) with Claude branding
- 📑 Fixed sidebar table of contents with 8 chapters
- ✨ Active chapter highlighting in yellow
- 🔗 Sky-500 hyperlinks with hover effects
- 📱 Responsive layout
- 🎯 Clean typography using Tiempos Text for headings and system fonts for body

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
claude-articles/
├── app/
│   ├── layout.tsx       # Root layout with navbar & sidebar
│   ├── page.tsx         # Main article content
│   └── globals.css      # Global styles
├── components/
│   ├── Navbar.tsx       # Top navigation
│   └── TableOfContents.tsx # Sidebar menu
└── PLAN.md              # Detailed project documentation
```

## Key Features Explained

### Navigation
- **Navbar**: Fixed at top with logo, language selector, and pricing link
- **Sidebar**: Fixed table of contents with smooth scrolling to sections
- **Active State**: Current chapter highlighted in yellow background

### Styling
- **Fonts**: 
  - Tiempos Text (serif) for H1 and H2
  - System UI for body text
- **Colors**:
  - Cream background (#f0f0eb) for navbar
  - Sky-500 for links and hover states
  - Yellow-100 for active chapter highlighting

### Layout
- Sidebar: 256px wide, fixed position
- Main content: Centered with max-width, left margin for sidebar
- No footer (as specified)

## Customization

Edit the content in `app/page.tsx` to modify the article text.

Update chapters in `components/TableOfContents.tsx` to change the sidebar menu.

Modify colors and styles in `tailwind.config.js` and `app/globals.css`.

## Build for Production

```bash
npm run build
npm start
```

## License

This is a demo project created for educational purposes.
