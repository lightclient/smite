pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/access/SignatureBouncer.sol";

contract BouncerProxy is SignatureBouncer {
  constructor() public { }

  mapping(address => uint) public nonce;

  event Received (address indexed sender, uint value);
  event Forwarded (bytes signature, address sender, address to, uint value, bytes data);

  // copied from
  // https://github.com/uport-project/uport-identity/blob/develop/contracts/Proxy.sol
  function () payable { emit Received(msg.sender, msg.value); }

  function forward(bytes _signature, address _sender, address _to, uint _value, bytes _data) public {
      bytes32 hash_output = keccak256(
        abi.encodePacked(
          address(this),
          _sender,
          _to,
          _value,
          _data,
          nonce[_sender]++
        )
      );

      // require(isValidDataHash(hash_output, _signature));
      require(executeCall(_to, _value, _data));

      emit Forwarded(_signature, _sender, _to, _value, _data);
  }

  // copied from GnosisSafe
  // https://github.com/gnosis/gnosis-safe-contracts/blob/master/contracts/GnosisSafe.sol
  function executeCall(address to, uint256 value, bytes data) internal returns (bool success) {
    assembly {
       success := call(gas, to, value, add(data, 0x20), mload(data), 0, 0)
    }
  }
}

contract StandardToken {
  function transfer(address _to,uint256 _value) public returns (bool) { }
}
