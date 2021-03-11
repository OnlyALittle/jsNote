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
