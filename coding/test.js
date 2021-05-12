async function a(params) {
    console.log('a')
    await new Promise(r => {
        console.log('b')
        r()
    }).then(() => {console.log('c')}).then(() => {console.log('d')})
    // b();
    console.log('a2')
}
// async function b(params) {
//     console.log('b')
// }
a();

new Promise(r => {
    console.log('p')
    r()
}).then(() => {
    console.log('p1')
}).then(() => {
    console.log('p1')
}).then(() => {
    console.log('p1')
}).then(() => {
    console.log('p1')
}).then(() => {
    console.log('p1')
}).then(() => {
    console.log('p1')
})

