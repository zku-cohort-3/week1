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
        Verifier = await ethers.getContractFactory("contracts/HelloWorldVerifier.sol:HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing

        // Generate proof and public signals for witness a=1 and b=2
        const { proof, publicSignals } = await groth16.fullProve(
            {"a":"1","b":"2"}, 
            "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey"
        );

        // Log the public signal with the result of the multiplication
        console.log('1x2 =',publicSignals[0]);

        // Convert proof values from string to BigInt values
        const editedPublicSignals = unstringifyBigInts(publicSignals);

        // Convert and publicSignal value(s) from string to BigInt values
        const editedProof = unstringifyBigInts(proof);

        // Prepare publicSignal and proof values for smart contract call as string (enode using proper data types) to verify the proof
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        // Exract numeric inputs from the calldata string and convert them into one-dimensional array of BigInts
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        // Format proof and signal values as a,b,c structure (Proof values: a - 1D array, b - 2D array, c - 1D array, Public signal values: Input - 1D array)
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        // Expect the verifiers response to be true
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        // Prepare values of an invalid proof
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0];

        // Expect the verifiers response to be false
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("contracts/Multiplier3Verifier.sol:Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        // Generate proof and public signals for witness a=1, b=2, c=3
        const { proof, publicSignals } = await groth16.fullProve(
            {"a":"1","b":"2","c":"3"}, 
            "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey"
        );

        // Log the public signal with the result of the multiplication
        console.log('1x2x3 =',publicSignals[0]);

        // Convert proof values from string to BigInt values
        const editedPublicSignals = unstringifyBigInts(publicSignals);

        // Convert and publicSignal value(s) from string to BigInt values
        const editedProof = unstringifyBigInts(proof);

        // Prepare publicSignal and proof values for smart contract call as string (enode using proper data types) to verify the proof
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        // Exract numeric inputs from the calldata string and convert them into one-dimensional array of BigInts
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        // Format proof and signal values as a,b,c structure (Proof values: a - 1D array, b - 2D array, c - 1D array, Public signal values: Input - 1D array)
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        // Expect the verifiers response to be true
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        // Prepare values of an invalid proof
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0];

        // Expect the verifiers response to be false
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("contracts/Multiplier3Verifier_plonk.sol:Multiplier3PlonkVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        // Generate proof and public signals for witness a=1, b=2, c=3
        const { proof, publicSignals } = await plonk.fullProve(
            {"a":"1","b":"2","c":"3"}, 
            "contracts/circuits/Multiplier3_plonk/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3_plonk/circuit_final.zkey"
        );

        // Log the public signal with the result of the multiplication
        console.log('1x2x3 =',publicSignals[0]);

        // Convert proof values from string to BigInt values
        const editedPublicSignals = unstringifyBigInts(publicSignals);

        // Convert and publicSignal value(s) from string to BigInt values
        const editedProof = unstringifyBigInts(proof);

        // Prepare publicSignal and proof values for smart contract call as string (enode using proper data types) to verify the proof
        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals);

        // Exract numeric inputs from the calldata string and convert them into one-dimensional array of BigInts
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x));

        // Format proof and signal values as bytes and uint array
        const proofHex = argv[0].toString(16);

        // Transform proof value to bytes, odd hex values need to be padded with extra 0 from the left
        const proofBytes = ethers.utils.solidityPack(['bytes'], [`0x${proofHex.length % 2 == 0 ? proofHex : `0${proofHex}`}`]);

        const Input = [argv[1].toString()];

        expect(await verifier.verifyProof(proofBytes, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        // Prepare value of an invalid proof
        let falseProofBigInt = 42;

        // Transform proof value to bytes
        let falseProofBytes = ethers.utils.solidityPack(['bytes'], [`0x${falseProofBigInt}`]);
        let publicSignal = [0];

        // Expect the verifiers response to be false
        expect(await verifier.verifyProof(falseProofBytes, publicSignal)).to.be.false;
    });
});