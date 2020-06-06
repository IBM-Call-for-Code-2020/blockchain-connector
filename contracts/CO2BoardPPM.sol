pragma solidity 0.6.9;

contract CO2BoardPPM {
  uint measured;
  function addMeasured(uint _measured) public {
    measured += _measured;
  }
  function getMeasured() public view returns (uint) {
    return measured;
  }
}