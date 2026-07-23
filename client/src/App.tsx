import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Analytics } from "@vercel/analytics/react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import ExamMode from "./pages/ExamMode";
import QuizMode from "./pages/QuizMode";
import SearchMode from "./pages/SearchMode";
import Onboarding from "./pages/Onboarding";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import CoPilot from "./pages/CoPilot";

// NOTE: Front page = the welcome page. Onboarding is now opt-in (reachable via
// /onboarding and the "How to use the book" link), NOT a forced redirect.
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/payment-cancel" component={PaymentCancel} />
      <Route path="/" component={Dashboard} />
      <Route path="/exam" component={ExamMode} />
      <Route path="/quiz" component={QuizMode} />
      <Route path="/search" component={SearchMode} />
      <Route path="/copilot" component={CoPilot} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
