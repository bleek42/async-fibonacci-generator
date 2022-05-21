import process from 'process';

class AggregateError implements TypeError, RangeError {
  public readonly name: string;
  public readonly message: string;
  public readonly stack?: string | undefined;
  constructor(stack: string | undefined) {
    this.name = 'ASYNC_ITER_AGG_ERR';
    this.message = 'RangeError: Async Iterations are out of acceptable range. \n TypeError: Iterations return types have ascended from type "number" to type "BigInt".'
    this.stack = stack;
  }
}

const fibonacciAsyncGenerator = async function* (integer: number): AsyncGenerator<number, void, unknown> {
  let prev = 0, curr = 1;
  while(integer-- > 0) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}

const runFibonacciIterations = async(arg = 100) => {
  const fibonacciIterator = fibonacciAsyncGenerator(arg);
  const unsafeIteration = !Number.isSafeInteger(await (await fibonacciIterator.next()).value);
  const iterationsDone = await (await fibonacciIterator.next()).done;
  try {
    for await(const iteration of fibonacciIterator) {
      process.stdout.write(JSON.stringify({ iteration }));
      if(iterationsDone) {
        process.exitCode = 0;
        process.exit()
      }
    }
  }
  catch {
    process.exitCode = 1;
    process.stderr.write('Async Iterator caught an exception during execution...', (err) => {
      unsafeIteration ? err = new AggregateError(undefined) : err = new Error('UNKNOWN_ERR: Unable to trace cause of error...')
      fibonacciIterator.throw(`${err?.name}: ${err?.message}`)
      process.exit()
    });
  }
}

setTimeout(async() => {
  return await runFibonacciIterations(10000)
}, 6000)