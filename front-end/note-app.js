function addMenuItemEvents(htmlElement, menuSelectCallback, renameCallback, deleteCallback) {
    htmlElement.onmouseover = () => {
        htmlElement.dataset.active = true;
    }
    htmlElement.onmouseout = () => {
        htmlElement.dataset.active = false;
    }
    addContextMenu(htmlElement, renameCallback, deleteCallback);
    htmlElement.onclick = () => {
        menuSelectCallback();
    }
}

function addContextMenu(htmlElement, renameCallback, deleteCallback) {
    let contextMenu = document.getElementById('context-menu')

    htmlElement.oncontextmenu = (event) => {
        event.preventDefault();

        const {clientX: mouseX, clientY: mouseY} = event;

        contextMenu.style.top = `${mouseY}px`;
        contextMenu.style.left = `${mouseX}px`;

        contextMenu.classList.remove('hidden');
        document.getElementById('rename').onclick = () => {
            let newName = prompt("Enter new name");
            renameCallback(newName);
        }
        document.getElementById('delete').onclick = deleteCallback;
    };
}

(function app() {
    setupDB("note-taker", () => {new User();})
    document.onclick = () => {
        document.getElementById('context-menu').classList.add('hidden');
    };
})();