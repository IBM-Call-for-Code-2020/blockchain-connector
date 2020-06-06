const Migrations = artifacts.require("Migrations");
const CO2BoardPPM = artifacts.require("./CO2BoardPPM.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(CO2BoardPPM);
};
