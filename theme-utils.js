//set global color to light (delete class dark and add class light)
function setTheme(theme)
{
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
}