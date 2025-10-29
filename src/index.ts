import { keccak_256 } from "@noble/hashes/sha3.js";
import { sha256 } from "@noble/hashes/sha2.js";

const arweaveAddressRegex = /^[a-z0-9-_]{43}$/i;
const evmAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/; // Base58, typically 44 chars
const bitcoinAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/; // Legacy, SegWit, Bech32

type ChainType = "arweave" | "evm" | "solana" | "bitcoin";

type svgieOptions = {
  asDataURI?: boolean;
  size?: number;
  seed?: string;
  legacy?: boolean;
  chain?: ChainType; // Explicit chain type for edge cases
};

// Universal base64 decode that works in both Node.js and browsers
const base64Decode = (base64: string): string => {
  // Try to use native atob if available (browsers and Node 16+)
  if (typeof atob !== "undefined") {
    return atob(base64);
  }
  // Fallback for older Node.js environments without atob
  // This implementation works without Buffer
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let str = "";
  base64 = base64.replace(/=+$/, "");

  for (let i = 0; i < base64.length; i += 4) {
    const encoded = [
      chars.indexOf(base64[i]!),
      chars.indexOf(base64[i + 1]!),
      chars.indexOf(base64[i + 2]!),
      chars.indexOf(base64[i + 3]!),
    ];

    const byte1 = (encoded[0]! << 2) | (encoded[1]! >> 4);
    const byte2 = ((encoded[1]! & 15) << 4) | (encoded[2]! >> 2);
    const byte3 = ((encoded[2]! & 3) << 6) | encoded[3]!;

    str += String.fromCharCode(byte1);
    if (encoded[2] !== -1) str += String.fromCharCode(byte2);
    if (encoded[3] !== -1) str += String.fromCharCode(byte3);
  }

  return str;
};

// Legacy color calculation functions from old implementation
const fixOpacity = (hexString: string) => {
  const data =
    hexString.length == 8
      ? hexString
      : hexString.length == 6
      ? hexString + "ff"
      : "ffffffff";
  return (
    data?.slice(0, 6) +
    parseInt(
      `${(parseInt(data?.slice(6, 8), 16) * 256) / 1024 + 191}`
    ).toString(16)
  );
};

const repeatChar = (s: string) => {
  return s
    .split("")
    .map((c) => c.repeat(2))
    .join("");
};

const splitColor = (s: string) => {
  if (s.length == 8) return [repeatChar(s.slice(0, 4)), repeatChar(s.slice(4))];
  return [s, s];
};

const getLegacyColors = (hexData: string) => {
  let colors = (hexData?.match(/.{1,8}/g) as string[]) || [];
  switch (colors.length) {
    case 1:
      return [];
    case 2:
      colors = [...splitColor(colors[0]!), ...splitColor(colors[1]!)];
      break;
    case 3:
      colors = [...splitColor(colors[0]!), ...colors.slice(1)];
      break;
    default:
      break;
  }
  return colors.map((hex) => fixOpacity(hex));
};

export const arSvgie = async (address: string, opts: svgieOptions = {}) => {
  if (!address || address.length !== 43 || !arweaveAddressRegex.test(address)) return;

  const { asDataURI = false, size = 32, seed = "", legacy = false } = opts;

  if (size < 1) return;
  const base64Address = address.replace(/-/g, "+").replace(/_/g, "/");
  // Add correct padding for base64
  const padding = (4 - (base64Address.length % 4)) % 4;
  const paddedBase64 = base64Address + "=".repeat(padding);

  const bytesAddress = new Uint8Array(
    base64Decode(paddedBase64)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  const paths = getSPaths(bytesAddress.slice(0, 20));
  
  // Choose between legacy (direct from address) or new (hashed) colors
  let colors: string[];
  if (legacy) {
    // Legacy mode: convert bytes to hex and extract color data
    const hexAddress = Array.from(bytesAddress)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const hexColors = hexAddress.slice(40); // Last 24 hex characters
    colors = getLegacyColors(hexColors);
  } else {
    // New mode: use hashed bytes for colors
    const hashedBytes = await getHashedBytes(paddedBase64, seed);
    colors = getColors(hashedBytes);
  }

  const svg = getSVG(size, colors, paths);

  if (asDataURI) return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  return svg;
};

const getHashedBytes = async (address: string, seed?: string) => {
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(address + (seed ? seed : ""))
  );
  return new Uint8Array(hashBuffer);
};

