import { describe, it, expect } from 'vitest';
import { arSvgie, evmSvgie, solanaSvgie, bitcoinSvgie, svgie } from './index';

describe('Arweave SVG Generation', () => {
  const arweaveAddress = 'E_pOZW6MDRtcTraQlIEM0p4l_AedIadAO9j-RzuPol8';

  it('should generate SVG for valid Arweave address', async () => {
    const result = await arSvgie(arweaveAddress);
    expect(result).toBeDefined();
    expect(result).toContain('<svg');
    expect(result).toContain('</svg>');
  });

  it('should generate SVG with custom size', async () => {
    const result = await arSvgie(arweaveAddress, { size: 64 });
    expect(result).toContain('width="64"');
    expect(result).toContain('height="64"');
  });

  it('should generate data URI when asDataURI is true', async () => {
    const result = await arSvgie(arweaveAddress, { asDataURI: true });
    expect(result).toMatch(/^data:image\/svg\+xml;utf8,/);
  });

  it('should generate different SVG with seed', async () => {
    const result1 = await arSvgie(arweaveAddress);
    const result2 = await arSvgie(arweaveAddress, { seed: 'test-seed' });
    expect(result1).not.toBe(result2);
  });

  it('should generate legacy colors when legacy option is true', async () => {
    const result = await arSvgie(arweaveAddress, { legacy: true });
    expect(result).toBeDefined();
    expect(result).toContain('<svg');
  });

  it('should return undefined for invalid Arweave address', async () => {
    const result = await arSvgie('invalid-address');
    expect(result).toBeUndefined();
  });

  it('should return undefined for empty address', async () => {
    const result = await arSvgie('');
    expect(result).toBeUndefined();
  });

  it('should return undefined for address with wrong length', async () => {
    const result = await arSvgie('tooShort');
    expect(result).toBeUndefined();
  });

  it('should return undefined for size < 1', async () => {
    const result = await arSvgie(arweaveAddress, { size: 0 });
    expect(result).toBeUndefined();
  });
});

describe('EVM SVG Generation', () => {
  const evmAddress = '0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e';

  it('should generate SVG for valid EVM address', () => {
    const result = evmSvgie(evmAddress);
    expect(result).toBeDefined();
    expect(result).toContain('<svg');
    expect(result).toContain('</svg>');
  });

  it('should generate SVG with custom size', () => {
    const result = evmSvgie(evmAddress, { size: 128 });
    expect(result).toContain('width="128"');
    expect(result).toContain('height="128"');
  });

  it('should generate data URI when asDataURI is true', () => {
    const result = evmSvgie(evmAddress, { asDataURI: true });
    expect(result).toMatch(/^data:image\/svg\+xml;utf8,/);
  });

  it('should return undefined for invalid EVM address', () => {
    const result = evmSvgie('0xinvalid');
    expect(result).toBeUndefined();
  });

  it('should return undefined for address without 0x prefix', () => {
    const result = evmSvgie('A3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e');
    expect(result).toBeUndefined();
  });

  it('should return undefined for size < 1', () => {
    const result = evmSvgie(evmAddress, { size: -1 });
    expect(result).toBeUndefined();
  });
});

describe('Solana SVG Generation', () => {
  const solanaAddress = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';

  it('should generate SVG for valid Solana address', () => {
    const result = solanaSvgie(solanaAddress);
    expect(result).toBeDefined();
    expect(result).toContain('<svg');
    expect(result).toContain('</svg>');
  });

  it('should generate SVG with custom size', () => {
    const result = solanaSvgie(solanaAddress, { size: 256 });
    expect(result).toContain('width="256"');
    expect(result).toContain('height="256"');
  });

  it('should generate different SVG with seed', () => {
    const result1 = solanaSvgie(solanaAddress);
    const result2 = solanaSvgie(solanaAddress, { seed: 'my-seed' });
    expect(result1).not.toBe(result2);
  });

  it('should generate data URI when asDataURI is true', () => {
    const result = solanaSvgie(solanaAddress, { asDataURI: true });
    expect(result).toMatch(/^data:image\/svg\+xml;utf8,/);
  });

  it('should return undefined for invalid Solana address', () => {
    const result = solanaSvgie('invalid');
    expect(result).toBeUndefined();
  });

  it('should return undefined for size < 1', () => {
    const result = solanaSvgie(solanaAddress, { size: 0 });
    expect(result).toBeUndefined();
  });
});

