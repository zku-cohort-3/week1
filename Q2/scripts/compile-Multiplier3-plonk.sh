#!/bin/bash

cd contracts/circuits

mkdir Multiplier3_plonk

echo "Compiling Multiplier3_plonk.circom..."

# compile circuit

circom Multiplier3.circom --r1cs --wasm --sym -o Multiplier3_plonk
snarkjs r1cs info Multiplier3/Multiplier3.r1cs

# Start a new zkey and make a contribution

snarkjs plonk setup Multiplier3_plonk/Multiplier3.r1cs

# generate solidity contract
snarkjs export solidityverifier ../Multiplier3Verifier.sol

cd ../..
