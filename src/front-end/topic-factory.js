import { createTopic, getAllTopics, updateTopic, deleteTopic, } from "../db/content-management"
import { TOPICS } from "../configure";
import { AbstractMenuItem } from "./abstract-menu-item";
import { sortElements } from "./util";

class TopicFactory extends AbstractMenuItem {
    constructor(menuItemContainer) {
        super(menuItemContainer, false, '_topicItemUpdate', 'topis');
        this.newFolderBtn = document.getElementById(TOPICS.NEW_BUTTON);
        this.newFolderBtn.onclick = () => {
            this.add();
        }

        this.load();
	}

    load() {
        getAllTopics((topicEvent) => {
            if(!topicEvent.topicsList.length > 0) {
                createTopic(TOPICS.DEFAULT_TOPIC, (topicObj) => {
                    this.topicid = topicObj.data.id;
                    this.add(this.topicid, TOPICS.DEFAULT_TOPIC);
                });
            } else {
                let topicsList = sortElements(topicEvent.topicsList, 'name');
                for(let i = 0; i < topicsList.length; i++) {
                    let topic = topicsList[i];
                    this.add(topic.id, topic.name);
                }
            }
            this.selectedMenuItem = this.menuItemContainer.firstChild;
            this.activate('loaded');
        });
    }

    renameEvent() {
        updateTopic(this.selectedId, this.selectedTitle, () => {
            this.notify({
                id: this.selectedId, type: 'topics',
                event: 'rename', data: null
            });
        });
    }

    deleteEvent(data) {
        deleteTopic(data.deleteId, () => {
            this.notify({
                id: this.selectedId, type: 'topics',
                event: 'delete', data: data
            });
        })
    }

    newEvent() {
        if(this.selectedMenuItem) {
            createTopic(this.selectedTitle, (dbObj) => {
                this.notify({
                    id: dbObj.data.id, type: 'topics',
                    event: 'new', data: null
                });
            });
        } else {
            this.notify({
                id: null, type: 'topics',
                event: 'new', data: null
            });
        }

    }
}

export {TopicFactory};