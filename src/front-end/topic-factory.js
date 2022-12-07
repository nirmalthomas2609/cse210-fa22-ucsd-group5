import { createTopic, getAllTopics, updateTopic, deleteTopic, } from "../db/content-management"
import { TOPICS } from "../configure";
import { AbstractMenuItem } from "./abstract-menu-item";
import { sortElements } from "./util";

class TopicFactory extends AbstractMenuItem {
    // Class TopicFactory is for creating, reading, updating, and deleting topics

    // TopicFactory constructor depends on the Menu object  
    constructor(menuItemContainer) {
        super(menuItemContainer, false, '_topicItemUpdate', 'topis');
        this.newFolderBtn = document.getElementById(TOPICS.NEW_BUTTON);
        this.newFolderBtn.onclick = () => {
            this.add();
        }

        this.load();
	}

    // Function: load
    //
    // Loads in all the topics and tweets created by the user to display
    //
    // Parameters:
    //
    //  None
    // 
    //  Returns:
    //
    //      None

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

    // Function: renameEvent
    //
    // Renames topic on webpage when user makes name change
    //
    // Parameters:
    //
    //  None
    // 
    //  Returns:
    //
    //      None
    renameEvent() {
        updateTopic(this.selectedId, this.selectedTitle, () => {
            this.notify({
                id: this.selectedId, type: 'topics',
                event: 'rename', data: null
            });
        });
    }

    // Function: deleteEvent
    //
    // Deletes a topic when user wants to remove a topic
    //
    // Parameters:
    //
    //  data   - contains the id of the topic to delete
    // 
    //  Returns:
    //
    //      None
    deleteEvent(data) {
        deleteTopic(data.deleteId, () => {
            this.notify({
                id: this.selectedId, type: 'topics',
                event: 'delete', data: data
            });
        })
    }

    // Function: newEvent
    //
    // Creates a new, empty topic when user wants to add a topic
    //
    // Parameters:
    //
    //  None
    // 
    //  Returns:
    //
    //      None

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