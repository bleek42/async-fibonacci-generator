async function* asyncFibGen(nums = 100) {
  let prev = 0, curr = 1;
  while(nums-- > 0) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}

setInterval(async() => {
  const fibIterator = asyncFibGen(100)
 for await(const iteration of fibonacciIterable) {
   console.log({ iteration })
   if((await fibIterator.next()).done) {
     clearInterval(interval)     
   }
 } 
}, 10000)