const hre = require("hardhat");

async function main() {
// Get contract to deploy & deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("buyMeACoffee deployed to ", buyMeACoffee.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
   });