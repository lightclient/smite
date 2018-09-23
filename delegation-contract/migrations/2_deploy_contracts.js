var BouncerProxy = artifacts.require("../contracts/BouncerProxy.sol");

module.exports = function(deployer) {
  deployer.deploy(BouncerProxy);
};