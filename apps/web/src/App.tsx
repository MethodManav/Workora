import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/tambo/theme/ThemeProvider";
import { Dashboard } from "./pages/Dashboard";
import { BoardPage } from "./pages/BoardPage";
import { BacklogPage } from "./pages/BacklogPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { AuthPage } from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import { TamboProvider } from "@tambo-ai/react";

const queryClient = new QueryClient();
const apiKey = import.meta.env.VITE_TAMBO_API_KEY;

const App = () => (
  <TamboProvider apiKey={apiKey}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/board" element={<BoardPage />} />
              <Route path="/backlog" element={<BacklogPage />} />
              <Route
                path="/sprints"
                element={
                  <PlaceholderPage title="Sprints" subtitle="Tambo Platform" />
                }
              />
              <Route
                path="/reports"
                element={
                  <PlaceholderPage
                    title="Reports"
                    subtitle="Analytics & Insights"
                  />
                }
              />
              <Route
                path="/settings"
                element={
                  <PlaceholderPage
                    title="Settings"
                    subtitle="Workspace Configuration"
                  />
                }
              />
              <Route path="/login" element={<AuthPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </TamboProvider>
);

export default App;
