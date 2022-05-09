const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
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

        // This is an asychronous call to groth16 that returns an object from which proof and publicSignals were destructured from.
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");

        console.log('1x2 =',publicSignals[0]);

        // The array of publicSignals is edited.
        const editedPublicSignals = unstringifyBigInts(publicSignals);

        // The proof object is edited.
        const editedProof = unstringifyBigInts(proof);

        // The array of hex, calldata, is derived from groth16 function.
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
      
        // This calldata is afterwards split to become used to verify the roof. Regex is used to help split and map the argv into different forms.
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        // The argv is split to different signals to help verify the proof.
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];

        // The last uint passed to the verifyProof function.
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        // Passing zeros to get invalid proof.
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
    let MultiVerifier;
    let verifier;

    beforeEach(async function () {
        //[assignment] insert your script here
        MultiVerifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await MultiVerifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here

          // This is an asychronous call to groth16 that returns an object from which proof and publicSignals were destructured from.
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2", "c": "3"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");

        // Confrims our log
        console.log('1x2x3 =',publicSignals[0]);
        
        // The array of publicSignals is edited.
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        // This calldata is afterwards split to become used to verify the roof. Regex is used to help split and map the argv into different forms.
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        // Values are assigned and tested.
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        // Passing zeros to get invalid proof.
        let a = [0, 0]
        let b = [[0,0], [0, 0]]
        let c = [0, 0]
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false
    });
});


describe("Multiplier3 with PLONK", function () {
    let plonkMultiVerifier;
    let verifier

    beforeEach(async function () {
        //[assignment] insert your script here

        // Get and deploy contract
        plonkMultiVerifier = await ethers.getContractFactory("PlonkMultiplier3Verifier");
        verifier = await plonkMultiVerifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here

        // This is an asychronous call to plonk that returns an object from which proof and publicSignals were destructured from.
        const {proof, publicSignals} = await plonk.fullProve({"a":"1","b":"2", "c": "3"}, "contracts/circuits/_Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/_Multiplier3/circuit_0000.zkey")

        // Confrims our log
        console.log('1x2x3 =',publicSignals[0]);

        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);

        // returns long hex number.
        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals)
        
        // Calldata is split into two
        const argv = calldata.split(",")
        const x = argv[0]
        const y = JSON.parse(argv[1]).map(s => BigInt(s).toString())

        expect(await verifier.verifyProof(x, y)).to.be.true;        
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here

         // Passing zeros to get invalid proof.
         let x = "0x000000000000000000000000";
         let y = ["0"]
         expect(await verifier.verifyProof(x, y)).to.be.false;
    });
});