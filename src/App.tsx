import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { QuestProvider } from "./context";
import { Layout } from "@/components/Layout";
import QuestsPage from "./pages/Quests";
import TodayPage from "./pages/Today";
import HistoryPage from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <QuestProvider>
        <Toaster />
        <Sonner position="top-center" />
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<QuestsPage />} />
              <Route path="/today" element={<TodayPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </HashRouter>
      </QuestProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
