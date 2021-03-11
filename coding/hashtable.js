//顺序查找链表
class LinkedList {
    constructor(key, value, next) {
        this.key = key;
        this.value = value;
        this.next = next;
    }
}
// // 创建分离链接法下的hashMap。
// function SeparateHashMap() {
//     var list = [];
//     // 获取索引
//     var loseloseHashCode = function (key) {
//         var hash = 0;
//         for (var i = 0; i < key.length; i++) {
//             hash += key.charCodeAt(i)
//         }
//         return hash % 37;
//     }
//     //这里为什么要创建一个新的用来存储键值对的构造函数？
//     //首先我们要知道的一点是，在分离链接下，我们元素所存储的位置实际上是在链表里面。
//     //而一旦在该散列位置下的链表中有多个值，我们仍旧需要通过key去找链表中所对应的元素。
//     //换句话说，分离链接下的存储方式是，首先通过key来计算散列值，然后把对应的key和value也就是ValuePair存入linkedList。
//     //这就是valuePair的作用了。
//     var ValuePair = function (key, value) {
//         this.key = key;
//         this.value = value;

//         this.toString = function () {
//             return "[" + this.key + "-" + this.value + "]";
//         }
//     }
//     //同样的，我们通过loselose散列函数计算出对应key的散列值。
//     this.put = function (key, value) {
//         var position = loseloseHashCode(key);
//         //这里如果该位置为undefined，说明这个位置没有链表，那么我们就新建一个链表。
//         if (list[position] == undefined) {
//             list[position] = new LinkedList();
//         }
//         //新建之后呢，我们就通过linkedList类的append方法把valuePair加入进去。
//         //那么如果上面的判断是false，也就是有了链表，直接跳过上面的判断执行加入操作就好了。
//         list[position].append(new ValuePair(key, value));
//     }

//     this.get = function (key) {
//         var position = loseloseHashCode(key);

//         //如果这个位置不是undefined，那么说明存在链表
//         if (list[position] !== undefined) {
//             //我们要拿到current，也就是链表中的第一个元素进行链表中的遍历。
//             var current = list[position];
//             //如果current.next不为null说明还有下一个
//             while (current) {
//                 //如果要查找的key是当前链表元素的key，就返回该链表节点的value。 
//                 if (current.element.key === key) {
//                     return current.element.value;
//                 }
//                 current = current.next;
//             }
//         }
//         return undefined;
//     }
//     //这个remove方法就不说了。跟get方法一模一样，get方法是在找到对应的值的时候返回该值的value，而remove方法是在找到该值的时候，重新赋值为undefined，从而移除它。
//     this.remove = function (key) {
//         var position = loseloseHashCode(key);

//         if (list[position] !== undefined) {
//             var current = list[position].getHead();
//             while (current.next) {
//                 if (current.element.key === key) {
//                     list[position].remove(current.element);
//                     if (list[position].isEmpty()) {
//                         list[position] = undefined;
//                     }
//                     return true;
//                 }
//                 current = current.next;
//             }
//             if (current.element.key === key) {
//                 list[position].remove(current.element);
//                 if (list[position].isEmpty()) {
//                     list[position] = undefined;
//                 }
//                 return true;
//             }
//         }

//         return false;
//     };

//     this.print = function () {
//         for (var i = 0; i < list.length; i++) {
//             // 大家可以把这里的判断去掉，看看到底是不是松散的数组结构。
//             if (list[i] !== undefined) {
//                 console.log(i + ":" + list[i]);
//             }
//         }
//     }
// }



class HashTable {
    storage = [];
    count = 0;
    limit = 37;
    k = 0.75

    hashFunc() {
        var hash = 0;
        for (var i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i)
        }
        return hash % limit;
    }

    put(key, value) {
        // 1.根据key获取index
        var index = this.hashFunc(key, this.limit)

        // 根据index取出对应的桶
        var bucket = this.storage[index]
        // 如果对应的位置没有桶那么就进行新创建
        if (!bucket) {
            bucket = []
            this.storage[index] = bucket
        }
        // 判断是否是修改数据
        for (var i = 0; i < bucket.length; i++) {
            var tuple = bucket[i]  //此时bucket的每一个元素也是数组的形式
            if (tuple[0] == key) {
                tuple[1] = value
                return
            }
        }

        // 进行添加
        bucket.push([key, value])
        this.count += 1

        if (this.count > this.limit * this.k) {
            this.resize(this.limit * 2)
        }
    }
    remove(key) {
        var index = this.hashFunc(key, this.limit)
        var bucket = this.storage[index]
        if (!bucket) {
            return null
        } else {
            for (var i = 0; i < bucket.length; i++) {
                var tuple = bucket[i]
                if (tuple[0] == key) {
                    // 从bucket数组中删除当前元素i
                    bucket.splice(i, 1)
                    // 总数减少
                    this.count--
                    // 缩容
                    if (this.limit > 7 && this.count < this.limit * 0.25) {
                        this.resize(Math.floor(this.limit / 2))
                    }
                    // 返回当前删除的元素
                    return tuple[1]
                }
            }
            return null
        }
    }
    resize(newlimit) {
        // 先保存就得数据
        var oldStorage = this.storage
        // 重置属性
        this.storage = []
        this.limit = newlimit

        // 遍历
        for (var i = 0; i < oldStorage.length; i++) {
            var bucket = oldStorage[i]
            if (!bucket) {
                continue
            } else {
                for (var j = 0; j < bucket.length; j++) {
                    var tuple = bucket[i]
                    this.put(tuple[0], tuple[1])
                }
            }
        }
    }
    // 判断当前传入数字是否是质数
    isPrime(num) {
        var temp = parseInt(Math.sqrt(num))
        for (var i = 2; i <= temp; i++) {
            if (num % i == 0) return false
        }
        return true
    }
    // 获取质数的方法
    getPrime(num) {
        while (!this.isPrime(num)) {
            num++
        }
        return num
    }
}




