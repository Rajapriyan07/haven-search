import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function GithubPagesRedirectHandler() {
  const navigate = useNavigate();

  // Supports the spa-github-pages pattern: /repo/?/some/path
  // See public/404.html and the small script in index.html
  React.useEffect(() => {
    const search = window.location.search;
    if (!search.startsWith("?/") || search.length <= 2) return;

    const decodedPath = decodeURIComponent(search.slice(2));
    const path = decodedPath.startsWith("/") ? decodedPath : `/${decodedPath}`;

    window.history.replaceState(null, "", import.meta.env.BASE_URL);
    navigate(path, { replace: true });
  }, [navigate]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <GithubPagesRedirectHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);
export default App;
