const EVENTTYPE_TRANSFER = 0;          // ERC-20/721 - NewTokenAgent
const EVENTTYPE_DEPOSIT = 1;           // WETH
const EVENTTYPE_WITHDRAWAL = 2;        // WETH
const EVENTTYPE_APPROVAL = 3;          // ERC-20
const EVENTTYPE_APPROVALFORALL = 4;    // ERC-721
const EVENTTYPE_NEWTOKENAGENT = 5;     // TokenAgentFactory - NewTokenAgent
const EVENTTYPE_INTERNALTRANSFER = 6;  // TokenAgent - InternalTransfer
const EVENTTYPE_OFFERED = 7;           // TokenAgent - Offered
const EVENTTYPE_OFFERUPDATED = 8;      // TokenAgent - Offered
const EVENTTYPE_OFFERSINVALIDATED = 9; // TokenAgent - OffersInvalidated
const EVENTTYPE_TRADED = 10;           // TokenAgent - Traded

function parseTokenEventLogs(logs, chainId) {
  // console.log(now() + " INFO functions:parseTokenEventLogs - logs: " + JSON.stringify(logs, null, 2));
  const erc20Interface = new ethers.utils.Interface(ERC20ABI);
  const erc721Interface = new ethers.utils.Interface(ERC721ABI);
  const records = [];
  for (const log of logs) {
    if (!log.removed) {
      // const contract = log.address;
      let eventRecord = null;
      if (log.topics[0] == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
        // ERC-20 event Transfer(address indexed from, address indexed to, uint tokens);
        // ERC-721 TODO
        const logData = erc20Interface.parseLog(log);
        const [from, to, tokens] = logData.args;
        eventRecord = { eventType: EVENTTYPE_TRANSFER, from, to, tokens: tokens.toString() /*, contractType: 20*/ };

      } else if (log.topics[0] == "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c") {
        // WETH Deposit (index_topic_1 address dst, uint256 wad)
        const to = ethers.utils.getAddress('0x' + log.topics[1].substring(26));
        tokens = ethers.BigNumber.from(log.data).toString();
        eventRecord = { eventType: EVENTTYPE_DEPOSIT, from: ADDRESS0, to, tokens /*, contractType: 20*/ };

      } else if (log.topics[0] == "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65") {
        // WETH Withdrawal (index_topic_1 address src, uint256 wad)
        const from = ethers.utils.getAddress('0x' + log.topics[1].substring(26));
        tokens = ethers.BigNumber.from(log.data).toString();
        eventRecord = { eventType: EVENTTYPE_WITHDRAWAL, from, to: ADDRESS0, tokens /*, contractType: 20*/ };

      } else if (log.topics[0] == "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925") {
        // ERC-20 event Approval(address indexed owner, address indexed spender, uint tokens);
        // ERC-721 Approval (address indexed owner, address indexed approved, uint256 indexed tokenId)
        if (log.topics.length == 4) {
          const logData = erc721Interface.parseLog(log);
          const [owner, approved, tokenId] = logData.args;
          eventRecord = { eventType: EVENTTYPE_APPROVAL, owner, approved, tokenId: tokenId.toString() /*, contractType: 721*/ };
        } else {
          const logData = erc20Interface.parseLog(log);
          const [owner, spender, tokens] = logData.args;
          eventRecord = { eventType: EVENTTYPE_APPROVAL, owner, spender, tokens: tokens.toString() /*, contractType: 20*/ };
        }
      } else if (log.topics[0] == "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31") {
        // ERC-721 event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
        // ERC-1155 event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
        const logData = erc721Interface.parseLog(log);
        const [owner, operator, approved] = logData.args;
        // NOTE: Both 721 and 1155 fall into this category, but assigning all to 721
        eventRecord = { eventType: EVENTTYPE_APPROVALFORALL, owner, operator, approved /*, contractType: 721*/ };
      } else {
        console.log(now() + " INFO functions:parseTokenEventLogs - UNHANDLED log: " + JSON.stringify(log));
      }
      if (eventRecord) {
        records.push( {
          chainId,
          blockNumber: parseInt(log.blockNumber),
          logIndex: parseInt(log.logIndex),
          txIndex: parseInt(log.transactionIndex),
          txHash: log.transactionHash,
          contract: log.address,
          ...eventRecord,
        });
      }
    }
  }
  // console.log(now() + " INFO functions:parseTokenEventLogs - records: " + JSON.stringify(records, null, 2));
  return records;
}

