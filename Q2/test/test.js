const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

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

describe("HelloWorld", function () {
  let Verifier;
  let verifier;

  beforeEach(async function () {
    Verifier = await ethers.getContractFactory("HelloWorldVerifier");
    verifier = await Verifier.deploy();
    await verifier.deployed();
  });

  it("Should return true for correct proof", async function () {
    //[assignment] Add comments to explain what each line is doing
    // Generate the Proof of computation in variable proof and public values in variable public signals
    const { proof, publicSignals } = await groth16.fullProve(
      { a: "1", b: "2" },
      "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm",
      "contracts/circuits/HelloWorld/circuit_final.zkey"
    );

    console.log("1x2 =", publicSignals[0]);

    const editedPublicSignals = unstringifyBigInts(publicSignals);
    const editedProof = unstringifyBigInts(proof);

    //Generate soliditycalldata it is like snarkks zkey export soliditycalldata public.json proof.json command.
    const calldata = await groth16.exportSolidityCallData(
      editedProof,
      editedPublicSignals
    );

    //modifying calldata for verifyproof function arguments
    const argv = calldata
      .replace(/["[\]\s]/g, "")
      .split(",")
      .map((x) => BigInt(x).toString());
    // console.log(calldata);

    //arguments
    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = argv.slice(8);

    expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
  });
  it("Should return false for invalid proof", async function () {
    let a = [0, 0];
    let b = [
      [0, 0],
      [0, 0],
    ];
    let c = [0, 0];
    let d = [0];
    expect(await verifier.verifyProof(a, b, c, d)).to.be.false; // call function
  });
});

describe("Multiplier3 with Groth16", function () {
  beforeEach(async function () {
    Verifier = await ethers.getContractFactory("Multiplier3Verifier");
    verifier = await Verifier.deploy();
    await verifier.deployed();
  });

  it("Should return true for correct proof", async function () {
    //[assignment] Add comments to explain what each line is doing
    // Generate the Proof of computation in variable proof and public values in variable public signals
    const { proof, publicSignals } = await groth16.fullProve(
      { in1: "2", in2: "3", in3: "4" },
      "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm",
      "contracts/circuits/Multiplier3/circuit_final.zkey"
    );

    console.log("2x3x4 =", publicSignals[0]);

    const editedPublicSignals = unstringifyBigInts(publicSignals);
    const editedProof = unstringifyBigInts(proof);

    //Generate soliditycalldata it is like snarkks zkey export soliditycalldata public.json proof.json command.
    const calldata = await groth16.exportSolidityCallData(
      editedProof,
      editedPublicSignals
    );

    //modifying calldata for verifyproof function arguments
    const argv = calldata
      .replace(/["[\]\s]/g, "")
      .split(",")
      .map((x) => BigInt(x).toString());
    // console.log(argv);

    //arguments
    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = argv.slice(8);

    expect(await verifier.verifyProof(a, b, c, Input)).to.be.true; // call function
  });
  it("Should return false for invalid proof", async function () {
    let a = [0, 0];
    let b = [
      [0, 0],
      [0, 0],
    ];
    let c = [0, 0];
    let d = [0];
    expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
  });
});

describe("Multiplier3 with PLONK", function () {
  beforeEach(async function () {
    Verifier = await ethers.getContractFactory("PlonkVerifier");
    verifier = await Verifier.deploy();
    await verifier.deployed();
  });

  it("Should return true for correct proof", async function () {
    //[assignment] Add comments to explain what each line is doing
    // Generate the Proof of computation in variable proof and public values in variable public signals
    const { proof, publicSignals } = await plonk.fullProve(
      //require plonk from snarkjs.
      { in1: "2", in2: "3", in3: "4" }, //input.json
      "contracts/circuits/Multiplier3_plonk/Multiplier3_js/Multiplier3.wasm",
      "contracts/circuits/Multiplier3_plonk/circuit_0000.zkey"
    );

    console.log("2x3x4 =", publicSignals[0]);

    const editedPublicSignals = unstringifyBigInts(publicSignals);
    const editedProof = unstringifyBigInts(proof);

    //Generate soliditycalldata it is like snarkks zkey export soliditycalldata public.json proof.json command.
    const calldata = await plonk.exportSolidityCallData(
      editedProof,
      editedPublicSignals
    );
    // console.log(calldata);
    //modifying calldata for verifyproof function arguments
    const argv = calldata.replace(/["[\]\s]/g, "").split(",");
    // .map((x) => BigInt(x).toString());

    // console.log(argv);
    //arguments
    const proofs = argv[0];
    const publics = [argv[1]];

    expect(await verifier.verifyProof(proofs, publics)).to.be.true; // call the function
  });
  it("Should return false for invalid proof", async function () {
    let a = "0x00";
    let b = ["0"];

    expect(await verifier.verifyProof(a, b)).to.be.false;
  });
});
