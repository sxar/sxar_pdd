# Pragmatic Drag and Drop Demo Application

A comprehensive demonstration application showcasing all the major use cases and patterns of the Pragmatic drag and drop library.

## Features

This demo application includes the following drag and drop patterns:

1. **Board / Kanban** - Multi-column board with draggable cards between columns and column reordering
2. **Sortable List** - Single column list with drag handles and reordering
3. **Tree Structure** - Hierarchical tree view with expandable nodes
4. **Grid Layout** - Draggable grid with position swapping
5. **File Upload** - External drag adapter for file drops from desktop
6. **Data Table** - Sortable table rows (simplified demo)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Drag and Drop**: Pragmatic drag and drop library
- **Styling**: CSS Modules

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## Setup Instructions

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Project Settings > API
3. The database migrations have already been applied to create the necessary tables

### 2. Configure Environment Variables

Create a `.env.local` file in the root of the demo-app directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Database Schema

The application uses the following tables:

- `boards` - Board container
- `columns` - Board columns
- `cards` - Cards within columns
- `list_items` - Sortable list items
- `tree_items` - Hierarchical tree nodes
- `grid_items` - Grid image items

Sample data is automatically seeded during migration.

## Testing

All draggable and droppable elements include `data-testid` attributes for easy UI testing:

- `pattern-card-{id}` - Pattern selection cards
- `board` - Board container
- `column-{id}` - Board columns
- `card-{id}` - Board cards
- `sortable-list` - List container
- `list-item-{id}` - List items
- `tree` - Tree container
- `grid` - Grid container
- `grid-item-{src}` - Grid items
- `file-drop-zone` - File upload drop zone
- `data-table` - Table container

## Project Structure

```
demo-app/
├── src/
│   ├── app/
│   │   ├── board/          # Board/Kanban pattern
│   │   ├── list/           # Sortable list pattern
│   │   ├── tree/           # Tree structure pattern
│   │   ├── grid/           # Grid layout pattern
│   │   ├── file/           # File upload pattern
│   │   ├── table/          # Data table pattern
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   └── PageLayout.tsx  # Shared page layout
│   └── lib/
│       └── supabase.ts     # Supabase client
├── supabase/
│   └── migrations/         # Database migrations
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Key Features for Testing

### Drag and Drop Capabilities

- **Multi-directional dragging**: Horizontal (columns), vertical (lists, cards)
- **Cross-container drops**: Move cards between columns
- **Position indicators**: Visual feedback showing drop location
- **Sticky drop targets**: Enhanced UX with sticky behavior on grid
- **External drops**: File system integration for uploads
- **Keyboard accessibility**: All patterns support keyboard navigation

### Database Integration

All drag operations persist to Supabase:
- Card positions update on move
- Column order saves on reorder
- List item positions sync on drag
- Grid positions update on swap

### Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablet devices
- Mobile phones (with touch support)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari
- Android Chrome

## Development

To build for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## License

This demo application is built with the Pragmatic drag and drop library by Atlassian.
