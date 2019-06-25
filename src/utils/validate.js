// 电话校验
function formItemValid(PATTERN, LABEl) {
  if(PATTERN){
    return [
      {
        pattern: PATTERN,
        message: `${LABEl}格式不正确`,
      },
    ];
  }
    return []
  
  
}


export {
  formItemValid,
};