const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const DEBUGSETUPEVENTS = false;

const ADDRESS0 = "0x0000000000000000000000000000000000000000";

const GASPRICE = ethers.parseUnits("1", "gwei");
const ETHUSD = 2500.0;

const BUY = 0;
const SELL = 1;

const ERC20 = 0;
const ERC721 = 1;
const ERC1155 = 2;

const FILL = 0;
const FILLORKILL = 1;

const PAYMENTTYPE_WETH = 0;
const PAYMENTTYPE_ETH = 1;

// const DATE_FORMAT_OPTIONS = {
//   year: "numeric",
//   month: "numeric",
//   day: "numeric",
//   hour: "numeric",
//   minute: "numeric",
//   second: "numeric",
//   hour12: false,
//   timeZone: "utc",
// };

describe("TokenAgentFactory", function () {

  function padLeft(s, n) {
    var o = s.toString();
    while (o.length < n) {
      o = " " + o;
    }
    return o;
  }
  function padRight(s, n) {
    var o = s;
    while (o.length < n) {
      o = o + " ";
    }
    return o;
  }
  function formatNumber(e) {
    return e != null ? e.toString().replace(/(?<!(\.\d*|^.{0}))(?=(\d{3})+(?!\d))/g, ',') : null;
  }
  function printLogs(d, label, txReceipt) {
    const tokenAgentAdresses = {};
    for (let i = 0; i < 4; i++) {
      tokenAgentAdresses[d.tokenAgents[i].target] = i;
    }
    const fee = BigInt(txReceipt.gasUsed) * GASPRICE;
    const feeUsd = parseFloat(ethers.formatEther(fee)) * ETHUSD;
    console.log("        * " + label + " - gasUsed: " + formatNumber(txReceipt.gasUsed) + " " + ethers.formatEther(fee) + "Ξ " + feeUsd.toFixed(2) + " USD @ " + ethers.formatUnits(GASPRICE, "gwei") + " gwei " + ETHUSD.toFixed(2) + " ETH/USD");
    txReceipt.logs.forEach((event) => {
      if (event.address in tokenAgentAdresses) {
        const log = d.tokenAgents[1].interface.parseLog(event);
        if (log.name == "Offered") {
          console.log("          + tokenAgents[" + tokenAgentAdresses[event.address] + "]." + log.name + '(index:' + parseInt(log.args[0]) +
            ', token: ' + log.args[1].substring(0, 10) +
            ', tokenType: ' + (log.args[2] == 1 ? '20' : (log.args[2] == 2 ? '721' : '1155')) +
            ', maker: ' + log.args[3].substring(0, 10) +
            ', buySell: ' + (log.args[4] ? 'SELL' : 'BUY') +
            ', expiry: ' + new Date(parseInt(log.args[5]) * 1000).toLocaleTimeString() +
            ', nonce: ' + log.args[6] +
            ', prices: ' + JSON.stringify(log.args[7].map(e => parseFloat(ethers.formatEther(e)))) +
            ', tokenIds: ' + JSON.stringify(log.args[8].map(e => parseInt(e.toString()))) +
            ', tokenss: ' + JSON.stringify(log.args[9].map(e => (log.args[2] == 1 ? parseFloat(ethers.formatEther(e)) : parseInt(e.toString())))) +
            ', timestamp: ' + new Date(parseInt(log.args[10]) * 1000).toLocaleTimeString() +
            ')');
        // } else if (log.name == "OfferTaken") {
        //   console.log("          + tokenAgents[" + tokenAgentAdresses[event.address] + "]." + log.name + '(index:' + parseInt(log.args[0]) +
        //     ', token: ' + log.args[1].substring(0, 10) +
        //     ', tokenType: ' + (log.args[2] == 1 ? '20' : (log.args[2] == 2 ? '721' : '1155')) +
        //     ', maker: ' + log.args[3].substring(0, 10) +
        //     // ', buySell: ' + (log.args[4] ? 'SELL' : 'BUY') +
        //     // ', expiry: ' + new Date(parseInt(log.args[5]) * 1000).toLocaleTimeString() +
        //     // ', count: ' + log.args[6] + ', nonce: ' + log.args[7] +
        //     // ', prices: ' + JSON.stringify(log.args[8].map(e => parseFloat(ethers.formatEther(e)))) +
        //     // ', tokenIds: ' + JSON.stringify(log.args[9].map(e => parseInt(e.toString()))) +
        //     ', tokenss: ' + JSON.stringify(log.args[4].map(e => (log.args[2] == 1 ? parseFloat(ethers.formatEther(e)) : parseInt(e.toString())))) +
        //     ', timestamp: ' + new Date(parseInt(log.args[5]) * 1000).toLocaleTimeString() +
        //     ')');
        } else if (log.name == "Traded") {
          console.log("          + tokenAgents[" + tokenAgentAdresses[event.address] + "]." + log.name + '(index:' + parseInt(log.args[0]) +
            ', token: ' + log.args[1].substring(0, 10) +
            ', tokenType: ' + (log.args[2] == 1 ? '20' : (log.args[2] == 2 ? '721' : '1155')) +
            ', maker: ' + log.args[3].substring(0, 10) +
            ', taker: ' + log.args[4].substring(0, 10) +
            ', makerBuySell: ' + (log.args[5] ? 'SELL' : 'BUY') +
            ', prices: ' + JSON.stringify(log.args[6].map(e => parseFloat(ethers.formatEther(e)))) +
            ', tokenIds: ' + JSON.stringify(log.args[7].map(e => parseInt(e.toString()))) +
            ', tokenss: ' + JSON.stringify(log.args[8].map(e => (log.args[2] == 1 ? parseFloat(ethers.formatEther(e)) : parseInt(e.toString())))) +
            ', remainingTokenss: ' + JSON.stringify(log.args[9].map(e => (log.args[2] == 1 ? parseFloat(ethers.formatEther(e)) : parseInt(e.toString())))) +
            // ', tokenss: ' + JSON.stringify(log.args[8].map(e => parseInt(e.toString()))) +
            ', price: ' + ethers.formatEther(log.args[10]) +
            ', timestamp: ' + new Date(parseInt(log.args[11]) * 1000).toLocaleTimeString() + ')');
        } else if (log.name == "InternalTransfer") {
          console.log("          + tokenAgents[" + tokenAgentAdresses[event.address] + "]." + log.name + '(from: ' + log.args[0].substring(0, 10) + ', to: ' + log.args[1].substring(0, 10) + ', ethers: ' + ethers.formatEther(log.args[2]) + ', timestamp: ' + new Date(parseInt(log.args[3]) * 1000).toLocaleTimeString() + ')');
        } else {
          console.log("          + tokenAgents[" + tokenAgentAdresses[event.address] + "]." + log.name + '(' + log.args.join(', ') + ')');
        }
      } else if (event.address == d.weth.target) {
        const log = d.weth.interface.parseLog(event);
        if (log.name == "Transfer") {
          console.log("          + weth." + log.name + '(src: ' + log.args[0].substring(0, 10) + ', guy: ' + log.args[1].substring(0, 10) + ', wad: ' + ethers.formatEther(log.args[2]) + ')');
        } else if (log.name == "Deposit") {
          console.log("          + weth." + log.name + '(dst: ' + log.args[0].substring(0, 10) + ', wad: ' + ethers.formatEther(log.args[1]) + ')');
        } else if (log.name == "Withdrawal") {
          console.log("          + weth." + log.name + '(src: ' + log.args[0].substring(0, 10) + ', wad: ' + ethers.formatEther(log.args[1]) + ')');
        } else {
          console.log("          + weth." + log.name + '(' + log.args.join(", ") + ')');
        }
      } else if (event.address == d.erc20Token.target) {
        const log = d.erc20Token.interface.parseLog(event);
        console.log("          + erc20Token." + log.name + '(from: ' + log.args[0].substring(0, 10) + ', to: ' + log.args[1].substring(0, 10) + ', tokens: ' + ethers.formatEther(log.args[2]) + ')');
      } else if (event.address == d.erc721Token.target) {
        const log = d.erc721Token.interface.parseLog(event);
        console.log("          + erc721Token." + log.name + '(from: ' + log.args[0].substring(0, 10) + ', to: ' + log.args[1].substring(0, 10) + ', tokenId: ' + log.args[2] + ')');
      } else if (event.address == d.erc1155Token.target) {
        const log = d.erc1155Token.interface.parseLog(event);
        console.log("          + erc1155Token." + log.name + '(operator: ' + log.args[0].substring(0, 10) + ', from: ' + log.args[1].substring(0, 10) + ', to: ' + log.args[2].substring(0, 10) + ', tokenId: ' + log.args[3] + ', tokens: ' + log.args[4] + ')');
      } else {
        console.log("          + " + JSON.stringify(event));
      }
    });
  }
  async function printState(d) {
    console.log();
    console.log("            # Account                         ETH          WETH " + d.weth.target.substring(0, 10) + "        ERC-20 " + d.erc20Token.target.substring(0, 10) + "                 ERC-721 " + d.erc721Token.target.substring(0, 10) + "                ERC-1155 " + d.erc1155Token.target.substring(0, 10));
    console.log("          --- ---------- ------------------------ ------------------------ ------------------------ ---------------------------------- ----------------------------------");
    const erc721Balances = {};
    for (let tokenId = 0; tokenId < 16; tokenId++) {
      const owner = await d.erc721Token.ownerOf(tokenId);
      if (!(owner in erc721Balances)) {
        erc721Balances[owner] = [];
      }
      erc721Balances[owner].push(tokenId);
    }

    const erc1155Balances = {};
    for (let tokenId = 0; tokenId < 4; tokenId++) {
      for (let i = 0; i < 4; i++) {
        const count = await d.erc1155Token.balanceOf(d.accounts[i].address, tokenId);
        if (!(d.accounts[i].address in erc1155Balances)) {
          erc1155Balances[d.accounts[i].address] = {};
        }
        if (!(tokenId in erc1155Balances[d.accounts[i].address])) {
          erc1155Balances[d.accounts[i].address][tokenId] = parseInt(count);
        }
      }
    }
    for (let i = 0; i < 4; i++) {
      const balance = await ethers.provider.getBalance(d.accounts[i].address);
      const wethBalance = await d.weth.balanceOf(d.accounts[i].address);
      const erc20Balance = await d.erc20Token.balanceOf(d.accounts[i].address);
      const erc721TokenIds = erc721Balances[d.accounts[i].address] || [];
      const erc1155TokenIds = erc1155Balances[d.accounts[i].address];
      const erc1155Info = [];
      for (const [tokenId, count] of Object.entries(erc1155TokenIds)) {
        erc1155Info.push(tokenId + ':' + count);
      }
      console.log("          " + padLeft(i, 3) + " " + d.accounts[i].address.substring(0, 10) + " " +
        padLeft(ethers.formatEther(balance), 24) + " " +
        padLeft(ethers.formatEther(wethBalance), 24) + " " +
        padLeft(ethers.formatEther(erc20Balance), 24) + " " +
        padLeft(erc721TokenIds.join(", "), 34) + " " +
        padLeft(erc1155Info.join(", "), 34)
      );
    }

    const offersInfo = await d.tokenAgents[1].getOffersInfo(0, 10);
    if (offersInfo.length > 0) {
      console.log();
      console.log("          tokenAgents[1] Offers");
      console.log("            # Token      Type B/S  Expiry       Nonce                         Prices                       TokenIds                        Tokenss");
      console.log("          --- ---------- ---- ---- ------------ ----- ------------------------------ ------------------------------ ------------------------------");
      for (let i = 0; i < offersInfo.length; i++) {
        const info = offersInfo[i];
        console.log("          " + padLeft(info[0], 3) + " " + info[1].substring(0, 10) + " " +
          padRight(info[2] == 1 ? '20' : (info[2] == 2 ? '721' : '1155'), 4) + " " +
          (info[3] ? 'SELL' : 'BUY ') + " " +
          padRight(new Date(parseInt(info[4]) * 1000).toLocaleTimeString(), 12) + " " +
          padLeft(info[5], 5) + " " +
          padLeft(info[6].map(e => parseFloat(ethers.formatEther(e)).toFixed(2)).join(", "), 30) + " " +
          padLeft(info[7].map(e => parseInt(e)).join(", "), 30) + " " +
          padLeft(info[8].map(e => (info[2] == 1 ? parseFloat(ethers.formatEther(e)).toFixed(2) : parseInt(e)) ).join(", "), 30)
        );
      }
    }

    console.log();
  }

  async function deployContracts() {
    const accounts = await ethers.getSigners();
    const WETH9 = await ethers.getContractFactory("WETH9");
    const weth = await WETH9.deploy();
    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    const erc20Token = await ERC20Token.deploy();
    const erc20TokenTxDeployment = await erc20Token.waitForDeployment();
    const erc20TokenTx = await erc20TokenTxDeployment.deploymentTransaction();
    const erc20TokenTxReceipt = await erc20TokenTx.wait();
    erc20TokenTxReceipt.logs.forEach((event) => {
      const log = erc20Token.interface.parseLog(event);
      DEBUGSETUPEVENTS && console.log("          + erc20Token." + log.name + '(from:' + log.args[0].substring(0, 10) + ', to:' + log.args[1].substring(0, 10) + ', tokens: ' + ethers.formatEther(log.args[2]) + ')');
    });

    const ERC721Token = await ethers.getContractFactory("ERC721Token");
    const erc721Token = await ERC721Token.deploy();
    const ERC1155Token = await ethers.getContractFactory("ERC1155Token");
    const erc1155Token = await ERC1155Token.deploy("https://blah.blah/blah/");

    const Demodex = await ethers.getContractFactory("Demodex");
    const demodex = await Demodex.deploy(weth);

    return;

    const TokenAgent = await ethers.getContractFactory("TokenAgent");
    const tokenAgentTemplate = await TokenAgent.deploy();
    const TokenAgentFactory = await ethers.getContractFactory("TokenAgentFactory");
    const tokenAgentFactory = await TokenAgentFactory.deploy();
    const tokenAgentFactoryTxDeployment = await tokenAgentFactory.waitForDeployment();
    const tokenAgentFactoryTx = await tokenAgentFactoryTxDeployment.deploymentTransaction();
    const tokenAgentFactoryTxReceipt = await tokenAgentFactoryTx.wait();
    const fee = BigInt(tokenAgentFactoryTxReceipt.gasUsed) * GASPRICE;
    const feeUsd = parseFloat(ethers.formatEther(fee)) * ETHUSD;
    console.log("        * accounts[0]->TokenAgentFactory.deploy() => " + tokenAgentFactory.target.substring(0, 10) + " - gasUsed: " + formatNumber(tokenAgentFactoryTxReceipt.gasUsed) + " " + ethers.formatEther(fee) + "Ξ " + feeUsd.toFixed(2) + " USD @ " + ethers.formatUnits(GASPRICE, "gwei") + " gwei " + ETHUSD.toFixed(2) + " ETH/USD");

    await tokenAgentFactory.init(weth, tokenAgentTemplate);

    const tokenAgents = [];
    for (let i = 0; i < 4; i++) {
      const newTokenAgentTx = await tokenAgentFactory.connect(accounts[i]).newTokenAgent();
      const newTokenAgentTxReceipt = await newTokenAgentTx.wait();
      const fee = BigInt(newTokenAgentTxReceipt.gasUsed) * GASPRICE;
      const feeUsd = parseFloat(ethers.formatEther(fee)) * ETHUSD;
      newTokenAgentTxReceipt.logs.forEach((event) => {
        const log = tokenAgentFactory.interface.parseLog(event);
        // console.log("          + tokenAgentFactory." + log.name + ' ' + JSON.stringify(log.args.map(e => e.toString())));
        DEBUGSETUPEVENTS && console.log("          + tokenAgentFactory." + log.name + '(tokenAgent: ' + log.args[0].substring(0, 12) + ', owner: ' + log.args[1].substring(0, 12) + ', index: ' + log.args[2] + ', indexByOwner: ' + log.args[3] + ', timestamp: ' + new Date(parseInt(log.args[4]) * 1000).toLocaleTimeString() + ')');
        console.log("        * accounts[" + i + "]->tokenAgentFactory.newTokenAgent() => " + log.args[0].substring(0, 10) + " - gasUsed: " + formatNumber(newTokenAgentTxReceipt.gasUsed) + " " + ethers.formatEther(fee) + "Ξ " + feeUsd.toFixed(2) + " USD @ " + ethers.formatUnits(GASPRICE, "gwei") + " gwei " + ETHUSD.toFixed(2) + " ETH/USD");
      });

      const tokenAgentByOwnerInfo = await tokenAgentFactory.getTokenAgentByOwnerInfo(accounts[i].address);
      console.log("        * tokenAgentByOwnerInfo: " + JSON.stringify(tokenAgentByOwnerInfo.map(e => e.toString())));
      const tokenAgentAddress = tokenAgentByOwnerInfo[1];
      const tokenAgent = TokenAgent.attach(tokenAgentAddress);
      tokenAgents.push(tokenAgent);
    }

    const tokenAgentsInfo = await tokenAgentFactory.getTokenAgentsInfo(0, 10);
    console.log("          Index tokenAgent Owner");
    console.log("          ----- ---------- ----------");
    for (let i = 0; i < tokenAgentsInfo.length; i++) {
      const info = tokenAgentsInfo[i];
      console.log("          " + padLeft(info[0], 5) + " " + info[1].substring(0, 10) + " " + info[2].substring(0, 10));
    }

    const amountWeth = ethers.parseUnits("100", 18);
    for (let i = 0; i < 4; i++) {
      const mintTx = await accounts[i].sendTransaction({ to: weth.target, value: amountWeth });
      const mintTxReceipt = await mintTx.wait();
      mintTxReceipt.logs.forEach((event) => {
        const log = weth.interface.parseLog(event);
        DEBUGSETUPEVENTS && console.log("          + weth." + log.name + '(dst:' + log.args[0].substring(0, 12) + ', wad: ' + ethers.formatEther(log.args[1]) + ')');
      });
    }

    const amountERC20 = ethers.parseUnits("1000", 18);
    for (let i = 1; i < 4; i++) {
      const transferTx = await erc20Token.transfer(accounts[i], amountERC20);
      const transferTxReceipt = await transferTx.wait();
      transferTxReceipt.logs.forEach((event) => {
        const log = weth.interface.parseLog(event);
        DEBUGSETUPEVENTS && console.log("          + erc20Token." + log.name + '(from:' + log.args[0].substring(0, 12) + ', to:' + log.args[1].substring(0, 12) + ', tokens: ' + ethers.formatEther(log.args[2]) + ')');
      });
    }
    const transfer1Tx = await erc20Token.transfer(ADDRESS0, ethers.parseUnits("996000", 18));
    const transfer1TxReceipt = await transfer1Tx.wait();
    transfer1TxReceipt.logs.forEach((event) => {
      const log = weth.interface.parseLog(event);
      DEBUGSETUPEVENTS && console.log("          + erc20Token." + log.name + '(from:' + log.args[0].substring(0, 12) + ', to:' + log.args[1].substring(0, 12) + ', tokens: ' + ethers.formatEther(log.args[2]) + ')');
    });

    const approveAmount = ethers.parseUnits("12.345", 18);
    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const approvalTx = await weth.connect(accounts[i]).approve(tokenAgents[j], approveAmount);
        const approvalTxReceipt = await approvalTx.wait();
        approvalTxReceipt.logs.forEach((event) => {
          const log = weth.interface.parseLog(event);
          DEBUGSETUPEVENTS && console.log("          + weth." + log.name + '(owner:' + log.args[0].substring(0, 12) + ', spender:' + log.args[1].substring(0, 12) + ', tokens: ' + ethers.formatEther(log.args[2]) + ')');
        });
      }
    }
    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const approvalTx = await erc20Token.connect(accounts[i]).approve(tokenAgents[j], approveAmount);
        const approvalTxReceipt = await approvalTx.wait();
        approvalTxReceipt.logs.forEach((event) => {
          const log = weth.interface.parseLog(event);
          DEBUGSETUPEVENTS && console.log("          + erc20Token." + log.name + '(owner:' + log.args[0].substring(0, 12) + ', spender:' + log.args[1].substring(0, 12) + ', tokens: ' + ethers.formatEther(log.args[2]) + ')');
        });
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const mintTx = await erc721Token.mint(accounts[i]);
        const mintTxReceipt = await mintTx.wait();
        mintTxReceipt.logs.forEach((event) => {
          const log = erc721Token.interface.parseLog(event);
          DEBUGSETUPEVENTS && console.log("          + erc721Token." + log.name + '(from:' + log.args[0].substring(0, 12) + ', to: ' + log.args[1].substring(0, 12) + ', tokenId: ' + log.args[2]);
        });
      }
    }

    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const setApprovalForAllTx = await erc721Token.connect(accounts[i]).setApprovalForAll(tokenAgents[j], true);
        const setApprovalForAllTxReceipt = await setApprovalForAllTx.wait();
        setApprovalForAllTxReceipt.logs.forEach((event) => {
          const log = erc721Token.interface.parseLog(event);
          DEBUGSETUPEVENTS && console.log("          + erc721Token." + log.name + '(owner:' + log.args[0].substring(0, 12) + ', operator: ' + log.args[1].substring(0, 12) + ', approved: ' + log.args[2]);
        });
      }
    }

    for (let tokenId = 0; tokenId < 4; tokenId++) {
        for (let i = 0; i < 4; i++) {
          const mintTx = await erc1155Token.mint(accounts[i], tokenId, 10 * (i + 1), "0x");
          const mintTxReceipt = await mintTx.wait();
          mintTxReceipt.logs.forEach((event) => {
            const log = erc1155Token.interface.parseLog(event);
            DEBUGSETUPEVENTS && console.log("          + erc1155Token." + log.name + '(operator:' + log.args[0].substring(0, 12) + ', from: ' + log.args[1].substring(0, 12) + ', to: ' + log.args[2].substring(0, 12) + ', id: ' + log.args[3] + ', amount: ' + log.args[4]);
          });
        }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const setApprovalForAllTx = await erc1155Token.connect(accounts[i]).setApprovalForAll(tokenAgents[j], true);
        const setApprovalForAllTxReceipt = await setApprovalForAllTx.wait();
        setApprovalForAllTxReceipt.logs.forEach((event) => {
          const log = erc1155Token.interface.parseLog(event);
          DEBUGSETUPEVENTS && console.log("          + erc1155Token." + log.name + '(owner:' + log.args[0].substring(0, 12) + ', operator: ' + log.args[1].substring(0, 12) + ', approved: ' + log.args[2]);
        });
      }
    }

    const now = parseInt(new Date().getTime()/1000);
    const expiry = parseInt(now) + 120;
    console.log("        * now: " + new Date(parseInt(now) * 1000).toLocaleTimeString() + ", expiry: " + new Date(parseInt(expiry) * 1000).toLocaleTimeString());

    return { tokenAgentFactory, tokenAgents, weth, erc20Token, erc721Token, erc1155Token, accounts, now, expiry };
  }

  describe("Demodex", function () {

    it.only("Test Demodex secondary functions", async function () {
      const d = await loadFixture(deployContracts);
      // await expect(d.tokenAgentFactory.newTokenAgent())
      //   .to.be.revertedWithCustomError(d.tokenAgentFactory, "AlreadyDeployed")
      //   .withArgs(anyValue);
      // expect(await d.tokenAgentFactory.tokenAgentsLength()).to.equal(4);
      // const getTokenAgentByOwnerInfo = await d.tokenAgentFactory.getTokenAgentByOwnerInfo(d.accounts[0].address);
      // const tokenAgentAddress = getTokenAgentByOwnerInfo[1];
      // const TokenAgent = await ethers.getContractFactory("TokenAgent");
      // const tokenAgent = TokenAgent.attach(tokenAgentAddress);
      // await expect(tokenAgent.connect(d.accounts[1]).init(d.weth, d.accounts[1]))
      //   .to.be.revertedWithCustomError(tokenAgent, "AlreadyInitialised");
      // expect(await tokenAgent.owner()).to.equal(d.accounts[0].address);
      // expect((await d.tokenAgentFactory.getTokenTypes([d.weth, d.erc20Token, d.erc721Token, d.erc1155Token, d.accounts[0]])).toString()).to.equal("1,1,2,3,4");
    });

    it("Test TokenAgent invalid offers", async function () {
      const d = await loadFixture(deployContracts);
      const tokenAgentByOwnerInfo = await d.tokenAgentFactory.getTokenAgentByOwnerInfo(d.accounts[0].address);
      const tokenAgentAddress = tokenAgentByOwnerInfo[1];
      const TokenAgent = await ethers.getContractFactory("TokenAgent");
      const tokenAgent = TokenAgent.attach(tokenAgentAddress);
      const invalidOffer1 = [[d.accounts[0].address, SELL, d.expiry, [888], [], ["999999999999999999999999999999999997"]]];
      await expect(tokenAgent.addOffers(invalidOffer1))
        .to.be.revertedWithCustomError(tokenAgent, "InvalidToken")
        .withArgs(0, d.accounts[0].address);
      const invalidOffer2 = [
        [d.weth.target, SELL, d.expiry, [888], [], ["999999999999999999999999999999999997"]],
      ];
      await expect(tokenAgent.addOffers(invalidOffer2))
        .to.be.revertedWithCustomError(tokenAgent, "CannotOfferWETH");
    });

    // TODO: Test TokenAgent error conditions

    it("Test TokenAgent ERC-20 offers and trades", async function () {
      const d = await loadFixture(deployContracts);
      await printState(d);
      const offers1 = [
        [
          d.erc20Token.target, BUY, d.expiry,
          [ethers.parseUnits("0.3", 18), ethers.parseUnits("0.2", 18), ethers.parseUnits("0.1", 18)],
          [],
          [ethers.parseUnits("1", 18), ethers.parseUnits("1", 18), ethers.parseUnits("0.1", 18)],
        ],
        [
          d.erc20Token.target, SELL, d.expiry,
          [ethers.parseUnits("0.1", 18), ethers.parseUnits("0.2", 18), ethers.parseUnits("0.3", 18)],
          [],
          [ethers.parseUnits("1", 18), ethers.parseUnits("1", 18), ethers.parseUnits("0.1", 18)],
        ],
      ];
      // console.log("        * offers1: " + JSON.stringify(offers1.map(e => e.toString())));
      console.log("        * offers1: " + JSON.stringify(offers1, (k, v) => typeof v === 'bigint' ? ethers.formatEther(v) : v));
      const addOffers1Tx = await d.tokenAgents[1].connect(d.accounts[1]).addOffers(offers1);

      const addOffers1TxReceipt = await addOffers1Tx.wait();
      const indices = [];
      addOffers1TxReceipt.logs.forEach((event) => {
        const log = d.tokenAgents[1].interface.parseLog(event);
        indices.push(parseInt(log.args[0]));
      });
      printLogs(d, "accounts[1]->tokenAgents[1].addOffers(offers1) => [" + indices.join(", ") + "]", addOffers1TxReceipt);
      await printState(d);

      if (true) {
        const trades1 = [
          [indices[0], ethers.parseUnits("0.295238095238095238", 18).toString(), FILLORKILL, [], [ethers.parseUnits("1.05", 18).toString()]],
          // [indices[1], ethers.parseUnits("0.104761904761904761", 18).toString(), FILLORKILL, [], [ethers.parseUnits("1.05", 18).toString()]],
        ];
        console.log("        * trades1: " + JSON.stringify(trades1));
        const trades1Tx = await d.tokenAgents[1].connect(d.accounts[2]).trade(trades1, PAYMENTTYPE_WETH, {value: ethers.parseEther("10.0")});
        const trades1TxReceipt = await trades1Tx.wait();
        printLogs(d, "accounts[2]->tokenAgents[1].trade(trades1, PAYMENTTYPE_WETH)", trades1TxReceipt);
        await printState(d);
      }
      if (false) {
        const trades2 = [
          [indices[0], ethers.parseUnits("0.209523809523809523", 18).toString(), FILLORKILL, [], [ethers.parseUnits("1.05", 18).toString()]],
        ];
        console.log("        * trades2: " + JSON.stringify(trades2));
        const trades2Tx = await d.tokenAgents[1].connect(d.accounts[2]).trade(trades2, PAYMENTTYPE_WETH);
        const trades2TxReceipt = await trades2Tx.wait();
        printLogs(d, "accounts[2]->tokenAgents[1].trade(trades2, PAYMENTTYPE_WETH)", trades2TxReceipt);
        await printState(d);
      }
    });

    it("Test TokenAgent ERC-721 offers and trades", async function () {
      const d = await loadFixture(deployContracts);
      await printState(d);
      const offers1 = [
        [
          d.erc721Token.target, BUY, d.expiry,
          [ethers.parseUnits("0.1", 18)],
          [],
          [14],
        ],
        [
          d.erc721Token.target, SELL, d.expiry,
          [ethers.parseUnits("0.1", 18)],
          [4, 5, 6, 7],
          // [4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
          [24],
        ],
        [
          d.erc721Token.target, SELL, d.expiry,
          [ethers.parseUnits("0.1", 18), ethers.parseUnits("0.2", 18), ethers.parseUnits("0.3", 18), ethers.parseUnits("0.4", 18)],
          [4, 5, 6, 7],
          [34],
        ],
      ];
      console.log("        * offers1: " + JSON.stringify(offers1.map(e => e.toString())));
      const addOffers1Tx = await d.tokenAgents[1].connect(d.accounts[1]).addOffers(offers1);
      const addOffers1TxReceipt = await addOffers1Tx.wait();
      const indices = [];
      addOffers1TxReceipt.logs.forEach((event) => {
        const log = d.tokenAgents[1].interface.parseLog(event);
        indices.push(parseInt(log.args[0]));
      });
      printLogs(d, "accounts[1]->tokenAgents[1].addOffers(offers1) => [" + indices.join(", ") + "]", addOffers1TxReceipt);
      await printState(d);

      if (true) {
        const trades1 = [
          // [indices[0], ethers.parseUnits("0.4", 18).toString(), FILLORKILL, [8, 9, 10, 11]],
          [indices[1], ethers.parseUnits("0.4", 18).toString(), FILLORKILL, [4, 5, 6, 7], []],
          // [indices[2], ethers.parseUnits("1", 18).toString(), FILLORKILL, [4, 5, 6, 7]],
        ];
        console.log("        * trades1: " + JSON.stringify(trades1));
        const trades1Tx = await d.tokenAgents[1].connect(d.accounts[2]).trade(trades1, PAYMENTTYPE_WETH, {value: ethers.parseEther("10.0")});
        const trades1TxReceipt = await trades1Tx.wait();
        printLogs(d, "accounts[2]->tokenAgents[1].trade(trades1, PAYMENTTYPE_WETH)", trades1TxReceipt);
        await printState(d);
      }
    });

    it("Test TokenAgent ERC-1155 offers and trades", async function () {
      const d = await loadFixture(deployContracts);
      await printState(d);
      const offers1 = [
        [
          d.erc1155Token.target, BUY, d.expiry,
          [ethers.parseUnits("0.1", 18)],
          [],
          [],
        ],
        [
          d.erc1155Token.target, SELL, d.expiry,
          [ethers.parseUnits("0.1", 18)],
          [0, 1, 2, 3],
          [5, 6, 7, 8],
        ],
        [
          d.erc1155Token.target, SELL, d.expiry,
          [ethers.parseUnits("0.1", 18), ethers.parseUnits("0.2", 18), ethers.parseUnits("0.3", 18), ethers.parseUnits("0.4", 18)],
          [0, 1, 2, 3],
          [10, 10, 10, 10],
        ],
      ];
      console.log("        * offers1: " + JSON.stringify(offers1.map(e => e.toString())));
      const addOffers1Tx = await d.tokenAgents[1].connect(d.accounts[1]).addOffers(offers1);
      const addOffers1TxReceipt = await addOffers1Tx.wait();
      const indices = [];
      addOffers1TxReceipt.logs.forEach((event) => {
        const log = d.tokenAgents[1].interface.parseLog(event);
        indices.push(parseInt(log.args[0]));
      });
      printLogs(d, "accounts[1]->tokenAgents[1].addOffers(offers1) => [" + indices.join(", ") + "]", addOffers1TxReceipt);
      await printState(d);

      if (true) {
        // TODO: Confirm check price
        const trades1 = [
          // [indices[0], ethers.parseUnits("0.157142857142857142", 18).toString(), FILLORKILL, [0, 9, 1, 10]],
          [indices[1], ethers.parseUnits("2.6", 18).toString(), FILLORKILL, [0, 1, 2, 3], [5, 6, 7, 8]],
          // [indices[2], ethers.parseUnits("7", 18).toString(), FILLORKILL, [0, 5, 1, 6, 2, 7, 3, 8]],
          // [indices[2], ethers.parseUnits("1", 18).toString(), FILLORKILL, [4, 5, 6, 7]],
        ];
        console.log("        * trades1: " + JSON.stringify(trades1));
        const trades1Tx = await d.tokenAgents[1].connect(d.accounts[2]).trade(trades1, PAYMENTTYPE_WETH, {value: ethers.parseEther("10.0")});
        const trades1TxReceipt = await trades1Tx.wait();
        printLogs(d, "accounts[2]->tokenAgents[1].trade(trades1, PAYMENTTYPE_WETH)", trades1TxReceipt);
        await printState(d);
      }
    });

  });

});
