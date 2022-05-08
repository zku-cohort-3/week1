const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/;

const verifierRegex = /contract Verifier/;

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

// Modification of the solidity version for the Multiplier3 contract (Generated using Groth16 algorithm)
let multiplier3Groth16Content = fs.readFileSync("./contracts/Multiplier3Verifier.sol", { encoding: 'utf-8' });
let multiplier3Groth16Bumped = multiplier3Groth16Content.replace(solidityRegex, 'pragma solidity ^0.8.0');
multiplier3Groth16Bumped = multiplier3Groth16Bumped.replace(verifierRegex, 'contract Multiplier3Verifier');

fs.writeFileSync("./contracts/Multiplier3Verifier.sol", multiplier3Groth16Bumped);

// Modification of the solidity version for the Multiplier3 contract (Generated using PLONK algorithm)
const plonkVerifierRegex = /contract PlonkVerifier/;
let multiplier3PlonkContent = fs.readFileSync("./contracts/Multiplier3Verifier_plonk.sol", { encoding: 'utf-8' });
let multiplier3PlonkBumped = multiplier3PlonkContent.replace(solidityRegex, 'pragma solidity ^0.8.0');
multiplier3PlonkBumped = multiplier3PlonkBumped.replace(plonkVerifierRegex, 'contract Multiplier3PlonkVerifier');

fs.writeFileSync("./contracts/Multiplier3Verifier_plonk.sol", multiplier3PlonkBumped);