function trim(str) {
	return str.replace(/^\s|\s*$/g, '')
}
function triml(str) {
	return str.replace(/^\s/g, '')
}
function trimr(str) {
	return str.replace(/\s*$/g, '')
}
function trimm(str) {
	return str.replace(/(?:(?!(^\s+|\s+$))\s)/g, '')
}
console.log(trim(' 1    '))
console.log(triml(' 1 1   '))
console.log(trimr(' 1 1   '))
console.log(trimm(' 1  1 1 1 '))