const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16 } = require("snarkjs");

function unstringifyBigInts(o) {
  if (typeof o == "string" && /^[0-9]+$/.test(o)) {
    return BigInt(o);
  } else if (typeof o == "string" && /^0x[0-9a-fA-F]+$/.test(o)) {
    return BigInt(o);
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
    if (o === null) return null;
    const res = {};
    const keys = Object.keys(o);
    keys.forEach((k) => {
      res[k] = unstringifyBigInts(o[k]);
    });
    return res;
  } else {
    return o;
  }
}

// describe("HelloWorld", function () {
//   let Verifier;
//   let verifier;

//   beforeEach(async function () {
//     Verifier = await ethers.getContractFactory("HelloWorldVerifier");
//     verifier = await Verifier.deploy();
//     await verifier.deployed();
//   });

//   it("Should return true for correct proof", async function () {
//     //[assignment] Add comments to explain what each line is doing
//     const { proof, publicSignals } = await groth16.fullProve(
//       { a: "1", b: "2" },
//       "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm",
//       "contracts/circuits/HelloWorld/circuit_final.zkey"
//     ); // HelloWorld.circomにおけるa,bに対してinputを入れている

//     console.log("----------------------------------"); //add

//     console.log(" 1 x 2 =", publicSignals[0]); //publicSignals is a output

//     const editedPublicSignals = unstringifyBigInts(publicSignals); // BigIntに変更 Array > BigInt

//     const editedProof = unstringifyBigInts(proof); // BigIntに変更 Objects > BigInt
//     const calldata = await groth16.exportSolidityCallData(
//       editedProof,
//       editedPublicSignals
//     ); //BigIntから全てのtxのcalldataを取得している
//     // console.log("calldata ===", calldata);

//     const argv = calldata
//       .replace(/["[\]\s]/g, "")
//       .split(",")
//       .map((x) => BigInt(x).toString());
//     // calldata ["BigInt","BigInt"] >> ["string","string"]
//     //　objになっていたいろんなBigInt >>> [string]

//     // console.log("argv ===", argv);

//     const a = [argv[0], argv[1]]; //calldataをstringに変換したものを割り当てている
//     const b = [
//       [argv[2], argv[3]],
//       [argv[4], argv[5]],
//     ]; //calldataをstringに変換したものを割り当てている
//     const c = [argv[6], argv[7]]; //calldataをstringに変換したものを割り当てている
//     const Input = argv.slice(8); //8番目まで切っちゃうぜ
//     console.log("Input ===", Input);

//     expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
//   });
//   it("Should return false for invalid proof", async function () {
//     let a = [0, 0];
//     let b = [
//       [0, 0],
//       [0, 0],
//     ];
//     let c = [0, 0];
//     let d = [0];
//     expect(await verifier.verifyProof(a, b, c, d)).to.be.false; //falseになるよねの確認をしている
//   });
// });

// describe("Multiplier3 with Groth16", function () {
//   let Verifier;
//   let verifier;

//   beforeEach(async function () {
//     //[assignment] insert your script here
//     Verifier = await ethers.getContractFactory("Multiplier3Verifier");
//     verifier = await Verifier.deploy();
//     await verifier.deployed();
//   });

//   it("Should return true for correct proof", async function () {
//     //[assignment] insert your script here
//     const { proof, publicSignals } = await groth16.fullProve(
//       { a: "1", b: "2", c: "4" },
//       "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm",
//       "contracts/circuits/Multiplier3/circuit_final.zkey"
//     );
//     const editedPublicSignals = unstringifyBigInts(publicSignals);

//     const editedProof = unstringifyBigInts(proof);
//     const calldata = await groth16.exportSolidityCallData(
//       editedProof,
//       editedPublicSignals
//     );
//     const argv = calldata
//       .replace(/["[\]\s]/g, "")
//       .split(",")
//       .map((x) => BigInt(x).toString());
//     const a = [argv[0], argv[1]];
//     const b = [
//       [argv[2], argv[3]],
//       [argv[4], argv[5]],
//     ];
//     const c = [argv[6], argv[7]];
//     const Input = argv.slice(8);

//     expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
//   });
//   it("Should return false for invalid proof", async function () {
//     //[assignment] insert your script here
//     let a = [0, 0];
//     let b = [
//       [0, 0],
//       [0, 0],
//     ];
//     let c = [0, 0];
//     let d = [0];
//     expect(await verifier.verifyProof(a, b, c, d)).to.be.false; //falseになるよねの確認をしている
//   });
// });

describe("Multiplier3 with PLONK", function () {
  let Verifier;
  let verifier;

  beforeEach(async function () {
    //[assignment] insert your script here
    Verifier = await ethers.getContractFactory("Multiplier3Verifier_plonk");
    verifier = await Verifier.deploy();
    await verifier.deployed();
  });

  //[assignment] insert your script here
  it("Should return true for correct proof", async function () {
    const { proof, publicSignals } = await plonk.fullProve(
      { a: "1", b: "2", c: "4" },
      // "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm",
      // "contracts/circuits/HelloWorld/circuit_final.zkey",
      "contracts/circuits/Multiplier3_plonk/Multiplier3_js/Multiplier3.wasm",
      // ここのfinal.zkeyがない
      "contracts/circuits/Multiplier3_plonk/circuit_final.zkey"
    );
    const editedPublicSignals = unstringifyBigInts(publicSignals);

    const editedProof = unstringifyBigInts(proof);
    const calldata = await groth16.exportSolidityCallData(
      editedProof,
      editedPublicSignals
    );
    const argv = calldata
      .replace(/["[\]\s]/g, "")
      .split(",")
      .map((x) => BigInt(x).toString());
    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = argv.slice(8);

    expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
  });
  // it("Should return false for invalid proof", async function () {
  //   //[assignment] insert your script here
  //   let a = [0, 0];
  //   let b = [
  //     [0, 0],
  //     [0, 0],
  //   ];
  //   let c = [0, 0];
  //   let d = [0];
  //   expect(await verifier.verifyProof(a, b, c, d)).to.be.false; //falseになるよねの確認をしている
  // });
});
