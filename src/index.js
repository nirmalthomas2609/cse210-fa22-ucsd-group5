import "./front-end/style/main.scss";
import { setupDB } from "./db/content-management";
import {Menu} from "./front-end/menu";
import {AbstractMenuItem} from "./front-end/abstract-menu-item";

setupDB('note-taker', () => {new Menu()});
document.onclick = () => {
    if(!AbstractMenuItem.contextMenuStatus.show) {
        document.getElementById('context-menu').classList.add('hidden');
    } else {
        AbstractMenuItem.contextMenuStatus.show=false;
    }
};