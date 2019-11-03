
async function asyncFn(){
  const a = await new Promise((rs, rj)=>{
    setTimeout(()=>{
      rs(1)
    });
  });
  const b = await new Promise((rs, rj)=>{
    setTimeout(()=>{
      rs(2)
    });
  });
  console.log(a,b);
  return {a, b};
}
const result = asyncFn();
result.then(value=>{
  console.log(value)
}).catch(err=>{
  console.log('失败');
})