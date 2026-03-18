import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import BistPage from "./pages/BistPage";
import KriptoPage from "./pages/KriptoPage";
import AnalizPage from "./pages/AnalizPage";
import PortfoyPage from "./pages/PortfoyPage";
import HakkimizdaPage from "./pages/HakkimizdaPage";
import Layout from "./components/Layout";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/bist" component={BistPage} />
        <Route path="/kripto" component={KriptoPage} />
        <Route path="/analiz" component={AnalizPage} />
        <Route path="/portfoy" component={PortfoyPage} />
        <Route path="/hakkimizda" component={HakkimizdaPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
