// Function: setTheme
//
// Sets the color theme based on current active theme. The active theme is determined
// by the active themes element in the navigaion bar
//
// Returns: None

function setTheme() {
    let oldTheme = curTheme === 'theme-1' ? 'theme-2' : 'theme-1';
    for(let topic of document.querySelectorAll('.topic')) {
        topic.classList.remove(oldTheme)
        topic.classList.add(curTheme);
    }

    for(let topic of document.querySelectorAll('.card')) {
        topic.classList.remove(oldTheme)
        topic.classList.add(curTheme);
    }

    for(let topic of document.querySelectorAll('body')) {
        topic.classList.remove(oldTheme)
        topic.classList.add(curTheme);
    }

}

let themes = document.getElementById('themes');
themes.onclick = (e) => {
    let curActive = themes.querySelector('.active');
    console.log(e, curActive)
    curActive.classList.remove('active');
    e.target.classList.add('active');
    curTheme = e.target.dataset.value;
    setTheme();
}

let curTheme = 'theme-1';

export {setTheme}