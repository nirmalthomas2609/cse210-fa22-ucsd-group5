import {  deleteTweet, getTweetById, updateTweet, createTweet } from "../db/content-management";
import { AbstractMenuItem } from "./abstract-menu-item";
import { TopicFactory } from "./topic-factory";
import { TweetFactory } from "./tweet-factory";
import { TOPICS, TWEETS } from "../configure";
import { TextEditor } from "./text-editor";

class Menu extends AbstractMenuItem {
    // Class Menu is the homepage interface for the user

	// Menu constructor does not depend on any objects
    constructor() {
        super('_menuUpdate');
        this.topicContainer = document.getElementById(TOPICS.CONTAINER);
        this.topicFactory = new TopicFactory(this.topicContainer);
        this.topicFactory.registerObserver(this);

        this.tweetContainer = document.getElementById(TWEETS.CONTAINER);
        this.tweetFactory = new TweetFactory(this.tweetContainer);
        this.tweetFactory.registerObserver(this);

        this.textEditor = new TextEditor();
        
        this.curTopic = null;
        this.curTweet = null;
    }

    _topicItemUpdate(menuItemEvent) {
        // changes view to new Topic upon event from user

        // need to reload tweets
        // select, context-start, new
        if (['select', 'context-start', 'new', 'loaded',].includes(menuItemEvent.event)) {

            if(menuItemEvent.id !== this.curTopic) {
                // need to check text editor for activate edits
                // check here
                // save text editor
                let saveObj = this.textEditor.close();
                if(saveObj) {
                    if(this.curTopic) {
                        if(this.curTopic !== saveObj.topicId) {
                            throw Error('Topic was loaded before tweet was saved!');
                        }
                    }
                    updateTweet(saveObj.tweetId, saveObj.title, saveObj.content, saveObj.topicId, () =>{
                        this.tweetFactory.setItemTitleById(saveObj.tweetId, saveObj.title);
                    });
                }

                // change topics
                this.curTopic = menuItemEvent.id;

                // load new tweets
                this.tweetFactory.load(this.curTopic);
            }
        }

        if (['delete'].includes(menuItemEvent.event)) {
            let saveObj = this.textEditor.close();
            if(saveObj) {
                updateTweet(saveObj.tweetId, saveObj.title, saveObj.content, saveObj.topicId, () =>{
                    this.tweetFactory.clearMenuItemContainer();
                });
            } else {
                this.tweetFactory.clearMenuItemContainer();
            }
        }

        if(['drop'].includes(menuItemEvent.event)) {
            // save tweet if opened in text editor
            
            let saveObj = this.textEditor.getSaveObj();
            this.textEditor.reset();
            deleteTweet(menuItemEvent.data.tweetId, () => {
                createTweet(saveObj.content, saveObj.title, menuItemEvent.data.topicId, () => {

                });
            });

            let tweet =  document.getElementById(menuItemEvent.data.tweetId);
            while(tweet.firstChild) {
                tweet.removeChild(tweet.firstChild)
            }
            tweet.remove();
        }
    }

    _tweetItemUpdate(menuItemEvent) {
        // changes view to different tweet upon even from user

        // close editor if tweet has been delete 
        if(['delete'].includes(menuItemEvent.event)) {
            this.textEditor.reset();
        }

        // just change title of text editor
        if(['rename'].includes(menuItemEvent.event)) {
            this.textEditor.setTitle(this.tweetFactory.selectedTitle);
        }

        if(!menuItemEvent.id) return;

        // topic front loaded tasks
        // dont need to worry about saving because topic
        // updates has already taken care of it
        if(['loaded'].includes(menuItemEvent.event)) {
            getTweetById(menuItemEvent.id, (dbObj) => {
                console.log(dbObj)
                this.textEditor.start(
                    dbObj.data.tweetTitle,
                    dbObj.data.textContent,
                    dbObj.data.tweetId,
                    dbObj.data.topicId
                );
            });
        }

        // tweets front loaded tasks
        if(['context-start', 'select', 'new']) {
            let saveObj = this.textEditor.close();
            if(saveObj) {
                updateTweet(saveObj.tweetId, saveObj.title, saveObj.content, saveObj.topicId, () =>{
                    this.tweetFactory.setItemTitleById(saveObj.tweetId, saveObj.title);
                });
            }

            getTweetById(menuItemEvent.id, (dbObj) => {
                this.textEditor.start(
                    dbObj.data.tweetTitle,
                    dbObj.data.textContent,
                    dbObj.data.tweetId,
                    dbObj.data.topicId
                );
            });
        }
    }
}

export {Menu};