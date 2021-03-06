class EventEmitter {
    constructor(){
        this.events = new Map();
    }
    add(key, event) {
        if (this.events.has(key)) {
            this.events.get(key).push(event)
        } else {
            this.events.set(key, [event])
        }
    }
    remove(key, event) {
        if (this.events.has(key)) {
            let res = this.events.get(key).filter(item => item !== event);
            this.events.set(key, res)
        }
    }
    emit(key, ...ret) {
        (this.events.get(key) || []).forEach(ev => {
            ev.apply(this, ret)
        });
    }
}

const event = new EventEmitter()

const handle = (...pyload) => console.log(pyload)

event.add('click', handle)

event.emit('click', 100, 200, 300, 100)

event.remove('click', handle)

event.emit('click', 100)

event.emit('dbclick', 100)

//原型、原型链、闭包和立即执行函数