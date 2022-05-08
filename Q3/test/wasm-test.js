const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("System of equations test", function () {
    this.timeout(100000000);

    it("Bonus question", async () => {
        const circuit = await wasm_tester("contracts/bonus/SystemOfEquations.circom");
        await circuit.loadConstraints();

        const INPUT = {
            "x": ["15","17","19"],
            "A": [["1","1","1"],["1","2","3"],["2",Fr.e(-1),"1"]],
            "b": ["51", "106", "32"]
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        console.log(witness);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(1)));
    });
});