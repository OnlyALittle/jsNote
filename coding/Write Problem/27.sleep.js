const sleep = (timer) => new Promise(r => {
	setTimeout(r, timer)
})


console.time('sleep')
sleep(1000).then(() => {
	console.timeEnd('sleep')
})