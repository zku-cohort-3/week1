pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

template Multiplier3 () {
   signal input a;
   signal output b;
   var x = a*a;
   x += 3;
   b <== x;

   b === a * a + 3;
}

component main = Multiplier3();
