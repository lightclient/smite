pragma solidity ^0.4.24;

contract Counter {
  event Received (address indexed sender, uint value);
  uint public count = 0;

  constructor() public { }

  function () payable {
    emit Received(msg.sender, msg.value);
  }

  function increment(uint256 amount) public {
    count = count + amount;
  }
}