import {CLASSES} from "../configure";
let NAME_CLASS = 'name-label';

// Function: createMenuItemHTML
//
// Creates a menu item HTML element
//
// Parameters:
//
//  title   - the title of the HTML element
//  isDraggable - boolean value of whether to make the HTML element draggable
// 
//  Returns:
//
//      None

function createMenuItemHTML(title, isDraggable) {
    // let menuItem = document.createElement('div');
    // menuItem.draggable = isDraggable;
    // menuItem.classList.add(CLASSES.MENU_ITEM, CLASSES.HOVER);

    // let nameLbl = document.createElement('div');
    // if(title) nameLbl.innerHTML = title;
    // nameLbl.classList.add(NAME_CLASS);
    // menuItem.appendChild(nameLbl);

    // let ellipseBtn = document.createElement('button');
    // ellipseBtn.classList.add('hidden');
    // ellipseBtn.innerHTML = '...';
    // menuItem.appendChild(ellipseBtn);
    
    let htmlString = `
        <li><a class="dropdown-item" href="#">${title}</a></li>
    `;
    
    return menuItem;
}

// Function: getTitleFromMenuItem
//
// Gets the title of a menu item
//
// Parameters:
//
//  menuItem  - HTML element that will be accessed for the title
// 
//  Returns:
//
//      None

function getTitleFromMenuItem(menuItem) {
    return menuItem.querySelector(`.${NAME_CLASS}`).innerHTML;
}

// Function: setMenuItemTitle
//
// Sets the title of a menu item
//
// Parameters:
//
//  menuItem  - HTML element that will be updated
//  title     - the new title for the HTML element
// 
//  Returns:
//
//      None

function setMenuItemTitle(menuItem, title) {
    menuItem.querySelector(`.${NAME_CLASS}`).innerHTML = title;
}


// Function: makeTitleUnique
//
// Ensures that title of menu items are unique (handles an edge case)
//
// Parameters:
//
//  menuItem  - HTML element in menu to ensure a unique title for
//  title     - the proposed title of the menuItem
//
//  Returns:
//
//      The new title of the HTML element

function makeTitleUnique(menuItem, title) {
    let inc = 0;
    for(let sib of menuItem.parentElement.children) {
        if(getTitleFromMenuItem(sib) === title) {
            inc += 1;
        }
    }
    return inc > 0 ? `${title}-${inc}` : title;
}

// Function: sortElements
//
// Sorts the html elements based on the inputted attribute
//
// Parameters:
//
//  element  - the elements to sort
//  attr     - the attribute of the elements to compare when sorting
// 
//  Returns:
//
//      None

function sortElements(elements, attr) {
    elements.sort((a, b) => 
        a[attr].localeCompare(b[attr], "en", {ignorePunctuation: true})
    )
    return elements;
}

export {createMenuItemHTML, makeTitleUnique, getTitleFromMenuItem, sortElements, setMenuItemTitle}