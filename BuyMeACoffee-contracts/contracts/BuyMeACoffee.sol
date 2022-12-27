// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
 
 // Deployed to Goerli: 0x595312aDe6ec430956BF5253a362792b85257fc0
contract BuyMeACoffee {
   // Event to commit when memo is created
   event NewMemo(
       address indexed from,
       uint256 timestamp,
       string name,
       string message
   );
 
   //Memo struct
   struct Memo{
       address from;
       uint256 timestamp;
       string name;
       string message;
   }
 
   // List of all memos
   Memo[] memos;
 
   // address of deployer
   address payable owner;
 
   // Deploy logic
   constructor() {
       owner = payable(msg.sender);
   }
 
   // Buy coffee
   // name of coffee buyer
   // message from coffee buyer
   function buyCoffee(string memory _name, string memory _message) public payable {
       require(msg.value > 0, "Cant buy coffee with 0 ETH");
 
       // Adds memo to storage
       memos.push(Memo(
           msg.sender,
           block.timestamp,
           _name,
           _message
       ));
 
       // Emit log event when memo is complete
       emit NewMemo(
           msg.sender,
           block.timestamp,
           _name,
           _message
       );
   }
 
   // Send entire balance to owner
   function withdrawTips() public {
       require(owner.send(address(this).balance));
   }
 
   // Retrieve all memos stored on blockchain
   function getMemos() public view returns(Memo[] memory) {
       return memos;
   }
}
