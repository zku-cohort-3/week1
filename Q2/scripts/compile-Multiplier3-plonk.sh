#!/bin/bash
# [assignment] create your own bash script to compile Multipler3.circom modeling after compile-Multiplier3.sh below
cd contracts/circuits

mkdir Multiplier3_plonk

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi
echo "-------------------------------"
echo "Compiling Multiplier3_plonk.circom..."
echo "-------------------------------"

# compile circuit

circom Multiplier3.circom --r1cs --wasm --sym -o Multiplier3
snarkjs r1cs info Multiplier3_plonk/Multiplier3.r1cs


# Start a new zkey and make a contribution

snarkjs plonk setup Multiplier3_plonk/Multiplier3.r1cs powersOfTau28_hez_final_10.ptau Multiplier3_plonk/circuit_final.zkey
###---  Error -------
snarkjs zkey verify Multiplier3_plonk/Multiplier3.r1cs powersOfTau28_hez_final_10.ptau Multiplier3_plonk/circuit_final.zkey
###-------------------
snarkjs zkey export verificationkey Multiplier3/circuit_final.zkey Multiplier3/verification_key.json


# generate solidity contract
snarkjs zkey export solidityverifier Multiplier3/circuit_final.zkey ../Multiplier3Verifier_plonk.sol

cd ../..
