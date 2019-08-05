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

//获取图片的地址
export function onGetImageUrl(value){
    if(value.response ? value.response.data.url : value.url){
        if(!(value.response ? value.response.data.url : value.url).includes('http:')){
            const { apiUrl: _apiUrl } = window.config;
            const origin = localStorage.getItem('origin') || '';
            const apiUrl = process.env.NODE_ENV === 'development' ? _apiUrl : origin;
            let newUrl = apiUrl.split(':')
            return `${newUrl[0]}:${newUrl[1]}${value.url}`
        } else {
            return value.response ? value.response.data.url : value.url
        }
    }
}