#!/bin/bash

cd contracts/circuits

mkdir Multipler3

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_12.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_12.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
fi

echo "Compiling Multipler3.circom..."

# compile circuit

circom Multipler3.circom --r1cs --wasm --sym -o Multipler3

if [[ $* == *--nodejs* ]]
then
    echo "Generating nodejs version of Multipler3.sol..."
    cd Multipler3/circuit_js

# # Start a new zkey and make a contribution
node generate_witness.js multiplier2.wasm input.json witness.wtns

snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
snarkjs groth16 setup multiplier2.r1cs pot12_final.ptau multiplier2_0000.zkey
snarkjs zkey contribute multiplier2_0000.zkey multiplier2_0001.zkey --name="1st Contributor Name" -v
snarkjs zkey export verificationkey multiplier2_0001.zkey verification_key.json
snarkjs groth16 prove multiplier2_0001.zkey witness.wtns proof.json public.json
snarkjs groth16 verify verification_key.json public.json proof.json


snarkjs groth16 setup Multipler3/Multipler3.r1cs powersOfTau28_hez_final_10.ptau Multipler3/circuit_0000.zkey
snarkjs zkey contribute Multipler3/multiplier3_0000.zkey Multipler3/multiplier3_final.zkey --name="1st Contributor Name" -v -e="random text"
snarkjs zkey export verificationkey Multipler3/multiplier3_final.zkey Multipler3/verification_key.json

# # generate solidity contract
snarkjs zkey export solidityverifier Multipler3/multiplier3_final.zkey ../Multipler3Verifier.sol

cd ../..
