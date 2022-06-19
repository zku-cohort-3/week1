pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template RangeProof(n) {
    assert(n <= 252);
    signal input in; // this is the number to be proved inside the range 
    signal input range[2]; // the two elements should be the range, i.e. [lower bound, upper bound]
    // ex: [0],[9]
    signal output out;

    component low = LessEqThan(n);
    component high = GreaterEqThan(n);

    // [assignment] insert your code here
    // create a template (not circuit, so don’t add component main = ...) 
    // that uses GreaterEqThan and LessEqThan to perform a range proof.

    low.in[0] <== in;
    low.in[1] <== range[0];

    high.in[0] <== in;
    high.in[1] <== range[1];

    out <== low.out * high.out;
}

template LessThan10() {
    signal input in;
    signal output out;

    component lt = LessThan(32); //32bits

    lt.in[0] <== in;
    lt.in[1] <== 10;

    out <== lt.out; 
}

template LessThanEq10() {
    signal input in;
    signal output out;

    component lt = LessEqThan(32); //32bits

    lt.in[0] <== in;
    lt.in[1] <== 10;

    out <== lt.out;
}

