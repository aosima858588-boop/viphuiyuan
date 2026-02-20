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
├── index.html           # 主 HTML 文件
├── styles.css           # 样式表
├── app.js               # 应用逻辑
├── .gitignore           # Git 忽略配置
├── LICENSE              # 许可证文件
├── .github/             # GitHub 配置（如 copilot-instructions.md）
├── custom-instructions/ # Copilot 自定义指令
└── README.md            # 项目说明
```

## 🌐 支持的网络

- Ethereum 主网 (Chain ID: 0x1)
- Goerli 测试网 (Chain ID: 0x5)
- Sepolia 测试网 (Chain ID: 0xaa36a7)
- Polygon 主网 (Chain ID: 0x89)
- BSC 主网 (Chain ID: 0x38)
- 其他兼容 EVM 的网络

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

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目遵循仓库根目录的 LICENSE 文件。

## 📞 联系方式

如有问题或建议，请通过 GitHub Issues 联系。

---

**注意**: 这是一个教育性项目，用于学习 Web3 开发。在使用真实资金前请充分测试。