function parseTokenEventLogsOld(logs, chainId, latestBlockNumber) {
  // console.log(now() + " INFO functions:parseTokenEventLogsOld - logs: " + JSON.stringify(logs, null, 2));
  const erc20Interface = new ethers.utils.Interface(ERC20ABI);
  const erc721Interface = new ethers.utils.Interface(ERC721ABI);
  const records = [];
  for (const log of logs) {
    if (!log.removed) {
      // const contract = log.address;
      let eventRecord = null;
      if (log.topics[0] == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
        // ERC-20 event Transfer(address indexed from, address indexed to, uint tokens);
        // ERC-721 TODO
        const logData = erc20Interface.parseLog(log);
        const [from, to, tokens] = logData.args;
        eventRecord = { eventType: "Transfer", from, to, tokens: tokens.toString() /*, contractType: 20*/ };

      } else if (log.topics[0] == "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c") {
        // WETH Deposit (index_topic_1 address dst, uint256 wad)
        const to = ethers.utils.getAddress('0x' + log.topics[1].substring(26));
        tokens = ethers.BigNumber.from(log.data).toString();
        eventRecord = { eventType: "Deposit", from: ADDRESS0, to, tokens /*, contractType: 20*/ };

      } else if (log.topics[0] == "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65") {
        // WETH Withdrawal (index_topic_1 address src, uint256 wad)
        const from = ethers.utils.getAddress('0x' + log.topics[1].substring(26));
        tokens = ethers.BigNumber.from(log.data).toString();
        eventRecord = { eventType: "Withdrawal", from, to: ADDRESS0, tokens /*, contractType: 20*/ };

      } else if (log.topics[0] == "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925") {
        // ERC-20 event Approval(address indexed owner, address indexed spender, uint tokens);
        // ERC-721 Approval (address indexed owner, address indexed approved, uint256 indexed tokenId)
        if (log.topics.length == 4) {
          const logData = erc721Interface.parseLog(log);
          const [owner, approved, tokenId] = logData.args;
          eventRecord = { eventType: "Approval", owner, approved, tokenId: tokenId.toString() /*, contractType: 721*/ };
        } else {
          const logData = erc20Interface.parseLog(log);
          const [owner, spender, tokens] = logData.args;
          eventRecord = { eventType: "Approval", owner, spender, tokens: tokens.toString() /*, contractType: 20*/ };
        }
      } else if (log.topics[0] == "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31") {
        // ERC-721 event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
        // ERC-1155 event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
        const logData = erc721Interface.parseLog(log);
        const [owner, operator, approved] = logData.args;
        // NOTE: Both 721 and 1155 fall into this category, but assigning all to 721
        eventRecord = { eventType: "ApprovalForAll", owner, operator, approved /*, contractType: 721*/ };
      } else {
        console.log(now() + " INFO functions:parseTokenEventLogsOld - UNHANDLED log: " + JSON.stringify(log));
      }
      if (eventRecord) {
        records.push( {
          chainId,
          blockNumber: parseInt(log.blockNumber),
          logIndex: parseInt(log.logIndex),
          txIndex: parseInt(log.transactionIndex),
          txHash: log.transactionHash,
          contract: log.address,
          ...eventRecord,
          confirmations: latestBlockNumber - log.blockNumber,
        });
      }
    }
  }
  // console.log(now() + " INFO functions:parseTokenEventLogsOld - records: " + JSON.stringify(records, null, 2));
  return records;
}

