#!/bin/bash

NAME='Multiplier3'

cd contracts/circuits

mkdir ${NAME}

# we can use the same inputs for phase 1 as it's circuit-independent
if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling ${NAME}.circom..."

# compile circuit
circom ${NAME}.circom --r1cs --wasm --sym -o ${NAME}
snarkjs r1cs info ${NAME}/${NAME}.r1cs

# Start a new zkey and make a contribution
snarkjs groth16 setup ${NAME}/${NAME}.r1cs powersOfTau28_hez_final_10.ptau ${NAME}/circuit_0000.zkey
snarkjs zkey contribute ${NAME}/circuit_0000.zkey ${NAME}/circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
snarkjs zkey export verificationkey ${NAME}/circuit_final.zkey ${NAME}/verification_key.json

# generate solidity contract
snarkjs zkey export solidityverifier ${NAME}/circuit_final.zkey ../${NAME}Verifier.sol

cd ../..