# Performance Benchmarks

This directory contains performance testing tools and documentation for `@svgies/icons`.

## Files

- **`PERFORMANCE.md`** - Detailed performance analysis and benchmarks
- **`test-speed.js`** - Node.js benchmark script
- **`test-speed.html`** - Browser-based benchmark with interactive UI
- **`run-browser-test.sh`** - Helper script to start local server for browser tests

## Quick Start

### Run Node.js Benchmarks

```bash
# From repository root
pnpm build
node benchmarks/test-speed.js
```

This will run 100 iterations per chain and display timing statistics.

### Run Browser Benchmarks

```bash
# From repository root
./benchmarks/run-browser-test.sh
```

Then open http://localhost:8000/benchmarks/test-speed.html in your browser and click "Run Speed Test".

## What's Tested

Both benchmarks test all supported blockchain address types:
- ✅ **Arweave** addresses
- ✅ **EVM** (Ethereum, Polygon, etc.) addresses
- ✅ **Solana** addresses
- ✅ **Bitcoin** addresses

Each test runs 100 iterations with warmup and measures:
- Average generation time
- Minimum time
- Maximum time
- Median time

## Current Results

### Node.js
All chains generate icons in **< 0.05ms** on average.

### Browser (Chrome)
All chains generate icons in **< 0.06ms** on average.

See [PERFORMANCE.md](./PERFORMANCE.md) for detailed results and analysis.

## Adding New Benchmarks

To add a new benchmark:

1. Add the test case to `test-speed.js` for Node.js
2. Add the test case to `test-speed.html` for browsers
3. Update `PERFORMANCE.md` with results
4. Run both tests to verify

## Notes

- Tests use `size: 128` for consistency
- Browser tests require building the project first (`pnpm build`)
- Browser tests need a local server due to ES module imports
- Results may vary based on hardware and browser/Node.js version

