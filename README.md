# VIP汇源 - Web3 钱包应用

一个简单易用的 Web3 钱包应用，支持连接 MetaMask 并与以太坊区块链交互。

## 🌟 功能特性

- ✅ **钱包连接**: 安全连接到 MetaMask 钱包
- 💰 **余额查询**: 实时查看您的 ETH 余额
- 📤 **发送交易**: 向任何地址发送以太坊
- 🌐 **多网络支持**: 支持主网和测试网（Goerli、Sepolia、Polygon、BSC等）
- 🎨 **现代 UI**: 美观的深色主题界面
- 📱 **响应式设计**: 支持桌面和移动设备

## 🚀 快速开始

### 前置要求

- 安装 [MetaMask](https://metamask.io/download/) 浏览器扩展
- 现代浏览器（Chrome、Firefox、Edge 等）

### 使用方法

1. 克隆或下载此仓库
2. 使用浏览器打开 `index.html` 文件
3. 点击"连接 MetaMask"按钮
4. 在 MetaMask 弹窗中确认连接
5. 开始使用钱包功能！

## 📖 使用说明

### 连接钱包

1. 确保已安装并解锁 MetaMask
2. 点击"连接 MetaMask"按钮
3. 在弹出的 MetaMask 窗口中选择要连接的账户
4. 点击"连接"确认

### 查看余额

连接钱包后，应用会自动显示：
- 当前账户地址
- 账户 ETH 余额
- 当前连接的网络

### 发送交易

1. 在"发送交易"卡片中输入：
   - 接收地址（0x 开头的以太坊地址）
   - 金额（ETH）
2. 点击"发送交易"按钮
3. 在 MetaMask 中确认交易
4. 等待交易完成

## 🛠️ 技术栈

- **HTML5**: 页面结构
- **CSS3**: 样式设计（渐变、动画、响应式）
- **JavaScript (ES6+)**: 应用逻辑
- **Web3/Ethereum**: 
  - `window.ethereum` API (MetaMask Provider)
  - JSON-RPC 方法调用

## 🔐 安全说明

- ⚠️ 本应用通过 MetaMask 与区块链交互，不存储任何私钥
- ⚠️ 所有交易都需要在 MetaMask 中确认
- ⚠️ 发送交易前请仔细检查接收地址和金额
- ⚠️ 建议在测试网上先进行测试

## 📁 项目结构

```
viphuiyuan/
├── index.html                    # 主 HTML 文件
├── styles.css                    # 样式表
├── app.js                        # 应用逻辑
├── contracts/                    # 智能合约
│   ├── FeeRouterAdapter.sol     # 费用路由适配器
│   ├── ExampleERC20.sol         # 示例 ERC20 代币
│   └── MockRouter.sol           # 测试用模拟路由
├── scripts/                      # 部署脚本
│   └── deploy.js                # 合约部署脚本
├── test/                         # 测试文件
│   └── test_fee_adapter.js      # FeeRouterAdapter 测试
├── hardhat.config.js            # Hardhat 配置
├── package.json                 # 项目依赖
├── .gitignore                   # Git 忽略配置
└── README.md                    # 项目说明
```

## 🌐 支持的网络

- Ethereum 主网 (Chain ID: 0x1)
- Goerli 测试网 (Chain ID: 0x5)
- Sepolia 测试网 (Chain ID: 0xaa36a7)
- Polygon 主网 (Chain ID: 0x89)
- BSC 主网 (Chain ID: 0x38)
- **OKX Chain 主网 (Chain ID: 0x42 / 66)**
- **OKX Chain 测试网 (Chain ID: 0x41 / 65)**
- 其他兼容 EVM 的网络

### OKX Chain 网络配置

#### OKX Chain 主网
- **Chain ID**: 66 (0x42)
- **RPC URL**: https://exchainrpc.okex.org
- **浏览器**: https://www.oklink.com/okc
- **货币符号**: OKT

#### OKX Chain 测试网
- **Chain ID**: 65 (0x41)
- **RPC URL**: https://exchaintestrpc.okex.org
- **浏览器**: https://www.oklink.com/okc-test
- **货币符号**: OKT
- **水龙头**: [OKX Testnet Faucet](https://www.oklink.com/okc-test/faucet)

### OKX DEX 参考地址

#### Router 地址
- **主网/测试网**: `0x5C7c3c269629E8aFB9A2E5fefb0e3d477b8Cf82C` (建议地址)

#### Factory 地址
- **主网/测试网**: 可通过 Router 合约查询或参考 [OKX 官方文档](https://www.okx.com/okc/docs)

### 相关链接
- [OKX Chain 官方文档](https://www.okx.com/okc/docs)
- [OKX Chain 区块浏览器](https://www.oklink.com/okc)
- [OKX DEX 文档](https://www.okx.com/okc/docs/dev/quick-start/introduction)

## 🎨 界面预览

应用采用现代深色主题设计，具有：
- 渐变色背景
- 卡片式布局
- 平滑动画效果
- 响应式设计

## 📝 开发计划

- [ ] 添加交易历史记录
- [ ] 支持 ERC-20 代币
- [ ] 添加 NFT 展示
- [ ] 实现多语言支持
- [ ] 添加 Web3Modal 支持更多钱包

---

## 🔧 智能合约开发与部署

本项目包含基于 Hardhat 的智能合约开发环境，支持 OKX Chain 的合约部署和验证。

### 前置要求

- Node.js 16+ 和 npm
- 用于部署的钱包私钥
- OKX Chain 测试网或主网的 OKT（用于 gas 费用）

### 安装依赖

```bash
npm install
```

### 编译合约

```bash
npm run compile
# 或
npx hardhat compile
```

### 运行测试

```bash
npm test
# 或
npx hardhat test
```

### 部署合约

#### 环境变量配置

在项目根目录创建 `.env` 文件并添加以下变量：

```bash
# 部署钱包私钥（请勿提交到 Git）
DEPLOYER_PRIVATE_KEY=your_private_key_here

# OKX Chain RPC URLs (可选，有默认值)
OKX_RPC_URL=https://exchainrpc.okex.org
OKX_TESTNET_RPC_URL=https://exchaintestrpc.okex.org

# OKX 浏览器 API Key (用于合约验证)
OKX_EXPLORER_API_KEY=your_api_key_here

# Router 地址 (可选，有默认值)
OKX_ROUTER_ADDRESS=0x5C7c3c269629E8aFB9A2E5fefb0e3d477b8Cf82C
```

⚠️ **安全提示**: 
- 永远不要将 `.env` 文件或私钥提交到 Git
- 使用测试钱包进行开发和测试
- 确保 `.env` 已添加到 `.gitignore`

#### 部署到 OKX Chain 测试网

```bash
npm run deploy:okx_testnet
# 或
npx hardhat run scripts/deploy.js --network okx_testnet
```

#### 部署到 OKX Chain 主网

```bash
npm run deploy:okx
# 或
npx hardhat run scripts/deploy.js --network okx
```

### 验证合约

部署后，使用以下命令在 OKX 浏览器上验证合约：

```bash
# 验证 ExampleERC20
npx hardhat verify --network okx_testnet <TOKEN_ADDRESS> "Example Token" "EXMPL" "1000000000000000000000000"

# 验证 FeeRouterAdapter 实现合约
npx hardhat verify --network okx_testnet <IMPLEMENTATION_ADDRESS>
```

### FeeRouterAdapter 合约说明

`FeeRouterAdapter` 是一个 UUPS 可升级的适配器合约，用于包装 UniswapV2 风格的路由器并收取交易费用。

**主要功能**:
- ✅ 从交易中按基点（basis points）收取费用
- ✅ 将费用分配给运营、销毁和奖励地址
- ✅ UUPS 可升级模式
- ✅ 暂停/恢复功能
- ✅ 所有者可配置费用和分配比例

**合约参数**:
- `feeBps`: 费用基点（1 bps = 0.01%，最大 1000 bps = 10%）
- `opsSplit`, `burnSplit`, `rewardsSplit`: 费用分配比例（总和必须为 10000）
- Recipients: 费用接收地址（ops, burn, rewards）

### GitHub Actions CI/CD

项目包含 GitHub Actions 工作流配置，支持：
- ✅ 自动编译和测试合约
- ✅ 自动部署到测试网（通过 workflow_dispatch）
- ✅ 发布时自动部署到主网

#### 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：
1. `DEPLOYER_PRIVATE_KEY`: 部署钱包的私钥
2. `OKX_EXPLORER_API_KEY`: OKX 浏览器 API 密钥（用于验证）

### 获取 OKX 测试网 OKT

访问 [OKX 测试网水龙头](https://www.oklink.com/okc-test/faucet) 获取测试网 OKT。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目遵循仓库根目录的 LICENSE 文件。

## 📞 联系方式

如有问题或建议，请通过 GitHub Issues 联系。

---

**注意**: 这是一个教育性项目，用于学习 Web3 开发。在使用真实资金前请充分测试。