// Dual-hash approach for chains that need SHA-256
const getHashForColors = (address: string, seed?: string): Uint8Array => {
  const input = new TextEncoder().encode(address + (seed || ""));
  return sha256(input);
};

const getHashForPaths = (address: string): Uint8Array => {
  const input = new TextEncoder().encode("paths:" + address);
  return sha256(input);
};

const getSPaths = (bytes20: Uint8Array) => {
  // build number arrays (original and symmetrical)
  const arr = [];
  const symArr = [];
  for (let i = 0; i < bytes20.length; i++) {
    const byte = bytes20[i] || 0;
    const highNibble = ((byte >> 4) & 0x0f) + 8;
    const lowNibble = (byte & 0x0f) + 8;
    arr.push(highNibble);
    arr.push(lowNibble);
    symArr.push(32 - highNibble);
    symArr.push(lowNibble);
  }
  //   const arr = bytes?.split("").map((char) => parseInt(char, 16) + 8);
  //   let symArr = arr?.map((val, index) => (index % 2 ? val : 32 - val));
  return [getSPath(arr), getSPath(symArr)];
};

// Creates a path from an array with all the control points defined
const getSPath = (arr: number[]) => {
  // First coordinates are the path start point
  let path = `M${arr[0]} ${arr[1]}`;
  // Every 2 coordinate pair, a Cubic Bézier S Curve goes into the path
  path += `C${arr[2]} ${arr[3]} ${arr[4]} ${arr[5]} ${arr[6]} ${arr[7]}`;
  for (let i = 8; i < arr.length; i += 4) {
    path += `S${arr[i]} ${arr[i + 1]} ${arr[i + 2]} ${arr[i + 3]}`;
  }
  // Last coordinate pair is used as control point for the last Bézier Curve
  //@ts-ignore
  path += `Q${2 * arr[arr.length - 2] - arr[arr.length - 4]} ${
    //@ts-ignore
    2 * arr[arr.length - 1] - arr[arr.length - 3]
  } ${arr[0]} ${arr[1]}z`;
  return path;
};

// Split bytes into hex colors (every 4 bytes) to create rgba colors
const getColors = (bytes: Uint8Array) => {
  const fixedOpacity = bytes.map((b, i) => (i % 4 !== 3 ? b : (b >> 2) + 191));
  const hexColors = [];
  let hexString = "";
  for (let i = 0; i < fixedOpacity.length; i++) {
    hexString += ("0" + fixedOpacity[i]?.toString(16)).slice(-2);
    if (i % 4 === 3) {
      hexColors.push(hexString);
      hexString = "";
    }
  }
  return hexColors;
};

const getSVG = (size: number, c: string[], p: string[]) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">
    <radialGradient id="ab">
        <stop stop-color="#${c[0]}" offset="0" />
        <stop stop-color="#${c[1]}" offset="1" />
    </radialGradient>
    <rect width="100%" height="100%" opacity="1" fill="white" />
    <rect width="100%" height="100%" opacity=".5" fill="url(#ab)" />
    <linearGradient id="cdc">
        <stop stop-color="#${c[2]}" offset="0" />
        <stop stop-color="#${c[3]}" offset=".5" />
        <stop stop-color="#${c[2]}" offset="1" />
    </linearGradient>
    <linearGradient id="dcd">
        <stop stop-color="#${c[3]}" offset="0" />
        <stop stop-color="#${c[2]}" offset=".5" />
        <stop stop-color="#${c[3]}" offset="1" />
    </linearGradient>
    <path
        fill="url(#cdc)"
        stroke-width=".1"
        stroke="url(#dcd)"
        d="${p[0]}${p[1]}"
    />
