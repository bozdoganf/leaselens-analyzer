import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnalysisProvider } from "@/context/AnalysisContext";
import Index from "./pages/Index.tsx";
import Upload from "./pages/Upload.tsx";
import Analyzing from "./pages/Analyzing.tsx";
import Results from "./pages/Results.tsx";
import Compare from "./pages/Compare.tsx";
import MyLeases from "./pages/MyLeases.tsx";
import Help from "./pages/Help.tsx";
import SignIn from "./pages/SignIn.tsx";
import Settings from "./pages/Settings.tsx";
import Support from "./pages/Support.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnalysisProvider>
          <Routes>
            {/* Marketing */}
            <Route path="/" element={<Index />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/my-leases" element={<MyLeases />} />
            <Route path="/help" element={<Help />} />
            <Route path="/sign-in" element={<SignIn />} />

            {/* App */}
            <Route path="/analyzing" element={<Analyzing />} />
            <Route path="/results" element={<Results />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnalysisProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
