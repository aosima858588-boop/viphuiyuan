const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Get router address from environment or use default
  const routerAddress = process.env.OKX_ROUTER_ADDRESS || "0x5C7c3c269629E8aFB9A2E5fefb0e3d477b8Cf82C";
  console.log("Using router address:", routerAddress);

  // Deploy ExampleERC20 token
  console.log("\n1. Deploying ExampleERC20...");
  const ExampleERC20 = await ethers.getContractFactory("ExampleERC20");
  const initialSupply = ethers.utils.parseEther("1000000"); // 1 million tokens
  const token = await ExampleERC20.deploy("Example Token", "EXMPL", initialSupply);
  await token.deployed();
  console.log("ExampleERC20 deployed to:", token.address);

  // Deploy FeeRouterAdapter using UUPS proxy pattern
  console.log("\n2. Deploying FeeRouterAdapter (UUPS Proxy)...");
  const FeeRouterAdapter = await ethers.getContractFactory("FeeRouterAdapter");
  
  // Default parameters
  const feeBps = 30; // 0.3% fee
  const opsRecipient = deployer.address;
  const burnRecipient = deployer.address;
  const rewardsRecipient = deployer.address;

  const adapter = await upgrades.deployProxy(
    FeeRouterAdapter,
    [routerAddress, feeBps, opsRecipient, burnRecipient, rewardsRecipient],
    { kind: "uups" }
  );
  await adapter.deployed();
  
  console.log("FeeRouterAdapter proxy deployed to:", adapter.address);
  
  // Get implementation address
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(adapter.address);
  console.log("FeeRouterAdapter implementation deployed to:", implementationAddress);

  // Summary
  console.log("\n=== Deployment Summary ===");
  console.log("ExampleERC20:", token.address);
  console.log("FeeRouterAdapter Proxy:", adapter.address);
  console.log("FeeRouterAdapter Implementation:", implementationAddress);
  console.log("\nConfiguration:");
  console.log("- Router:", routerAddress);
  console.log("- Fee:", feeBps, "bps (", (feeBps / 100).toFixed(2), "%)");
  console.log("- Ops Recipient:", opsRecipient);
  console.log("- Burn Recipient:", burnRecipient);
  console.log("- Rewards Recipient:", rewardsRecipient);
  
  console.log("\n✅ Deployment complete!");
  console.log("\nTo verify contracts on OKX explorer, run:");
  console.log(`npx hardhat verify --network ${network.name} ${token.address} "Example Token" "EXMPL" "${initialSupply}"`);
  console.log(`npx hardhat verify --network ${network.name} ${implementationAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
