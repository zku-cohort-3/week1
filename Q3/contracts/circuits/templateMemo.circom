
// less than template

// Checking Input is 0 or not
template IsZero() {
    signal input in;
    signal output out;

    signal inv;

    inv <-- in!=0 ? 1/in : 0;

    out <== -in*inv +1; 
    // If input is 0 -> 1 : IsZero(0) => true    return value ==> 1
    // If input is 4 -> 0 : IsZero(4) => false   return value ==> 0

    in*out === 0;
}


// Checking Two Inputs is equal or not
template IsEqual() {
    signal input in[2];
    signal output out;

    component isz = IsZero();

    in[1] - in[0] ==> isz.in;

    // If input is [3,3] : IsZero(0) => true    return value ==> 1
    // If input is [2,3] : IsZero(1) => false   return value ==> 0
    isz.out ==> out;
}


template ForceEqualIfEnabled() {
    signal input enabled;
    signal input in[2];

    component isz = IsZero();

    in[1] - in[0] ==> isz.in;

    (1 - isz.out)*enabled === 0;
    // If input is [3,3], enabled is "0 or 1" => 0になる
    // If input is [2,3], enabled is "0" => 0になる 
    //                    enabled is "1" => 1になる 
}

/*
// N is the number of bits the input  have.
// The MSF is the sign bit.
template LessThan(n) {
    signal input in[2];
    signal output out;

    component num2Bits0;
    component num2Bits1;

    component adder;

    adder = BinSum(n, 2);

    num2Bits0 = Num2Bits(n);
    num2Bits1 = Num2BitsNeg(n);

    in[0] ==> num2Bits0.in;
    in[1] ==> num2Bits1.in;

    var i;
    for (i=0;i<n;i++) {
        num2Bits0.out[i] ==> adder.in[0][i];
        num2Bits1.out[i] ==> adder.in[1][i];
    }

    adder.out[n-1] ==> out;
}
*/

// ----------------------------
// HOW TO USE 
// ----------------------------

template LessThan10() {
    signal input in;
    signal output out;

    component lt = LessThan(32); //32bits

    lt.in[0] <== in;
    lt.in[1] <== 10;

    out <== lt.out;
}

// in[0]がin[1]未満のやつかをcheckするよ
// nはbitsを表しているよ 2^32 = 4294967296 => 4.3 * 10^10
template LessThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;

    component n2b = Num2Bits(n+1);

    n2b.in <== in[0]+ (1<<n) - in[1];

    out <== 1-n2b.out[n];
}



// N is the number of bits the input  have.
// The MSF is the sign bit.

// in[0]がin[1]以下のやつかをcheckするよ
// nはbitsを表しているよ 2^32 = 4294967296 => 4.3 * 10^10
template LessEqThan(n) {
    signal input in[2];
    signal output out;

    component lt = LessThan(n);

    lt.in[0] <== in[0];
    lt.in[1] <== in[1]+1;
    lt.out ==> out;
}

// N is the number of bits the input  have.
// The MSF is the sign bit.
// それより大きいか
template GreaterThan(n) {
    signal input in[2];
    signal output out;

    component lt = LessThan(n);

    lt.in[0] <== in[1];
    lt.in[1] <== in[0];
    lt.out ==> out;
}

// N is the number of bits the input  have.
// The MSF is the sign bit.
// それ以上か
template GreaterEqThan(n) {
    signal input in[2];
    signal output out;

    component lt = LessThan(n);

    lt.in[0] <== in[1];
    lt.in[1] <== in[0]+1;
    lt.out ==> out;
}
