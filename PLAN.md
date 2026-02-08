# Claude Articles - Project Plan

## Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Design Specifications

### Colors
- **Background (Navbar)**: `#f0f0eb` (cream)
- **Hyperlinks & Hover**: `sky-500` (Tailwind)
- **Active Chapter Highlight**: `yellow-100` (light yellow background)

### Typography
- **Headings (H1, H2)**: "Tiempos Text Regular" (serif font)
- **Body Text**: system-ui (native system font stack)
- **Font Sizes**:
  - H1: `text-4xl`
  - H2: `text-3xl`
  - H3: `text-xl`
  - Body: `text-base` / `text-sm`

### Layout Structure

#### Navbar (Fixed Top)
- Background: cream (#f0f0eb)
- Left side: Logo (⚡) + "Claude Articles"
- Right side: "English" (with dropdown) + "Pricing"
- Border bottom
- Fixed positioning

#### Sidebar (Left)
- Width: 256px (w-64)
- Fixed position
- Table of contents with numbered chapters
- Active chapter highlighted in yellow
- Smooth scrolling to sections
- Hover effects with sky-500 color

#### Main Content Area
- Left margin to account for sidebar (ml-64)
- Max width container (max-w-3xl)
- Centered content
- Generous padding and spacing

### Features

#### Navigation
- Sticky navbar at top
- Fixed table of contents sidebar
- Smooth scroll to chapter sections
- Active chapter highlighting

#### Interactive Elements
- Hover effects on links (sky-500)
- Clickable chapter menu items
- Language selector dropdown
- All links styled consistently

#### Content Formatting
- Bulleted lists with proper spacing
- Hyperlinks styled in sky-500
- Nested lists supported
- Code-like boxes for special callouts (gray background)
- Proper hierarchy with headings

## File Structure
```
claude-articles/
├── app/
│   ├── layout.tsx          # Root layout with navbar & sidebar
│   ├── page.tsx            # Main article content
│   └── globals.css         # Global styles & Tailwind
├── components/
│   ├── Navbar.tsx          # Top navigation bar
│   └── TableOfContents.tsx # Left sidebar chapter menu
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── postcss.config.js
```

## Key Components

### Navbar Component
- Fixed to top of viewport
- Cream background (#f0f0eb)
- Claude branding on left
- Language selector and Pricing link on right
- Responsive hover states

### TableOfContents Component
- Fixed sidebar navigation
- 8 chapter items
- Active state tracking
- Yellow highlight for current chapter
- Smooth scroll behavior
- Hover effects

### Main Article
- Structured with semantic HTML
- Proper heading hierarchy
- Lists and links styled consistently
- Sections linked to table of contents
- No footer as requested

## Styling Guidelines

### Spacing
- Generous padding and margins
- Consistent vertical rhythm
- Proper list spacing

### Colors
- Minimal color palette
- Sky-500 for interactive elements
- Yellow-100 for active states
- Gray scale for text hierarchy

### Typography
- Tiempos Text for headings (elegant serif)
- System UI for body text (native feel)
- Clear size hierarchy
- Proper line height

## Notable Exclusions
- No footer section (as requested)
- No search functionality
- No authentication
- No backend/API

## Development Commands
```bash
npm install    # Install dependencies
npm run dev    # Start development server (port 3000)
npm run build  # Build for production
npm start      # Start production server
```

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design considerations
- Proper font fallbacks
