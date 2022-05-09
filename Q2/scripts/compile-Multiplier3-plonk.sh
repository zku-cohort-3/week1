#!/bin/bash

# [assignment] create your own bash script to compile Multipler3.circom using PLONK below

cd contracts/circuits

mkdir Multiplier3Plonk

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling Multiplier3Plonk.circom..."

# compile circuit

circom  Multiplier3.circom --r1cs --wasm --sym -o Multiplier3Plonk

# View information about the circuit
snarkjs r1cs info Multiplier3Plonk/Multiplier3.r1cs 

# Start a new zkey and make a contribution

snarkjs plonk setup Multiplier3Plonk/Multiplier3.r1cs powersOfTau28_hez_final_10.ptau Multiplier3Plonk/circuit_final.zkey

snarkjs zkey export verificationkey Multiplier3Plonk/circuit_final.zkey Multiplier3Plonk/verification_key.json
snarkjs zkey export solidityverifier Multiplier3Plonk/circuit_final.zkey ..//Multiplier3VerifierPlonk.sol
cd ../..
