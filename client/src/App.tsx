import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NecVersionProvider } from "./contexts/NecVersionContext";
import Dashboard from "./pages/Dashboard";
import ExamMode from "./pages/ExamMode";
import QuizMode from "./pages/QuizMode";
import SearchMode from "./pages/SearchMode";
import BookMethod from "./pages/BookMethod";

function AppRouter() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/book-method" component={BookMethod} />
        <Route path="/exam" component={ExamMode} />
        <Route path="/quiz" component={QuizMode} />
        <Route path="/search" component={SearchMode} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <NecVersionProvider>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </NecVersionProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
