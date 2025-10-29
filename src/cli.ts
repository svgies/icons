#!/usr/bin/env node

import { arSvgie, evmSvgie, solanaSvgie, bitcoinSvgie, svgie } from "./index.js";
import { writeFile } from "fs/promises";

const HELP_TEXT = `
svgies - Generate SVG identicons from blockchain addresses

USAGE:
  svgie <address> [options]
  svgie --address <address> [options]

SUPPORTED ADDRESS TYPES:
  - Arweave addresses (43 characters, base64url)
  - Bitcoin addresses (26-62 characters, base58/bech32)
  - EVM addresses (0x + 40 hex characters)
  - Solana addresses (32-44 characters, base58)

OPTIONS:
  -a, --address <address>   Blockchain address (auto-detected)
  -s, --size <number>       SVG size in pixels (default: 32)
  -c, --chain <type>        Force chain type: arweave, evm, solana, bitcoin
  --seed <string>           Seed for randomization (not available for EVM)
  -d, --data-uri            Output as data URI instead of raw SVG
  -o, --output <file>       Write to file instead of stdout
  -l, --legacy              Use legacy color calculation (Arweave only)
  -h, --help                Show this help message

EXAMPLES:
  # Arweave address
  svgie E_pOZW6MDRtcTraQlIEM0p4l_AedIadAO9j-RzuPol8
  svgie E_pOZW6MDRtcTraQlIEM0p4l_AedIadAO9j-RzuPol8 --size 64 --legacy
  
  # Bitcoin address
  svgie 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
  svgie bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh --chain bitcoin
  
  # EVM address (Ethereum, Polygon, etc.)
  svgie 0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e
  svgie 0xA3Ca2a4BFb8Af380cf2D42e40A832E7a205db08e --data-uri -o icon.svg
  
  # Solana address
  svgie DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK --size 128
  svgie DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK --chain solana
`;

interface CliOptions {
  address?: string;
  size?: number;
  seed?: string;
  chain?: "arweave" | "evm" | "solana" | "bitcoin";
  asDataURI?: boolean;
  output?: string;
  legacy?: boolean;
  help?: boolean;
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '-h':
      case '--help':
        options.help = true;
        break;
      
      case '-a':
      case '--address':
        options.address = args[++i];
        break;
      
      case '-s':
      case '--size':
        const size = parseInt(args[++i] || '', 10);
        if (!isNaN(size)) options.size = size;
        break;
      
      case '-c':
      case '--chain':
        const chain = args[++i];
        if (chain === 'arweave' || chain === 'evm' || chain === 'solana' || chain === 'bitcoin') {
          options.chain = chain;
        }
        break;
      
      case '--seed':
        options.seed = args[++i];
        break;
      
      case '-d':
      case '--data-uri':
        options.asDataURI = true;
        break;
      
      case '-l':
      case '--legacy':
        options.legacy = true;
        break;
      
      case '-o':
      case '--output':
        options.output = args[++i];
        break;
      
      default:
        // If it doesn't start with -, treat as positional address argument
        if (!arg?.startsWith('-') && !options.address) {
          options.address = arg;
        }
        break;
    }
  }
  
  return options;
}

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  // Show help
  if (options.help || args.length === 0) {
    console.log(HELP_TEXT);
    process.exit(0);
  }
  
  // Validate address
  if (!options.address) {
    console.error('Error: Address is required');
    console.log('\nUse --help for usage information');
    process.exit(1);
  }
  
  try {
    // Generate SVG (auto-detect address type)
    const result = await svgie(options.address, {
      size: options.size,
      seed: options.seed,
      chain: options.chain,
      asDataURI: options.asDataURI,
      legacy: options.legacy
    });
    
    if (!result) {
      console.error('Error: Invalid address format.');
      console.error('Supported formats:');
      console.error('  - Arweave: 43 characters (base64url)');
      console.error('  - Bitcoin: 26-62 characters (base58/bech32)');
      console.error('  - EVM: 0x + 40 hex characters');
      console.error('  - Solana: 32-44 characters (base58)');
      process.exit(1);
    }
    
    // Output result
    if (options.output) {
      await writeFile(options.output, result, 'utf-8');
      console.log(`SVG written to ${options.output}`);
    } else {
      console.log(result);
    }
    
  } catch (error) {
    console.error('Error generating SVG:', error);
    process.exit(1);
  }
}

main();

