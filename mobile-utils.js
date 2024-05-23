document.getElementById('mobile-dropdown-button').addEventListener('click', () =>
{
    const dropdownList = document.getElementById('mobile-dropdown-list');
    const isExpanded = dropdownList.classList.contains('expanded');
    const button = document.getElementById('mobile-dropdown-button');
    if (isExpanded)
    {
        dropdownList.classList.remove('expanded');
        dropdownList.classList.add('collapsed');
        button.setAttribute('aria-expanded', 'false');
        button.classList.remove('expanded');
        button.classList.add('collapsed');

    } else
    {
        dropdownList.classList.add('expanded');
        dropdownList.classList.remove('collapsed');
        button.classList.remove('collapsed');
        button.classList.add('expanded');
        button.setAttribute('aria-expanded', 'true');
    }
}
);