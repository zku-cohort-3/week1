pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

template Multiplier3 () {  

   // Declaration of signals.  
   signal input a;  
   signal input b;
   signal input c;
   signal d_1;
   signal output d;

   // Constraints.  
   d_1 <== a * b;
   d <== d_1 * c;
}

component main = Multiplier3();