import { describe, it } from 'node:test';
import assert from 'node:assert';
import { arSvgie, evmSvgie, solanaSvgie, bitcoinSvgie, svgie } from './index';

describe('Arweave SVG Generation', () => {
  const arweaveAddress = 'E_pOZW6MDRtcTraQlIEM0p4l_AedIadAO9j-RzuPol8';

  it('should generate SVG for valid Arweave address', async () => {
    const result = await arSvgie(arweaveAddress);
    assert.ok(result !== undefined);
    assert.ok(result.includes('<svg'));
    assert.ok(result.includes('</svg>'));
  });

  it('should generate SVG with custom size', async () => {
    const result = await arSvgie(arweaveAddress, { size: 64 });
    assert.ok(result !== undefined);
    assert.ok(result.includes('width="64"'));
    assert.ok(result.includes('height="64"'));
  });

  it('should generate data URI when asDataURI is true', async () => {
    const result = await arSvgie(arweaveAddress, { asDataURI: true });
    assert.ok(result !== undefined);
    assert.match(result, /^data:image\/svg\+xml;utf8,/);
  });

  it('should generate different SVG with seed', async () => {
    const result1 = await arSvgie(arweaveAddress);
    const result2 = await arSvgie(arweaveAddress, { seed: 'test-seed' });
    assert.notStrictEqual(result1, result2);
  });

  it('should generate legacy colors when legacy option is true', async () => {
    const result = await arSvgie(arweaveAddress, { legacy: true });
    assert.ok(result !== undefined);
    assert.ok(result.includes('<svg'));
  });

  it('should return undefined for invalid Arweave address', async () => {
    const result = await arSvgie('invalid-address');
    assert.strictEqual(result, undefined);
  });

  it('should return undefined for empty address', async () => {
    const result = await arSvgie('');
    assert.strictEqual(result, undefined);
  });

  it('should return undefined for address with wrong length', async () => {
    const result = await arSvgie('tooShort');
    assert.strictEqual(result, undefined);
  });

  it('should return undefined for size < 1', async () => {
    const result = await arSvgie(arweaveAddress, { size: 0 });
    assert.strictEqual(result, undefined);
  });
});

describe('EVM SVG Generation', () => {
  const evmAddress = '0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e';

  it('should generate SVG for valid EVM address', () => {
    const result = evmSvgie(evmAddress);
    assert.ok(result !== undefined);
    assert.ok(result.includes('<svg'));
    assert.ok(result.includes('</svg>'));
  });

  it('should generate SVG with custom size', () => {
    const result = evmSvgie(evmAddress, { size: 128 });
    assert.ok(result !== undefined);
    assert.ok(result.includes('width="128"'));
    assert.ok(result.includes('height="128"'));
  });

  it('should generate data URI when asDataURI is true', () => {
    const result = evmSvgie(evmAddress, { asDataURI: true });
    assert.ok(result !== undefined);
    assert.match(result, /^data:image\/svg\+xml;utf8,/);
  });

  it('should return undefined for invalid EVM address', () => {
    const result = evmSvgie('0xinvalid');
    assert.strictEqual(result, undefined);
  });

  it('should return undefined for address without 0x prefix', () => {
    const result = evmSvgie('A3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e');
    assert.strictEqual(result, undefined);
  });

  it('should return undefined for size < 1', () => {
    const result = evmSvgie(evmAddress, { size: -1 });
    assert.strictEqual(result, undefined);
  });
});

describe('Solana SVG Generation', () => {
  const solanaAddress = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';

  it('should generate SVG for valid Solana address', () => {
    const result = solanaSvgie(solanaAddress);
    assert.ok(result !== undefined);
    assert.ok(result.includes('<svg'));
    assert.ok(result.includes('</svg>'));
  });

  it('should generate SVG with custom size', () => {
    const result = solanaSvgie(solanaAddress, { size: 256 });
    assert.ok(result !== undefined);
    assert.ok(result.includes('width="256"'));
    assert.ok(result.includes('height="256"'));
  });

  it('should generate different SVG with seed', () => {
    const result1 = solanaSvgie(solanaAddress);
    const result2 = solanaSvgie(solanaAddress, { seed: 'my-seed' });
    assert.ok(result1 !== undefined);
    assert.ok(result2 !== undefined);
    assert.notStrictEqual(result1, result2);
  });

  it('should generate data URI when asDataURI is true', () => {
    const result = solanaSvgie(solanaAddress, { asDataURI: true });
    assert.ok(result !== undefined);
    assert.match(result, /^data:image\/svg\+xml;utf8,/);
  });

  it('should return undefined for invalid Solana address', () => {
    const result = solanaSvgie('invalid');
    assert.strictEqual(result, undefined);
  });

  it('should return undefined for size < 1', () => {
    const result = solanaSvgie(solanaAddress, { size: 0 });
    assert.strictEqual(result, undefined);
  });
});

