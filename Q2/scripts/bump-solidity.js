const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

// Fetching contents of the Multiplier3Verifier.sol file
let content_groth16 = fs.readFileSync("./contracts/Multiplier3Verifier.sol", { encoding: 'utf-8' });

// Replacing all expressions which matches the solidityRegex regular expression by 'pragma solidity ^0.8.0'
let bumped_groth16 = content_groth16.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped_groth16 = bumped_groth16.replace(verifierRegex, 'contract Verifier');

// Writing back the updated smart contract to the .sol file
fs.writeFileSync("./contracts/Multiplier3Verifier.sol", bumped_groth16);

// Same steps for _plonk contract
let content_plonk = fs.readFileSync("./contracts/_plonkMultiplier3Verifier.sol", { encoding: 'utf-8' });
bumped_plonk = content_plonk.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped_plonk = bumped_plonk.replace(verifierRegex, 'contract PlonkVerifier');

fs.writeFileSync("./contracts/_plonkMultiplier3Verifier.sol", bumped_plonk);