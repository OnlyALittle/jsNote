// 入参格式参考1：
const inputFuncStr = "function a (val) { console.log('transfer') }";
// 出参格式参考1：
const outputFuncStr = "const a = (val) => { console.log('transfer') }";


let a = inputFuncStr.replace(/(?:function)(.*)(\(.*\))(?:\s)(\{)/, (
    $1, $2, $3, $4, $5
) => {
    $2 = `${$2}= `
    $3 = `${$3} => `
    return 'const' +$2 + $3 + $4
})