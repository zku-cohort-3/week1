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

    //"in" should be less than or equal to "upperBound"
    low.in[0] <== in;
    low.in[1] <== range[1];

    //"in" should be greater than or equal to "lowerBound"
    high.in[0] <== in;
    high.in[1] <== range[0];

    //Now the output would be:
    //{false} = 0: when any one of the output from low and high is 0
    //{true} = 1: when both of the output from low and high are 1
    out <== low.out * high.out;
}