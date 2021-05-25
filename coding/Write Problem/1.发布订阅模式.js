class EventEmitter {
    events = new Map();

    on(name, cb, ...args) {
        if (!this.events.has(name)) {
            this.events.set(name, new Map());
        }
        this.events.get(name).set(cb, (...params) => cb.call(this, [...args, ...params]))
    }

    fire(name, ...args) {
        let cbs = this.events.get(name);
        for (const cb of cbs.values()) {
            cb(...args)
        }
    }

    once(name, cb, ...args) {
        if (!this.events.has(name)) {
            this.events.set(name, new Map())
        }
        this.events.get(name).set(cb, (...params) => {
            cb.call(this, [...args, ...params])
            this.off(name, cb)
        })
    }

    off(name, cb) {
        let cbs = this.events.get(name);
        cbs && cbs.delete(cb);
    }
}

const fn1 = (...args) => console.log('I want sleep1', ...args)
const fn2 = (...args) => console.log('I want sleep2', ...args)

const event = new EmitListen();
console.log('--------')
event.on('sleep', fn1, 1,2,3)
event.on('sleep', fn2, 1,2,3)
event.fire('sleep', 4,5,6)
console.log('--------')
event.off('sleep', fn1)
event.once('sleep', () => console.log('i want sleep once'))
event.fire('sleep')
console.log('--------')
event.fire('sleep')
console.log('--------')


class Subject {
    constructor(){
        this.observers = [];
    }
    add(observer){  // 添加
        this.observers.push(observer);
    }
    remove(observer){  // 删除
        var observers = this.observers;
        for(var i = 0;i < observers.length;i++){
            if(observers[i] === observer){
                observers.splice(i,1);
            }
        }
    }
    notify(){
        var observers = this.observers;
        for(var i = 0;i < observers.length;i++){
            observers[i].update();
        }
    }
}
class Observer {
    constructor(name) {
        this.name = name;
    }
    update(){  // 更新
        console.log('my name is '+this.name);
    }

}

var sub = new Subject();
var obs1 = new Observer('ttsy1');
var obs2 = new Observer('ttsy2');
sub.add(obs1);
sub.add(obs2);
sub.notify();  //my name is ttsy1、my name is ttsy2

