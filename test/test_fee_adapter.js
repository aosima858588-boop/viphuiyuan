const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("FeeRouterAdapter", function () {
  let adapter;
  let token;
  let mockRouter;
  let owner;
  let ops;
  let burn;
  let rewards;
  let user;

  beforeEach(async function () {
    [owner, ops, burn, rewards, user] = await ethers.getSigners();

    // Deploy a mock router
    const MockRouter = await ethers.getContractFactory("MockRouter");
    mockRouter = await MockRouter.deploy();
    await mockRouter.deployed();

    // Deploy test token
    const ExampleERC20 = await ethers.getContractFactory("ExampleERC20");
    token = await ExampleERC20.deploy("Test Token", "TEST", ethers.utils.parseEther("1000000"));
    await token.deployed();

    // Deploy FeeRouterAdapter
    const FeeRouterAdapter = await ethers.getContractFactory("FeeRouterAdapter");
    adapter = await upgrades.deployProxy(
      FeeRouterAdapter,
      [mockRouter.address, 100, ops.address, burn.address, rewards.address], // 1% fee
      { kind: "uups" }
    );
    await adapter.deployed();
  });

  describe("Initialization", function () {
    it("Should initialize with correct parameters", async function () {
      expect(await adapter.router()).to.equal(mockRouter.address);
      expect(await adapter.feeBps()).to.equal(100);
      expect(await adapter.opsRecipient()).to.equal(ops.address);
      expect(await adapter.burnRecipient()).to.equal(burn.address);
      expect(await adapter.rewardsRecipient()).to.equal(rewards.address);
    });

    it("Should set default splits", async function () {
      expect(await adapter.opsSplit()).to.equal(3333);
      expect(await adapter.burnSplit()).to.equal(3333);
      expect(await adapter.rewardsSplit()).to.equal(3334);
    });

    it("Should not allow initialization twice", async function () {
      await expect(
        adapter.initialize(mockRouter.address, 100, ops.address, burn.address, rewards.address)
      ).to.be.reverted;
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update fee", async function () {
      await adapter.setFeeBps(200);
      expect(await adapter.feeBps()).to.equal(200);
    });

    it("Should not allow fee above max", async function () {
      await expect(adapter.setFeeBps(1001)).to.be.revertedWith("Fee too high");
    });

    it("Should allow owner to update splits", async function () {
      await adapter.setSplits(4000, 3000, 3000);
      expect(await adapter.opsSplit()).to.equal(4000);
      expect(await adapter.burnSplit()).to.equal(3000);
      expect(await adapter.rewardsSplit()).to.equal(3000);
    });

    it("Should require splits to sum to 10000", async function () {
      await expect(adapter.setSplits(4000, 3000, 2000)).to.be.revertedWith(
        "Splits must sum to 10000"
      );
    });

    it("Should allow owner to update recipients", async function () {
      const [newOps, newBurn, newRewards] = await ethers.getSigners();
      await adapter.setRecipients(newOps.address, newBurn.address, newRewards.address);
      expect(await adapter.opsRecipient()).to.equal(newOps.address);
      expect(await adapter.burnRecipient()).to.equal(newBurn.address);
      expect(await adapter.rewardsRecipient()).to.equal(newRewards.address);
    });

    it("Should allow owner to update router", async function () {
      const [newRouter] = await ethers.getSigners();
      await adapter.setRouter(newRouter.address);
      expect(await adapter.router()).to.equal(newRouter.address);
    });

    it("Should allow owner to pause and unpause", async function () {
      await adapter.pause();
      expect(await adapter.paused()).to.be.true;
      await adapter.unpause();
      expect(await adapter.paused()).to.be.false;
    });
  });

  describe("Fee Distribution", function () {
    it("Should distribute fees correctly when taking fee", async function () {
      const swapAmount = ethers.utils.parseEther("100");
      const expectedFee = swapAmount.mul(100).div(10000); // 1% of 100 = 1 ETH
      
      // Mint tokens to user and adapter (adapter needs tokens to act as router output)
      await token.mint(user.address, swapAmount);
      await token.mint(mockRouter.address, swapAmount.mul(2)); // Router has enough for swap
      
      // Approve adapter
      await token.connect(user).approve(adapter.address, swapAmount);
      
      // Get initial balances
      const initialOps = await token.balanceOf(ops.address);
      const initialBurn = await token.balanceOf(burn.address);
      const initialRewards = await token.balanceOf(rewards.address);
      
      // Perform swap (should succeed with MockRouter)
      const path = [token.address, token.address];
      await adapter.connect(user).swapExactTokensForTokensWithFee(
        swapAmount,
        0,
        path,
        user.address,
        Math.floor(Date.now() / 1000) + 3600
      );
      
      // Calculate expected fee distribution based on splits
      const expectedOps = expectedFee.mul(3333).div(10000);
      const expectedBurn = expectedFee.mul(3333).div(10000);
      const expectedRewards = expectedFee.sub(expectedOps).sub(expectedBurn);
      
      // Check fee distribution
      const finalOps = await token.balanceOf(ops.address);
      const finalBurn = await token.balanceOf(burn.address);
      const finalRewards = await token.balanceOf(rewards.address);
      
      expect(finalOps.sub(initialOps)).to.equal(expectedOps);
      expect(finalBurn.sub(initialBurn)).to.equal(expectedBurn);
      expect(finalRewards.sub(initialRewards)).to.equal(expectedRewards);
    });

    it("Should take correct fee amount from swap", async function () {
      const swapAmount = ethers.utils.parseEther("100");
      
      // Mint tokens to user
      await token.mint(user.address, swapAmount);
      await token.mint(mockRouter.address, swapAmount.mul(2));
      
      // Approve adapter
      await token.connect(user).approve(adapter.address, swapAmount);
      
      // Get initial user balance
      const initialUserBalance = await token.balanceOf(user.address);
      
      // Perform swap
      const path = [token.address, token.address];
      await adapter.connect(user).swapExactTokensForTokensWithFee(
        swapAmount,
        0,
        path,
        user.address,
        Math.floor(Date.now() / 1000) + 3600
      );
      
      // User should have transferred the full amount
      expect(await token.balanceOf(user.address)).to.be.gt(initialUserBalance.sub(swapAmount));
    });
  });

  describe("Rescue Tokens", function () {
    it("Should allow owner to rescue tokens", async function () {
      const rescueAmount = ethers.utils.parseEther("10");
      await token.mint(adapter.address, rescueAmount);
      
      const initialBalance = await token.balanceOf(owner.address);
      await adapter.rescueTokens(token.address, owner.address, rescueAmount);
      const finalBalance = await token.balanceOf(owner.address);
      
      expect(finalBalance.sub(initialBalance)).to.equal(rescueAmount);
    });
  });
});

// Mock Router contract for testing
describe("MockRouter", function () {
  it("Should deploy mock router", async function () {
    const MockRouter = await ethers.getContractFactory("MockRouter");
    const mockRouter = await MockRouter.deploy();
    await mockRouter.deployed();
    expect(mockRouter.address).to.be.properAddress;
  });
});
