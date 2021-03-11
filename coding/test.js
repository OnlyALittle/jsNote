console.log('1');

setTimeout(function() {
    console.log('6');
}, 10)
process.nextTick(function() {
    console.log('5');
})