// TokenAgentFactory
// event NewTokenAgent(TokenAgent indexed tokenAgent, Account indexed owner, Index indexed index, Index indexByOwner, Unixtime timestamp);
function parseTokenAgentFactoryEventLogs(logs, chainId, tokenAgentFactoryAddress, tokenAgentFactoryAbi) {
  // console.log(now() + " INFO functions:parseTokenAgentFactoryEventLogs - logs: " + JSON.stringify(logs, null, 2));
  const interface = new ethers.utils.Interface(tokenAgentFactoryAbi);
  const records = [];
  for (const log of logs) {
    if (!log.removed) {
      const logData = interface.parseLog(log);
      const contract = log.address;
      let eventRecord = null;
      if (logData.eventFragment.name == "NewTokenAgent") {
        // event NewTokenAgent(TokenAgent indexed tokenAgent, Account indexed owner, Index indexed index, Unixtime timestamp);
        const [tokenAgent, owner, index, timestamp] = logData.args;
        eventRecord = { eventType: EVENTTYPE_NEWTOKENAGENT, tokenAgent, owner, index, timestamp };
      } else {
        console.log(now() + " INFO functions:parseTokenAgentFactoryEventLogs - UNHANDLED log: " + JSON.stringify(log));
      }
      if (eventRecord) {
        records.push( {
          chainId,
          blockNumber: parseInt(log.blockNumber),
          logIndex: parseInt(log.logIndex),
          txIndex: parseInt(log.transactionIndex),
          txHash: log.transactionHash,
          contract,
          ...eventRecord,
        });
      }
    }
  }
  // console.log(now() + " INFO functions:parseTokenAgentFactoryEventLogs - records: " + JSON.stringify(records, null, 2));
  return records;
}
function parseTokenAgentFactoryEventLogsOld(logs, chainId, tokenAgentFactoryAddress, tokenAgentFactoryAbi, latestBlockNumber) {
  // console.log(now() + " INFO functions:parseTokenAgentFactoryEventLogsOld - logs: " + JSON.stringify(logs, null, 2));
  const interface = new ethers.utils.Interface(tokenAgentFactoryAbi);
  const records = [];
  for (const log of logs) {
    if (!log.removed) {
      const logData = interface.parseLog(log);
      const contract = log.address;
      let eventRecord = null;
      if (logData.eventFragment.name == "NewTokenAgent") {
        // event NewTokenAgent(TokenAgent indexed tokenAgent, Account indexed owner, Index indexed index, Unixtime timestamp);
        const [tokenAgent, owner, index, timestamp] = logData.args;
        eventRecord = { eventType: EVENTTYPE_NEWTOKENAGENT, tokenAgent, owner, index, timestamp };
      } else {
        console.log(now() + " INFO functions:parseTokenAgentFactoryEventLogsOld - UNHANDLED log: " + JSON.stringify(log));
      }
      if (eventRecord) {
        records.push( {
          chainId,
          blockNumber: parseInt(log.blockNumber),
          logIndex: parseInt(log.logIndex),
          txIndex: parseInt(log.transactionIndex),
          txHash: log.transactionHash,
          contract,
          ...eventRecord,
          confirmations: latestBlockNumber - log.blockNumber,
        });
      }
    }
  }
  // console.log(now() + " INFO functions:parseTokenAgentFactoryEventLogsOld - records: " + JSON.stringify(records, null, 2));
  return records;
}

// TokenAgent
// type Account is address;  // 2^160
// type Index is uint32;     // 2^32  = 4,294,967,296
// type Nonce is uint24;     // 2^24  = 16,777,216
// type Price is uint128;    // 2^128 = 340, 282,366,920,938,463,463, 374,607,431,768,211,456
// type Token is address;    // 2^160
// type TokenId is uint;     // 2^256 = 115,792, 089,237,316,195,423,570, 985,008,687,907,853,269, 984,665,640,564,039,457, 584,007,913,129,639,936
// type TokenId16 is uint16; // 2^16 = 65,536
// type Tokens is uint128;   // 2^128 = 340, 282,366,920,938,463,463, 374,607,431,768,211,456
// type Unixtime is uint40;  // 2^40  = 1,099,511,627,776. For Unixtime, 1,099,511,627,776 seconds = 34865.285000507356672 years
// enum BuySell { BUY, SELL }
// enum Execution { FILL, FILLORKILL }
// enum TokenIdType { TOKENID256, TOKENID16 }
// enum PaymentType { WETH, ETH }
// enum TokenType { UNKNOWN, ERC20, ERC721, ERC1155, INVALID }
// event InternalTransfer(address indexed from, address indexed to, uint ethers, Unixtime timestamp);
// event Offered(Index index, Token indexed token, TokenType tokenType, Account indexed maker, BuySell buySell, Unixtime expiry, Nonce nonce, Price[] prices, TokenId[] tokenIds, Tokens[] tokenss, Unixtime timestamp);
// event OfferUpdated(Index index, Token indexed token, TokenType tokenType, Account indexed maker, BuySell buySell, Unixtime expiry, Nonce nonce, Price[] prices, TokenId[] tokenIds, Tokens[] tokenss, Unixtime timestamp);
// event OffersInvalidated(Nonce newNonce, Unixtime timestamp);
// event Traded(Index index, Token indexed token, TokenType tokenType, Account indexed maker, Account indexed taker, BuySell makerBuySell, uint[] prices, uint[] tokenIds, uint[] tokenss, Tokens[] remainingTokenss, Price price, Unixtime timestamp);

