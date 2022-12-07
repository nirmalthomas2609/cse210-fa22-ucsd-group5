import {CLASSES} from "../configure";
import { AbstractObserverPattern } from "./abstract-observer";
import { createMenuItemHTML, makeTitleUnique, setMenuItemTitle } from "./util";
let NAME_CLASS = 'name-label';

class AbstractMenuItem extends AbstractObserverPattern {
    // Class AbstractMenuItem defines the methods available for a menu item in the front end

    static contextMenuStatus = {
        showMenu: false,
        set show(status) {this.showMenu = status;},
        get show() {return this.showMenu;}
    }

    // AbstractMenuItem constructor depends on the HTML container, a callback function, and type of menu
    constructor(container, isDraggable=false, callback, menuType) {
        super(callback);

        if (this.constructor === AbstractMenuItem) {
            throw new Error(
                "Abstract class: " +
                    "AbstractMenuItem cannot be instantiated."
            );
        }
        this.type = menuType;
        this.menuItemContainer = container;
        this.isDraggable = isDraggable;
    }

    //                                           //
    // getters and setters for each menu item    //
    //                                           //
    set selectedMenuItem(menuItem) {
        let curSelectedItem = this.selectedMenuItem;
        if(curSelectedItem) {
            curSelectedItem.classList.remove(CLASSES.SELECTED);
        }
        if (menuItem){
            menuItem.classList.add(CLASSES.SELECTED);
        }
    }

    get selectedMenuItem() {
        return this.menuItemContainer.querySelector(`.${CLASSES.SELECTED}`);
    }

    set selectedId(id) {
        this.selectedMenuItem.id = id;
    }

    get selectedId() {
        if(this.selectedMenuItem){
            return this.selectedMenuItem.id;
        }
    }

    get selectedTitleElement() {
        if(this.selectedMenuItem) {
            return this.selectedMenuItem.querySelector(`.${NAME_CLASS}`);
        }
    }

    set selectedTitle(title) {
        let nameLbl = this.selectedTitleElement;
        nameLbl.innerHTML = title;
    }

    get selectedTitle() {
        if(this.selectedMenuItem) {
            let nameLbl = this.selectedTitleElement;
            return nameLbl.innerHTML;
        }
    }

    get selectedContextBtn() {
        return this.selectedMenuItem.lastElementChild;
    }

    get selectedContextTop() {
        return this.selectedContextBtn.offsetTop + this.selectedContextBtn.offsetHeight;
    }

    get selectedContextLeft() {
        return this.selectedContextBtn.offsetLeft;
    }

    // Function: add
    //
    // Creates a new menu item with id and title
    //
    // Parameters:
    //
    //  id         - id of the menu item
    //  title  - title of the menu item
    // 
    // Returns:
    //
    //      Nothing

    add(id, title) {
        let menuItem = createMenuItemHTML(title, this.isDraggable);
        this.menuItemContainer.appendChild(menuItem);
        this.addMenuEvents(menuItem);
        this.addContextMenu(menuItem);
        this.configureDraggable(menuItem);

        if(id) {
            menuItem.id = id;
            setMenuItemTitle(menuItem, title);
            return;
        }

        this.menuItemContainer.parentElement.classList.add('adding-item');
        this.initializeItem(menuItem);
    }

    // Function: initializeItem
    //
    // Configures the new menuItem with the correct options
    //
    // Parameters:
    //
    //  menuItem  - the HTML element of the menu
    // 
    // Returns:
    //
    //      Nothing

    initializeItem(menuItem) {
        let nameLbl = menuItem.querySelector(`.${NAME_CLASS}`);
        nameLbl.innerHTML = '';
        nameLbl.dataset.text = 'Enter Name...';
        this._makeEditable(nameLbl, true);
        nameLbl.contentEditable = true;
        nameLbl.focus();
        this.selectedMenuItem = menuItem;
        
        nameLbl.onblur = () => {
            this.menuItemContainer.parentElement.classList.remove('adding-item');
            this._makeEditable(nameLbl, false);
            if(!this.selectedTitle) {
                this.deleteSelectedMenuItem();
                this.selectedMenuItem = null;
            }
            this.activate('new');
        }
        nameLbl.onkeydown = (e) => {
            if(e.key === 'Enter') {
                nameLbl.blur();
            }
        }
    }

    // Function: addMenuEvents
    //
    // Shows menu options upon click
    //
    // Parameters:
    //
    //  menuItem  - the HTML element of the menu
    // 
    // Returns:
    //
    //      Nothing

