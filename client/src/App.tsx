import { Route, Switch } from "wouter";
import { MaterialThemeProvider } from "./contexts/MaterialThemeContext";
import { isThemeId } from "./lib/themes";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import "./pages/landing.css";

function forcedThemeFromPath() {
  const match = window.location.pathname.match(/^\/preview\/([^/]+)\/?$/);
  return match && isThemeId(match[1]) ? match[1] : undefined;
}

export default function App() {
  return (
    <MaterialThemeProvider forcedTheme={forcedThemeFromPath()}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/tracker" component={Home} />
        <Route path="/preview/:theme">
          {() => <Home />}
        </Route>
        <Route>
          <Landing />
        </Route>
      </Switch>
    </MaterialThemeProvider>
  );
}