function parseTokenAgentEventLogs(logs, chainId, tokenAgentAbi) {
  // console.log(now() + " INFO functions:parseTokenAgentEventLogs - logs: " + JSON.stringify(logs, null, 2));
  const interface = new ethers.utils.Interface(tokenAgentAbi);
  const records = [];
  for (const log of logs) {
    if (!log.removed) {
      const logData = interface.parseLog(log);
      const contract = log.address;
      let eventRecord = null;
      if (logData.eventFragment.name == "Offered") {
        // event Offered(Index index, Token indexed token, TokenType tokenType, Account indexed maker, BuySell buySell, Unixtime expiry, Nonce nonce, Price[] prices, TokenId[] tokenIds, Tokens[] tokenss, Unixtime timestamp);
        const [index, token, tokenType, maker, buySell, expiry, nonce, prices, tokenIds, tokenss, timestamp] = logData.args;
        eventRecord = {
          eventType: EVENTTYPE_OFFERED, index, token, tokenType, maker, buySell, expiry, nonce,
          prices: prices.map(e => ethers.BigNumber.from(e).toString()),
          tokenIds: tokenIds.map(e => ethers.BigNumber.from(e).toString()),
          tokenss: tokenss.map(e => ethers.BigNumber.from(e).toString()),
          timestamp,
        };
      } else if (logData.eventFragment.name == "Traded") {
        // event Traded(Index index, Token indexed token, TokenType tokenType, Account indexed maker, Account indexed taker, BuySell makerBuySell, uint[] prices, uint[] tokenIds, uint[] tokenss, Tokens[] remainingTokenss, Price price, Unixtime timestamp);
        const [index, token, tokenType, maker, taker, makerBuySell, prices, tokenIds, tokenss, remainingTokenss, price, timestamp] = logData.args;
        eventRecord = {
          eventType: EVENTTYPE_TRADED, index, token, tokenType, maker, taker, makerBuySell,
          prices: prices.map(e => ethers.BigNumber.from(e).toString()),
          tokenIds: tokenIds.map(e => ethers.BigNumber.from(e).toString()),
          tokenss: tokenss.map(e => ethers.BigNumber.from(e).toString()),
          remainingTokenss: remainingTokenss.map(e => ethers.BigNumber.from(e).toString()),
          price: price.toString(),
          timestamp,
        };

      } else if (logData.eventFragment.name == "InternalTransfer") {
        // event InternalTransfer(address indexed from, address indexed to, uint ethers, Unixtime timestamp);
        const [from, to, ethers, timestamp] = logData.args;
        eventRecord = { eventType: EVENTTYPE_INTERNALTRANSFER, from, to, ethers: ethers.toString(), timestamp };
      } else if (logData.eventFragment.name == "OffersInvalidated") {
        // event OffersInvalidated(Nonce newNonce, Unixtime timestamp);
        const [newNonce, timestamp] = logData.args;
        eventRecord = { eventType: EVENTTYPE_OFFERSINVALIDATED, newNonce, timestamp };
      } else {
        console.log(now() + " INFO functions:parseTokenAgentEventLogs - UNHANDLED log: " + JSON.stringify(log));
      }
      if (eventRecord) {
        records.push( {
          chainId,
          blockNumber: parseInt(log.blockNumber),
          logIndex: parseInt(log.logIndex),
          txIndex: parseInt(log.transactionIndex),
          txHash: log.transactionHash,
          contract,
          ...eventRecord,
        });
      }
    }
  }
  // console.log(now() + " INFO functions:parseTokenAgentEventLogs - records: " + JSON.stringify(records, null, 2));
  return records;
}

