/**
 *
 */
export default class EventService {
    /**
     *
     */
    constructor() {
        // No need for a Map since we're using the browser's event system
    }

    /**
     * Emits a custom event with the given name and data.
     * @param {string} eventName - The name of the event to emit.
     * @param {string} message - The message to pass to the event listeners.
     */
    emitEvent(eventName, message = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                message: message,
            },
        });
        window.dispatchEvent(event);
    }

    /**
     * Adds a listener for the specified event.
     * @param {string} eventName - The name of the event to listen for.
     * @param {Function} listener - The callback function to execute when the event is emitted.
     */
    addEventListener(eventName, listener) {
        window.addEventListener(eventName, listener);
    }

    /**
     * Removes a listener for the specified event.
     * @param {string} eventName - The name of the event to remove the listener from.
     * @param {Function} listener - The callback function to remove.
     */
    removeEventListener(eventName, listener) {
        window.removeEventListener(eventName, listener);
    }

    /**
     * Removes all listeners for the specified event.
     * @param {string} eventName - The name of the event to remove all listeners from.
     */
    removeAllEventListener(eventName) {
        // To remove all listeners, we need to clone the event listeners and remove them one by one
        const listeners = window.eventListeners?.get(eventName) || [];
        listeners.forEach((listener) => {
            window.removeEventListener(eventName, listener);
        });
    }
}
