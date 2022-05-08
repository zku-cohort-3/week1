pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template RangeProof(n) {
    assert(n <= 252);
    signal input in; // this is the number to be proved inside the range
    signal input range[2]; // the two elements should be the range, i.e. [lower bound, upper bound]
    signal output out;

    component low = LessEqThan(n);
    component high = GreaterEqThan(n);

    // [assignment] insert your code here

    signal out1; //intermediate signal for low out
    signal out2; // intermediate signal for high out

    low.in[0] <== in;
    low.in[1] <== range[1]; //upperbond
    out1 <== low.out; // if input in lesseqtan input range[1] should return 1, otherwise 0

    high.in[0] <== in;
    high.in[1] <== range[0]; //lowerbond
    out2 <== high.out; // if input in greatereqtan input range[0] should return 1, otherwise 0


    out <== out1 * out2; // if input in range should return 1, otherwise 0. Only If out1 and out2 are equals to 1  in same time
                        // out returns 1, otherwise it returns 0; 
}

