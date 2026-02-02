# 嗨呀 (HaiYa) - Daily Mood Tracker

## Overview
A Chinese-language daily mood tracking application that helps users record and reflect on their daily emotional states. The app features a cute mascot (nerd emoji with glasses), sound effects, and theme customization.

## Project Structure
```
├── src/
│   ├── App.tsx          # Main app with routing
│   ├── main.tsx         # Entry point
│   ├── index.css        # Global styles with theme variables
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   └── ...          # Custom components
│   ├── pages/           # Route pages
│   │   ├── Index.tsx        # Home page
│   │   ├── RecordPage.tsx   # Mood recording
│   │   ├── HistoryPage.tsx  # Past entries
│   │   ├── SettingsPage.tsx # Settings
│   │   └── ThemeStorePage.tsx # Theme selection
│   ├── context/         # React context (AppContext for state)
│   ├── hooks/           # Custom hooks
│   └── lib/             # Utilities (sfx, utils)
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind CSS config
└── package.json         # Dependencies
```

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: react-router-dom (HashRouter)
- **State Management**: React Context (AppContext)
- **Data Storage**: localStorage (no backend)
- **Animation**: Framer Motion
- **Charts**: Recharts

## Key Features
1. **Daily Mood Recording**: Users rate their day and add notes
2. **Mood History**: View past entries with calendar view
3. **Theme Customization**: Multiple color themes available
4. **Export/Import**: Backup data as JSON
5. **Sound Effects**: Interactive audio feedback
6. **Poster Generation**: Share mood summaries as images

## Data Storage
All data is stored in localStorage:
- `haiya_entries`: Array of mood entries
- `haiya_settings`: User preferences and unlocked themes
- `haiya_welcome_seen`: Welcome screen flag

## Running the Project
```bash
npm run dev    # Development server on port 5000
npm run build  # Production build to dist/
```

## Recent Changes
- 2026-02-02: Migrated from Lovable to Replit environment
- Removed Supabase integration (was unused)
- Configured Vite for port 5000 with allowedHosts
- Set up static deployment configuration
