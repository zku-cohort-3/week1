pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib-matrix/circuits/matMul.circom"; // hint: you can use more than one templates in circomlib-matrix to help you
include "../../node_modules/circomlib-matrix/circuits/matSub.circom";
include "../../node_modules/circomlib-matrix/circuits/matElemSum.circom";
include "../../node_modules/circomlib-matrix/circuits/transpose.circom";

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here
    component mul = matMul(n, n, 1);

    // Calculate A * x = b'
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            mul.a[i][j] <== A[i][j];
        }
        mul.b[i][0] <== x[i];
    }

    component comparators[n];
    var results[1][n];
    
    // Generate array of comparison results b[i] == b'[i]
    for (var i = 0; i < n; i++) {
        comparators[i] = IsEqual();

        comparators[i].in[0] <== b[i];
        comparators[i].in[1] <== mul.out[i][0];
        results[0][i] = comparators[i].out;
    }

    component matSum = matElemSum(1,n);

    // Sum the results of all comparisons
    for (var i = 0; i < n; i++) {
        matSum.a[0][i] <== results[0][i];
    }

    // Expect that all comparisons resulted in value 1
    // so the sum of the results matrix would be 1 * n = n
    component isResOk = IsEqual();
    isResOk.in[0] <== matSum.out;
    isResOk.in[1] <== n;
    
    out <== isResOk.out;
}

component main {public [A, b]} = SystemOfEquations(3);