pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

template Multiplier3 () {  

   // Declaration of signals.  
   signal input a;  
   signal input b;
   signal input c;
   signal output d; 
   signal e; //temp intermediate signal

   // Constraints.  
   e <== a * b;
   d <== c * e; //we're basically splitting the operations in two parts
}

component main = Multiplier3();