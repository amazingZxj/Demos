const Promise = require('./promise');

const myPromise = new Promise(function(resolve, reject){
  resolve(100);
})

myPromise
.then((value)=>{
  console.log('成功', value)
  return new Promise((rs, rj)=>{
    rs(11122)
  })
}, (error)=>{
  console.log('失败', error)
})
.then((value)=>{
  console.log('成功1', value);
},(error)=>{
  console.log('失败1', error)
})
.then((value)=>{
  console.log('成功2', value);
},(error)=>{
  console.log('失败2', error)
})