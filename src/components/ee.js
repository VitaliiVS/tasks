export class EventEmitter {
    constructor() {
        this.events = {}
    }

    on = (eventName, callback) => {
        if (!this.events[eventName]) {
            this.events[eventName] = []
        }

        this.events[eventName].push(callback)

        return () => this.unsubscribe(eventName, callback)
    }

    emit = (eventName, data) => {
        const event = this.events[eventName]
        if (event) {
            event.forEach(callback => { callback.call(null, data) })
        }
    }

    unsubscribe = (eventName, callback) => {
        this.events[eventName] = this.events[eventName].filter(eventFn => callback !== eventFn)
    }
}