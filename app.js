// Web3 钱包应用
class Web3Wallet {
    constructor() {
        this.account = null;
        this.web3 = null;
        this.init();
    }

    async init() {
        // 检查是否安装了 MetaMask
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask 已安装!');
            this.web3 = window.ethereum;
            
            // 监听账户变化
            this.web3.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.handleDisconnect();
                } else {
                    this.account = accounts[0];
                    this.updateUI();
                }
            });

            // 监听网络变化
            this.web3.on('chainChanged', () => {
                window.location.reload();
            });

            // 检查是否已经连接
            const accounts = await this.web3.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                this.account = accounts[0];
                this.updateUI();
            }
        } else {
            console.log('请安装 MetaMask!');
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // 连接按钮
        document.getElementById('connectButton').addEventListener('click', () => {
            this.connectWallet();
        });

        // 断开连接按钮
        document.getElementById('disconnectButton').addEventListener('click', () => {
            this.handleDisconnect();
        });

        // 发送交易表单
        document.getElementById('sendForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendTransaction();
        });
    }

    async connectWallet() {
        if (typeof window.ethereum === 'undefined') {
            alert('请先安装 MetaMask! 访问 https://metamask.io/download/');
            return;
        }

        try {
            // 请求连接钱包
            const accounts = await this.web3.request({ method: 'eth_requestAccounts' });
            this.account = accounts[0];
            console.log('已连接账户:', this.account);
            
            this.updateUI();
        } catch (error) {
            console.error('连接失败:', error);
            alert('连接钱包失败: ' + error.message);
        }
    }

    async updateUI() {
        if (this.account) {
            // 显示已连接状态
            document.getElementById('notConnected').classList.add('hidden');
            document.getElementById('connected').classList.remove('hidden');
            document.getElementById('transactionForm').classList.remove('hidden');

            // 显示账户地址
            document.getElementById('accountAddress').textContent = this.account;

            // 获取并显示余额
            await this.updateBalance();

            // 获取并显示网络
            await this.updateNetwork();
        } else {
            // 显示未连接状态
            document.getElementById('notConnected').classList.remove('hidden');
            document.getElementById('connected').classList.add('hidden');
            document.getElementById('transactionForm').classList.add('hidden');
        }
    }

    async updateBalance() {
        try {
            const balance = await this.web3.request({
                method: 'eth_getBalance',
                params: [this.account, 'latest']
            });

            // 将 Wei 转换为 ETH
            const ethBalance = parseInt(balance, 16) / Math.pow(10, 18);
            document.getElementById('accountBalance').textContent = ethBalance.toFixed(4) + ' ETH';
        } catch (error) {
            console.error('获取余额失败:', error);
            document.getElementById('accountBalance').textContent = '获取失败';
        }
    }

    async updateNetwork() {
        try {
            const chainId = await this.web3.request({ method: 'eth_chainId' });
            const networks = {
                '0x1': 'Ethereum 主网',
                '0x5': 'Goerli 测试网',
                '0xaa36a7': 'Sepolia 测试网',
                '0x89': 'Polygon 主网',
                '0x38': 'BSC 主网'
            };

            const networkName = networks[chainId] || `未知网络 (${chainId})`;
            document.getElementById('networkName').textContent = networkName;
        } catch (error) {
            console.error('获取网络失败:', error);
            document.getElementById('networkName').textContent = '未知';
        }
    }

    handleDisconnect() {
        this.account = null;
        this.updateUI();
        
        // 清空交易表单
        document.getElementById('sendForm').reset();
        document.getElementById('transactionStatus').classList.add('hidden');
    }

    async sendTransaction() {
        const recipient = document.getElementById('recipientAddress').value;
        const amount = document.getElementById('amount').value;

        if (!this.account) {
            alert('请先连接钱包!');
            return;
        }

        if (!recipient || !amount) {
            alert('请填写完整的交易信息!');
            return;
        }

        // 验证地址格式
        if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
            alert('接收地址格式不正确!');
            return;
        }

        try {
            const statusDiv = document.getElementById('transactionStatus');
            statusDiv.textContent = '交易处理中...';
            statusDiv.className = 'transaction-status';
            statusDiv.classList.remove('hidden', 'success', 'error');

            // 将 ETH 转换为 Wei
            const amountInWei = '0x' + (parseFloat(amount) * Math.pow(10, 18)).toString(16);

            // 发送交易
            const txHash = await this.web3.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: this.account,
                    to: recipient,
                    value: amountInWei,
                }],
            });

            console.log('交易哈希:', txHash);
            
            statusDiv.textContent = `✓ 交易成功! 交易哈希: ${txHash}`;
            statusDiv.classList.add('success');

            // 清空表单
            document.getElementById('sendForm').reset();

            // 更新余额
            setTimeout(() => {
                this.updateBalance();
            }, 2000);

        } catch (error) {
            console.error('交易失败:', error);
            const statusDiv = document.getElementById('transactionStatus');
            statusDiv.textContent = `✗ 交易失败: ${error.message}`;
            statusDiv.classList.add('error');
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new Web3Wallet();
});
