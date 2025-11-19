import { BrowserRouter, Routes, Route } from "react-router-dom";
import Wrapper from "./layouts/Wrapper";
import HomeOne from "./components/homes/home-one";
import SEO from "./components/SEO";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import AboutPage from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";
import Requests from "./pages/Requests";
import Sessions from "./pages/Sessions";
import Chat from "./pages/Chat";
import Ratings from "./pages/Ratings";
import Profile from "./pages/Profile";
import KnowledgeExchange from "./pages/KnowledgeExchange";
import SmartMatching from "./pages/SmartMatching";
import CommunityHub from "./pages/CommunityHub";
import FlexibleScheduling from "./pages/FlexibleScheduling";
import SwapAppProviders from "./providers/SwapAppProviders";

const App = () => (
  <BrowserRouter>
    <SwapAppProviders>
      <Wrapper>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SEO pageTitle="Swap" />
                <HomeOne />
              </>
            }
          />
          <Route
            path="/signin"
            element={
              <>
                <SEO pageTitle="Sign In" />
                <SignIn />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <SEO pageTitle="Join Swap" />
                <SignUp />
              </>
            }
          />
          <Route
            path="/onboarding"
            element={
              <>
                <SEO pageTitle="Onboarding" />
                <Onboarding />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <SEO pageTitle="About Swap" />
                <AboutPage />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <SEO pageTitle="Dashboard" />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/matches"
            element={
              <>
                <SEO pageTitle="Find a Swap" />
                <Matches />
              </>
            }
          />
          <Route
            path="/requests"
            element={
              <>
                <SEO pageTitle="Requests" />
                <Requests />
              </>
            }
          />
          <Route
            path="/sessions"
            element={
              <>
                <SEO pageTitle="Sessions" />
                <Sessions />
              </>
            }
          />
          <Route
            path="/chat"
            element={
              <>
                <SEO pageTitle="Community Chat" />
                <Chat />
              </>
            }
          />
          <Route
            path="/ratings"
            element={
              <>
                <SEO pageTitle="Ratings" />
                <Ratings />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <SEO pageTitle="Profile" />
                <Profile />
              </>
            }
          />
          <Route
            path="/features/knowledge-exchange"
            element={
              <>
                <SEO pageTitle="Knowledge Exchange - Swap" />
                <KnowledgeExchange />
              </>
            }
          />
          <Route
            path="/features/smart-matching"
            element={
              <>
                <SEO pageTitle="Smart Matching - Swap" />
                <SmartMatching />
              </>
            }
          />
          <Route
            path="/features/community-hub"
            element={
              <>
                <SEO pageTitle="Community Hub - Swap" />
                <CommunityHub />
              </>
            }
          />
          <Route
            path="/features/flexible-scheduling"
            element={
              <>
                <SEO pageTitle="Flexible Scheduling - Swap" />
                <FlexibleScheduling />
              </>
            }
          />
        </Routes>
      </Wrapper>
    </SwapAppProviders>
  </BrowserRouter>
);

export default App;
