import { createTweet, getTweetsByTopicId, updateTweet, deleteTweet } from "../db/content-management"
import { TWEETS } from "../configure";
import { AbstractMenuItem } from "./abstract-menu-item";
import {sortElements} from "./util";
class TweetFactory extends AbstractMenuItem {
    constructor(menuItemContainer) {
        super(menuItemContainer, true, '_tweetItemUpdate', 'tweets');
        this.newTweetBtn = document.getElementById(TWEETS.NEW_BUTTON);
        this.newTweetBtn.onclick = () => {
            this.add();
        }
	}

    load(topicid) {
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

    newEvent() {
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

    deleteEvent(data) {
        deleteTweet(data.deleteId, () => {
            this.notify({
                id: this.selectedId, type: 'tweets',
                event: 'delete', data: data
            });
        });
    }

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