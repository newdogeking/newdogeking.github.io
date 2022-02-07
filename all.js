

let config = {
    contract: "0x2EDf172c31EB9029979C7C66671300ce200675bA",
    symbol: "StarLink",
    decimals: 18,
    image: "https://profit-hunters.biz/wp-content/uploads/2020/06/1200px-Starlink_Logo.svg_.png",
    abiOld: [
        'function balanceOf(address account) external view returns (uint256)',
        'function allowance(address owner, address spender) external view returns (uint256)',
        'function approve(address spender, uint256 amount) external returns (bool)',
    ],
    oldContract: "0x2EDf172c31EB9029979C7C66671300ce200675bA",
    abi: [
        'function isMigrated(address) public view returns(bool)',
        'function NDK2StarLink() public',
    ]
}
let defaultChain = "bscChainMainNet"
let boardingID = "onboard"
let boardingAccount = "onboardAccount"
let pancakeSwap = {
    "localNet": "https://pancakeswap.finance/swap?outputCurrency="+config.contract,
    "bscChainMainNet": "https://pancakeswap.finance/swap?outputCurrency="+config.contract,
    "bscChainTestNet": "https://pancake.kiemtienonline360.com/#/swap?outputCurrency="+config.contract,
}

let host = "https://newdogeking.github.io"
let kLine = "https://poocoin.app/tokens/"+config.contract
let chainInfo = {
    "bscChainTestNet": {
        "chainId": "0x61",
        "chainName": "BSC TestNet",
        "rpcUrls": [
            "https://data-seed-prebsc-1-s1.binance.org:8545/",
            "https://data-seed-prebsc-2-s1.binance.org:8545/"
        ],
        "iconUrls": [
            "https://dex-bin.bnbstatic.com/static/images/favicon.ico",
            "https://dex-bin.bnbstatic.com/static/images/favicon.ico"
        ],
        "nativeCurrency": {
            "name": "BNB",
            "symbol": "BNB",
            "decimals": 18
        },
        "blockExplorerUrls": [
            "https://testnet.bscscan.com/"
        ]
    },
    "bscChainMainNet": {
        "chainId": "0x38",
        "chainName": "BSC MainNet",
        "rpcUrls": [
            "https://bsc-dataseed1.binance.org",
            "https://bsc-dataseed1.defibit.io/",
            "https://bsc-dataseed1.ninicoin.io/"
        ],
        "iconUrls": [
            "https://dex-bin.bnbstatic.com/static/images/favicon.ico",
            "https://dex-bin.bnbstatic.com/static/images/favicon.ico"
        ],
        "nativeCurrency": {
            "name": "BNB",
            "symbol": "BNB",
            "decimals": 18
        },
        "blockExplorerUrls": [
            "https://bscscan.com/"
        ]
    },
    "localNet": {
        "chainId": "0x539",
        "chainName": "Localhost-8545",
        "rpcUrls": [
            "http://localhost:8545"
        ],
        "iconUrls": [
            "https://dex-bin.bnbstatic.com/static/images/favicon.ico"
        ],
        "nativeCurrency": {
            "name": "ethereum",
            "symbol": "eth",
            "decimals": 18
        },
        "blockExplorerUrls": [
            "http://localhost:8545"
        ]
    }
}

function shortAddress(res, pre, suf) {
    if (!pre) pre = 6
    if (!suf) suf = 4
    return (res.length > 13) ? res.substr(0, pre) + "..." + res.substr(-suf) : res;
}

function timeFixed(t) {
    if (t > 9) return t.toString()
    else return "0" + t
}

var accounts = [];
window.addEventListener('DOMContentLoaded', () => {
    const onboarding = new MetaMaskOnboarding();
    const onboardButton = document.getElementById(boardingID);
    const onboardAccount = document.getElementById(boardingAccount);

    const updateButton = () => {
        // if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
        //     onboardButton.innerText = 'Click to install MetaMask!';
        //     onboardButton.onclick = () => {
        //         onboardButton.innerText = 'Onboarding in progress';
        //         onboardButton.disabled = true;
        //         onboarding.startOnboarding();
        //     };
        // } else
        if (accounts && accounts.length > 0) {
            // onboardButton.innerText = 'Connected';
            onboardAccount.innerText = shortAddress(accounts[0]);
            onboardButton.disabled = true;
            onboarding.stopOnboarding();
        } else {
            onboardAccount.innerText = 'Connect Wallet';
            onboardButton.onclick = async () => {
                console.log(window.ethereum)
                accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                await updateButton()
                await initAccounts()
            };
        }
    };
    updateButton();
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        onboardButton.click()
    }

    async function initAccounts() {
        window.ethereum.on('accountsChanged', (newAccounts) => {
            console.log(newAccounts);
            accounts = newAccounts;
            updateButton();
            initContract()
            initContractOld()
        });

        registerEthereumChain(defaultChain).then(() => {})
        await initContract()
        await initContractOld()
    }
});

async function addTokenToWallet() {
    await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
                address: config.contract, // The address that the token is at.
                symbol: config.symbol, // A ticker symbol or shorthand, up to 5 chars.
                decimals: config.decimals, // The number of decimals in the token
                image: config.image, // A string url of the token logo
            },
        },
    });
}

async function registerEthereumChain(chain) {
    let chainData = {
        'jsonrpc': '2.0',
        'method': 'wallet_addEthereumChain',
        'params': [
            chainInfo[chain],
        ],
    };
    return window.ethereum.request(chainData)
}


var provider
var contract
var contractOld

async function initContract() {
    // provider = new ethers.providers.Web3Provider(
    //     window.ethereum
    // );
    // await provider.send("eth_requestAccounts", [])
    // const signer = provider.getSigner();
    //
    // contract = new ethers.Contract(config.contract, config.abi, signer);
    // console.log("contract: ", contract)
    //
    // await checkIfMigrated()
}

async function initContractOld() {
    provider = new ethers.providers.Web3Provider(
        window.ethereum
    );
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner();

    contractOld = new ethers.Contract(config.contract, config.abiOld, signer);
    console.log("contractOld: ", contractOld)

    await checkIfMigrated()
}

async function checkIfMigrated() {
    // let tx = await contract.isMigrated(accounts[0]);
    let tx = false;
    if (tx) {
        $("#NewDogeKing").val(0);
        $("#btnApprove").prop('disabled', true);
        $("#btnMigrate").prop('disabled', true);
    } else {
        let balance = await contractOld.balanceOf(accounts[0])
        $("#NewDogeKing").val(ethers.utils.formatEther(balance));
        if ((await contractOld.allowance(accounts[0], config.contract)).lt(balance)) {
            $("#btnApprove").prop('disabled', false);
            $("#btnMigrate").prop('disabled', true);
        } else {
            $("#btnApprove").prop('disabled', true);
            $("#btnMigrate").prop('disabled', false);
        }
    }
}
async function approve() {
    let tx = await contractOld.approve(contract, ethers.constants.MaxUint256);
    await tx.wait()
    alert("批准成功： ", tx.hash)
    await checkIfMigrated()
}
async function migrate() {
    let tx = await contract.NDK2StarLink();
    await tx.wait()
    alert("迁移成功： ", tx.hash)
    await checkIfMigrated()
}
