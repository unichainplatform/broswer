### Unichain开发工具
这是一个专门针对Unichain开发者的钱包工具，支持Unichain的所有功能。
开发者可以使用本工具链接Unichain的主网、测试网络、以及自己搭建的测试环境，通过本工具创建、发送Unichain的各种交易。
还可以使用本工具直接查询区块链上的数据。


如何使用（针对程序猿，需要事先安装好git、node和npm/cnpm）
1. git clone https://github.com/unichainplatform/webWallet.git
2. cd webWallet
3. cnpm i
4. cnpm run start -- -p 8080
5. 在浏览器中访问http://localhost:8080, 节点信息设置按钮位于网页右上角处，默认链接本地节点（http://127.0.0.1:8545），同时也有官方公布的主网和测试网节点地址可供选择

### 用户使用指南：
由于Unichain采用了更容易记忆的账号体系来包装难以记忆的公私钥账号，因此在钱包里，我们需要先生成或导入公私钥，然后再生成容易记忆的账号，将公钥同账号绑定后即可使用（如转账、发行资产等操作），具体操作如下：

- 进入“账户管理”一栏中的“密钥”子栏目
- 对于首次使用本网页钱包的用户，需要初始化本钱包，点击按钮“初始化钱包/新增一对公私钥”，此时会有助记词出现，按提示操作即可，除此以外，你还可以通过导入助记词来初始化钱包，点击按钮“通过导入助记词初始化钱包”，按提示操作即可；
- 钱包初始化完成后，还可以使用直接导入私钥、导入keystore等操作，用于钱包之间的账号转移；
- 当密钥部分有公私钥后，便可进入“账号”子栏目开始创建账号，对于首次之前没有任何账号的用户，需要向官方或是其他有账号的用户获取帮助，帮您创建一个账号，您只要将账号名和账号需要绑定的公钥告知对方即可，对方就能帮您创建账号，切记不要告知对方您的私钥，当对方把账号创建好后，您便可导入账号，进而对此账号做一些操作。