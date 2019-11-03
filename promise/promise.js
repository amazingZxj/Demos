const SUCCESS = 'fulfilled';
const FAIL = 'rejected';
const PENDING = 'pending';
function resolvePromise2 (result, promise2, resolve, reject){
  if(typeof result === 'function' || (typeof result === 'object' && result != null)){
    try {
      const then = result.then;
      if(typeof then === 'function'){
        then.call(result, x=>{
          resolvePromise2(x, promise2, resolve, reject); 
        },y=>{
          reject(y);
        })
      }else{
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  }else{
    resolve(result);
  }
}
class Promise {
  constructor(exe){
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolveFn = (value) => {
      if(value instanceof Promise){ 
        return value.then(resolveFn, rejectFn); 
      }
      if(this.state === PENDING){
        this.state = SUCCESS;
        this.value = value;
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    };
    const rejectFn = (reason) => {
      if(this.state === PENDING){
        this.state = FAIL;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    };
    try {
      exe(resolveFn, rejectFn);
    } catch (error) {
      rejectFn(error);
    }
  }
  then(onResolved, onRejected){
    const promise2 = new Promise((resolve, reject)=>{
      if(this.state === SUCCESS){
        setTimeout(()=>{
          try{
            const result = onResolved(this.value);
            resolvePromise2(result, promise2, resolve, reject);
          }catch(error){
            reject(error);
          }
        });
      }
      if(this.state === FAIL){
        setTimeout(()=>{
          try {
            const result = onRejected(this.reason);
            resolvePromise2(result, promise2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if(this.state === PENDING){
        this.onResolvedCallbacks.push(()=>{
          setTimeout(()=>{
            try {
              const result = onResolved(this.value);
              resolvePromise2(result, promise2, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(()=>{
          setTimeout(()=>{
            try {
              const result = onRejected(this.reason);
              resolvePromise2(result, promise2, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });
    return promise2;
  }
}
module.exports = Promise;