</svg>`;
};

// ==================== EVM Address Support ====================

// Get colors from keccak256 hash for EVM addresses
const getEvmColors = (hexData: string) => {
  // Remove 0x prefix and match groups of 8 hex characters
  const colors = (hexData?.slice(2).match(/.{1,8}/g) as string[]) || [];
  return colors.map((hex) => fixOpacity(hex));
};

// Get paths from EVM address hex characters
const getEvmPaths = (ethAddress: string) => {
  // Remove 0x prefix and convert each hex char to number
  const arr = ethAddress
    ?.substring(2)
    .split("")
    .map((char) => parseInt(char, 16) + 8);
  const symArr = arr?.map((val, index) => (index % 2 ? val : 32 - val));
  return [getSPath(arr), getSPath(symArr)];
};

export const evmSvgie = (address: string, opts: svgieOptions = {}) => {
  if (!address || !evmAddressRegex.test(address)) return;

  const { asDataURI = false, size = 32 } = opts;

  if (size < 1) return;

  // Hash the address with keccak256
  // ethers.keccak256 treats 0x-prefixed strings as hex bytes, not UTF-8 strings
  const addressLower = address.toLowerCase();
  const hexOnly = addressLower.slice(2); // Remove 0x prefix
  
  // Convert hex string to bytes
  const addressBytes = new Uint8Array(
    hexOnly.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  
  const hashBytes = keccak_256(addressBytes);
  const hash = "0x" + Array.from(hashBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Get colors from hash and paths from original address
  const colors = getEvmColors(hash);
  const paths = getEvmPaths(addressLower);

  const svg = getSVG(size, colors, paths);

  if (asDataURI) return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  return svg;
};

// ==================== Solana Address Support ====================

export const solanaSvgie = (address: string, opts: svgieOptions = {}) => {
  if (!address || !solanaAddressRegex.test(address)) return;

  const { asDataURI = false, size = 32, seed } = opts;

  if (size < 1) return;

  // Dual-hash approach
  const colorHash = getHashForColors(address, seed);
  const pathHash = getHashForPaths(address);

  const colors = getColors(colorHash);
  const paths = getSPaths(pathHash.slice(0, 20));

  const svg = getSVG(size, colors, paths);

  if (asDataURI) return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  return svg;
};

// ==================== Bitcoin Address Support ====================

export const bitcoinSvgie = (address: string, opts: svgieOptions = {}) => {
  if (!address || !bitcoinAddressRegex.test(address)) return;

  const { asDataURI = false, size = 32, seed } = opts;

  if (size < 1) return;

  // Dual-hash approach
  const colorHash = getHashForColors(address, seed);
  const pathHash = getHashForPaths(address);

  const colors = getColors(colorHash);
  const paths = getSPaths(pathHash.slice(0, 20));

  const svg = getSVG(size, colors, paths);

  if (asDataURI) return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  return svg;
};

// ==================== Auto-detect & Universal Function ====================

// Auto-detect address type and generate appropriate SVG
export const svgie = async (address: string, opts: svgieOptions = {}) => {
  // If chain is explicitly specified, use that
  if (opts.chain) {
    switch (opts.chain) {
      case "arweave":
        return await arSvgie(address, opts);
      case "evm":
        return evmSvgie(address, opts);
      case "solana":
        return solanaSvgie(address, opts);
      case "bitcoin":
        return bitcoinSvgie(address, opts);
    }
  }

  // Auto-detect based on format (ordered by specificity)
  if (evmAddressRegex.test(address)) {
    return evmSvgie(address, opts);
  } else if (arweaveAddressRegex.test(address)) {
    return await arSvgie(address, opts);
  } else if (bitcoinAddressRegex.test(address)) {
    return bitcoinSvgie(address, opts);
  } else if (solanaAddressRegex.test(address)) {
    return solanaSvgie(address, opts);
  }
  
  return undefined;
};
