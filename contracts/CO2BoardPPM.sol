pragma solidity 0.6.9;

contract CO2BoardPPM {
  mapping (string => uint) usage;
  function addUsage(string memory _vehicleId, uint _usage) public {
    usage[_vehicleId] += _usage;
  }
  function getUsage(string memory _vehicleId) public view returns (uint) {
    return usage[_vehicleId];
  }
}