import { MaterialThemeProvider } from "./contexts/MaterialThemeContext";
import { isThemeId } from "./lib/themes";
import Home from "./pages/Home";

function forcedThemeFromPath() {
  const match = window.location.pathname.match(/^\/preview\/([^/]+)\/?$/);
  return match && isThemeId(match[1]) ? match[1] : undefined;
}

export default function App() {
  return (
    <MaterialThemeProvider forcedTheme={forcedThemeFromPath()}>
      <Home />
    </MaterialThemeProvider>
  );
}
