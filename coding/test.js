
setTimeout(() => {
    console.log(1)
    let date = Date.now();
    while (1) {
        if (Date.now() - date > 50) break;
    }
    console.log('-----');
    setTimeout(() => {
        console.log(2)
    })

})

let date = Date.now();
while (1) {
    if (Date.now() - date > 50) break;
}

setImmediate(() => {
    console.log(3)
})

// setTimeout(() => {
//     setTimeout(() => {
//         console.log(3)
//     })
//     let date = Date.now();
//     while (1) {
//         if (Date.now() - date > 50) break;
//     }
//     setImmediate(() => {
//         console.log(4)
//     })
// })