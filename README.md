# Demodex - Work In Progress

Decentralised ERC-20/721/1155 token exchange.

#### UI URL
[https://bokkypoobah.github.io/Demodex/](https://bokkypoobah.github.io/Demodex/)

#### Testing

Connect to the Sepolia network

##### Setup Token Contract

Go to the Token Contracts tab. Click on [+] to add a new token contract.

<kbd><img src="images/TokenContracts_1_20240926.png" width="600"/></kbd>

Select `0x7439E9Bb6D8a84dd3A23fe621A30F95403F87fB9` `WEENUS` from the dropdown list. Click on [+]

<kbd><img src="images/TokenContracts_2_20240926.png" width="600"/></kbd>

Click on the [->] icon to permit usage of this token.

<kbd><img src="images/TokenContracts_3_20240926.png" width="600"/></kbd>

<br />

##### Trade Fungibles

Go to the Trade Fungibles tab. Select the `WEENUS` token from the dropdown

<kbd><img src="images/TradeFungibles_1_20240926.png" width="600"/></kbd>

<br />

---

#### Deployments

* v0.8.0 [Demodex](https://sepolia.etherscan.io/address/0x2e5D59C1b7da9324eD29891BA060866948dd6b88#code) using [WETH](https://sepolia.etherscan.io/address/0x07391dbE03e7a0DEa0fce6699500da081537B6c3#code) - [deployed/Demodex_Sepolia_0x2e5D59C1b7da9324eD29891BA060866948dd6b88.sol](deployed/Demodex_Sepolia_0x2e5D59C1b7da9324eD29891BA060866948dd6b88.sol)

<br />

---

#### Testing

##### First Install
Clone/download this repository, and in the new folder on your computer:

```bash
npm install --save-dev hardhat
```

##### Run Test Script

Or run the test with the output saved in [./testIt.out](./testIt.out).
You may initially have to mark the script as executable using the command `chmod 700 ./10_testIt.sh`.

```bash
$ ./10_testIt.sh
```

<br />

<br />

Enjoy!

(c) BokkyPooBah / Bok Consulting Pty Ltd 2024. The MIT Licence.
