let USER_ITEM_CLASS = 'user-item';
let TITLE_CLASS = 'title';
let SUB_ITEM_CLASS = 'sub-item';
let TOPIC_ITEM_CLASS = 'topic-item';
let TWEET_ITEM_CLASS = 'tweet-item';

class AbstractUserMenu extends AbstractObserverPattern{
    constructor(callback) {
        super(callback)
        if(this.constructor === AbstractUserMenu) {
            throw new Error(
                'Abstract Class: AbstractUserMenu cannot be instantiated.'
            );
        }

        this.htmlElements = [];
    }
    
    _toggleSubItem(subItem) {
        subItem.dataset.active = false;
        subItem.onmouseover = () => {
            subItem.dataset.active = true;
        }
        subItem.onmouseout = () => {
            subItem.dataset.active = false;
        }
    }

    _toggleSubItems() {
        for(let subItem of this.htmlElements) {
            if (subItem.classList.contains(TITLE_CLASS)) {
                continue;
            }
            if (subItem.classList.contains(TOPIC_ITEM_CLASS)){
                hideItems(subItem.children, true);
                for(let child of subItem.children) {
                    this._toggleSubItem(child);
                }
            }
            this._toggleSubItem(subItem);
        }
    }

    getHTMLElements() {
        return this.htmlElements;
    }
}