describe('Bitcoin SVG Generation', () => {
  const legacyBitcoinAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
  const bech32BitcoinAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

  it('should generate SVG for valid legacy Bitcoin address', () => {
    const result = bitcoinSvgie(legacyBitcoinAddress);
    assert.ok(result !== undefined);
    assert.ok(result.includes('<svg'));
    assert.ok(result.includes('</svg>'));
  });

  it('should generate SVG for valid bech32 Bitcoin address', () => {
    const result = bitcoinSvgie(bech32BitcoinAddress);
    assert.ok(result !== undefined);
    assert.ok(result.includes('<svg'));
    assert.ok(result.includes('</svg>'));
  });

  it('should generate SVG with custom size', () => {
    const result = bitcoinSvgie(legacyBitcoinAddress, { size: 48 });
    assert.ok(result !== undefined);
    assert.ok(result.includes('width="48"'));
    assert.ok(result.includes('height="48"'));
  });

  it('should generate different SVG with seed', () => {
    const result1 = bitcoinSvgie(legacyBitcoinAddress);
    const result2 = bitcoinSvgie(legacyBitcoinAddress, { seed: 'bitcoin-seed' });
    assert.ok(result1 !== undefined);
    assert.ok(result2 !== undefined);
    assert.notStrictEqual(result1, result2);
  });

  it('should generate data URI when asDataURI is true', () => {
    const result = bitcoinSvgie(legacyBitcoinAddress, { asDataURI: true });
    assert.ok(result !== undefined);
    assert.match(result, /^data:image\/svg\+xml;utf8,/);
  });

  it('should return undefined for invalid Bitcoin address', () => {
    const result = bitcoinSvgie('invalid-btc-address');
    assert.strictEqual(result, undefined);
  });

  it('should return undefined for size < 1', () => {
    const result = bitcoinSvgie(legacyBitcoinAddress, { size: 0 });
    assert.strictEqual(result, undefined);
  });
});

describe('Universal svgie() - Auto-detection', () => {
  it('should auto-detect and generate SVG for Arweave address', async () => {
    const address = 'E_pOZW6MDRtcTraQlIEM0p4l_AedIadAO9j-RzuPol8';
    const result = await svgie(address);
    assert.ok(result !== undefined);
    assert.ok(result.includes('<svg'));
  });

  it('should auto-detect and generate SVG for EVM address', async () => {
    const address = '0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e';
    const result = await svgie(address);
    assert.ok(result !== undefined);
    assert.ok(result.includes('<svg'));
  });

  it('should auto-detect and generate SVG for Solana address', async () => {
    const address = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
    const result = await svgie(address);
    assert.ok(result !== undefined);
    assert.ok(result.includes('<svg'));
  });

  it('should auto-detect and generate SVG for Bitcoin address', async () => {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    const result = await svgie(address);
    assert.ok(result !== undefined);
    assert.ok(result.includes('<svg'));
  });

  it('should return undefined for unrecognized address format', async () => {
    const result = await svgie('completely-invalid-address-12345');
    assert.strictEqual(result, undefined);
  });

  it('should respect explicit chain type override', async () => {
    const address = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
    const result = await svgie(address, { chain: 'solana' });
    assert.ok(result !== undefined);
    assert.ok(result.includes('<svg'));
  });

  it('should pass options correctly to underlying function', async () => {
    const address = '0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e';
    const result = await svgie(address, { size: 96, asDataURI: true });
    assert.ok(result !== undefined);
    assert.match(result, /^data:image\/svg\+xml;utf8,/);
    assert.ok(result.includes('width%3D%2296%22')); // URL-encoded width="96"
  });
});

describe('SVG Structure Validation', () => {
  it('should contain required SVG elements', async () => {
    const address = '0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e';
    const result = evmSvgie(address);
    assert.ok(result !== undefined);
    
    assert.ok(result.includes('xmlns="http://www.w3.org/2000/svg"'));
    assert.ok(result.includes('viewBox="0 0 32 32"'));
    assert.ok(result.includes('<radialGradient'));
    assert.ok(result.includes('<linearGradient'));
    assert.ok(result.includes('<path'));
    assert.ok(result.includes('<rect'));
  });

  it('should have valid gradient definitions', async () => {
    const address = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
    const result = solanaSvgie(address);
    assert.ok(result !== undefined);
    
    assert.ok(result.includes('id="ab"'));
    assert.ok(result.includes('id="cdc"'));
    assert.ok(result.includes('id="dcd"'));
    assert.ok(result.includes('fill="url(#ab)"'));
    assert.ok(result.includes('fill="url(#cdc)"'));
    assert.ok(result.includes('stroke="url(#dcd)"'));
  });

  it('should contain stop-color definitions', () => {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    const result = bitcoinSvgie(address);
    assert.ok(result !== undefined);
    
    assert.match(result, /stop-color="#[0-9a-f]{8}"/i);
    assert.ok(result.includes('offset='));
  });
});

describe('Consistency Tests', () => {
  it('should generate same SVG for same Arweave address without seed', async () => {
    const address = 'E_pOZW6MDRtcTraQlIEM0p4l_AedIadAO9j-RzuPol8';
    const result1 = await arSvgie(address);
    const result2 = await arSvgie(address);
    assert.ok(result1 !== undefined);
    assert.ok(result2 !== undefined);
    assert.strictEqual(result1, result2);
  });

  it('should generate same SVG for same EVM address', () => {
    const address = '0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e';
    const result1 = evmSvgie(address);
    const result2 = evmSvgie(address);
    assert.ok(result1 !== undefined);
    assert.ok(result2 !== undefined);
    assert.strictEqual(result1, result2);
  });

  it('should generate same SVG for same Solana address without seed', () => {
    const address = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
    const result1 = solanaSvgie(address);
    const result2 = solanaSvgie(address);
    assert.ok(result1 !== undefined);
    assert.ok(result2 !== undefined);
    assert.strictEqual(result1, result2);
  });

  it('should generate same SVG for same Bitcoin address without seed', () => {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    const result1 = bitcoinSvgie(address);
    const result2 = bitcoinSvgie(address);
    assert.ok(result1 !== undefined);
    assert.ok(result2 !== undefined);
    assert.strictEqual(result1, result2);
  });
});

