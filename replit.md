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
│   │   ├── ThemeLockScreen.tsx  # Lock screen for theme store
│   │   ├── MyWardrobe.tsx       # Theme selection grid
│   │   └── ...          # Custom components
│   ├── pages/           # Route pages
│   │   ├── Index.tsx        # Home page
│   │   ├── RecordPage.tsx   # Mood recording
│   │   ├── HistoryPage.tsx  # Past entries
│   │   ├── SettingsPage.tsx # Settings
│   │   └── ThemeStorePage.tsx # Theme selection (locked until 20 entries)
│   ├── context/         # React context (AppContext for state)
│   ├── hooks/           # Custom hooks
│   ├── assets/          # Static assets (images, QR codes)
│   └── lib/             # Utilities (sfx, utils, themes)
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
3. **Theme Customization**: Multiple color themes (locked until 20 entries)
4. **Export/Import**: Backup data as JSON
5. **Sound Effects**: Interactive audio feedback on clicks and theme changes
6. **Poster Generation**: Share mood summaries as images
7. **Gamification**: Theme store unlocks after 20 recorded days

## Theme Lock System
- Theme store is locked for new users
- Unlocks after user records 20 entries
- Shows encouraging lock screen with progress bar
- Developer backdoor: Uncomment `// const daysRecorded = 20;` in ThemeStorePage.tsx

## Data Storage
All data is stored in localStorage:
- `haiya_entries`: Array of mood entries
- `haiya_settings`: User preferences and unlocked themes
- `haiya_welcome_seen`: Welcome screen flag
- `haiya_celebration_shown`: Unlock celebration flag

## Running the Project
```bash
npm run dev    # Development server on port 5000
npm run build  # Production build to dist/
```

## Recent Changes
- 2026-02-02: Migrated from Lovable to Replit environment
- 2026-02-02: Removed Supabase integration (was unused)
- 2026-02-02: Configured Vite for port 5000 with allowedHosts
- 2026-02-02: Set up static deployment configuration
- 2026-02-02: Removed developer mode toggle from settings
- 2026-02-02: Added sound effects when switching themes
- 2026-02-02: Added back button to theme store page
- 2026-02-02: Added coffee donation QR code to About (after 20 days)
- 2026-02-02: Created ThemeLockScreen component with gamification UI
- 2026-03-05: Completed Replit Agent migration — installed all npm packages, removed unused @supabase/supabase-js and lovable-tagger packages, deleted src/integrations/supabase/ directory
