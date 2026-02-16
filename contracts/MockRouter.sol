// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MockRouter
 * @notice Simple mock router for testing purposes
 */
contract MockRouter {
    /**
     * @notice Mock swap function that mimics UniswapV2Router
     */
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts) {
        require(deadline >= block.timestamp, "Expired");
        require(path.length >= 2, "Invalid path");
        
        // Transfer input tokens from sender
        IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);
        
        // For testing, just return the same amount
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        amounts[path.length - 1] = amountIn;
        
        // Transfer output tokens to recipient (if we have them)
        if (path[0] == path[path.length - 1]) {
            IERC20(path[path.length - 1]).transfer(to, amountIn);
        }
        
        return amounts;
    }
}
