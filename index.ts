import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  type Umi,
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  mplTokenMetadata,
  createNft,
} from "@metaplex-foundation/mpl-token-metadata";

import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

import {
  createTree,
  findLeafAssetIdPda,
  getAssetWithProof,
  mintV1,
  mplBubblegum,
  parseLeafFromMintV1Transaction,
  verifyCollection,
  mintToCollectionV1,
} from "@metaplex-foundation/mpl-bubblegum";
import { symbolName } from "typescript";

const endpoint = "https://api.devnet.solana.com";

const mintCNFT = async () => {
  const fellowAddresses = [
    "7yxySxVMxgwMJ3TMBboPfAqZmkDvuMzBLQQ39GeFQUks",
    "6X4G9p5kiE6tDXkBHfpqispJ2B6YfAA3tBGcKvaXaht2",
  ];

  //SETTING UP UMI
  const umi: Umi = createUmi(endpoint)
    .use(mplBubblegum())
    .use(mplTokenMetadata())
    .use(irysUploader());
  console.log("🛠 UMI: ", umi);

  // GENERATE NEW KEYPAIR SIGNER
  const signer = generateSigner(umi);

  //READ WALLET
  const wallet = await Bun.file("my-keypair.json").text();
  const secretKey = new Uint8Array(JSON.parse(wallet));
  console.log(`☘️  Secret Key: ${secretKey}`);
  let keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);

  // LOAD KEYPAIR INTO UMI
  umi.use(keypairIdentity(keypair));
  const merkleTree = generateSigner(umi);
  console.log("🌲 MERKLE TREE PUBLICKEY: ", merkleTree);

  // CREATE A MERKLE TREE
  const createTreeTx = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
    canopyDepth: 0,
  });

  await createTreeTx.sendAndConfirm(umi);

  // CREATE TOKEN METADATA
  const collectionID = generateSigner(umi);
  const NFTImageURI = [
    "https://pbs.twimg.com/profile_images/1837114156777889793/UZAq8VY4_400x400.jpg",
  ];
  console.log("collectionID", collectionID);

  const collectionMetadata = {
    name: "arjun",
    symbol: "AC",
    description: "zero to something in solana",
    image: NFTImageURI[0],
    externalUrl: "https://x.com/4rjunc",
    properties: {
      files: [
        {
          uri: NFTImageURI[0],
          type: "image/png",
        },
      ],
    },
  };

  console.log("UPLOADING COLLECTION METADATA");
  const collectionMetadataUri =
    await umi.uploader.uploadJson(collectionMetadata);
  console.log("CREATING COLLECTION NFT");
  await createNft(umi, {
    mint: collectionID,
    name: "arjun",
    uri: collectionMetadataUri,
    isCollection: true,
    sellerFeeBasisPoints: percentAmount(0),
  }).sendAndConfirm(umi);

  const nftMetadata = {
    name: "4rjunc",
    image: NFTImageURI[0],
    externalUrl: "https://x.com/4rjunc",
    attributes: [
      { trait_type: "twitter", value: "https://twitter.com/4rjunc" },
      { trait_type: "github", value: "https://github.com/4rjunc" },
    ],
    properties: {
      files: [{ uri: NFTImageURI[0], type: "image/png" }],
    },
  };

  console.log("UPLOADING CNFT METADATA");
  const nftMetadataUri = await umi.uploader.uploadJson(nftMetadata);

  console.log("merkleTree:", merkleTree);
  for (const student of fellowAddresses) {
    console.log("Student Address:", student);
    const newOwner = publicKey(student);

    console.log("Minting Compressed NFT to Merkle Tree...");

    // const { signature } = await mintToCollectionV1(umi, {
    const { signature } = await mintV1(umi, {
      leafOwner: newOwner,
      merkleTree: merkleTree.publicKey,
      collectionMint: collectionID.publicKey,
      metadata: {
        name: "4rjunc",
        uri: nftMetadataUri, // Either use `nftMetadataUri` or a previously uploaded uri.
        sellerFeeBasisPoints: 500, // 5%
        collection: { key: collectionID.publicKey, verified: false },
        creators: [
          { address: umi.identity.publicKey, verified: true, share: 100 },
        ],
      },
    }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

    console.log("Waiting for 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

mintCNFT();
