/** Storage key for the visitor's manual theme choice ("light" | "dark"). */
export const THEME_KEY: string = "portfolio-theme";

// Runs before first paint (inlined in <head>): applies a saved choice so the
// page never flashes the wrong theme. With no saved choice the CSS follows the
// device setting via prefers-color-scheme.
const SCRIPT: string = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
