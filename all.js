

let config = {
    contract: "0x2EDf172c31EB9029979C7C66671300ce200675bA",
    symbol: "NewDogeKing",
    decimals: 18,
    image: "https://s2.loli.net/2022/02/02/iBSWPILM7tj36of.png",
    abi: [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "relationship",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "utm",
                    "type": "address"
                }
            ],
            "name": "airdrop",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "airdropAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdrawUtm",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },

        {
            "inputs": [],
            "name": "getUtmBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "weiAmount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
    ],
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


function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
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
    // console.log(accounts);
    // return
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        // initAccounts()
        onboardButton.click()
        // fetch presale process

    }

    function initAccounts() {
        // window.ethereum.request({
        //     method: 'eth_requestAccounts',
        // }).then((newAccounts) => {
        //     accounts = newAccounts;
        //     updateButton();
        // })
        window.ethereum.on('accountsChanged', (newAccounts) => {
            console.log(newAccounts);
            accounts = newAccounts;
            updateButton();
            initContract()
        });

        // register chain
        // registerEthereumChain("bscChainTestNet")
        // registerEthereumChain("bscChainMainNet")

        registerEthereumChain(defaultChain).then(() => initContract())
        initContract()
        // refreshProcess()
        // setTimeout(refreshProcess, 1000);
        // setInterval(refreshProcess, 15000)
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

function storeUtm() {
    let rr = getQueryString("r")
    if (rr) localStorage.setItem("utm", rr)
    else if (!localStorage.getItem("utm")) localStorage.setItem("utm", config.contract)
}
storeUtm()


var provider
var contract

async function initContract() {
    provider = new ethers.providers.Web3Provider(
        window.ethereum
    );
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner();

    contract = new ethers.Contract(config.contract, config.abi, signer);
    console.log("contract: ", contract)

    // console.log("totalSupply: ", await contract.totalSupply())
    contract.totalSupply().then(r => {
        console.log("totalSupply: ", ethers.utils.formatEther(r))
    })

    await checkAirdrop()
    await getUtmBalance()
}

async function checkAirdrop() {
    const airdropInput = $("#airdropInput")
    const airdropButon = $("#airdropButon")
    const withdrawButton = $("#withdrawButton")
    const copyButton = $("#copyButton")
    const myInput = $("#myInput")
    let parent = await contract.relationship(accounts[0])
    console.log("provider: ", provider)
    console.log("parent: ", parent)
    if (parent && parent !== "0x0000000000000000000000000000000000000000") {
        airdropInput.prop('disabled', true);
        airdropButon.prop('disabled', true);
        withdrawButton.prop('disabled', false);
        copyButton.prop('disabled', false);
        myInput.val(`${host}?r=${accounts[0]}`)
    } else {
        airdropInput.prop('disabled', false);
        airdropButon.prop('disabled', false);
        withdrawButton.prop('disabled', true);
        copyButton.prop('disabled', true);
        myInput.val("")
    }

    console.log("balanceOf: ", ethers.utils.formatEther(await contract.balanceOf(accounts[0])))
}
async function getUtmBalance() {
    let amount = await contract.getUtmBalance()
    console.log("getUtmBalance: ", ethers.utils.formatEther(amount))
    $("#utmPrize").text(ethers.utils.formatEther(amount))
}

async function airdrop() {
    if (accounts.length == 0) {
        alert("please connect wallet first")
        return
    }
    // console.log(ethers.utils.parseEther("12"))
    // let eth2 = document.getElementById("bnb")
    // console.log(eth2.value?eth2.value:0)
    // return
    let utm = localStorage.getItem("utm")
    let tx = await contract.airdrop(utm)
    console.log("tx hash: ", tx.hash)
    // let hash = chainInfo[defaultChain].blockExplorerUrls[0]+"/tx/"+r.hash
    alert('buy success with tx hash: ' + tx.hash)
    await tx.wait()
    checkAirdrop()
}

function withdraw() {
    if (accounts.length == 0) {
        alert("please connect wallet first")
        return
    }
    // alert("coming after presale")
    _withdraw()
}

function _withdraw() {
    contract.withdrawUtm().then(r => {
        console.log("tx hash: ", r)
        // let hash = chainInfo[defaultChain].blockExplorerUrls[0]+"/tx/"+r.hash
        alert('withdraw success with tx hash: ' + r.hash)
    }, err => {
        alert(err.message)
        console.log("err: ", err)
    })
}

