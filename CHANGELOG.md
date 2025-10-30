# @7i7o/arSvgies

## 2.0.1

### Patch Changes

- af35c40: Add benchmarks to measure icons generation speed for all chains

## 2.0.0

### Major Changes

- 84353a5: # Major Release: Multi-Chain Support and Package Rebrand

  This release represents a complete overhaul of the package with extensive new features and breaking changes.

  ## 🎉 New Features

  ### Multi-Chain Support

  - **Solana Support**: Added `solanaSvgie()` function with dual-hash approach for maximum uniqueness
  - **Bitcoin Support**: Added `bitcoinSvgie()` function supporting Legacy, SegWit, and Bech32 addresses
  - **Auto-detection**: Smart address format detection with priority ordering (EVM → Arweave → Bitcoin → Solana)
  - **Explicit Chain Selection**: New `--chain` option to override auto-detection when needed

  ### Enhanced Functionality

  - **Browser Compatibility**: Removed Node.js Buffer dependency, now works natively in browsers
  - **Dual-Hash Algorithm**: Solana and Bitcoin use independent SHA-256 hashes for colors and paths
  - **Seed Support**: Added seed parameter for Arweave, Solana, and Bitcoin (not EVM)
  - **Visual Examples**: Added example SVG files for all supported chains

  ### CLI Improvements

  - Renamed command from `arsvgie` to `svgie` (shorter, cleaner)
  - Added `-c, --chain` option for explicit chain type specification
  - Comprehensive help documentation with examples for all chains
  - Better error messages with format validation

  ## 💥 Breaking Changes

  ### Package Rename

  - **Old**: `@7i7o/arsvgies`
  - **New**: `@svgies/icons`
  - **Migration**: Update imports and package name in your projects

  ### CLI Command Change

  - **Old**: `arsvgie`
  - **New**: `svgie`
  - **Migration**: Update all CLI scripts and commands

  ### Repository Change

  - **Old**: `github.com/7i7o/arSvgies`
  - **New**: `github.com/svgies/icons`

  ## 🔧 Technical Improvements

  ### Algorithm Enhancements

  - **EVM**: Fixed color generation to match Ethereum ecosystem standards (hex bytes, not string)
  - **Arweave**: Maintained SHA-256 approach with optional legacy mode
  - **Solana/Bitcoin**: Dual-hash approach ensures very high uniqueness

  ### Export Changes

  ```typescript
  // New exports
  export { solanaSvgie, bitcoinSvgie, svgie };

  // Enhanced types
  type ChainType = "arweave" | "evm" | "solana" | "bitcoin";
  ```

  ## 📦 What's Included

  - Support for 4 major blockchain ecosystems
  - Browser and Node.js compatibility
  - Full TypeScript definitions
  - Comprehensive documentation with visual examples
  - MIT License
  - Example SVG files for all chains

  ## 📚 Documentation

  - Complete README overhaul with examples for all chains
  - Visual comparison table
  - API reference for all functions
  - CLI documentation
  - Usage examples for React, Node.js, Express, and more

  ## 🔄 Migration Guide

  ### Package Update

  ```bash
  # Remove old package
  npm uninstall @7i7o/arsvgies

  # Install new package
  npm install @svgies/icons
  ```

  ### Code Updates

  ```typescript
  // Before
  import { arSvgie } from "@7i7o/arsvgies";

  // After
  import {
    arSvgie,
    evmSvgie,
    solanaSvgie,
    bitcoinSvgie,
    svgie,
  } from "@svgies/icons";
  ```

  ### CLI Updates

  ```bash
  # Before
  arsvgie <address>

  # After
  svgie <address>
  ```

### Patch Changes

- 3911226: Fix workflow to use PAT token in GH actions to allow changesets to generate PRs

## 1.1.0

### Minor Changes

- 5113f98: fix build script

### Patch Changes

- 34ed831: fix files section of package.json

## 1.0.0

### Major Changes

- 1a79fbc: Added generative svg art for Arweave addresses
