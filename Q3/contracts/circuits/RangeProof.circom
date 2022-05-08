pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template RangeProof(n) {
    assert(n <= 252);
    signal input in; // this is the number to be proved inside the range
    signal input range[2]; // the two elements should be the range, i.e. [lower bound, upper bound]
    signal output out;

    component low = LessEqThan(n);
    component high = GreaterEqThan(n);

    // check less than
    low.in[0] <== in;
    low.in[1] <== range[0];
    signal lt <== low.out;

    // check greater than
    high.in[0] <== in;
    high.in[1] <== range[1];
    signal gt <== high.out;

    // if either lower or higher, return 0 (false)
    // otherwise return 1 (true)
    signal notOk <-- lt * gt;
    signal ok <-- notOk == 1? 0 : 1;
    out <== ok;
}
