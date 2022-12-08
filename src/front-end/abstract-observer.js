/**
 * @abstract
 * @class AbstractObserverPattern
 *
 * From Wikipedia: https://en.wikipedia.org/wiki/Observer_pattern
 * The observer pattern is a software design pattern in which an object,
 * named the 'Subject', maintains a list of its dependents, called
 * 'Observers',and notifies them automatically of any state changes, usually
 * by calling one of their methods.
 *
 * Any class that inherits AbstractObserverPattern will become a 'Subject'.
 *
 * @param{String} notifyFunction The function that Subject will call on all
 *                               of its observers. observers must implement
 *                               this function in order to register as an
 *                               observer.
 */

// Class: AbstractObserverPattern
// From Wikipedia: https://en.wikipedia.org/wiki/Observer_pattern
// The observer pattern is a software design pattern in which an object,
// named the 'Subject', maintains a list of its dependents, called
// 'Observers',and notifies them automatically of any state changes, usually
// by calling one of their methods.
// Any class that inherits AbstractObserverPattern will become a 'Subject'.

class AbstractObserverPattern {
    constructor(notifyFunction, options) {
        if (this.constructor === AbstractObserverPattern) {
            throw new Error(
                "Abstract class: " +
                    "AbstractObserverPattern cannot be instantiated."
            );
        }

        this.observers = [];
        this.notifyFunction = notifyFunction;
        this.options = options;
    }

    // Function: registerObserver
    //
    // *Adds an observer to the observer list.*
    //
    // Parameters:
    //
    //  observer - The observer to be registered
    // 
    // Returns:
    //
    //      None

    registerObserver(observer) {
        if (!this.hasNotifyFunction(observer)) {
            throw new Error(
                "Cannot register observer: missing " + this.notifyFunction
            );
        }
        this.observers.push(observer);
    }

    // Function: notify
    //
    // *Notify all observers*
    //
    // Parameters:
    //
    //  data - The data to be provided to all observers on notification
    // 
    // Returns:
    //
    //      None

    notify(data) {
        var scope = this;
        for(let obs of this.observers) {
            obs[scope.notifyFunction](data);
        };
    }

    hasNotifyFunction(observer) {
        return typeof observer[this.notifyFunction] === "function";
    }
}

export {AbstractObserverPattern}