import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QuestProvider } from './context';
import { Layout } from '@/components/Layout';
import { hasSeenWelcome } from '@/lib/onboarding';
import QuestsPage from './pages/Quests';
import TodayPage from './pages/Today';
import HistoryPage from './pages/History';
import WelcomePage from './pages/Welcome';
import NotFound from './pages/NotFound';
import { TutorialProvider } from '@/tutorial/TutorialProvider';

const queryClient = new QueryClient();

const RootRedirect = () => (
  <Navigate to={hasSeenWelcome() ? '/quests' : '/welcome'} replace />
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <QuestProvider>
        <Toaster />
        <Sonner position="top-center" />
        <HashRouter>
          <TutorialProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/quests" element={<QuestsPage />} />
                <Route path="/today" element={<TodayPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </TutorialProvider>
        </HashRouter>
      </QuestProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
