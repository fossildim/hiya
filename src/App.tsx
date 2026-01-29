import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { playRandomSyllable } from "@/lib/sfx";
import { useTheme } from "@/hooks/useTheme";
import Index from "./pages/Index";
import RecordPage from "./pages/RecordPage";
import HistoryPage from "./pages/HistoryPage";
import EntryDetailPage from "./pages/EntryDetailPage";
import SettingsPage from "./pages/SettingsPage";
import ThemeStorePage from "./pages/ThemeStorePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Theme wrapper component
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useTheme(); // This applies theme on mount and listens for system changes
  return <>{children}</>;
};

const App = () => {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, [role="button"], input[type="button"], input[type="submit"], summary'
      ) as HTMLElement | null;

      if (!interactive) return;
      // allow opting out in rare cases
      if (interactive.getAttribute("data-sfx") === "off") return;

      playRandomSyllable();
    };

    // capture so we still play even if a component stops propagation
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AppProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
              <Routes>
              <Route path="/" element={<Index />} />
                <Route path="/record" element={<RecordPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/entry/:date" element={<EntryDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/theme-store" element={<ThemeStorePage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </HashRouter>
          </AppProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
