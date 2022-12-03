import {CLASSES} from "../configure";
let NAME_CLASS = 'name-label';

function createMenuItemHTML(title, isDraggable) {
    let menuItem = document.createElement('div');
    menuItem.draggable = isDraggable;
    menuItem.classList.add(CLASSES.MENU_ITEM, CLASSES.HOVER);

    let nameLbl = document.createElement('div');
    if(title) nameLbl.innerHTML = title;
    nameLbl.classList.add(NAME_CLASS);
    menuItem.appendChild(nameLbl);

    let ellipseBtn = document.createElement('button');
    ellipseBtn.classList.add('hidden');
    ellipseBtn.innerHTML = '...';
    menuItem.appendChild(ellipseBtn);
    
    return menuItem;
}

function getTitleFromMenuItem(menuItem) {
    return menuItem.querySelector(`.${NAME_CLASS}`).innerHTML;
}

function setMenuItemTitle(menuItem, title) {
    menuItem.querySelector(`.${NAME_CLASS}`).innerHTML = title;
}

function makeTitleUnique(menuItem, title) {
    let inc = 0;
    for(let sib of menuItem.parentElement.children) {
        if(getTitleFromMenuItem(sib) === title) {
            inc += 1;
        }
    }
    return inc > 0 ? `${title}-${inc}` : title;
}

function sortElements(elements, attr) {
    elements.sort((a, b) => 
        a[attr].localeCompare(b[attr], "en", {ignorePunctuation: true})
    )
    return elements;
}

export {createMenuItemHTML, makeTitleUnique, getTitleFromMenuItem, sortElements, setMenuItemTitle}