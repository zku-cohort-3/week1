#!/bin/bash

# [assignment] create your own bash script to compile Multipler3.circom using PLONK below#!/bin/bash

cd contracts/circuits

mkdir Multipler3

echo "Compiling Multipler3.circom..."

# compile circuit

circom Multipler3.circom --r1cs --wasm --sym --c -o Multipler3

if [[ $* == *--nodejs* ]]
then
    echo "Generating nodejs version of Multipler3.sol..."
    cd Multipler3/multipler3_js
    node generate_witness.js multipler3.wasm input.json witness.wtns

else
    echo "Using cpp version of Multipler3.sol..."
    cd Multipler3/multiplier3_cpp
    make

    Multipler3/multipler3 input.json witness.wtns
fi

cp Multipler3/witness.wtns ../../../witness.wtns
cd ../..

# Generate zkey files
snarkjs plonk setup Multiplier3/multiplier3.r1cs Multiplier3/multiplier3_0000.zkey
snarkjs zkey contribute Multiplier3/multiplier3_0000.zkey Multiplier3/multiplier3_0001.zkey --name="1st Contributor Name" -v

# Export verification key to json file
snarkjs zkey export verificationkey Multiplier3/multiplier3_0001.zkey Multiplier3/verification_key.json

# genarate zero knowledge proof using zkey and witness
snarkjs plonk prove Multiplier3/multiplier2_0001.zkey Multiplier3/witness.wtns Multiplier3/proof.json Multiplier3/public.json

# use the verification key proof and public file to verify if proof is valid
snarkjs plonk verify Multiplier3/verification_key.jsonMultiplier3/public.json Multiplier3/proof.json
