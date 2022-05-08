#!/bin/bash

# [assignment] create your own bash script to compile Multipler3.circom using PLONK below


cd contracts/circuits # enter this directory

mkdir Multiplier3_plonk # create a folder

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then # check powersoftau
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

# compile circuit
circom Multiplier3.circom --r1cs --wasm --sym --c -o Multiplier3_plonk
snarkjs r1cs info Multiplier3_plonk/Multiplier3.r1cs

# Start a new zkey and make a contribution
snarkjs plonk setup Multiplier3_plonk/Multiplier3.r1cs powersOfTau28_hez_final_10.ptau Multiplier3_plonk/circuit_0000.zkey

snarkjs zkey export verificationkey Multiplier3_plonk/circuit_0000.zkey Multiplier3_plonk/verification_key.json

# generate solidity contract
snarkjs zkey export solidityverifier Multiplier3_plonk/circuit_0000.zkey ../Multiplier3PlonkVerifier.sol

cd ../..