    addMenuEvents(menuItem) {
        menuItem.onclick = () => {
            if (AbstractMenuItem.contextMenuStatus.show) {
                return;
            }
            let activate = this.selectedId !== menuItem.id;
            this.selectedMenuItem  = menuItem;
            if(activate) {
                this.activate('select');
            }
        }
    }
    // Function: addContextMenu
    //
    // Displays the options when the user clicks to expand the menu
    //
    // Parameters:
    //
    //  menuItem  - the HTML element of the menu
    // 
    // Returns:
    //
    //      Nothing
    addContextMenu(menuItem) {
        let contextMenu = document.getElementById('context-menu')
    
        menuItem.lastElementChild.onclick = (event) => {
            event.preventDefault();
            let curSelectedItem = this.selectedMenuItem;
            this.selectedMenuItem = menuItem;
            AbstractMenuItem.contextMenuStatus.show = true;
            contextMenu.style.top = `${this.selectedContextTop}px`;
            contextMenu.style.left = `${this.selectedContextLeft}px`;
    
            contextMenu.classList.toggle('hidden');
            document.getElementById('rename').onclick = () => {
                let newName = prompt("Enter new name");
                if(newName) {
                    console.log(makeTitleUnique(this.selectedMenuItem,newName))
                    this.selectedTitle = makeTitleUnique(this.selectedMenuItem,newName);
                    this.activate('rename');
                }
            }

            document.getElementById('delete').onclick = () => {
                let deletedId = this.deleteSelectedMenuItem();
                // this.callbacks.deleteCallback(deletedId);
                this.selectedMenuItem = curSelectedItem;
                this.activate('delete', {deleteId: deletedId});
            }
            this.activate('context-start');
        };
    }
    // Function: deleteSelectedMenuItem
    //
    // Deletes a menu item from the HTML container
    //
    // Parameters:
    //
    //  menuItem  - the HTML element of the menu
    // 
    // Returns:
    //
    //      Nothing
    deleteSelectedMenuItem() {
        let menuItem = this.selectedMenuItem;
        let deletedId = menuItem.id;
        while(menuItem.firstChild) {
            menuItem.removeChild(menuItem.firstChild);
        }
        menuItem.remove();
        return deletedId;
    }

    // Function: setItemTitleById
    //
    // Sets title of menu item
    //
    // Parameters:
    //
    //  id  - id of the menu item
    //  title - new title of the menu item
    // 
    //  Returns:
    //
    //      Nothing
    setItemTitleById(id, title) {
        let titleElm = document.getElementById(id);
        if(!titleElm) { 
            return;
        }
        titleElm = titleElm.querySelector(`.${NAME_CLASS}`);
        titleElm.innerHTML = title;
    }

    // Function: clearMenuItemContainer
    //
    // Clears all menu items in a container
    //
    // Parameters:
    //
    //  None
    // 
    // Returns:
    //
    //      Nothing
    clearMenuItemContainer() {
        while (this.menuItemContainer.firstChild) {
            this.menuItemContainer.removeChild(this.menuItemContainer.firstChild);
        }
    }

    // Function: _makeEditable
    //
    // Configures an html element to be editable
    //
    // Parameters:
    //
    //  htmlElement  - an HTML element
    //  isEditable   - boolean value for whether element is editable
    //
    //
    // Returns:
    //
    //      Nothing
    _makeEditable(htmlElement, isEditable) {
        // Configures an html element to be editable
        htmlElement.contentEditable = isEditable;
    }

    // Function: addMenuEvents
    //
    // Shows menu options upon click
    //
    // Parameters:
    //
    //  event  - the name of the event triggering this call
    //  data   - optional parameter if necessary call requires data
    //
    //
    // Returns:
    //
    //      Nothing
    activate(event, data) {
        // Activates a menu item by adding listeners for events on an item
        if(event === 'context-start') {
            this.notify({
                id: this.selectedId, type: this.type,
                event: 'context-start', data: null
            });
        } else if(event === 'rename') {
            this.renameEvent();
        } else if (event === 'delete') {
            this.deleteEvent(data);
        } else if (event === 'select') {
            this.notify({
                id:this.selectedId, type: this.type,
                event: 'select', data: null
            });
        } else if (event === 'new') {
            this.newEvent();
        } else if (event === 'loaded') {
            this.notify({
                id: this.selectedId, type: this.type,
                event: 'loaded', data: null
            });
        } else if (event === 'drop') {
            this.notify({
                id: this.selectedId, type: this.type,
                event: 'drop', data: data
            });
        }
    }

    // Function: configureDraggable
    //
    // Configures a menu item as draggable
    //
    // Parameters:
    //
    //  menuItem  - the HTML element of the menu
    // 
    // Returns:
    //
    //      Nothing
    configureDraggable(menuItem) {
        if(!this.isDraggable) {
            menuItem.ondragover = (e) => {
                e.preventDefault();
                menuItem.dataset.active = true;
            }
            menuItem.ondragleave = (e) => {
                e.preventDefault();
                menuItem.dataset.active = false;
            }
            menuItem.ondrop = (e) => {
                menuItem.dataset.active = false;
                if(menuItem.id !== this.selectedId) {
                    this.activate('drop', {
                        tweetId: e.dataTransfer.getData('text'),
                        topicId: menuItem.id
                    });
                }
            }
        } else {
            menuItem.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', e.target.id)
            }
        }
    }
}

export {AbstractMenuItem}