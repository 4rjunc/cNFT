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

const endpoint = "https://api.devnet.solana.com";
//const endpoint = "https://api.mainnet-beta.solana.com";

const mintCNFT = async () => {
  const fellowAddresses = [
    "BSxNuBrnCnpEcNGpnt3Hb6iqF3vfh33hfmLKREtgezSa", //nju address
    "EbN3JqZ2EKGGVagmvQpUuUPopEMDaXq4yXbLNqhaXEZD", //my second acc.
    "7jQFJLS3QRGJyshYkLgp4QQH8D5c9qym2LQzkhag38UD",
    "8J9Hz2tfFLDhE5vcdbinCMug4xqyBCfQCoi4QYfVapEn",
    "A1mq3dn2tUBfJB6WjnL4XtVQgGLGAUD3FeiMLuUQoRMu",
    "HjJQdfTHgC3EBX3471w4st8BXbBmtbaMyCAXNgcUb7dq",
    "BtSTqq27A7xTMaCPWEhNwdf4eHsLWiWZvhQS2ABMd1Y4",
    "9riZWGcTFTLoBpmRM5xfYXCrHsxoqL4ynqBYtNxskYHV",
    "H3QFot1G5Xe8wAjkQbLLt5dEYsHBsicKLHL1aSBv2H2d",
    "G1ZRP9Sz87SZJ6ZdsqaK8QxbXGTwCFv1SYnheRtY63DW",
    "8MgdhXTpfWp5k2m1Q2CxMkETgenkYasNqGW88nUANRkR",
    "6X4G9p5kiE6tDXkBHfpqispJ2B6YfAA3tBGcKvaXaht2",
    "8HWXSHAngoGE9dudeZUcvnP7xRr9Wb4gy7H8VS5GRo7N",
    "9BbWp6tcX9MEGSUEpNXfspYxYsWCxE9FgRkAc3RpftkT",
    "3dfxtPdadK4CdHC1HjcD6Fc2J3x3REy55RyDxAfYuf1d",
    "Fhrr8gFyNAASoCM2GprrjaNahgCJyb5SVV6V5oHr72Fj",
    "DVxLfD4BFF3dLUtpvDZ5jbZExjknE1m2WwH2axz2J6ge",
    "3o5cfcL9VS31T9N5ZbQgLTHokpxiWbTtjoAMjUp2SNey",
    "9unenHYtwUowNkWdZmSYTwzGxxdzKVJh7npk6W6uqRF3",
    "3dTSLCGStegkuoU6dc75DbRdJk4rKV3d5ZCZdSWbTcQv",
    "6ggGtCSpE6moyjDhQQ7MfQ8cw89DcgtYJhaKZaKJ59CQ",
    "JCsFjtj6tem9Dv83Ks4HxsL7p8GhdLtokveqW7uWjGyi",
    "DH9oe9rfZWkRfBVWvib11ihrgCaYP1jGrD9fXcvhun37",
    "HdaKENyK8fxod85QipFYZffC82PmsM8XEW4prcZbeQiK",
    "EcrHvqa5Vh4NhR3bitRZVrdcUGr1Z3o6bXHz7xgBU2FB",
    "GyETGp22PjuTTiQJQ2P9oAe7oioFjJ7tbTBr1qiXZoa8",
    "frae7AtwagcebTnNNFaobGH2haFUGNpFniKELbuBi2z",
    "38rc27bLd73QUDKmiDBQjsmbXpxinx8metaPFsRPSCWi",
    "4syk2oXfU7kgpAPAxsyBv47FHeNuVz5WGc2x8atGNDd2",
    "HFJEhqTUPKKWvhwVeQS5qjSP373kMUFpNuiqMMyXZ2Gr",
    "72hBoHW3TDBHH8vASheaqwVAb8ez3SJAhwtegN5UQvJ9",
    "CxjawXnJxAyb7Zx3xCkSD3nxamdpcfSikvnnC7C8RMHh",
    "2hNdA3G3hfwUN6z28mgFTAjmkXdTvHsRiTXQP3AZjaij",
    "ji1E9W3P4Yesmwcv6m5rgBs6dGnshaTcfaFoRW6qcjL",
    "HT8DNntQe2ZN1v763zUqPou5wwNGTg6xBPCDg31vhjrv",
    "BsdgGRzDmVTM8FBepRXrQixMZgjP6smsSbuDb1Y7VJB6",
  ];

  //SETTING UP UMI
  const umi: Umi = createUmi(endpoint)
    .use(mplBubblegum())
    .use(mplTokenMetadata())
    .use(irysUploader());
  // console.log("🛠 UMI: ", umi);

  // GENERATE NEW KEYPAIR SIGNER
  const signer = generateSigner(umi);

  //READ WALLET
  const wallet = await Bun.file("my-keypair.json").text();
  //const secretKey = new Uint8Array(JSON.parse(wallet));
  const secretKey = new Uint8Array(JSON.parse(wallet));
  //console.log(`☘️  Secret Key: ${secretKey}`);
  let keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);

  // LOAD KEYPAIR INTO UMI
  umi.use(keypairIdentity(keypair));
  const merkleTree = generateSigner(umi);
  console.log("🌲 MERKLE TREE PUBLICKEY: ", merkleTree);

  // CREATE A MERKLE TREE
  const createTreeTx = await createTree(umi, {
    merkleTree,
    maxDepth: 5,
    maxBufferSize: 8,
    canopyDepth: 2,
  });

  await createTreeTx.sendAndConfirm(umi);

  // CREATE TOKEN METADATA
  const collectionID = generateSigner(umi);
  console.log("⭐️ COLLECTION ID", collectionID);

  //console.log("UPLOADING COLLECTION METADATA");
  //const collectionMetadataUri = await umi.uploader.uploadJson(collectionMetadata);
  const collectionMetadataUri =
    "https://jbtvvzbsryxfzsfvkyia.supabase.co/storage/v1/object/public/solanamob/collectionMetadata.json";
  console.log("CREATING COLLECTION NFT");
  await createNft(umi, {
    mint: collectionID,
    name: "arjun",
    uri: collectionMetadataUri,
    isCollection: true,
    sellerFeeBasisPoints: percentAmount(0),
  }).sendAndConfirm(umi);

  //console.log("UPLOADING CNFT METADATA");
  //  const nftMetadataUri = await umi.uploader.uploadJson(nftMetadata);
  const nftMetadataUri =
    "https://jbtvvzbsryxfzsfvkyia.supabase.co/storage/v1/object/public/solanamob/cNFTMetadata.json";
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
        uri: nftMetadataUri, // Either use `nftMetadataUri` or a previously uploaded uri.""
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
