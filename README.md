# Compressed NFT (cNFT) Minting Script

Images
![ss1]("https://github.com/4rjunc/cNFT/blob/main/src/Screenshot%202024-09-29%20at%2016.18.41.png?raw=true")
![ss2]("https://github.com/4rjunc/cNFT/blob/main/src/Screenshot%202024-09-29%20at%2016.18.50.png?raw=true")

[Devet]("https://explorer.solana.com/address/6fEXLrZ2jn9QcUQeZ3Ted3HyRhv2xo6PNCdMDzbgqUuF?cluster=devnet")
To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This script demonstrates how to create and mint Compressed NFTs (cNFTs) on the Solana blockchain using the Metaplex Foundation's UMI library and associated modules.

## Overview

The script performs the following main tasks:

1. Sets up the UMI (Unified Modular Interface) with necessary plugins
2. Creates a Merkle tree for storing compressed NFTs
3. Creates a collection NFT
4. Mints compressed NFTs to multiple recipient addresses

## Prerequisites

- Node.js and npm (or Bun) installed
- Solana CLI tools
- A Solana wallet with some SOL for transaction fees

## Dependencies

The script uses the following main dependencies:

- `@metaplex-foundation/umi-bundle-defaults`
- `@metaplex-foundation/umi`
- `@metaplex-foundation/mpl-token-metadata`
- `@metaplex-foundation/umi-uploader-irys`
- `@metaplex-foundation/mpl-bubblegum`

## Setup

1. Install the required dependencies.
2. Ensure you have a Solana wallet keypair file named `my-keypair.json` in the same directory as the script.

## Configuration

- The script is set to use the Solana devnet. You can change this by modifying the `endpoint` variable.
- A list of recipient addresses is hardcoded in the `fellowAddresses` array.

## Main Functions

### `mintCNFT()`

This is the main function that orchestrates the entire minting process:

1. Sets up UMI with necessary plugins
2. Loads the wallet keypair
3. Creates a Merkle tree
4. Creates a collection NFT
5. Mints compressed NFTs to each address in the `fellowAddresses` array

## Usage

Run the script using Node.js or Bun:

```
bun run <script-name>.ts
```

## Important Notes

- The script uses pre-uploaded metadata URIs for both the collection and individual NFTs. You may want to customize these or implement dynamic metadata uploading.
- There's a 5-second delay between minting each cNFT to avoid rate limiting issues.
- Ensure you have sufficient SOL in your wallet to cover transaction fees.
- This script is for educational purposes. Always ensure you understand and comply with Solana's rate limits and best practices when deploying to production.

## Security Considerations

- The script reads a wallet keypair file. Ensure this file is kept secure and never shared or committed to version control.
- The keypair is used to sign transactions, so it should have the necessary permissions but contain only the funds needed for the operation.

## Customization

You can customize various aspects of the script:

- Modify the Merkle tree parameters in the `createTree` function call.
- Adjust the collection and NFT metadata.
- Change the recipient addresses in the `fellowAddresses` array.

## Troubleshooting

If you encounter issues:

- Ensure all dependencies are correctly installed.
- Check that your wallet has sufficient SOL.
- Verify that the `my-keypair.json` file is in the correct location and format.
- If transactions fail, you may need to adjust the delay between mints or handle rate limiting more robustly.
  Blogs Refered

1. The most detailed blog on Solana's compression: https://www.helius.dev/blog/all-you-need-to-know-about-compression-on-solana
2. All about specifically NFT compression (cNFTS): https://www.helius.dev/blog/solana-nft-compression
3. Metaplex's Bubblegum program's docs: https://developers.metaplex.com/bubblegum
4. Merkle Tress: https://www.helius.dev/blog/cryptographic-tools-101-hash-functions-and-merkle-trees-explained#what’s-a-merkle-tree

5. Creating compressed NFTs using Javascript: https://solana.com/developers/guides/javascript/compressed-nfts
6. The most detailed blog on Solana's compression: https://www.helius.dev/blog/all-you-need-to-know-about-compression-on-solana
7. All about specifically NFT compression (cNFTS): https://www.helius.dev/blog/solana-nft-compression
8. Metaplex's Bubblegum program's docs: https://developers.metaplex.com/bubblegum  
   This project was created using `bun init` in bun v1.1.20. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
