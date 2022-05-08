pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

template Multiplier3 () {

   // Declaration of signals.
   signal input a;
   signal input b;
   var x = a*a;
   x += c;
   b <== x;

   // Constraints.
   b === a*a + c;
}

component main = Multiplier3();
