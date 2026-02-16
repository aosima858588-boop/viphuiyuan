// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ExampleERC20
 * @notice Simple ERC20 token for testing purposes
 */
contract ExampleERC20 is ERC20 {
    /**
     * @notice Constructor that mints initial supply to deployer
     * @param name Token name
     * @param symbol Token symbol
     * @param initialSupply Initial supply to mint (in wei units)
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @notice Mint tokens (for testing purposes)
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
