const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

let multiplierContent = fs.readFileSync("./contracts/Multiplier3Verifier.sol", {encoding: 'utf-8'})

let task = multiplierContent.replace(solidityRegex, 'pragma solidity ^0.8.0');
task = task.replace(verifierRegex, 'contract Multiplier3Verifier')

fs.writeFileSync("./contracts/Multiplier3Verifier.sol", task);


// The plonk contract

let plonkMultiplierContent = fs.readFileSync("./contracts/_plonkMultiplier3Verifier.sol", {encoding: 'utf-8'})

let tasks = plonkMultiplierContent.replace(solidityRegex, 'pragma solidity ^0.8.0');
tasks = tasks.replace(verifierRegex, 'contract PlonkMultiplier3Verifier')

fs.writeFileSync("./contracts/_plonkMultiplier3Verifier.sol", tasks);