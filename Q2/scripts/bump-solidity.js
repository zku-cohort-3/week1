// const fs = require("fs");
// const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/;

// const verifierRegex = /contract Verifier/;

// let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", {
//   encoding: "utf-8",
// });
// let bumped = content.replace(solidityRegex, "pragma solidity ^0.8.0");
// bumped = bumped.replace(verifierRegex, "contract HelloWorldVerifier");

// fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment
const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/;

const verifierRegex = /contract Verifier/;

let content1 = fs.readFileSync("./contracts/HelloWorldVerifier.sol", {
  encoding: "utf-8",
});
let content2 = fs.readFileSync("./contracts/Multiplier3Verifier.sol", {
  encoding: "utf-8",
});
let content3 = fs.readFileSync("./contracts/Multiplier3Verifier_plonk.sol", {
  encoding: "utf-8",
});

let bumped01 = content1.replace(solidityRegex, "pragma solidity ^0.8.0");
let bumped02 = content2.replace(solidityRegex, "pragma solidity ^0.8.0");
let bumped03 = content3.replace(solidityRegex, "pragma solidity ^0.8.0");

bumped1 = bumped01.replace(verifierRegex, "contract HelloWorldVerifier");
bumped2 = bumped02.replace(verifierRegex, "contract Multiplier3Verifier");
bumped3 = bumped03.replace(verifierRegex, "contract Multiplier3Verifier_plonk");

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped1);
fs.writeFileSync("./contracts/Multiplier3Verifier.sol", bumped2);
fs.writeFileSync("./contracts/Multiplier3Verifier_plonk.sol", bumped3);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment
