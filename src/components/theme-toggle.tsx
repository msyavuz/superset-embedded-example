import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <button type="button" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? <Moon /> : <Sun />}
    </button>
  );
}
