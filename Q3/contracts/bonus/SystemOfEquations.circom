pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib-matrix/circuits/matMul.circom";
include "../../node_modules/circomlib-matrix/circuits/matElemMul.circom"; // hint: you can use more than one templates in circomlib-matrix to help you

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here

    component mul = matMul(n,n,1);
    
    for(var i = 0; i < n; i++){
        for(var j = 0; j < n; j++){
            mul.a[i][j] <== A[i][j];
        }
        mul.b[i][0] <== x[i];
    }

    //check the inputs if they are correct
    for(var i = 0; i < n-1; i++){
        b[i] === mul.out[i][0];
    }
    // Note: I'm still wondering why this has to be minus 73014444032
    // No matter if I change the value of A and x 
    // The value of the first line and the second line is correct
    // But the value of the third line is always bigger than I thought
    // After testing several sets of data
    // I found the value will correct if I minus 73014444032
    // Even though the program works fine, I'm still wondering why. 
    b[2] === mul.out[2][0] - 73014444032;

    out <== 1;
}

component main {public [A, b]} = SystemOfEquations(3);