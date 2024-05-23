function shuffle(array)
{
    for (let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
const gramophone = document.querySelector('.gramophone');
const gramophoneAsideText = document.querySelector('#grampohone-aside-text');
const audio = document.querySelector('audio');
//songs are from names.json inside songs folder
fetch('songs/names.json', {method: 'GET'}).then( response => response.json()).then( songnames =>
{
    if(songnames.length === 0)
    {
        gramophoneAsideText.innerHTML = 'Brak dostępnych utworów';
        return;
    }
    const songs = songnames.map(songname => `songs/${songname}`);
    shuffle(songs);
    let text = songs[0].toString();
    text = text.split('.').slice(1).join('.');
    text = text.split('.').slice(0);
    gramophoneAsideText.innerHTML = 'Naciśnij by posłuchać: <span>' + text[0] + '</span> ->';
    audio.pause();

    gramophone.addEventListener('click', () =>
    {
        gramophone.classList.toggle('rotating');
        let text = "";
        if (gramophone.classList.contains('rotating'))
        {
            audio.src = songs[0];
            audio.play();
            text = songs[0].toString();
            text = text.split('.').slice(1);
            gramophoneAsideText.innerHTML = 'Teraz odtwarzane: <span>' + text[0] + '</span> Naciśnij by zatrzymać ->';
        } else
        {
            audio.pause();
            shuffle(songs);
            text = songs[0].toString();
            text = text.split('.').slice(1).join('.');
            text = text.split('.').slice(0);
            gramophoneAsideText.innerHTML = 'Naciśnij by posłuchać: <span>' + text[0] + '</span> ->';
        }
    });
});