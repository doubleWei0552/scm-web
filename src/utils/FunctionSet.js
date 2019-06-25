//用于存放公用的功能函数合集

//正则验证函数 pattern:表示要验证的正则表达式;value:表示要验证的数据
export function onRegex(pattern,value){  
    if(pattern && value){
        var PATTERN=new RegExp(pattern);
        return PATTERN.test(value)
    } else {
        return true
    }
}