describe('Bitcoin SVG Generation', () => {
  const legacyBitcoinAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
  const bech32BitcoinAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

  it('should generate SVG for valid legacy Bitcoin address', () => {
    const result = bitcoinSvgie(legacyBitcoinAddress);
    expect(result).toBeDefined();
    expect(result).toContain('<svg');
    expect(result).toContain('</svg>');
  });

  it('should generate SVG for valid bech32 Bitcoin address', () => {
    const result = bitcoinSvgie(bech32BitcoinAddress);
    expect(result).toBeDefined();
    expect(result).toContain('<svg');
    expect(result).toContain('</svg>');
  });

  it('should generate SVG with custom size', () => {
    const result = bitcoinSvgie(legacyBitcoinAddress, { size: 48 });
    expect(result).toContain('width="48"');
    expect(result).toContain('height="48"');
  });

  it('should generate different SVG with seed', () => {
    const result1 = bitcoinSvgie(legacyBitcoinAddress);
    const result2 = bitcoinSvgie(legacyBitcoinAddress, { seed: 'bitcoin-seed' });
    expect(result1).not.toBe(result2);
  });

  it('should generate data URI when asDataURI is true', () => {
    const result = bitcoinSvgie(legacyBitcoinAddress, { asDataURI: true });
    expect(result).toMatch(/^data:image\/svg\+xml;utf8,/);
  });

  it('should return undefined for invalid Bitcoin address', () => {
    const result = bitcoinSvgie('invalid-btc-address');
    expect(result).toBeUndefined();
  });

  it('should return undefined for size < 1', () => {
    const result = bitcoinSvgie(legacyBitcoinAddress, { size: 0 });
    expect(result).toBeUndefined();
  });
});

describe('Universal svgie() - Auto-detection', () => {
  it('should auto-detect and generate SVG for Arweave address', async () => {
    const address = 'E_pOZW6MDRtcTraQlIEM0p4l_AedIadAO9j-RzuPol8';
    const result = await svgie(address);
    expect(result).toBeDefined();
    expect(result).toContain('<svg');
  });

  it('should auto-detect and generate SVG for EVM address', async () => {
    const address = '0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e';
    const result = await svgie(address);
    expect(result).toBeDefined();
    expect(result).toContain('<svg');
  });

  it('should auto-detect and generate SVG for Solana address', async () => {
    const address = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
    const result = await svgie(address);
    expect(result).toBeDefined();
    expect(result).toContain('<svg');
  });

  it('should auto-detect and generate SVG for Bitcoin address', async () => {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    const result = await svgie(address);
    expect(result).toBeDefined();
    expect(result).toContain('<svg');
  });

  it('should return undefined for unrecognized address format', async () => {
    const result = await svgie('completely-invalid-address-12345');
    expect(result).toBeUndefined();
  });

  it('should respect explicit chain type override', async () => {
    const address = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
    const result = await svgie(address, { chain: 'solana' });
    expect(result).toBeDefined();
    expect(result).toContain('<svg');
  });

  it('should pass options correctly to underlying function', async () => {
    const address = '0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e';
    const result = await svgie(address, { size: 96, asDataURI: true });
    expect(result).toMatch(/^data:image\/svg\+xml;utf8,/);
    expect(result).toContain('width%3D%2296%22'); // URL-encoded width="96"
  });
});

describe('SVG Structure Validation', () => {
  it('should contain required SVG elements', async () => {
    const address = '0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e';
    const result = evmSvgie(address);
    
    expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(result).toContain('viewBox="0 0 32 32"');
    expect(result).toContain('<radialGradient');
    expect(result).toContain('<linearGradient');
    expect(result).toContain('<path');
    expect(result).toContain('<rect');
  });

  it('should have valid gradient definitions', async () => {
    const address = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
    const result = solanaSvgie(address);
    
    expect(result).toContain('id="ab"');
    expect(result).toContain('id="cdc"');
    expect(result).toContain('id="dcd"');
    expect(result).toContain('fill="url(#ab)"');
    expect(result).toContain('fill="url(#cdc)"');
    expect(result).toContain('stroke="url(#dcd)"');
  });

  it('should contain stop-color definitions', () => {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    const result = bitcoinSvgie(address);
    
    expect(result).toMatch(/stop-color="#[0-9a-f]{8}"/i);
    expect(result).toContain('offset=');
  });
});

describe('Consistency Tests', () => {
  it('should generate same SVG for same Arweave address without seed', async () => {
    const address = 'E_pOZW6MDRtcTraQlIEM0p4l_AedIadAO9j-RzuPol8';
    const result1 = await arSvgie(address);
    const result2 = await arSvgie(address);
    expect(result1).toBe(result2);
  });

  it('should generate same SVG for same EVM address', () => {
    const address = '0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e';
    const result1 = evmSvgie(address);
    const result2 = evmSvgie(address);
    expect(result1).toBe(result2);
  });

  it('should generate same SVG for same Solana address without seed', () => {
    const address = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK';
    const result1 = solanaSvgie(address);
    const result2 = solanaSvgie(address);
    expect(result1).toBe(result2);
  });

  it('should generate same SVG for same Bitcoin address without seed', () => {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    const result1 = bitcoinSvgie(address);
    const result2 = bitcoinSvgie(address);
    expect(result1).toBe(result2);
  });
});

