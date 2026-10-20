
const THEME = "theme";

// Le thème clair / sombre 
function lireThemeInitial() {
    const sauvegarde = localStorage.getItem(THEME);
    if (sauvegarde === "clair" || sauvegarde === "sombre") {
        return sauvegarde;
    }
    const systemeEstSombre = window.matchMedia("(prefers-color-scheme: dark").matches;
    if (systemeEstSombre) {
        return"sombre";
    }
return "clair";
}
function appliquerTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}
appliquerTheme(lireThemeInitial());