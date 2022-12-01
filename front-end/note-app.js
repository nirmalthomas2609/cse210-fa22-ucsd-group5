let showContextMenu = false;
let validDrag = false;
let moveTweet = false;
function addMenuItemEvents(htmlElement, menuSelectCallback) {
    htmlElement.onmouseover = () => {
        htmlElement.dataset.active = true;
    }
    htmlElement.onmouseout = () => {
        htmlElement.dataset.active = false;
    }
    htmlElement.onclick = () => {
        menuSelectCallback(htmlElement.id);
    }
}

function setMenuItemName(id, name) {
    let menuItem = document.getElementById(id);
    menuItem.firstElementChild.innerHTML = name;
}

function addContextMenu(htmlElement, renameCallback, deleteCallback) {
    let contextMenu = document.getElementById('context-menu')

    htmlElement.lastElementChild.onclick = (event) => {
        event.preventDefault();
        showContextMenu = true;
        contextMenu.style.top = `${htmlElement.lastElementChild.offsetTop + htmlElement.lastElementChild.offsetHeight}px`;
        contextMenu.style.left = `${htmlElement.lastElementChild.offsetLeft}px`;

        contextMenu.classList.toggle('hidden');
        document.getElementById('rename').onclick = () => {
            let newName = prompt("Enter new name");
            if(newName) {
                setMenuItemName(htmlElement.id, newName);
                renameCallback(htmlElement.id, newName);
            }
        }
        document.getElementById('delete').onclick = () => {
            deleteCallback(htmlElement.id);
            while(htmlElement.firstChild) {
                htmlElement.removeChild(htmlElement.firstChild);
            }
            htmlElement.remove();
        }
    };
}
function createMenuItem(itemObj, callbacks, isDraggable=false) {
    let menuItem = document.createElement('div');
    menuItem.id = itemObj.id;
    menuItem.draggable = true;
    if(!isDraggable) {
        menuItem.ondragover = (e) => {
            e.preventDefault();
            menuItem.dataset.active = true;
        }
        menuItem.ondragleave = (e) => {
            e.preventDefault();
            menuItem.dataset.active = false;
        }
        menuItem.ondrop = (e) => {
            let tweetElement = document.getElementById(e.dataTransfer.getData('text'));
            tweetTitle = tweetElement.firstElementChild.innerHTML;
            moveTweet=true;
            updateTweet(tweetElement.id, tweetTitle, '', itemObj.id, () => {});
            while (tweetElement.firstChild) {
                tweetElement.removeChild(tweetElement.firstChild);
            }
            tweetElement.remove();
            callbacks.selectCallback(menuItem.id);
        }
    } else {
        menuItem.ondragstart = (e) => {
            moveTweet=false;
            e.dataTransfer.setData('text/plain', e.target.id)
        }
    }

    menuItem.classList.add('menu-item');

    let nameLbl = document.createElement('div');
    nameLbl.innerHTML = itemObj.name;
    menuItem.appendChild(nameLbl);

    let ellipseBtn = document.createElement('button');
    ellipseBtn.innerHTML = '...';
    menuItem.appendChild(ellipseBtn);

    addMenuItemEvents(menuItem, callbacks.selectCallback);
    addContextMenu(menuItem, callbacks.renameCallback, callbacks.deleteCallback);

    return menuItem;
}

(function app() {
    setupDB("note-taker", () => {new User();})
    document.onclick = () => {
        if(!showContextMenu) {
            document.getElementById('context-menu').classList.add('hidden');
        } else {
            showContextMenu=false;
        }
    };
})();