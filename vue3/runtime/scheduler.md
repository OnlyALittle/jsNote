# scheduler

1. nextTick接受函数作为参数，同时nextTick会创建一个微任务。
2. queueJob接受函数作为参数，queueJob会将参数push到queue队列中，在当前宏任务执行结束之后，清空队列。
3. queuePostFlushCb接受函数或者又函数组成的数组作为参数，queuePostFlushCb会将将参数push到postFlushCbs队列中，在当前宏任务执行结束之后，清空队列。
4. queueJob执行的优先级高于queuePostFlushCb
5. queueJob和queuePostFlushCb允许在清空队列的期间添加新的成员。
