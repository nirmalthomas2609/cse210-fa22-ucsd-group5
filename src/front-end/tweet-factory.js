import { createTweet, getTweetsByTopicId, updateTweet, deleteTweet } from "../db/content-management"
import { TWEETS } from "../configure";
import { AbstractMenuItem } from "./abstract-menu-item";
import {sortElements} from "./util";
class TweetFactory extends AbstractMenuItem {
    // Class TweetFactory is the interface for managing tweets (creating, reading, updating, deleting)

	// TweetFactory constructor depends on the menu object
    constructor(menuItemContainer) {
        super(menuItemContainer, true, '_tweetItemUpdate', 'tweets');
        this.newTweetBtn = document.getElementById(TWEETS.NEW_BUTTON);
        this.newTweetBtn.onclick = () => {
            this.add();
        }
	}

    // Function: load
    //
    // Loads in all the topics and tweets created by the user to display
    //
    // Parameters:
    //
    //  topidid  - the id of the topic from which to read all tweets
    // 
    //  Returns:
    //
    //      None

    load(topicid) {
        // Loads in all tweets associated with a topic
        this.topicid = topicid;
        this.clearMenuItemContainer();
        getTweetsByTopicId(topicid, (tweetList) => {
            console.log(tweetList)
            tweetList =  sortElements(tweetList.data, 'tweetTitle');
            console.log(tweetList)
            for(let tweet of tweetList) {
                this.add(tweet.tweetId, tweet.tweetTitle);
            }
            this.selectedMenuItem = this.menuItemContainer.firstChild;
            this.activate('loaded');
        });
    }
    
    
    // Function: newEvent
    //
    // Creates a new tweet within a topic when user wants to add a tweet
    //
    // Parameters:
    //
    //  None
    // 
    //  Returns:
    //
    //      None

    newEvent() {
        // Creates a new tweet within a topic when user wants to add a tweet
        if (this.selectedMenuItem) {
            createTweet('', this.selectedTitle, this.topicid, (dbObj) => {
                this.notify({
                    id: dbObj.data.id, type: 'tweets',
                    event: 'new', data: null
                });
            });
        } else {
            this.notify({
                id: null, type: 'tweets',
                event: 'new', data: null
            });
        }
    }

    // Function: deleteEvent
    //
    // Deletes a tweet from the menu when user wants to remove a tweet
    //
    // Parameters:
    //
    //  data - contained id of the tweet to delete
    // 
    //  Returns:
    //
    //      None

    deleteEvent(data) {
        deleteTweet(data.deleteId, () => {
            this.notify({
                id: this.selectedId, type: 'tweets',
                event: 'delete', data: data
            });
        });
    }

    // Function: renameEvent
    //
    // Renames a tweet when user wants to change title
    //
    // Parameters:
    //
    //  None
    // 
    //  Returns:
    //
    //      None

    renameEvent() {
        updateTweet(this.selectedId, this.selectedTitle, '', '', () => {
            this.notify({
                id: this.selectedId, type: 'tweets',
                event: 'rename', data: null
            });
        });
    }
}

export {TweetFactory};