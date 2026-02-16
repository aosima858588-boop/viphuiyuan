// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

/**
 * @title FeeRouterAdapter
 * @notice UUPS upgradeable adapter that wraps a UniswapV2-style router and takes fees
 * @dev Charges fees in basis points from tokenIn on swaps and distributes to configured recipients
 */
contract FeeRouterAdapter is OwnableUpgradeable, PausableUpgradeable, UUPSUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    // Events
    event FeeTaken(address indexed token, uint256 amount, uint256 feeBps);
    event FeeDistributed(address indexed token, address indexed recipient, uint256 amount, string category);
    event SwapExecuted(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event FeeBpsUpdated(uint256 oldFeeBps, uint256 newFeeBps);
    event SplitsUpdated(uint256 opsSplit, uint256 burnSplit, uint256 rewardsSplit);
    event RecipientsUpdated(address ops, address burn, address rewards);
    event RouterUpdated(address oldRouter, address newRouter);

    // Constants
    uint256 public constant MAX_FEE_BPS = 1000; // 10% max fee
    uint256 public constant BPS_DENOMINATOR = 10000;

    // State variables
    address public router;
    uint256 public feeBps; // Fee in basis points

    // Fee distribution splits (in basis points)
    uint256 public opsSplit;
    uint256 public burnSplit;
    uint256 public rewardsSplit;

    // Recipients
    address public opsRecipient;
    address public burnRecipient;
    address public rewardsRecipient;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initialize the contract
     * @param _router Address of the UniswapV2-style router
     * @param _feeBps Initial fee in basis points
     * @param _opsRecipient Recipient address for ops fees
     * @param _burnRecipient Recipient address for burn fees
     * @param _rewardsRecipient Recipient address for rewards fees
     */
    function initialize(
        address _router,
        uint256 _feeBps,
        address _opsRecipient,
        address _burnRecipient,
        address _rewardsRecipient
    ) public initializer {
        __Ownable_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        require(_router != address(0), "Invalid router");
        require(_feeBps <= MAX_FEE_BPS, "Fee too high");
        require(_opsRecipient != address(0), "Invalid ops recipient");
        require(_burnRecipient != address(0), "Invalid burn recipient");
        require(_rewardsRecipient != address(0), "Invalid rewards recipient");

        router = _router;
        feeBps = _feeBps;
        opsRecipient = _opsRecipient;
        burnRecipient = _burnRecipient;
        rewardsRecipient = _rewardsRecipient;

        // Default equal splits (33.33% each)
        opsSplit = 3333;
        burnSplit = 3333;
        rewardsSplit = 3334; // Slightly more to account for rounding
    }

    /**
     * @notice Swap exact tokens for tokens with fee deduction
     * @param amountIn Amount of input tokens
     * @param amountOutMin Minimum amount of output tokens
     * @param path Array of token addresses (swap path)
     * @param to Recipient of output tokens
     * @param deadline Transaction deadline
     * @return amounts Array of amounts for each step in the path
     */
    function swapExactTokensForTokensWithFee(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external whenNotPaused returns (uint256[] memory amounts) {
        require(path.length >= 2, "Invalid path");
        require(amountIn > 0, "Amount must be positive");
        
        address tokenIn = path[0];
        
        // Transfer tokens from sender
        IERC20Upgradeable(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Calculate and take fee
        uint256 feeAmount = (amountIn * feeBps) / BPS_DENOMINATOR;
        uint256 amountAfterFee = amountIn - feeAmount;
        
        if (feeAmount > 0) {
            emit FeeTaken(tokenIn, feeAmount, feeBps);
            _distributeFee(tokenIn, feeAmount);
        }
        
        // Approve router to spend tokens
        IERC20Upgradeable(tokenIn).safeApprove(router, 0);
        IERC20Upgradeable(tokenIn).safeApprove(router, amountAfterFee);
        
        // Execute swap on router
        (bool success, bytes memory data) = router.call(
            abi.encodeWithSignature(
                "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
                amountAfterFee,
                amountOutMin,
                path,
                to,
                deadline
            )
        );
        
        require(success, "Router swap failed");
        amounts = abi.decode(data, (uint256[]));
        
        emit SwapExecuted(tokenIn, path[path.length - 1], amountIn, amounts[amounts.length - 1]);
        
        return amounts;
    }

    /**
     * @notice Distribute collected fees to recipients
     * @param token Token address to distribute
     * @param feeAmount Total fee amount to distribute
     */
    function _distributeFee(address token, uint256 feeAmount) internal {
        uint256 opsAmount = (feeAmount * opsSplit) / BPS_DENOMINATOR;
        uint256 burnAmount = (feeAmount * burnSplit) / BPS_DENOMINATOR;
        uint256 rewardsAmount = feeAmount - opsAmount - burnAmount; // Remaining goes to rewards
        
        if (opsAmount > 0) {
            IERC20Upgradeable(token).safeTransfer(opsRecipient, opsAmount);
            emit FeeDistributed(token, opsRecipient, opsAmount, "ops");
        }
        
        if (burnAmount > 0) {
            IERC20Upgradeable(token).safeTransfer(burnRecipient, burnAmount);
            emit FeeDistributed(token, burnRecipient, burnAmount, "burn");
        }
        
        if (rewardsAmount > 0) {
            IERC20Upgradeable(token).safeTransfer(rewardsRecipient, rewardsAmount);
            emit FeeDistributed(token, rewardsRecipient, rewardsAmount, "rewards");
        }
    }

    /**
     * @notice Update fee in basis points
     * @param _feeBps New fee in basis points
     */
    function setFeeBps(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= MAX_FEE_BPS, "Fee too high");
        uint256 oldFeeBps = feeBps;
        feeBps = _feeBps;
        emit FeeBpsUpdated(oldFeeBps, _feeBps);
    }

    /**
     * @notice Update fee distribution splits
     * @param _opsSplit Operations split in basis points
     * @param _burnSplit Burn split in basis points
     * @param _rewardsSplit Rewards split in basis points
     */
    function setSplits(
        uint256 _opsSplit,
        uint256 _burnSplit,
        uint256 _rewardsSplit
    ) external onlyOwner {
        require(_opsSplit + _burnSplit + _rewardsSplit == BPS_DENOMINATOR, "Splits must sum to 10000");
        opsSplit = _opsSplit;
        burnSplit = _burnSplit;
        rewardsSplit = _rewardsSplit;
        emit SplitsUpdated(_opsSplit, _burnSplit, _rewardsSplit);
    }

    /**
     * @notice Update recipient addresses
     * @param _opsRecipient New ops recipient
     * @param _burnRecipient New burn recipient
     * @param _rewardsRecipient New rewards recipient
     */
    function setRecipients(
        address _opsRecipient,
        address _burnRecipient,
        address _rewardsRecipient
    ) external onlyOwner {
        require(_opsRecipient != address(0), "Invalid ops recipient");
        require(_burnRecipient != address(0), "Invalid burn recipient");
        require(_rewardsRecipient != address(0), "Invalid rewards recipient");
        opsRecipient = _opsRecipient;
        burnRecipient = _burnRecipient;
        rewardsRecipient = _rewardsRecipient;
        emit RecipientsUpdated(_opsRecipient, _burnRecipient, _rewardsRecipient);
    }

    /**
     * @notice Update router address
     * @param _router New router address
     */
    function setRouter(address _router) external onlyOwner {
        require(_router != address(0), "Invalid router");
        address oldRouter = router;
        router = _router;
        emit RouterUpdated(oldRouter, _router);
    }

    /**
     * @notice Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Rescue tokens sent to contract by mistake
     * @param token Token address to rescue
     * @param to Recipient address
     * @param amount Amount to rescue
     */
    function rescueTokens(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        IERC20Upgradeable(token).safeTransfer(to, amount);
    }

    /**
     * @notice Authorize upgrade (UUPS requirement)
     * @param newImplementation Address of new implementation
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
