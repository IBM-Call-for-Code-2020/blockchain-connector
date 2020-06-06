const fs = require('fs');
const CO2BoardPPM = artifacts.require("./CO2BoardPPM.sol");

module.exports = function(deployer) {
  deployer.deploy(CO2BoardPPM, {overwrite: false}).then(() => {
    fs.writeFile(
      'metadata/CO2BoardPPM',
      JSON.stringify(CO2BoardPPM._json, 2), 
      (err) => {
        if (err) throw err 
        console.log();
        console.log(`-----------------------`);
        console.log(`The metadata of ${CO2BoardPPM._json.contractName} is recorded on metadata/CO2BoardPPM file.`);
      }
    );
    fs.writeFile(
      'metadata/addressOfCO2BoardPPM',
      CO2BoardPPM.address,
      (err) => {
        if (err) throw err 
        console.log(`The deployed address of ${CO2BoardPPM._json.contractName} is recorded on metadata/addressOfCO2BoardPPM file.`);
        console.log(`-----------------------`);
      }
    )
  })
};