// TODO: Delete below
function parseTokenAgentEventLogsOld(logs, chainId, tokenAgentAddress, tokenAgentAbi, latestBlockNumber) {
  // console.log(now() + " INFO functions:parseTokenAgentEventLogsOld - logs: " + JSON.stringify(logs, null, 2));
  const interface = new ethers.utils.Interface(tokenAgentAbi);
  const records = [];
  for (const log of logs) {
    if (!log.removed) {
      const logData = interface.parseLog(log);
      const contract = log.address;
      let eventRecord = null;
      if (logData.eventFragment.name == "Offered") {
        // event Offered(Index index, Token indexed token, TokenType tokenType, Account indexed maker, BuySell buySell, Unixtime expiry, Nonce nonce, Price[] prices, TokenId[] tokenIds, Tokens[] tokenss, Unixtime timestamp);
        const [index, token, tokenType, maker, buySell, expiry, nonce, prices, tokenIds, tokenss, timestamp] = logData.args;
        eventRecord = {
          eventType: "Offered", index, token, tokenType, maker, buySell, expiry, nonce,
          prices: prices.map(e => ethers.BigNumber.from(e).toString()),
          tokenIds: tokenIds.map(e => ethers.BigNumber.from(e).toString()),
          tokenss: tokenss.map(e => ethers.BigNumber.from(e).toString()),
          timestamp,
        };
      } else if (logData.eventFragment.name == "Traded") {
        // event Traded(Index index, Token indexed token, TokenType tokenType, Account indexed maker, Account indexed taker, BuySell makerBuySell, uint[] prices, uint[] tokenIds, uint[] tokenss, Tokens[] remainingTokenss, Price price, Unixtime timestamp);
        const [index, token, tokenType, maker, taker, makerBuySell, prices, tokenIds, tokenss, remainingTokenss, price, timestamp] = logData.args;
        eventRecord = {
          eventType: "Traded", index, token, tokenType, maker, taker, makerBuySell,
          prices: prices.map(e => ethers.BigNumber.from(e).toString()),
          tokenIds: tokenIds.map(e => ethers.BigNumber.from(e).toString()),
          tokenss: tokenss.map(e => ethers.BigNumber.from(e).toString()),
          remainingTokenss: remainingTokenss.map(e => ethers.BigNumber.from(e).toString()),
          price: price.toString(),
          timestamp,
        };

      } else if (logData.eventFragment.name == "InternalTransfer") {
        // event InternalTransfer(address indexed from, address indexed to, uint ethers, Unixtime timestamp);
        const [from, to, ethers, timestamp] = logData.args;
        eventRecord = { eventType: "InternalTransfer", from, to, ethers: ethers.toString(), timestamp };
      } else if (logData.eventFragment.name == "OffersInvalidated") {
        // event OffersInvalidated(Nonce newNonce, Unixtime timestamp);
        const [newNonce, timestamp] = logData.args;
        eventRecord = { eventType: "OffersInvalidated", newNonce, timestamp };
      } else {
        console.log(now() + " INFO functions:parseTokenAgentEventLogsOld - UNHANDLED log: " + JSON.stringify(log));
      }
      if (eventRecord) {
        records.push( {
          chainId,
          blockNumber: parseInt(log.blockNumber),
          logIndex: parseInt(log.logIndex),
          txIndex: parseInt(log.transactionIndex),
          txHash: log.transactionHash,
          contract,
          ...eventRecord,
          confirmations: latestBlockNumber - log.blockNumber,
        });
      }
    }
  }
  // console.log(now() + " INFO functions:parseTokenAgentEventLogsOld - records: " + JSON.stringify(records, null, 2));
  return records;
}
