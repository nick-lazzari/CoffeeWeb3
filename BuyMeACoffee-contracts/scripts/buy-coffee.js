// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
 
// Returns balance of a given address
// "getBalance" built in - returns value of address
// utils takes in big integers and makes it easier to read
 
async function getBalance(address) {
 const balanceBigInt = await hre.waffle.provider.getBalance(address);
 return hre.ethers.utils.formatEther(balanceBigInt);
}
 
// Logs ether balances for list of addresses
async function printBalances(addresses) {
 let idx = 0;
 for (const address of addresses) {
   console.log(`Address ${idx} balance: `, await getBalance(address));
   idx++
 }
}
 
// Logs the memos stored on-chain from coffee purchaes
async function printMemos(memos) {
 for (const memo of memos) {
  const timestamp = memo.timestamp;
  const tipper = memo.name;
  const tipperAddress = memo.from;
  const message = memo.message;
  console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
 }
}
 
async function main() {
 // Get example accounts.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
 
 // Get contract to deploy & deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("buyMeACoffee deployed to ", buyMeACoffee.address);
 
 // Check balances before coffee is purchased
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("== start ==");
  await printBalances(addresses);
  
 // Buy owner coffee
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper).buyCoffee("Nick", "Hello", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Max", "Hey", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Martin", "Hi", tip);

 // Check balances after purchase
  console.log("== Bought Coffee ==");
  await printBalances(addresses);

 // Withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();
 
 // Check balance after withdraw
  console.log("== After Withdraw ==");
  await printBalances(addresses);
 
 // Read all memos left for the owner
 console.log("== Memos ==");
 const memos = await buyMeACoffee.getMemos();
 printMemos(memos);
}

 
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
 console.error(error);
 process.exitCode = 1;
});
