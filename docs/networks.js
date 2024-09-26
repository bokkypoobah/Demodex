// https://stealthaddress.dev/contracts/deployments
const NETWORKS = {
  // 1: {
  //   name: "Ethereum Mainnet",
  //   explorer: "https://etherscan.io/",
  //   nonFungibleViewer: "https://opensea.io/assets/ethereum/${contract}/${tokenId}",
  //   erc20Logos: [
  //       "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${contract}/logo.png",
  //       "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${contract}/logo.png",
  //   ],
  //   reservoir: "https://api.reservoir.tools/",
  // },
  // 42161: {
  //   name: "Arbitrum",
  //   explorer: "https://arbiscan.io/",
  //   nonFungibleViewer: "https://opensea.io/assets/arbitrum/${contract}/${tokenId}",
  //   erc20Logos: [
  //       "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/assets/${contract}/logo.png",
  //       "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/${contract}/logo.png",
  //   ],
  //   reservoir: "https://api-arbitrum.reservoir.tools/",
  // },
  // 8453: {
  //   name: "Base",
  //   explorer: "https://basescan.org/",
  //   nonFungibleViewer: "https://opensea.io/assets/base/${contract}/${tokenId}",
  //   erc20Logos: [
  //       "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/base/assets/${contract}/logo.png",
  //       "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/assets/${contract}/logo.png",
  //   ],
  //   reservoir: "https://api-base.reservoir.tools/",
  //   maxLogScrapingSize: 10_000, // TODO: Base RPC server fails for > 10k blocks for ERC-20 event log scraping
  // },
  // 100: {
  //   name: "Gnosis Chain",
  //   explorer: "https://gnosisscan.io/",
  // },
  // 10: {
  //   name: "Optimism",
  //   explorer: "https://optimistic.etherscan.io/",
  //   nonFungibleViewer: "https://opensea.io/assets/optimism/${contract}/${tokenId}",
  //   erc20Logos: [
  //       "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/optimism/assets/${contract}/logo.png",
  //       "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/${contract}/logo.png",
  //   ],
  //   reservoir: "https://api-optimism.reservoir.tools/",
  // },
  // 137: {
  //   name: "Polygon Matic",
  //   explorer: "https://polygonscan.com/",
  //   nonFungibleViewer: "https://opensea.io/assets/matic/${contract}/${tokenId}",
  //   erc20Logos: [
  //       "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/assets/${contract}/logo.png",
  //       "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/${contract}/logo.png",
  //   ],
  //   reservoir: "https://api-polygon.reservoir.tools/",
  // },
  // 534352: {
  //   name: "Scroll",
  //   explorer: "https://scrollscan.com/",
  //   erc20Logos: [
  //       "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/scroll/assets/${contract}/logo.png",
  //       "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/scroll/assets/${contract}/logo.png",
  //   ],
  //   reservoir: "https://api-scroll.reservoir.tools/",
  // },
  11155111: {
    name: "Sepolia Testnet",
    tokenAgentFactory: {
      name: "TokenAgentFactory v0.8.5",
      address: "0xBC40555f0948b5499EF898Ba4932C3EBCf96B8c3",
      abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"contract TokenAgent","name":"tokenAgent","type":"address"}],"name":"AlreadyDeployed","type":"error"},{"inputs":[],"name":"GoAway","type":"error"},{"inputs":[],"name":"NotInitialised","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract TokenAgent","name":"tokenAgent","type":"address"},{"indexed":true,"internalType":"Account","name":"owner","type":"address"},{"indexed":true,"internalType":"Index","name":"index","type":"uint32"},{"indexed":false,"internalType":"Unixtime","name":"timestamp","type":"uint40"}],"name":"NewTokenAgent","type":"event"},{"inputs":[{"internalType":"Account","name":"owner","type":"address"}],"name":"getTokenAgentByOwnerInfo","outputs":[{"components":[{"internalType":"Index","name":"index","type":"uint32"},{"internalType":"contract TokenAgent","name":"tokenAgent","type":"address"},{"internalType":"Account","name":"owner","type":"address"}],"internalType":"struct TokenAgentFactory.TokenAgentInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract TokenAgent","name":"tokenAgent","type":"address"}],"name":"getTokenAgentInfo","outputs":[{"components":[{"internalType":"Index","name":"index","type":"uint32"},{"internalType":"contract TokenAgent","name":"tokenAgent","type":"address"},{"internalType":"Account","name":"owner","type":"address"}],"internalType":"struct TokenAgentFactory.TokenAgentInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"fromIndex","type":"uint256"},{"internalType":"uint256","name":"toIndex","type":"uint256"}],"name":"getTokenAgentsInfo","outputs":[{"components":[{"internalType":"Index","name":"index","type":"uint32"},{"internalType":"contract TokenAgent","name":"tokenAgent","type":"address"},{"internalType":"Account","name":"owner","type":"address"}],"internalType":"struct TokenAgentFactory.TokenAgentInfo[]","name":"results","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"Token[]","name":"tokens","type":"address[]"}],"name":"getTokenTypes","outputs":[{"internalType":"enum TokenType[]","name":"_tokenTypes","type":"uint8[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract WETH","name":"_weth","type":"address"},{"internalType":"contract TokenAgent","name":"_tokenAgentTemplate","type":"address"}],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"newTokenAgent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"Account","name":"","type":"address"}],"name":"tokenAgentByOwners","outputs":[{"internalType":"contract TokenAgent","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract TokenAgent","name":"","type":"address"}],"name":"tokenAgentIndex","outputs":[{"internalType":"Index","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenAgentTemplate","outputs":[{"internalType":"contract TokenAgent","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenAgents","outputs":[{"internalType":"contract TokenAgent","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenAgentsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"weth","outputs":[{"internalType":"contract WETH","name":"","type":"address"}],"stateMutability":"view","type":"function"}],
    },
    tokenAgent: {
      name: "TokenAgent v0.8.5 (template)",
      address: "0x8f0e1491F6acccC1B30eF03438E74EDb07Db2417",
      abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AlreadyInitialised","type":"error"},{"inputs":[],"name":"CannotOfferWETH","type":"error"},{"inputs":[{"internalType":"Price","name":"executedAveragePrice","type":"uint128"},{"internalType":"Price","name":"tradeAveragePrice","type":"uint128"}],"name":"ExecutedAveragePriceGreaterThanSpecified","type":"error"},{"inputs":[{"internalType":"Price","name":"executedAveragePrice","type":"uint128"},{"internalType":"Price","name":"tradeAveragePrice","type":"uint128"}],"name":"ExecutedAveragePriceLessThanSpecified","type":"error"},{"inputs":[{"internalType":"Price","name":"executedTotalPrice","type":"uint128"},{"internalType":"Price","name":"tradeTotalPrice","type":"uint128"}],"name":"ExecutedTotalPriceGreaterThanSpecified","type":"error"},{"inputs":[{"internalType":"Price","name":"executedTotalPrice","type":"uint128"},{"internalType":"Price","name":"tradeTotalPrice","type":"uint128"}],"name":"ExecutedTotalPriceLessThanSpecified","type":"error"},{"inputs":[{"internalType":"uint256","name":"ethersRequested","type":"uint256"},{"internalType":"uint256","name":"ethersRemaining","type":"uint256"}],"name":"InsufficentEthersRemaining","type":"error"},{"inputs":[{"internalType":"uint256","name":"line","type":"uint256"},{"internalType":"Tokens","name":"tokensRequested","type":"uint128"},{"internalType":"Tokens","name":"tokensRemaining","type":"uint128"}],"name":"InsufficentTokensRemaining","type":"error"},{"inputs":[{"internalType":"uint256","name":"line","type":"uint256"},{"internalType":"Index","name":"index","type":"uint32"}],"name":"InvalidIndex","type":"error"},{"inputs":[{"internalType":"uint256","name":"line","type":"uint256"},{"internalType":"string","name":"reason","type":"string"}],"name":"InvalidInputData","type":"error"},{"inputs":[{"internalType":"uint256","name":"line","type":"uint256"},{"internalType":"Nonce","name":"offerNonce","type":"uint24"},{"internalType":"Nonce","name":"currentNonce","type":"uint24"}],"name":"InvalidOffer","type":"error"},{"inputs":[{"internalType":"uint256","name":"line","type":"uint256"},{"internalType":"Token","name":"token","type":"address"}],"name":"InvalidToken","type":"error"},{"inputs":[{"internalType":"uint256","name":"line","type":"uint256"},{"internalType":"TokenId","name":"tokenId","type":"uint256"}],"name":"InvalidTokenId","type":"error"},{"inputs":[],"name":"NotOwner","type":"error"},{"inputs":[{"internalType":"uint256","name":"line","type":"uint256"},{"internalType":"Index","name":"index","type":"uint32"},{"internalType":"Unixtime","name":"expiry","type":"uint40"}],"name":"OfferExpired","type":"error"},{"inputs":[],"name":"Owner","type":"error"},{"inputs":[],"name":"PricesMustBeSortedWithNoDuplicates","type":"error"},{"inputs":[],"name":"TokenIdsMustBeSortedWithNoDuplicates","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"ethers","type":"uint256"},{"indexed":false,"internalType":"Unixtime","name":"timestamp","type":"uint40"}],"name":"InternalTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"Index","name":"index","type":"uint32"},{"indexed":true,"internalType":"Token","name":"token","type":"address"},{"indexed":false,"internalType":"enum TokenType","name":"tokenType","type":"uint8"},{"indexed":true,"internalType":"Account","name":"maker","type":"address"},{"indexed":false,"internalType":"enum BuySell","name":"buySell","type":"uint8"},{"indexed":false,"internalType":"Unixtime","name":"expiry","type":"uint40"},{"indexed":false,"internalType":"Nonce","name":"nonce","type":"uint24"},{"indexed":false,"internalType":"Price[]","name":"prices","type":"uint128[]"},{"indexed":false,"internalType":"TokenId[]","name":"tokenIds","type":"uint256[]"},{"indexed":false,"internalType":"Tokens[]","name":"tokenss","type":"uint128[]"},{"indexed":false,"internalType":"Unixtime","name":"timestamp","type":"uint40"}],"name":"OfferUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"Index","name":"index","type":"uint32"},{"indexed":true,"internalType":"Token","name":"token","type":"address"},{"indexed":false,"internalType":"enum TokenType","name":"tokenType","type":"uint8"},{"indexed":true,"internalType":"Account","name":"maker","type":"address"},{"indexed":false,"internalType":"enum BuySell","name":"buySell","type":"uint8"},{"indexed":false,"internalType":"Unixtime","name":"expiry","type":"uint40"},{"indexed":false,"internalType":"Nonce","name":"nonce","type":"uint24"},{"indexed":false,"internalType":"Price[]","name":"prices","type":"uint128[]"},{"indexed":false,"internalType":"TokenId[]","name":"tokenIds","type":"uint256[]"},{"indexed":false,"internalType":"Tokens[]","name":"tokenss","type":"uint128[]"},{"indexed":false,"internalType":"Unixtime","name":"timestamp","type":"uint40"}],"name":"Offered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"Nonce","name":"newNonce","type":"uint24"},{"indexed":false,"internalType":"Unixtime","name":"timestamp","type":"uint40"}],"name":"OffersInvalidated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"Index","name":"index","type":"uint32"},{"indexed":true,"internalType":"Token","name":"token","type":"address"},{"indexed":false,"internalType":"enum TokenType","name":"tokenType","type":"uint8"},{"indexed":true,"internalType":"Account","name":"maker","type":"address"},{"indexed":true,"internalType":"Account","name":"taker","type":"address"},{"indexed":false,"internalType":"enum BuySell","name":"makerBuySell","type":"uint8"},{"indexed":false,"internalType":"uint256[]","name":"prices","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"tokenss","type":"uint256[]"},{"indexed":false,"internalType":"Tokens[]","name":"remainingTokenss","type":"uint128[]"},{"indexed":false,"internalType":"Price","name":"price","type":"uint128"},{"indexed":false,"internalType":"Unixtime","name":"timestamp","type":"uint40"}],"name":"Traded","type":"event"},{"inputs":[{"components":[{"internalType":"Token","name":"token","type":"address"},{"internalType":"enum BuySell","name":"buySell","type":"uint8"},{"internalType":"Unixtime","name":"expiry","type":"uint40"},{"internalType":"Price[]","name":"prices","type":"uint128[]"},{"internalType":"TokenId[]","name":"tokenIds","type":"uint256[]"},{"internalType":"Tokens[]","name":"tokenss","type":"uint128[]"}],"internalType":"struct TokenAgent.AddOffer[]","name":"inputs","type":"tuple[]"}],"name":"addOffers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"from","type":"uint256"},{"internalType":"uint256","name":"to","type":"uint256"}],"name":"getOffersInfo","outputs":[{"components":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"Token","name":"token","type":"address"},{"internalType":"enum TokenType","name":"tokenType","type":"uint8"},{"internalType":"enum BuySell","name":"buySell","type":"uint8"},{"internalType":"Unixtime","name":"expiry","type":"uint40"},{"internalType":"Nonce","name":"nonce","type":"uint24"},{"internalType":"Price[]","name":"prices","type":"uint128[]"},{"internalType":"TokenId[]","name":"tokenIds","type":"uint256[]"},{"internalType":"Tokens[]","name":"tokenss","type":"uint128[]"}],"internalType":"struct TokenAgent.OfferInfo[]","name":"results","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract WETH","name":"_weth","type":"address"},{"internalType":"Account","name":"owner","type":"address"}],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"invalidateOffers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"nonce","outputs":[{"internalType":"Nonce","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"offers","outputs":[{"internalType":"Token","name":"token","type":"address"},{"internalType":"enum BuySell","name":"buySell","type":"uint8"},{"internalType":"Unixtime","name":"expiry","type":"uint40"},{"internalType":"Nonce","name":"nonce","type":"uint24"},{"internalType":"enum TokenIdType","name":"tokenIdType","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"Account","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC1155Partial","name":"token","type":"address"},{"internalType":"TokenId","name":"tokenId","type":"uint256"},{"internalType":"Tokens","name":"tokens","type":"uint128"}],"name":"recoverERC1155Token","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC721Partial","name":"token","type":"address"},{"internalType":"TokenId","name":"tokenId","type":"uint256"}],"name":"recoverERC721Token","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"Tokens","name":"tokens","type":"uint128"}],"name":"recoverTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"Index","name":"index","type":"uint32"},{"internalType":"Price","name":"price","type":"uint128"},{"internalType":"enum Execution","name":"execution","type":"uint8"},{"internalType":"TokenId[]","name":"tokenIds","type":"uint256[]"},{"internalType":"Tokens[]","name":"tokenss","type":"uint128[]"}],"internalType":"struct TokenAgent.TradeInput[]","name":"inputs","type":"tuple[]"},{"internalType":"enum PaymentType","name":"paymentType","type":"uint8"}],"name":"trade","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"Index","name":"index","type":"uint32"},{"internalType":"Unixtime","name":"expiry","type":"uint40"},{"internalType":"Price[]","name":"prices","type":"uint128[]"},{"internalType":"TokenId[]","name":"tokenIds","type":"uint256[]"},{"internalType":"Tokens[]","name":"tokenss","type":"uint128[]"}],"internalType":"struct TokenAgent.UpdateOffer[]","name":"inputs","type":"tuple[]"}],"name":"updateOffers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"weth","outputs":[{"internalType":"contract WETH","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}],
    },
    weth: {
      name: "WETH9",
      address: "0x07391dbE03e7a0DEa0fce6699500da081537B6c3",
      abi: [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"guy","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"guy","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
    },
    // transferHelper: {
    //   // TODO: ABI & versions
    //   name: "MagicalInternetMoney-0.8.3",
    //   address: "0xAd4EFaB0A1c32184c6254e07eb6D26A3AaEB0Ae2",
    // },
    explorer: "https://sepolia.etherscan.io/",
    nonFungibleViewer: "https://testnets.opensea.io/assets/sepolia/${contract}/${tokenId}",
    erc20Logos: [
        "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/sepolia/assets/${contract}/logo.png",
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/sepolia/assets/${contract}/logo.png",
    ],
    tokens: [
      { address: "0x7439E9Bb6D8a84dd3A23fe621A30F95403F87fB9", symbol: "WEENUS", name: "Weenus 💪", decimals: 18, type: 20, drip: "1000" },
      { address: "0xc21d97673B9E0B3AA53a06439F71fDc1facE393B", symbol: "XEENUS", name: "Xeenus 💪", decimals: 18, type: 20, drip: "1000" },
      { address: "0x93fCA4c6E2525C09c95269055B46f16b1459BF9d", symbol: "YEENUS", name: "Yeenus 💪", decimals: 8, type: 20, drip: "1000" },
      { address: "0xe9EF74A6568E9f0e42a587C9363C9BcC582dcC6c", symbol: "ZEENUS", name: "Zeenus 💪", decimals: 0, type: 20, drip: "1000" },
      { address: "0x8b73448426797099b6b9a96c4343f528bbAfc55e", symbol: "TESTTOADZ", name: "TestToadz", type: 721, drip: "3" },
    ],
    reservoir: "https://api-sepolia.reservoir.tools/",
  },
  // 17000: {
  //   name: "Holešky Testnet",
  //   explorer: "https://holesky.etherscan.io/",
  // },
  // 421614: {
  //   name: "Arbitrum Sepolia Testnet",
  //   explorer: "https://sepolia.arbiscan.io/",
  //   nonFungibleViewer: "https://testnets.opensea.io/assets/arbitrum-sepolia/${contract}/${tokenId}",
  // },
  // 84532: {
  //   name: "Base Sepolia Testnet",
  //   explorer: "https://sepolia.basescan.org/",
  //   nonFungibleViewer: "https://testnets.opensea.io/assets/base-sepolia/${contract}/${tokenId}",
  //   reservoir: "https://api-base-sepolia.reservoir.tools/",
  // },
  // 11155420: {
  //   name: "Optimism Sepolia Testnet",
  //   explorer: "https://sepolia-optimism.etherscan.io/",
  // },
};
