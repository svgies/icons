// Node.js Speed Test for @svgies/icons
import { arSvgie, evmSvgie, solanaSvgie, bitcoinSvgie } from '../dist/index.js';

const ITERATIONS = 100;

const addresses = {
  arweave: 'E_pOZW6MDRtcTraQlIEM0p4l_AedIadAO9j-RzuPol8',
  evm: '0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e',
  solana: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
  bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
};

async function benchmarkChain(name, fn, address) {
  const times = [];
  
  // Warmup
  for (let i = 0; i < 10; i++) {
    await fn(address, { size: 128 });
  }
  
  // Actual benchmark
  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    await fn(address, { size: 128 });
    const end = performance.now();
    times.push(end - start);
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];
  
  return { avg, min, max, median };
}

async function runBenchmarks() {
  console.log('🚀 Node.js Speed Test - @svgies/icons');
  console.log(`Running ${ITERATIONS} iterations per chain...\n`);
  
  const results = {};
  
  // Arweave
  console.log('Testing Arweave...');
  results.arweave = await benchmarkChain('Arweave', arSvgie, addresses.arweave);
  
  // EVM
  console.log('Testing EVM...');
  results.evm = await benchmarkChain('EVM', evmSvgie, addresses.evm);
  
  // Solana
  console.log('Testing Solana...');
  results.solana = await benchmarkChain('Solana', solanaSvgie, addresses.solana);
  
  // Bitcoin
  console.log('Testing Bitcoin...');
  results.bitcoin = await benchmarkChain('Bitcoin', bitcoinSvgie, addresses.bitcoin);
  
  console.log('\n📊 Results (in milliseconds):\n');
  console.log('┌─────────────┬─────────┬─────────┬─────────┬─────────┐');
  console.log('│ Chain       │ Avg     │ Min     │ Max     │ Median  │');
  console.log('├─────────────┼─────────┼─────────┼─────────┼─────────┤');
  
  for (const [chain, stats] of Object.entries(results)) {
    const name = chain.padEnd(11);
    const avg = stats.avg.toFixed(3).padStart(7);
    const min = stats.min.toFixed(3).padStart(7);
    const max = stats.max.toFixed(3).padStart(7);
    const median = stats.median.toFixed(3).padStart(7);
    console.log(`│ ${name} │ ${avg} │ ${min} │ ${max} │ ${median} │`);
  }
  
  console.log('└─────────────┴─────────┴─────────┴─────────┴─────────┘');
  
  // Performance comparison
  const fastest = Object.entries(results).reduce((a, b) => 
    a[1].avg < b[1].avg ? a : b
  );
  const slowest = Object.entries(results).reduce((a, b) => 
    a[1].avg > b[1].avg ? a : b
  );
  
  console.log(`\n🏆 Fastest: ${fastest[0]} (${fastest[1].avg.toFixed(3)}ms)`);
  console.log(`🐌 Slowest: ${slowest[0]} (${slowest[1].avg.toFixed(3)}ms)`);
  console.log(`📈 Difference: ${((slowest[1].avg / fastest[1].avg - 1) * 100).toFixed(1)}% slower\n`);
}

runBenchmarks().catch(console.error);

