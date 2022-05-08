#!/bin/bash

NAME='Multiplier3'

cd contracts/circuits

echo "Compiling ${NAME}.circom..."

# compile circuit
mkdir ${NAME}
circom ${NAME}.circom --r1cs --wasm --sym -o ${NAME}
snarkjs r1cs info ${NAME}/${NAME}.r1cs

# setup
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
snarkjs powersoftau verify pot12_0001.ptau
snarkjs powersoftau beacon pot12_0001.ptau pot12_beacon.ptau 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"
snarkjs powersoftau prepare phase2 pot12_beacon.ptau pot12_final.ptau 
snarkjs powersoftau verify pot12_final.ptau

snarkjs plonk setup ${NAME}/${NAME}.r1cs pot12_final.ptau ${NAME}/circuit_final_plonk.zkey
snarkjs zkey export verificationkey ${NAME}/circuit_final_plonk.zkey verification_key.json
snarkjs zkey export solidityverifier ${NAME}/circuit_final_plonk.zkey ../Multiplier3VerifierPLONK.sol

cd ../..