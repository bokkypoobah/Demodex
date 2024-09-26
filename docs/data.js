const Data = {
  template: `
  <div>
    <b-button v-b-toggle.data-module size="sm" block variant="outline-info">Data</b-button>
    <b-collapse id="data-module" visible class="my-2">
      <b-card no-body class="border-0">
        <b-row>
          <b-col cols="5" class="small px-1 text-right">Addresses:</b-col>
          <b-col class="small px-1 truncate" cols="7">{{ Object.keys(addresses).length }}</b-col>
        </b-row>
        <b-row>
          <b-col cols="5" class="small px-1 text-right">ERC-20 Contracts:</b-col>
          <b-col class="small px-1 truncate" cols="7">{{ totalERC20Contracts }}</b-col>
        </b-row>
        <b-row>
          <b-col cols="5" class="small px-1 text-right">ERC-721 Tokens:</b-col>
          <b-col class="small px-1 truncate" cols="7">{{ totalERC721Tokens }}</b-col>
        </b-row>
        <b-row>
          <b-col cols="5" class="small px-1 text-right">Registry:</b-col>
          <b-col class="small px-1 truncate" cols="7">{{ Object.keys(registry[chainId] || {}).length }}</b-col>
        </b-row>
        <b-row>
          <b-col cols="5" class="small px-1 text-right">Stealth Transfers:</b-col>
          <b-col class="small px-1 truncate" cols="7">{{ totalStealthTransfers }}</b-col>
        </b-row>
        <!-- <b-row>
          <b-col cols="5" class="small px-1">ENS Map</b-col>
          <b-col class="small px-1 truncate" cols="7">{{ Object.keys(ens).length }}</b-col>
        </b-row> -->
      </b-card>
    </b-collapse>
  </div>
  `,
  data: function () {
    return {
      count: 0,
      reschedule: true,
    }
  },
  computed: {
    powerOn() {
      return store.getters['connection/powerOn'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    chainId() {
      return store.getters['connection/chainId'];
    },
    addresses() {
      return store.getters['data/addresses'];
    },
    registry() {
      return store.getters['data/registry'];
    },
    stealthTransfers() {
      return store.getters['data/stealthTransfers'];
    },
    totalStealthTransfers() {
      let result = (store.getters['data/forceRefresh'] % 2) == 0 ? 0 : 0;
      for (const [blockNumber, logIndexes] of Object.entries(this.stealthTransfers[this.chainId] || {})) {
        for (const [logIndex, item] of Object.entries(logIndexes)) {
          result++;
        }
      }
      return result;
    },
    totalERC20Contracts() {
      let result = (store.getters['data/forceRefresh'] % 2) == 0 ? 0 : 0;
      // TODO
      // for (const [address, data] of Object.entries(this.tokenContracts[this.chainId] || {})) {
      //   if (data.type == "erc20") {
      //     result++;
      //   }
      // }
      return result;
    },
    totalERC721Tokens() {
      let result = (store.getters['data/forceRefresh'] % 2) == 0 ? 0 : 0;
      // TODO
      // for (const [address, data] of Object.entries(this.tokenContracts[this.chainId] || {})) {
      //   if (data.type == "erc721") {
      //     result += Object.keys(data.tokenIds).length;
      //   }
      // }
      return result;
    },
    // mappings() {
    //   return store.getters['data/mappings'];
    // },
    // txs() {
    //   return store.getters['data/txs'];
    // },
    // assets() {
    //   return store.getters['data/assets'];
    // },
    // ens() {
    //   return store.getters['data/ens'];
    // },
  },
  methods: {
    async timeoutCallback() {
      logDebug("Data", "timeoutCallback() count: " + this.count);
      this.count++;
      var t = this;
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 15000);
      }
    },
  },
  beforeDestroy() {
    logDebug("Data", "beforeDestroy()");
  },
  mounted() {
    logDebug("Data", "mounted() $route: " + JSON.stringify(this.$route.params));
    store.dispatch('config/restoreState');
    this.reschedule = true;
    logDebug("Data", "Calling timeoutCallback()");
    this.timeoutCallback();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const dataModule = {
  namespaced: true,
  state: {
    DB_PROCESSING_BATCH_SIZE: 12345,

    addressToIndex: {},
    indexToAddress: [],
    txHashToIndex: {},
    indexToTxHash: [],

    tokenSet: {},

    tokenSetAgents: {},
    tokenSetOwners: {},

    addresses: {},
    tokenAgents: {},
    tokenContracts: {},

    // Ignore this block
    balances: {},
    approvals: {},
    tokens: {},
    expiries: {},
    collection: {}, // chainId -> contract => { id, symbol, name, image, slug, creator, tokenCount }
    timestamps: {}, // chainId -> blockNumber => timestamp
    txs: {}, // txHash => tx & txReceipt
    registry: {}, // Address => StealthMetaAddress
    stealthTransfers: {}, // ChainId, blockNumber, logIndex => data
    ens: {},
    names: {},
    exchangeRates: {},

    forceRefresh: 0,
    sync: {
      section: null,
      total: null,
      completed: null,
      halt: false,
    },
    db: {
      name: "tokenagentdata085a",
      version: 1,
      schemaDefinition: {
        tokenAgentFactoryEvents: '[chainId+blockNumber+logIndex],[blockNumber+contract],contract',
        tokenAgentEvents: '[chainId+blockNumber+logIndex],[blockNumber+contract],contract',
        tokenSetTokenAgentEvents: '[tokenSet+blockNumber+logIndex],[blockNumber+contract],contract',
        tokenSetTokenAgentInternalEvents: '[tokenSet+blockNumber+logIndex],[blockNumber+contract],contract',
        tokenSetTokenEvents: '[tokenSet+blockNumber+logIndex],[blockNumber+contract],contract',

        announcements: '[chainId+blockNumber+logIndex],[blockNumber+contract],contract,confirmations,stealthAddress',
        registrations: '[chainId+blockNumber+logIndex],[blockNumber+contract],contract,confirmations',
        tokenEvents: '[chainId+blockNumber+logIndex],[blockNumber+contract],contract,confirmations',

        cache: '&objectName',
      },
      updated: null,
    },
  },
  getters: {
    addressToIndex: state => state.addressToIndex,
    indexToAddress: state => state.indexToAddress,
    txHashToIndex: state => state.txHashToIndex,
    indexToTxHash: state => state.indexToTxHash,

    tokenSet: state => state.tokenSet,

    addresses: state => state.addresses,
    tokenAgents: state => state.tokenAgents,
    tokenContracts: state => state.tokenContracts,

    // Ignore this block
    balances: state => state.balances,
    approvals: state => state.approvals,
    tokens: state => state.tokens,
    expiries: state => state.expiries,
    collection: state => state.collection,
    timestamps: state => state.timestamps,
    txs: state => state.txs,
    registry: state => state.registry,
    stealthTransfers: state => state.stealthTransfers,
    ens: state => state.ens,
    names: state => state.names,
    exchangeRates: state => state.exchangeRates,

    forceRefresh: state => state.forceRefresh,
    sync: state => state.sync,
    db: state => state.db,
  },
  mutations: {
    setState(state, info) {
      // console.log(now() + " INFO dataModule:mutations.setState - info: " + JSON.stringify(info, null, 2));
      Vue.set(state, info.name, info.data);
    },
    addAddressIndex(state, address) {
      // console.log(now() + " INFO dataModule:mutations.addAddressIndex - address: " + address);
      if (address && !(address in state.addressToIndex)) {
        const newIndex = state.indexToAddress.length;
        Vue.set(state.addressToIndex, address, newIndex);
        Vue.set(state.indexToAddress, newIndex, address);
      }
    },
    addTxHashIndex(state, txHash) {
      // console.log(now() + " INFO dataModule:mutations.addTxHashIndex - txHash: " + txHash);
      if (!(txHash in state.txHashToIndex)) {
        const newIndex = state.indexToTxHash.length;
        Vue.set(state.txHashToIndex, txHash, newIndex);
        Vue.set(state.indexToTxHash, newIndex, txHash);
      }
    },
    addTokenAgent(state, info) {
      console.log(now() + " INFO dataModule:mutations.addTokenAgent - info: " + JSON.stringify(info));
      if (!(info.chainId in state.tokenAgents)) {
        Vue.set(state.tokenAgents, info.chainId, {});
      }
      if (!(info.tokenAgent in state.tokenAgents[info.chainId])) {
        Vue.set(state.tokenAgents[info.chainId], info.tokenAgent, {
            blockNumber: info.blockNumber,
            logIndex: info.logIndex,
            txIndex: info.txIndex,
            txHash: info.txHash,
            timestamp: info.timestamp,
            owner: info.owner,
            index: info.index,
            nonce: 0,
            nonceBlockNumber: null,
            nonceTimestamp: null,
        });
      }
    },
    updateTokenAgentNonce(state, info) {
      // console.log(now() + " INFO dataModule:mutations.updateTokenAgentNonce - info: " + JSON.stringify(info));
      if (state.tokenAgents[info.chainId] && state.tokenAgents[info.chainId][info.contract]) {
        Vue.set(state.tokenAgents[info.chainId][info.contract], 'nonce', info.newNonce);
        Vue.set(state.tokenAgents[info.chainId][info.contract], 'nonceBlockNumber', info.blockNumber);
        Vue.set(state.tokenAgents[info.chainId][info.contract], 'nonceTimestamp', info.timestamp);
      }
    },

    addTokenContract(state, info) {
      console.log(now() + " INFO dataModule:mutations.addTokenContract info: " + JSON.stringify(info, null, 2));
      if (!(info.chainId in state.tokenContracts)) {
        Vue.set(state.tokenContracts, info.chainId, {});
      }
      if (!(info.address in state.tokenContracts[info.chainId])) {
        Vue.set(state.tokenContracts[info.chainId], info.address, {
          type: info.type,
          symbol: info.symbol,
          name: info.name,
          decimals: info.decimals,
          totalSupply: info.totalSupply,
          slug: info.slug,
          image: info.image,
          watch: false,
          transfers: false,
          junk: false,
        });
      }
      console.log(now() + " INFO dataModule:mutations.addTokenContract info: " + JSON.stringify(state.tokenContracts[info.chainId][info.address], null, 2));
    },
    toggleTokenContractField(state, info) {
      Vue.set(state.tokenContracts[info.chainId][info.address], info.field, !state.tokenContracts[info.chainId][info.address][info.field]);
      console.log(now() + " INFO dataModule:mutations.toggleTokenContractField - tokenContracts[" + info.chainId + "][" + info.address + "]." + info.field + " = " + state.tokenContracts[info.chainId][info.address][info.field]);
    },
    deleteTokenContract(state, info) {
      console.log(now() + " INFO dataModule:mutations.deleteTokenContract info: " + JSON.stringify(info, null, 2));
      if ((info.address in state.tokenContracts[info.chainId])) {
        Vue.delete(state.tokenContracts[info.chainId], info.address);
      }
      if (Object.keys(state.tokenContracts[info.chainId]).length == 0) {
        Vue.delete(state.tokenContracts, info.chainId);
      }
    },

    updateBalances(state, info) {
      // console.log(now() + " INFO dataModule:mutations.updateBalances - info: " + JSON.stringify(info, null, 2));
      Vue.set(state.balances, info.chainId, info.balances);
    },
    updateApprovals(state, info) {
      // console.log(now() + " INFO dataModule:mutations.updateApprovals - info: " + JSON.stringify(info, null, 2));
      Vue.set(state.approvals, info.chainId, info.approvals);
    },
    toggleAddressField(state, info) {
      Vue.set(state.addresses[info.address], info.field, !state.addresses[info.address][info.field]);
      console.log(now() + " INFO dataModule:mutations.toggleAddressField - addresses[" + info.address + "]." + info.field + " = " + state.addresses[info.address][info.field]);
    },
    setAddressField(state, info) {
      Vue.set(state.addresses[info.address], info.field, info.value);
      // console.log(now() + " INFO dataModule:mutations.setAddressField - addresses[" + info.address + "]." + info.field + " = " + state.addresses[info.address][info.field]);
    },
    toggleFungibleJunk(state, item) {
      // console.log(now() + " INFO dataModule:mutations.toggleFungibleJunk - item: " + JSON.stringify(item));
      if (state.tokens[item.chainId] && state.tokens[item.chainId][item.contract]) {
        Vue.set(state.tokens[item.chainId][item.contract], 'junk', !state.tokens[item.chainId][item.contract].junk);
      }
    },
    toggleFungibleActive(state, item) {
      // console.log(now() + " INFO dataModule:mutations.toggleFungibleActive - item: " + JSON.stringify(item));
      if (state.tokens[item.chainId] && state.tokens[item.chainId][item.contract]) {
        Vue.set(state.tokens[item.chainId][item.contract], 'active', !state.tokens[item.chainId][item.contract].active);
      }
    },
    setFungibleField(state, info) {
      // console.log(now() + " INFO dataModule:mutations.setFungibleField: " + JSON.stringify(info, null, 2));
      if (state.tokens[info.chainId] && state.tokens[info.chainId][info.contract]) {
        Vue.set(state.tokens[info.chainId][info.contract], info.field, info.value);
      }
    },
    updateFungibleTotalSupply(state, info) {
      // console.log(now() + " INFO dataModule:mutations.updateFungibleTotalSupply: " + JSON.stringify(info, null, 2));
      if (state.tokens[info.chainId] && state.tokens[info.chainId][info.contract]) {
        Vue.set(state.tokens[info.chainId][info.contract], 'totalSupply', info.totalSupply);
      }
    },
    toggleNonFungibleJunk(state, item) {
      // console.log(now() + " INFO dataModule:mutations.toggleNonFungibleJunk - item: " + JSON.stringify(item));
      const [ chainId, contract, tokenId ] = [ item.chainId, item.contract, item.tokenId ];
      if (!(chainId in state.tokens)) {
        Vue.set(state.tokens, chainId, {});
      }
      if (!(contract in state.tokens[chainId])) {
        Vue.set(state.tokens[chainId], contract, {
          junk: false,
          tokens: {},
        });
      }
      Vue.set(state.tokens[chainId][contract], 'junk', !state.tokens[chainId][contract].junk);
    },
    toggleNonFungibleActive(state, item) {
      // console.log(now() + " INFO dataModule:mutations.toggleNonFungibleActive - item: " + JSON.stringify(item));
      const [ chainId, contract, tokenId ] = [ item.chainId, item.contract, item.tokenId ];
      if (!(chainId in state.tokens)) {
        Vue.set(state.tokens, chainId, {});
      }
      if (!(contract in state.tokens[chainId])) {
        Vue.set(state.tokens[chainId], contract, {
          junk: false,
          tokens: {},
        });
      }
      if (!(tokenId in state.tokens[chainId][contract].tokens)) {
        Vue.set(state.tokens[chainId][contract].tokens, tokenId, {
          name: null,
          description: null,
          image: null,
          attributes: null,
          active: false,
        });
      }
      Vue.set(state.tokens[chainId][contract].tokens[tokenId], 'active', !state.tokens[chainId][contract].tokens[tokenId].active);
    },
    setNonFungibleField(state, info) {
      // console.log(now() + " INFO dataModule:mutations.setNonFungibleField: " + JSON.stringify(info, null, 2));
      if (state.tokens[info.chainId] && state.tokens[info.chainId][info.contract] && state.tokens[info.chainId][info.contract].tokens[info.tokenId]) {
        Vue.set(state.tokens[info.chainId][info.contract].tokens[info.tokenId], info.field, info.value);
      }
    },

    addNewAddress(state, newAccount) {
      // console.log(now() + " INFO dataModule:mutations.addNewAddress(" + JSON.stringify(newAccount, null, 2) + ")");
      let address = null;
      let linkedToAddress = null;
      let type = null;
      let mine = false;
      let source = null;
      if (newAccount.action == "addCoinbase") {
        address = store.getters['connection/coinbase'];
        type = "address";
        mine = true;
        source = "attached";
      } else if (newAccount.action == "addAddress") {
        address = ethers.utils.getAddress(newAccount.address);
        type = "address";
        mine = newAccount.mine;
        source = "manual";
      } else if (newAccount.action == "addStealthMetaAddress") {
        address = newAccount.address;
        linkedToAddress = newAccount.linkedToAddress;
        type = "stealthMetaAddress";
        mine = newAccount.mine;
        source = "manual";
      } else {
        address = newAccount.address;
        linkedToAddress = newAccount.linkedToAddress;
        type = "stealthMetaAddress";
        mine = true;
        source = "attached";
      }
      console.log("address: " + address);
      console.log("linkedToAddress: " + linkedToAddress);
      console.log("type: " + type);
      if (address in state.addresses) {
        Vue.set(state.addresses[address], 'type', type);
        if (type == "stealthMetaAddress") {
          Vue.set(state.addresses[address], 'linkedToAddress', linkedToAddress);
          Vue.set(state.addresses[address], 'phrase', newAccount.action == "generateStealthMetaAddress" ? newAccount.phrase : undefined);
          Vue.set(state.addresses[address], 'viewingPrivateKey', newAccount.action == "generateStealthMetaAddress" ? newAccount.viewingPrivateKey : undefined);
          Vue.set(state.addresses[address], 'spendingPublicKey', newAccount.action == "generateStealthMetaAddress" ? newAccount.spendingPublicKey : undefined);
          Vue.set(state.addresses[address], 'viewingPublicKey', newAccount.action == "generateStealthMetaAddress" ? newAccount.viewingPublicKey : undefined);
        }
        Vue.set(state.addresses[address], 'mine', mine);
        Vue.set(state.addresses[address], 'watch', newAccount.watch);
        Vue.set(state.addresses[address], 'sendFrom', newAccount.sendFrom);
        Vue.set(state.addresses[address], 'sendTo', newAccount.sendTo);
        Vue.set(state.addresses[address], 'name', newAccount.name);
      } else {
        if (type == "address") {
          Vue.set(state.addresses, address, {
            type,
            source,
            junk: false,
            mine,
            watch: newAccount.watch,
            sendFrom: newAccount.sendFrom,
            sendTo: newAccount.sendTo,
            name: newAccount.name,
            notes: null,
          });
        } else {
          Vue.set(state.addresses, address, {
            type,
            linkedToAddress,
            phrase: newAccount.action == "generateStealthMetaAddress" ? newAccount.phrase : undefined,
            viewingPrivateKey: newAccount.action == "generateStealthMetaAddress" ? newAccount.viewingPrivateKey : undefined,
            spendingPublicKey: newAccount.action == "generateStealthMetaAddress" ? newAccount.spendingPublicKey : undefined,
            viewingPublicKey: newAccount.action == "generateStealthMetaAddress" ? newAccount.viewingPublicKey : undefined,
            source,
            junk: false,
            mine,
            watch: newAccount.watch,
            sendFrom: newAccount.sendFrom,
            sendTo: newAccount.sendTo,
            name: newAccount.name,
            notes: null,
          });
        }
      }
      console.log(now() + " INFO dataModule:mutations.addNewAddress AFTER - state.addresses: " + JSON.stringify(state.addresses, null, 2));
    },
    addNewStealthAddress(state, info) {
      // console.log(now() + " INFO dataModule:mutations.addNewStealthAddress: " + JSON.stringify(info, null, 2));
      Vue.set(state.addresses, info.stealthAddress, {
        type: info.type,
        linkedTo: info.linkedTo,
        source: info.source,
        junk: info.junk,
        mine: info.mine,
        watch: info.watch,
        sendFrom: info.sendFrom,
        sendTo: info.sendTo,
        name: info.name,
        notes: info.notes,
      });
    },
    updateToStealthAddress(state, info) {
      // console.log(now() + " INFO dataModule:mutations.updateToStealthAddress: " + JSON.stringify(info, null, 2));
      Vue.set(state.addresses[info.stealthAddress], 'type', info.type);
      Vue.set(state.addresses[info.stealthAddress], 'linkedTo', info.linkedTo);
      Vue.set(state.addresses[info.stealthAddress], 'junk', info.junk);
      Vue.set(state.addresses[info.stealthAddress], 'mine', info.mine);
      Vue.set(state.addresses[info.stealthAddress], 'sendFrom', info.sendFrom);
      Vue.set(state.addresses[info.stealthAddress], 'sendTo', info.sendTo);
    },
    deleteAddress(state, address) {
      Vue.delete(state.addresses, address);
    },
    addFungibleMetadata(state, info) {
      // console.log(now() + " INFO dataModule:mutations.addFungibleMetadata info: " + JSON.stringify(info, null, 2));
      if (!(info.chainId in state.tokens)) {
        Vue.set(state.tokens, info.chainId, {});
      }
      if (!(info.contract in state.tokens[info.chainId])) {
        Vue.set(state.tokens[info.chainId], info.contract, {
          type: info.type,
          symbol: info.symbol,
          name: info.name,
          decimals: info.decimals,
          totalSupply: info.totalSupply,
          image: info.image,
          junk: false,
          active: false,
          notes: null,
        });
      }
    },
    addExpiry(state, info) {
      // console.log(now() + " INFO dataModule:mutations.addExpiry info: " + JSON.stringify(info, null, 2));
      const [ chainId, contract, tokenId, expiry ] = [ info.chainId, info.contract, info.tokenId, info.expiry ];
      if (!(chainId in state.expiries)) {
        Vue.set(state.expiries, chainId, {});
      }
      if (!(contract in state.expiries[chainId])) {
        Vue.set(state.expiries[chainId], contract, {});
      }
      if (!(tokenId in state.expiries[chainId][contract])) {
        Vue.set(state.expiries[chainId][contract], tokenId, expiry);
      } else {
        if (expiry > state.expiries[chainId][contract][tokenId]) {
          Vue.set(state.expiries[chainId][contract], tokenId, expiry);
        }
      }
    },
    addNonFungibleContractMetadata(state, info) {
      // console.log(now() + " INFO dataModule:mutations.addNonFungibleContractMetadata info: " + JSON.stringify(info, null, 2));
      if (!(info.chainId in state.tokens)) {
        Vue.set(state.tokens, info.chainId, {});
      }
      if (!(info.contract in state.tokens[info.chainId])) {
        Vue.set(state.tokens[info.chainId], info.contract, {
          type: info.type,
          symbol: info.symbol,
          name: info.name,
          image: null,
          junk: false,
          tokens: {},
        });
      }
    },
    addNonFungibleMetadata(state, info) {
      console.log(now() + " INFO dataModule:mutations.addNonFungibleMetadata info: " + JSON.stringify(info, null, 2));
      const [ chainId, contract, tokenId ] = [ info.chainId, info.contract, info.tokenId ];
      if (!(chainId in state.tokens)) {
        Vue.set(state.tokens, chainId, {});
      }
      if (!(contract in state.tokens[chainId])) {
        Vue.set(state.tokens[chainId], contract, {
          type: info.type,
          symbol: info.collectionSymbol || null,
          name: info.collectionName || null,
          slug: info.slug || null,
          image: null,
          junk: false,
          tokens: {},
        });
      }
      if (!(tokenId in state.tokens[chainId][contract].tokens)) {
        // console.log(now() + " INFO dataModule:mutations.addNonFungibleMetadata new info: " + JSON.stringify(info, null, 2));
        Vue.set(state.tokens[chainId][contract].tokens, tokenId, {
          name: info.name,
          description: info.description,
          image: info.image,
          attributes: info.attributes,
          active: false,
          lastSale: info.lastSale || null,
          price: info.price || null,
          topBid: info.topBid || null,
        });
      } else {
        // console.log(now() + " INFO dataModule:mutations.addNonFungibleMetadata existing: " + JSON.stringify(info, null, 2));
        Vue.set(state.tokens[chainId][contract].tokens[tokenId], 'name', info.name);
        Vue.set(state.tokens[chainId][contract].tokens[tokenId], 'description', info.description);
        Vue.set(state.tokens[chainId][contract].tokens[tokenId], 'image', info.image);
        Vue.set(state.tokens[chainId][contract].tokens[tokenId], 'attributes', info.attributes);
        Vue.set(state.tokens[chainId][contract].tokens[tokenId], 'lastSale', info.lastSale || null);
        Vue.set(state.tokens[chainId][contract].tokens[tokenId], 'price', info.price || null);
        Vue.set(state.tokens[chainId][contract].tokens[tokenId], 'topBid', info.topBid || null);
      }
    },
    addStealthTransfer(state, info) {
      // console.log(now() + " INFO dataModule:mutations.addStealthTransfer: " + JSON.stringify(info, null, 2));
      if (!(info.chainId in state.stealthTransfers)) {
        Vue.set(state.stealthTransfers, info.chainId, {});
      }
      if (!(info.blockNumber in state.stealthTransfers[info.chainId])) {
        Vue.set(state.stealthTransfers[info.chainId], info.blockNumber, {});
      }
      if (!(info.logIndex in state.stealthTransfers[info.chainId][info.blockNumber])) {
        Vue.set(state.stealthTransfers[info.chainId][info.blockNumber], info.logIndex, info);
      }
    },
    setENS(state, info) {
      // console.log(now() + " INFO dataModule:mutations.setENS info: " + JSON.stringify(info));
      if (info.name) {
        Vue.set(state.ens, info.address, info.name);
      } else {
        if (state.ens[info.address]) {
          Vue.delete(state.ens, info.address);
        }
      }
    },
    addTimestamp(state, info) {
      // console.log(now() + " INFO dataModule:mutations.addTimestamp info: " + JSON.stringify(info, null, 2));
      if (!(info.chainId in state.timestamps)) {
        Vue.set(state.timestamps, info.chainId, {});
      }
      if (!(info.blockNumber in state.timestamps[info.chainId])) {
        Vue.set(state.timestamps[info.chainId], info.blockNumber, info.timestamp);
      }
    },
    updateName(state, info) {
      // console.log(now() + " INFO dataModule:mutations.updateName info: " + JSON.stringify(info, null, 2));
      Vue.set(state.names, info.address, info.name);
    },
    addTx(state, tx) {
      // console.log(now() + " INFO dataModule:mutations.addTx tx: " + JSON.stringify(tx, null, 2));
      if (!(tx.chainId in state.txs)) {
        Vue.set(state.txs, tx.chainId, {});
      }
      if (!(tx.txHash in state.txs[tx.chainId])) {
        Vue.set(state.txs[tx.chainId], tx.txHash, tx);
      }
    },

    setExchangeRates(state, exchangeRates) {
      // const dates = Object.keys(exchangeRates);
      // dates.sort();
      // for (let date of dates) {
      //   console.log(date + "\t" + exchangeRates[date]);
      // }
      Vue.set(state, 'exchangeRates', exchangeRates);
    },
    forceRefresh(state) {
      Vue.set(state, 'forceRefresh', parseInt(state.forceRefresh) + 1);
      // console.log(now() + " INFO dataModule:mutations.forceRefresh: " + state.forceRefresh);
    },
    saveTxTags(state, info) {
      if (!(info.txHash in state.txsInfo)) {
        Vue.set(state.txsInfo, info.txHash, {
          tags: info.tags,
        });
      } else {
        Vue.set(state.txsInfo[info.txHash], 'tags', info.tags);
      }
    },
    addTagToTxs(state, info) {
      for (const txHash of Object.keys(info.txHashes)) {
        if (!(txHash in state.txsInfo)) {
          Vue.set(state.txsInfo, txHash, {
            tags: [info.tag],
          });
        } else {
          const currentTags = state.txsInfo[txHash].tags || [];
          if (!currentTags.includes(info.tag)) {
            currentTags.push(info.tag);
            Vue.set(state.txsInfo[txHash], 'tags', currentTags);
          }
        }
      }
    },
    removeTagFromTxs(state, info) {
      for (const txHash of Object.keys(info.txHashes)) {
        if (txHash in state.txsInfo) {
          const currentTags = state.txsInfo[txHash].tags || [];
          if (currentTags.includes(info.tag)) {
            const newTags = currentTags.filter(e => e != info.tag);
            if (newTags.length == 0 && Object.keys(state.txsInfo[txHash]).length == 1) {
              Vue.delete(state.txsInfo, txHash);
            } else {
              Vue.set(state.txsInfo[txHash], 'tags', newTags);
            }
          }
        }
      }
    },
    setSyncSection(state, info) {
      // console.log(now() + " INFO dataModule:mutations.setSyncSection info: " + JSON.stringify(info));
      state.sync.section = info.section;
      state.sync.total = info.total;
    },
    setSyncCompleted(state, completed) {
      console.log(now() + " INFO dataModule:mutations.setSyncCompleted completed: " + completed + (state.sync.total ? ("/" + state.sync.total) : "") + " " + state.sync.section);
      state.sync.completed = completed;
    },
    setSyncHalt(state, halt) {
      state.sync.halt = halt;
    },
  },
  actions: {
    async restoreState(context) {
      console.log(now() + " INFO dataModule:actions.restoreState");
      if (Object.keys(context.state.addresses).length == 0) {
        const db0 = new Dexie(context.state.db.name);
        db0.version(context.state.db.version).stores(context.state.db.schemaDefinition);
        for (let type of ['indexToAddress', 'indexToTxHash', 'tokenSetAgents', 'tokenSetOwners', 'tokenContracts', 'tokenAgents', 'addresses', 'tokenSet', /*'names', 'ens', 'expiries', 'timestamps', 'txs', 'tokens', 'balances', 'approvals', 'registry', 'stealthTransfers'*/]) {
          const data = await db0.cache.where("objectName").equals(type).toArray();
          if (data.length == 1) {
            // console.log(now() + " INFO dataModule:actions.restoreState " + type + " => " + JSON.stringify(data[0].object, null, 2));
            context.commit('setState', { name: type, data: data[0].object });
            if (type == 'indexToAddress') {
              const addressToIndex = {};
              for (const [index, address] of context.state.indexToAddress.entries()) {
                addressToIndex[address] = index;
              }
              context.commit('setState', { name: 'addressToIndex', data: addressToIndex });
            } else if (type == 'indexToTxHash') {
              const txHashToIndex = {};
              for (const [index, address] of context.state.indexToTxHash.entries()) {
                txHashToIndex[address] = index;
              }
              context.commit('setState', { name: 'txHashToIndex', data: txHashToIndex });
            }
          }
        }
      }
    },
    async saveData(context, types) {
      // console.log(now() + " INFO dataModule:actions.saveData - types: " + JSON.stringify(types));
      const db0 = new Dexie(context.state.db.name);
      db0.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      for (let type of types) {
        await db0.cache.put({ objectName: type, object: context.state[type] }).then(function() {
        }).catch(function(error) {
          console.log("error: " + error);
        });
      }
      db0.close();
    },

    async addTokenContract(context, info) {
      console.log(now() + " INFO dataModule:actions.addTokenContract - info: " + JSON.stringify(info));
      await context.commit('addTokenContract', info);
      await context.dispatch('saveData', ['tokenContracts']);
    },
    async toggleTokenContractField(context, info) {
      console.log(now() + " INFO dataModule:actions.toggleTokenContractField - info: " + JSON.stringify(info));
      await context.commit('toggleTokenContractField', info);
      await context.dispatch('saveData', ['tokenContracts']);
    },
    async deleteTokenContract(context, info) {
      console.log(now() + " INFO dataModule:actions.deleteTokenContract - info: " + JSON.stringify(info));
      await context.commit('deleteTokenContract', info);
      await context.dispatch('saveData', ['tokenContracts']);
    },

    async setAddressField(context, info) {
      // console.log(now() + " INFO dataModule:actions.setAddressField - info: " + JSON.stringify(info));
      await context.commit('setAddressField', info);
      await context.dispatch('saveData', ['addresses']);
    },
    async toggleAddressField(context, info) {
      console.log(now() + " INFO dataModule:actions.toggleAddressField - info: " + JSON.stringify(info));
      await context.commit('toggleAddressField', info);
      await context.dispatch('saveData', ['addresses']);
    },
    async updateFungibleTotalSupply(context, info) {
      // console.log(now() + " INFO dataModule:actions.updateFungibleTotalSupply - info: " + JSON.stringify(info));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const interface = new ethers.Contract(info.contract, ERC20ABI, provider);
      try {
        const totalSupply = await interface.totalSupply();
        await context.commit('updateFungibleTotalSupply', { ...info, totalSupply: totalSupply && totalSupply.toString() || null });
      } catch (e) {
      }
      // await context.dispatch('saveData', ['tokens']);
    },
    async toggleFungibleJunk(context, item) {
      // console.log(now() + " INFO dataModule:actions.toggleFungibleJunk - item: " + JSON.stringify(item));
      await context.commit('toggleFungibleJunk', item);
      await context.dispatch('saveData', ['tokens']);
    },
    async toggleFungibleActive(context, item) {
      // console.log(now() + " INFO dataModule:actions.toggleFungibleActive - item: " + JSON.stringify(item));
      await context.commit('toggleFungibleActive', item);
      await context.dispatch('saveData', ['tokens']);
    },
    async setFungibleField(context, item) {
      // console.log(now() + " INFO dataModule:actions.setFungibleField - item: " + JSON.stringify(item));
      await context.commit('setFungibleField', item);
      await context.dispatch('saveData', ['tokens']);
    },
    async toggleNonFungibleJunk(context, item) {
      // console.log(now() + " INFO dataModule:actions.toggleNonFungibleJunk - item: " + JSON.stringify(item));
      await context.commit('toggleNonFungibleJunk', item);
      await context.dispatch('saveData', ['tokens']);
    },
    async toggleNonFungibleActive(context, item) {
      // console.log(now() + " INFO dataModule:actions.toggleNonFungibleActive - item: " + JSON.stringify(item));
      await context.commit('toggleNonFungibleActive', item);
      await context.dispatch('saveData', ['tokens']);
    },
    async setNonFungibleField(context, item) {
      // console.log(now() + " INFO dataModule:actions.setNonFungibleField - item: " + JSON.stringify(item));
      await context.commit('setNonFungibleField', item);
      await context.dispatch('saveData', ['tokens']);
    },
    async addNonFungibleMetadata(context, info) {
      // console.log(now() + " INFO dataModule:actions.addNonFungibleMetadata - info: " + JSON.stringify(info, null, 2));
      context.commit('addNonFungibleMetadata', info);
      await context.dispatch('saveData', ['tokens']);
    },

    async deleteAddress(context, address) {
      console.log(now() + " INFO dataModule:actions.deleteAddress - address: " + JSON.stringify(address, null, 2));
      await context.commit('deleteAddress', address);
      await context.dispatch('saveData', ['addresses']);
    },
    async saveTxTags(context, info) {
      await context.commit('saveTxTags', info);
      await context.dispatch('saveData', ['txsInfo']);
    },
    async addTagToTxs(context, info) {
      await context.commit('addTagToTxs', info);
      await context.dispatch('saveData', ['txsInfo']);
    },
    async removeTagFromTxs(context, info) {
      await context.commit('removeTagFromTxs', info);
      await context.dispatch('saveData', ['txsInfo']);
    },
    async refreshNonFungibleMetadata(context, tokens) {
      console.log(now() + " INFO dataModule:actions.refreshNonFungibleMetadata - token: " + JSON.stringify(tokens));
      const chainId = store.getters['connection/chainId'];
      const reservoirPrefix = NETWORKS[chainId] && NETWORKS[chainId].reservoir || null;
      if (reservoirPrefix) {
        const BATCHSIZE = 40; // 50 causes the Reservoir API to fail for some fetches
        const DELAYINMILLIS = 2500;
        for (let i = 0; i < tokens.length && !context.state.sync.halt; i += BATCHSIZE) {
          const batch = tokens.slice(i, parseInt(i) + BATCHSIZE);
          let continuation = null;
          do {
            if (continuation) {
              await delay(DELAYINMILLIS);
            }
            let url = reservoirPrefix + "tokens/v7?" + batch.map(e => 'tokens=' + e.contract + ':' + e.tokenId).join("&");
            url = url + (continuation != null ? "&continuation=" + continuation : '');
            url = url + "&limit=50&includeAttributes=true&includeTopBid=true&includeLastSale=true";
            console.log(url);
            const data = await fetch(url).then(response => response.json());
            continuation = data.continuation;
            if (data.tokens) {
              for (let record of data.tokens) {
                const token = parseReservoirTokenData(record);
                // if (data.image) {
                //   const imageBase64 = await imageUrlToBase64(data.image);
                //   console.log("imageBase64: " + JSON.stringify(imageBase64, null, 2));
                // }
                context.commit('addNonFungibleMetadata', token);
              }
            }
          } while (continuation != null);
        }
      }
      await context.dispatch('saveData', ['tokens']);
    },

    async requestReservoirMetadataRefresh(context, tokens) {
      console.log(now() + " INFO dataModule:actions.requestReservoirMetadataRefresh - token: " + JSON.stringify(tokens));
      const chainId = store.getters['connection/chainId'];
      const reservoirPrefix = NETWORKS[chainId] && NETWORKS[chainId].reservoir || null;
      if (reservoirPrefix) {
        const BATCHSIZE = 40; // 50 causes the Reservoir API to fail for some fetches
        const DELAYINMILLIS = 2500;
        for (let i = 0; i < tokens.length && !context.state.sync.halt; i += BATCHSIZE) {
          const batch = tokens.slice(i, parseInt(i) + BATCHSIZE);
          console.log("batch: " + JSON.stringify(batch));
          const tokenList = batch.map(e => e.contract + ':' + e.tokenId);
          console.log("tokenList: " + JSON.stringify(tokenList));
          const options = {
            method: 'POST',
            // mode: 'no-cors', // cors, no-cors, *cors, same-origin
            headers: { accept: '*/*', 'content-type': 'application/json', 'x-api-key': 'demo-api-key' },
            body: JSON.stringify({
              liquidityOnly: false,
              overrideCoolDown: false,
              tokens: tokenList,
              // tokens: ['0xa1eB40c284C5B44419425c4202Fa8DabFF31006b:178'],
            }),
          };
          console.log("options: " + JSON.stringify(options, null, 2));

          const url = reservoirPrefix + "tokens/refresh/v2";
          console.log(url);
          fetch(reservoirPrefix + "tokens/refresh/v2", options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
          // TODO: Handle response

      //     let continuation = null;
      //     do {
      //       if (!continuation) {
      //         await delay(DELAYINMILLIS);
      //       }
      //       let url = reservoirPrefix + "tokens/v7?" + batch.map(e => 'tokens=' + e.contract + ':' + e.tokenId).join("&");
      //       url = url + (continuation != null ? "&continuation=" + continuation : '');
      //       url = url + "&limit=50&includeAttributes=true&includeTopBid=true&includeLastSale=true";
      //       console.log(url);
      //       const data = await fetch(url).then(response => response.json());
      //       continuation = data.continuation;
      //       if (data.tokens) {
      //         for (let record of data.tokens) {
      //           const token = parseReservoirTokenData(record);
      //           // console.log("token: " + JSON.stringify(token, null, 2));
      //           context.commit('addNonFungibleMetadata', token);
      //         }
      //       }
      //     } while (continuation != null);
        }
      }
      await context.dispatch('saveData', ['tokens']);
    },


    async setSyncHalt(context, halt) {
      context.commit('setSyncHalt', halt);
    },
    async resetTokens(context) {
      await context.commit('resetTokens');
      await context.dispatch('saveData', ['accounts']);
    },
    async resetData(context) {
      console.log(now() + " INFO dataModule:actions.resetData");
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      await db.announcements.clear();
      await db.cache.clear();
      await db.registrations.clear();
      await db.tokenEvents.clear();
      db.close();
    },
    async addNewAddress(context, newAddress) {
      console.log(now() + " INFO dataModule:actions.addNewAddress - newAddress: " + JSON.stringify(newAddress, null, 2) + ")");
      context.commit('addNewAddress', newAddress);
      await context.dispatch('saveData', ['addresses']);
    },
    // async restoreAccount(context, addressData) {
    // console.log(now() + " INFO dataModule:actions.restoreAccount - addressData: " + JSON.stringify(addressData));
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const ensReverseRecordsContract = new ethers.Contract(ENSREVERSERECORDSADDRESS, ENSREVERSERECORDSABI, provider);
    //   const accountInfo = await getAccountInfo(addressData.account, provider)
    //   if (accountInfo.account) {
    //     context.commit('addNewAddress', accountInfo);
    //     context.commit('addNewAccountInfo', addressData);
    //   }
    //   const names = await ensReverseRecordsContract.getNames([addressData.account]);
    //   const name = names.length == 1 ? names[0] : addressData.account;
    //   if (!(addressData.account in context.state.ensMap)) {
    //     context.commit('addENSName', { account: addressData.account, name });
    //   }
    // },
    // async restoreIntermediateData(context, info) {
    //   if (info.blocks && info.txs) {
    //     await context.commit('setState', { name: 'blocks', data: info.blocks });
    //     await context.commit('setState', { name: 'txs', data: info.txs });
    //   }
    // },
    async syncIt(context, options) {
      console.log(now() + " INFO dataModule:actions.syncIt - options.tokenContractAddress: " + options.tokenContractAddress);
      // const db = new Dexie(context.state.db.name);
      // db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const block = await provider.getBlock();
      const confirmations = 100; // store.getters['config/settings'].confirmations && parseInt(store.getters['config/settings'].confirmations) || 10;
      const blockNumber = block && block.number || null;
      const cryptoCompareAPIKey = null; // store.getters['config/settings'].cryptoCompareAPIKey && store.getters['config/settings'].cryptoCompareAPIKey.length > 0 && store.getters['config/settings'].cryptoCompareAPIKey || null;
      const chainId = store.getters['connection/chainId'];
      const coinbase = store.getters['connection/coinbase'];
      // if (!(coinbase in context.state.addresses) && Object.keys(context.state.addresses).length == 0) {
      //   context.commit('addNewAddress', { action: "addCoinbase", check: ["ethers", "tokens"] });
      // }

      // console.log("context.state.addressToIndex BEFORE: " + JSON.stringify(context.state.addressToIndex));
      // console.log("context.state.indexToAddress BEFORE: " + JSON.stringify(context.state.indexToAddress));
      // console.log("context.state.txHashToIndex BEFORE: " + JSON.stringify(context.state.txHashToIndex));
      // console.log("context.state.indexToTxHash BEFORE: " + JSON.stringify(context.state.indexToTxHash));

      if (options.tokenContractAddress) {
        if (!(coinbase in context.state.addressToIndex)) {
          context.commit('addAddressIndex', coinbase);
        }
        options.coinbaseIndex = context.state.addressToIndex[coinbase];
        try {
          options.token = ethers.utils.getAddress(options.tokenContractAddress);
          // console.log(now() + " INFO dataModule:actions.syncIt - options.token: " + options.token);
          if (!(options.token in context.state.addressToIndex)) {
            context.commit('addAddressIndex', options.token);
          }
          options.tokenIndex = context.state.addressToIndex[options.token];
          if (options.token in (context.state.tokenContracts[chainId] || {})) {
            options.symbol = context.state.tokenContracts[chainId][options.token].symbol;
            options.name = context.state.tokenContracts[chainId][options.token].name;
            options.decimals = context.state.tokenContracts[chainId][options.token].decimals;
          }
        } catch (e) {
          console.log(now() + " ERROR dataModule:actions.syncIt - tokenContractAddress: " + options.tokenContractAddress);
          options.token = null;
        }
      }
      const network = chainId && NETWORKS[chainId.toString()] || {};
      if (network.tokenAgentFactory) {
        options.weth = network.weth.address;
        if (!(options.weth in context.state.addressToIndex)) {
          context.commit('addAddressIndex', options.weth);
        }
        options.wethIndex = context.state.addressToIndex[options.weth];
      }
      // console.log(now() + " INFO dataModule:actions.syncIt - options: " + JSON.stringify(options));

      context.dispatch('saveData', ['indexToAddress', 'indexToTxHash']);

      const parameter = { chainId, coinbase, blockNumber, confirmations, timestamp: block.timestamp, cryptoCompareAPIKey, ...options, incrementalSync: true };

      // const devMode = true;
      const devMode = false;

      if (!devMode) {
        await context.dispatch('syncTokenAgentFactoryEvents', parameter);
      }
      if (!devMode) {
        await context.dispatch('collateTokenAgentFactoryEvents', parameter);
      }
      if (!devMode) {
        await context.dispatch('syncTokenAgentGeneralEvents', parameter);
      }
      if (!devMode) {
        await context.dispatch('collateTokenAgentGeneralEvents', parameter);
      }
      if (options.token && !devMode) {
        await context.dispatch('syncTokenSetTokenAgentEvents', parameter);
      }
      if (options.token && !devMode) {
        await context.dispatch('collateTokenSetTokenAgentEvents', parameter);
      }
      if (options.token && !devMode) {
        await context.dispatch('syncTokenSetTokenAgentInternalEvents', parameter);
      }
      if (options.token && !devMode) {
        await context.dispatch('syncTokenSetTokenEvents', parameter);
      }
      if (options.token && !devMode) {
        await context.dispatch('collateTokenSet', parameter);
      }

      // console.log("context.state.addressToIndex AFTER: " + JSON.stringify(context.state.addressToIndex));
      // console.log("context.state.indexToAddress AFTER: " + JSON.stringify(context.state.indexToAddress));
      // console.log("context.state.txHashToIndex AFTER: " + JSON.stringify(context.state.txHashToIndex));
      // console.log("context.state.indexToTxHash AFTER: " + JSON.stringify(context.state.indexToTxHash));
      // context.dispatch('saveData', ['indexToAddress', 'indexToTxHash']);

      context.commit('setSyncSection', { section: null, total: null });
      context.commit('setSyncHalt', false);
      context.commit('forceRefresh');
    },

    async syncTokenAgentFactoryEvents(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncTokenAgentFactoryEvents BEGIN - token: " + parameter.token);
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = parameter.chainId && NETWORKS[parameter.chainId.toString()] || {};
      let [startBlock, deleteAcount, addCount] = [0, 0, 0];
      if (network.tokenAgentFactory) {
        async function getLogs(fromBlock, toBlock) {
          // console.log(now() + " INFO dataModule:actions.syncTokenAgentFactoryEvents.getLogs: " + fromBlock + " - " + toBlock);
          let split = false;
          const maxLogScrapingSize = NETWORKS['' + parameter.chainId].maxLogScrapingSize || null;
          if (!maxLogScrapingSize || (toBlock - fromBlock) <= maxLogScrapingSize) {
            try {
              const filter = {
                address: network.tokenAgentFactory.address, fromBlock, toBlock,
                topics: [[
                    // event NewTokenAgent(TokenAgent indexed tokenAgent, Account indexed owner, Index indexed index, Unixtime timestamp);
                    ethers.utils.id("NewTokenAgent(address,address,uint32,uint40)"),
                  ],
                ],
              };
              const eventLogs = await provider.getLogs(filter);
              const records = parseTokenAgentFactoryEventLogs(eventLogs, parameter.chainId, network.tokenAgentFactory.address, network.tokenAgentFactory.abi);
              const newRecords = [];
              for (const record of records) {
                if (!(record.txHash in context.state.txHashToIndex)) {
                  context.commit('addTxHashIndex', record.txHash);
                }
                for (const address of [record.contract, record.tokenAgent, record.owner]) {
                  if (!(address in context.state.addressToIndex)) {
                    context.commit('addAddressIndex', address);
                  }
                }
                const newRecord = {
                  ...record,
                  txHash: context.state.txHashToIndex[record.txHash],
                  contract: context.state.addressToIndex[record.contract],
                  tokenAgent: context.state.addressToIndex[record.tokenAgent],
                  owner: context.state.addressToIndex[record.owner],
                };
                newRecords.push(newRecord);
              }
              if (newRecords.length) {
                addCount += newRecords.length;
                context.dispatch('saveData', ['indexToAddress', 'indexToTxHash']);
                await db.tokenAgentFactoryEvents.bulkAdd(newRecords).then(function(lastKey) {
                  // console.log(now() + " INFO dataModule:actions.syncTokenAgentFactoryEvents.bulkAdd - lastKey: " + JSON.stringify(lastKey));
                }).catch(Dexie.BulkError, function(e) {
                  // console.log(now() + " INFO dataModule:actions.syncTokenAgentFactoryEvents bulkAdd error: " + JSON.stringify(e.failures, null, 2));
                });
              }
            } catch (e) {
              split = true;
            }
          } else {
            split = true;
          }
          if (split) {
            const mid = parseInt((fromBlock + toBlock) / 2);
            await getLogs(fromBlock, mid);
            await getLogs(parseInt(mid) + 1, toBlock);
          }
        }
        context.commit('setSyncSection', { section: 'TokenAgentFactory events', total: null });
        const data = await db.cache.where("objectName").equals('tokenAgentFactory.' + parameter.chainId).toArray();
        startBlock = data.length == 1 ? data[0].object - parameter.confirmations : 0;
        deleteCount = await db.tokenAgentFactoryEvents.where("[chainId+blockNumber+logIndex]").between([parameter.chainId, startBlock, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).delete();
        await getLogs(startBlock, parameter.blockNumber);
        await db.cache.put({ objectName: 'tokenAgentFactory.' + parameter.chainId, object: parameter.blockNumber }).then(function() {
        }).catch(function(error) {
          console.log("error: " + error);
        });
      }
      console.log(now() + " INFO dataModule:actions.syncTokenAgentFactoryEvents END - startBlock: " + startBlock + ", blockNumber: " + parameter.blockNumber+ ", deleteCount: " + deleteCount + ", addCount: " + addCount);
    },

    async collateTokenAgentFactoryEvents(context, parameter) {
      console.log(now() + " INFO dataModule:actions.collateTokenAgentFactoryEvents BEGIN - token: " + parameter.token);
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      // console.log("tokenAgents BEFORE: " + JSON.stringify(context.state.tokenAgents, null, 2));
      let rows = 0;
      let done = false;
      do {
        let data = await db.tokenAgentFactoryEvents.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        // console.log(now() + " INFO dataModule:actions.collateTokenAgentFactoryEvents - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        for (const item of data) {
          if (!(parameter.chainId in context.state.tokenAgents) || !(item.tokenAgent in context.state.tokenAgents[parameter.chainId])) {
            context.commit('addTokenAgent', item);
          }
        }
        rows = parseInt(rows) + data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      // console.log("tokenAgents AFTER: " + JSON.stringify(context.state.tokenAgents, null, 2));
      await context.dispatch('saveData', ['tokenAgents']);
      console.log(now() + " INFO dataModule:actions.collateTokenAgentFactoryEvents END - rows: " + rows);
    },

    async syncTokenAgentGeneralEvents(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncTokenAgentGeneralEvents BEGIN - token: " + parameter.token);
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = parameter.chainId && NETWORKS[parameter.chainId.toString()] || {};
      let [startBlock, deleteAcount, addCount] = [0, 0, 0];
      if (network.tokenAgentFactory) {
        async function getLogs(fromBlock, toBlock) {
          // console.log(now() + " INFO dataModule:actions.syncTokenAgentGeneralEvents.getLogs: " + fromBlock + " - " + toBlock);
          let split = false;
          const maxLogScrapingSize = NETWORKS['' + parameter.chainId].maxLogScrapingSize || null;
          if (!maxLogScrapingSize || (toBlock - fromBlock) <= maxLogScrapingSize) {
            try {
              const filter = {
                address: null, fromBlock, toBlock,
                topics: [[
                  // event OffersInvalidated(Nonce newNonce, Unixtime timestamp);
                  ethers.utils.id("OffersInvalidated(uint24,uint40)"),
                  ],
                ],
              };
              const eventLogs = await provider.getLogs(filter);
              const records = parseTokenAgentEventLogs(eventLogs, parameter.chainId, network.tokenAgent.abi);
              const newRecords = [];
              for (const record of records) {
                const contractIndex = context.state.addressToIndex[record.contract];
                if (record.eventType == EVENTTYPE_OFFERSINVALIDATED && (contractIndex in (context.state.tokenAgents[parameter.chainId] || {}))) {
                  if (!(record.txHash in context.state.txHashToIndex)) {
                    context.commit('addTxHashIndex', record.txHash);
                  }
                  for (const address of [record.contract]) {
                    if (!(address in context.state.addressToIndex)) {
                      context.commit('addAddressIndex', address);
                    }
                  }
                  const newRecord = {
                    ...record,
                    txHash: context.state.txHashToIndex[record.txHash],
                    contract: context.state.addressToIndex[record.contract],
                  };
                  newRecords.push(newRecord);
                }
              }
              if (newRecords.length) {
                addCount += newRecords.length;
                context.dispatch('saveData', ['indexToAddress', 'indexToTxHash']);
                await db.tokenAgentEvents.bulkAdd(newRecords).then(function(lastKey) {
                  // console.log(now() + " INFO dataModule:actions.syncTokenAgentGeneralEvents.bulkAdd - lastKey: " + JSON.stringify(lastKey));
                }).catch(Dexie.BulkError, function(e) {
                  // console.log(now() + " INFO dataModule:actions.syncTokenAgentGeneralEvents bulkAdd error: " + JSON.stringify(e.failures, null, 2));
                });
              }
            } catch (e) {
              split = true;
            }
          } else {
            split = true;
          }
          if (split) {
            const mid = parseInt((fromBlock + toBlock) / 2);
            await getLogs(fromBlock, mid);
            await getLogs(parseInt(mid) + 1, toBlock);
          }
        }
        context.commit('setSyncSection', { section: 'TokenAgent general events', total: null });
        const data = await db.cache.where("objectName").equals('tokenAgentGeneral.' + parameter.chainId).toArray();
        startBlock = data.length == 1 ? data[0].object - parameter.confirmations : 0;
        deleteCount = await db.tokenAgentEvents.where("[chainId+blockNumber+logIndex]").between([parameter.chainId, startBlock, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).delete();
        await getLogs(startBlock, parameter.blockNumber);
        await db.cache.put({ objectName: 'tokenAgentGeneral.' + parameter.chainId, object: parameter.blockNumber }).then(function() {
        }).catch(function(error) {
          console.log("error: " + error);
        });
      }
      console.log(now() + " INFO dataModule:actions.syncTokenAgentGeneralEvents END - startBlock: " + startBlock + ", blockNumber: " + parameter.blockNumber+ ", deleteCount: " + deleteCount + ", addCount: " + addCount);
    },

    async collateTokenAgentGeneralEvents(context, parameter) {
      console.log(now() + " INFO dataModule:actions.collateTokenAgentGeneralEvents BEGIN - token: " + parameter.token);
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      // console.log("tokenAgents BEFORE: " + JSON.stringify(context.statetokenAgents, null, 2));
      let rows = 0;
      let done = false;
      do {
        let data = await db.tokenAgentEvents.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        // console.log(now() + " INFO dataModule:actions.collateTokenAgentGeneralEvents - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        for (const item of data) {
          context.commit('updateTokenAgentNonce', item);
        }
        rows = parseInt(rows) + data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      // console.log("tokenAgents AFTER: " + JSON.stringify(context.state.tokenAgents, null, 2));
      await context.dispatch('saveData', ['tokenAgents']);
      console.log(now() + " INFO dataModule:actions.collateTokenAgentGeneralEvents END - rows: " + rows);
    },

    async syncTokenSetTokenAgentEvents(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncTokenSetTokenAgentEvents BEGIN - token: " + parameter.token);
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = parameter.chainId && NETWORKS[parameter.chainId.toString()] || {};
      let [startBlock, deleteAcount, addCount] = [0, 0, 0];
      if (network.tokenAgentFactory) {
        async function getLogs(fromBlock, toBlock) {
          // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenAgentEvents.getLogs: " + fromBlock + " - " + toBlock);
          let split = false;
          const maxLogScrapingSize = NETWORKS['' + parameter.chainId].maxLogScrapingSize || null;
          if (!maxLogScrapingSize || (toBlock - fromBlock) <= maxLogScrapingSize) {
            try {
              const filter = {
                address: null, fromBlock, toBlock,
                topics: [[
                  // event Offered(Index index, Token indexed token, TokenType tokenType, Account indexed maker, BuySell buySell, Unixtime expiry, Nonce nonce, Price[] prices, TokenId[] tokenIds, Tokens[] tokenss, Unixtime timestamp);
                  ethers.utils.id("Offered(uint32,address,uint8,address,uint8,uint40,uint24,uint128[],uint256[],uint128[],uint40)"),
                  // event Traded(Index index, Token indexed token, TokenType tokenType, Account indexed maker, Account indexed taker, BuySell makerBuySell, uint[] prices, uint[] tokenIds, uint[] tokenss, Tokens[] remainingTokenss, Price price, Unixtime timestamp);
                  // Traded (uint32 index, index_topic_1 address token, uint8 tokenType, index_topic_2 address maker, index_topic_3 address taker, uint8 makerBuySell, uint256[] prices, uint256[] tokenIds, uint256[] tokenss, uint128[] remainingTokenss, uint128 price, uint40 timestamp)
                  ethers.utils.id("Traded(uint32,address,uint8,address,address,uint8,uint256[],uint256[],uint256[],uint128[],uint128,uint40)"),
                  // TODO event OfferUpdated(Index index, Token indexed token, TokenType tokenType, Account indexed maker, BuySell buySell, Unixtime expiry, Nonce nonce, Price[] prices, TokenId[] tokenIds, Tokens[] tokenss, Unixtime timestamp);
                  ],
                  [ '0x000000000000000000000000' + parameter.token.substring(2, 42).toLowerCase() ],
                ],
              };
              const eventLogs = await provider.getLogs(filter);
              const records = parseTokenAgentEventLogs(eventLogs, parameter.chainId, network.tokenAgent.abi);
              const newRecords = [];
              for (const record of records) {
                const contractIndex = context.state.addressToIndex[record.contract];
                if (contractIndex in (context.state.tokenAgents[parameter.chainId] || {})) {
                  if (!(record.txHash in context.state.txHashToIndex)) {
                    context.commit('addTxHashIndex', record.txHash);
                  }
                  let addresses = [];
                  if (record.eventType == EVENTTYPE_OFFERED) {
                    addresses = [record.contract, record.token, record.maker];
                  } else if (record.eventType == EVENTTYPE_TRADED) {
                    addresses = [record.contract, record.token, record.maker, record.taker];
                  }
                  for (const address of addresses) {
                    if (!(address in context.state.addressToIndex)) {
                      context.commit('addAddressIndex', address);
                    }
                  }
                  let newRecord = {};
                  if (record.eventType == EVENTTYPE_OFFERED) {
                    addresses = [record.contract, record.token, record.maker];
                    newRecord = {
                      tokenSet: parameter.tokenIndex,
                      ...record,
                      txHash: context.state.txHashToIndex[record.txHash],
                      contract: context.state.addressToIndex[record.contract],
                      token: context.state.addressToIndex[record.token],
                      maker: context.state.addressToIndex[record.maker],
                    };
                  } else if (record.eventType == EVENTTYPE_TRADED) {
                    addresses = [record.contract, record.token, record.maker, record.taker];
                    newRecord = {
                      tokenSet: parameter.tokenIndex,
                      ...record,
                      txHash: context.state.txHashToIndex[record.txHash],
                      contract: context.state.addressToIndex[record.contract],
                      token: context.state.addressToIndex[record.token],
                      maker: context.state.addressToIndex[record.maker],
                      taker: context.state.addressToIndex[record.taker],
                    };
                  }
                  newRecords.push(newRecord);
                }
              }
              if (newRecords.length) {
                addCount += newRecords.length;
                context.dispatch('saveData', ['indexToAddress', 'indexToTxHash']);
                await db.tokenSetTokenAgentEvents.bulkAdd(newRecords).then(function(lastKey) {
                  // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenAgentEvents.bulkAdd - lastKey: " + JSON.stringify(lastKey));
                }).catch(Dexie.BulkError, function(e) {
                  // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenAgentEvents bulkAdd error: " + JSON.stringify(e.failures, null, 2));
                });
              }
            } catch (e) {
              split = true;
            }
          } else {
            split = true;
          }
          if (split) {
            const mid = parseInt((fromBlock + toBlock) / 2);
            await getLogs(fromBlock, mid);
            await getLogs(parseInt(mid) + 1, toBlock);
          }
        }
        context.commit('setSyncSection', { section: 'TokenSet TokenAgent events', total: null });
        const data = await db.cache.where("objectName").equals('tokenSetTokenAgent.' + parameter.chainId + '.' + parameter.tokenIndex).toArray();
        startBlock = data.length == 1 ? data[0].object - parameter.confirmations : 0;
        deleteCount = await db.tokenSetTokenAgentEvents.where("[tokenSet+blockNumber+logIndex]").between([parameter.tokenIndex, startBlock, Dexie.minKey],[parameter.tokenIndex, Dexie.maxKey, Dexie.maxKey]).delete();
        await getLogs(startBlock, parameter.blockNumber);
        await db.cache.put({ objectName: 'tokenSetTokenAgent.' + parameter.chainId + '.' + parameter.tokenIndex, object: parameter.blockNumber }).then(function() {
        }).catch(function(error) {
          console.log("error: " + error);
        });
      }
      console.log(now() + " INFO dataModule:actions.syncTokenSetTokenAgentEvents END - startBlock: " + startBlock + ", blockNumber: " + parameter.blockNumber+ ", deleteCount: " + deleteCount + ", addCount: " + addCount);
    },

    async collateTokenSetTokenAgentEvents(context, parameter) {
      console.log(now() + " INFO dataModule:actions.collateTokenSetTokenAgentEvents BEGIN - token: " + parameter.token);
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const tokenSetAgents = {};
      const tokenSetOwners = {};
      const newAddress = false;
      for (const [address, d] of Object.entries(context.state.addresses)) {
        if (!(address in context.state.addressToIndex)) {
          context.commit('addAddressIndex', address);
          newAddress = true;
        }
        tokenSetOwners[context.state.addressToIndex[address]] = 1;
      }
      if (newAddress) {
        context.dispatch('saveData', ['indexToAddress']);
      }
      if (!(parameter.coinbaseIndex in tokenSetOwners)) {
        tokenSetOwners[parameter.coinbaseIndex] = 1;
      }
      let rows = 0;
      let done = false;
      do {
        let data = await db.tokenSetTokenAgentEvents.where('[tokenSet+blockNumber+logIndex]').between([parameter.tokenIndex, Dexie.minKey, Dexie.minKey],[parameter.tokenIndex, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        for (const e of data) {
          // console.log(now() + " INFO dataModule:actions.collateTokenSetTokenAgentEvents - e: " + JSON.stringify(e));
          if (!(e.contract in tokenSetAgents)) {
            tokenSetAgents[e.contract] = 1;
          }
          if (('maker' in e) && !(e.maker in tokenSetOwners)) {
            tokenSetOwners[e.maker] = 1;
          }
          if (('taker' in e) && !(e.taker in tokenSetOwners)) {
            tokenSetOwners[e.taker] = 1;
          }
        }
        rows = parseInt(rows) + data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      context.commit('setState', { name: 'tokenSetAgents', data: tokenSetAgents });
      context.commit('setState', { name: 'tokenSetOwners', data: tokenSetOwners });
      // console.log("tokenSetAgents: " + JSON.stringify(Object.keys(context.state.tokenSetAgents).map(e => context.state.indexToAddress[e])));
      // console.log("tokenSetOwners: " + JSON.stringify(Object.keys(context.state.tokenSetOwners).map(e => context.state.indexToAddress[e])));
      await context.dispatch('saveData', ['tokenSetAgents', 'tokenSetOwners']);
      console.log(now() + " INFO dataModule:actions.collateTokenSetTokenAgentEvents END - tokenSetAgents: " + Object.keys(tokenSetAgents).length + ", tokenSetOwners: " + Object.keys(tokenSetOwners).length);
    },

    async syncTokenSetTokenAgentInternalEvents(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncTokenSetTokenAgentInternalEvents BEGIN - token: " + parameter.token);
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = parameter.chainId && NETWORKS[parameter.chainId.toString()] || {};
      let [startBlock, deleteAcount, addCount] = [0, 0, 0];
      if (network.tokenAgentFactory) {
        async function getLogs(fromBlock, toBlock, part) {
          // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenAgentInternalEvents.getLogs: " + fromBlock + " - " + toBlock);
          const tokenSetAgentAddresses = Object.keys(context.state.tokenSetAgents).map(e => '0x000000000000000000000000' + context.state.indexToAddress[e].substring(2, 42).toLowerCase());
          const fromAddresses = part == 0 ? tokenSetAgentAddresses : null;
          const toAddresses = part == 1 ? tokenSetAgentAddresses : null;
          // TODO: Split up into batches of addresses
          // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenAgentInternalEvents - part: " + part + ", fromAddresses: " + JSON.stringify(fromAddresses) + ", toAddresses: " + JSON.stringify(toAddresses));
          let split = false;
          const maxLogScrapingSize = NETWORKS['' + parameter.chainId].maxLogScrapingSize || null;
          if (!maxLogScrapingSize || (toBlock - fromBlock) <= maxLogScrapingSize) {
            try {
              const filter = {
                address: null, fromBlock, toBlock,
                topics: [[
                    // event InternalTransfer(address indexed from, address indexed to, uint ethers, Unixtime timestamp);
                    ethers.utils.id("InternalTransfer(address,address,uint256,uint40)"),
                  ],
                  fromAddresses,
                  toAddresses,
                ],
              };
              const eventLogs = await provider.getLogs(filter);
              const records = parseTokenAgentEventLogs(eventLogs, parameter.chainId, network.tokenAgent.abi);
              const newRecords = [];
              for (const record of records) {
                // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenAgentInternalEvents - record: " + JSON.stringify(record, null, 2));
                const contractIndex = context.state.addressToIndex[record.contract];
                if (contractIndex in (context.state.tokenAgents[parameter.chainId] || {})) {
                  if (!(record.txHash in context.state.txHashToIndex)) {
                    context.commit('addTxHashIndex', record.txHash);
                  }
                  for (const address of [record.from, record.to]) {
                    if (!(address in context.state.addressToIndex)) {
                      context.commit('addAddressIndex', address);
                    }
                  }
                  newRecord = {
                    tokenSet: parameter.tokenIndex,
                    ...record,
                    txHash: context.state.txHashToIndex[record.txHash],
                    contract: context.state.addressToIndex[record.contract],
                    from: context.state.addressToIndex[record.from],
                    to: context.state.addressToIndex[record.to],
                  };
                  newRecords.push(newRecord);
                }
              }
              if (newRecords.length) {
                addCount += newRecords.length;
                context.dispatch('saveData', ['indexToAddress', 'indexToTxHash']);
                await db.tokenSetTokenAgentInternalEvents.bulkAdd(newRecords).then(function(lastKey) {
                  // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenAgentInternalEvents.bulkAdd - lastKey: " + JSON.stringify(lastKey));
                }).catch(Dexie.BulkError, function(e) {
                  // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenAgentInternalEvents bulkAdd error: " + JSON.stringify(e.failures, null, 2));
                });
              }
            } catch (e) {
              split = true;
            }
          } else {
            split = true;
          }
          if (split) {
            const mid = parseInt((fromBlock + toBlock) / 2);
            await getLogs(fromBlock, mid, part);
            await getLogs(parseInt(mid) + 1, toBlock, part);
          }
        }
        context.commit('setSyncSection', { section: 'TokenSet TokenAgent events', total: null });
        const data = await db.cache.where("objectName").equals('tokenSetTokenAgentInternalEvents.' + parameter.chainId + '.' + parameter.tokenIndex).toArray();
        startBlock = data.length == 1 ? data[0].object - parameter.confirmations : 0;
        deleteCount = await db.tokenSetTokenAgentInternalEvents.where("[tokenSet+blockNumber+logIndex]").between([parameter.tokenIndex, startBlock, Dexie.minKey],[parameter.tokenIndex, Dexie.maxKey, Dexie.maxKey]).delete();
        await getLogs(startBlock, parameter.blockNumber, 0);
        await getLogs(startBlock, parameter.blockNumber, 1);
        await db.cache.put({ objectName: 'tokenSetTokenAgentInternalEvents.' + parameter.chainId + '.' + parameter.tokenIndex, object: parameter.blockNumber }).then(function() {
        }).catch(function(error) {
          console.log("error: " + error);
        });
      }
      console.log(now() + " INFO dataModule:actions.syncTokenSetTokenAgentInternalEvents END - startBlock: " + startBlock + ", blockNumber: " + parameter.blockNumber+ ", deleteCount: " + deleteCount + ", addCount: " + addCount);
    },

    async syncTokenSetTokenEvents(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncTokenSetTokenEvents BEGIN - token: " + parameter.token);
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = parameter.chainId && NETWORKS[parameter.chainId.toString()] || {};
      let [startBlock, deleteAcount, addCount] = [0, 0, 0];
      if (network.tokenAgentFactory) {
        async function getLogs(fromBlock, toBlock, part, addresses) {
          console.log(now() + " INFO dataModule:actions.syncTokenSetTokenEvents.getLogs: " + fromBlock + " - " + toBlock + ", part: " + part + ", addresses: " + JSON.stringify(addresses));
          const addressesInBytes = addresses.map(e => '0x000000000000000000000000' + context.state.indexToAddress[e].substring(2, 42).toLowerCase());
          let split = false;
          const maxLogScrapingSize = NETWORKS['' + parameter.chainId].maxLogScrapingSize || null;
          if (!maxLogScrapingSize || (toBlock - fromBlock) <= maxLogScrapingSize) {
            try {
              let filter = null;
              if (part == 0) {
                filter = {
                  address: parameter.token, fromBlock, toBlock,
                  topics: [[
                      // ERC-20 event Approval(address indexed owner, address indexed spender, uint tokens);
                      ethers.utils.id("Approval(address,address,uint256)"),
                    ],
                    null,
                    addressesInBytes,
                  ]};
              } else if (part == 1) {
                filter = {
                  address: parameter.weth, fromBlock, toBlock,
                  topics: [[
                      // ERC-20 event Approval(address indexed owner, address indexed spender, uint tokens);
                      ethers.utils.id("Approval(address,address,uint256)"),
                    ],
                    null,
                    addressesInBytes,
                  ]};
              } else if (part == 2) {
                filter = {
                  address: parameter.token, fromBlock, toBlock,
                  topics: [[
                      // ERC-20 event Transfer(address indexed from, address indexed to, uint tokens);
                      ethers.utils.id("Transfer(address,address,uint256)"),
                    ],
                    addressesInBytes,
                    null,
                  ]};
              } else if (part == 3) {
                filter = {
                  address: parameter.token, fromBlock, toBlock,
                  topics: [[
                      // ERC-20 event Transfer(address indexed from, address indexed to, uint tokens);
                      ethers.utils.id("Transfer(address,address,uint256)"),
                    ],
                    null,
                    addressesInBytes,
                  ]};
              } else if (part == 4) {
                filter = {
                  address: parameter.weth, fromBlock, toBlock,
                  topics: [[
                      // ERC-20 event Transfer(address indexed from, address indexed to, uint tokens);
                      ethers.utils.id("Transfer(address,address,uint256)"),
                      // WETH event  Deposit(address indexed dst, uint wad);
                      ethers.utils.id("Deposit(address,uint256)"),
                      // WETH event  Withdrawal(address indexed src, uint wad);
                      ethers.utils.id("Withdrawal(address,uint256)"),
                    ],
                    addressesInBytes,
                    null,
                  ]};
              } else if (part == 5) {
                filter = {
                  address: parameter.weth, fromBlock, toBlock,
                  topics: [[
                      // ERC-20 event Transfer(address indexed from, address indexed to, uint tokens);
                      ethers.utils.id("Transfer(address,address,uint256)"),
                    ],
                    null,
                    addressesInBytes,
                  ]};
              }
              // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenEvents - part: " + part + ", filter: " + JSON.stringify(filter));
              const eventLogs = await provider.getLogs(filter);
              const records = parseTokenEventLogs(eventLogs, parameter.chainId);
              // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenEvents - records: " + JSON.stringify(records));
              const newRecords = [];
              for (const record of records) {
                if (!(record.txHash in context.state.txHashToIndex)) {
                  context.commit('addTxHashIndex', record.txHash);
                }
                if (record.eventType == EVENTTYPE_APPROVAL) {
                  for (const address of [record.owner, record.spender]) {
                    if (!(address in context.state.addressToIndex)) {
                      context.commit('addAddressIndex', address);
                    }
                  }
                  newRecord = {
                    tokenSet: parameter.tokenIndex,
                    ...record,
                    txHash: context.state.txHashToIndex[record.txHash],
                    contract: context.state.addressToIndex[record.contract],
                    owner: context.state.addressToIndex[record.owner],
                    spender: context.state.addressToIndex[record.spender],
                  };
                } else {
                  for (const address of [record.from, record.to]) {
                    if (!(address in context.state.addressToIndex)) {
                      context.commit('addAddressIndex', address);
                    }
                  }
                  newRecord = {
                    tokenSet: parameter.tokenIndex,
                    ...record,
                    txHash: context.state.txHashToIndex[record.txHash],
                    contract: context.state.addressToIndex[record.contract],
                    from: context.state.addressToIndex[record.from],
                    to: context.state.addressToIndex[record.to],
                  };
                }
                newRecords.push(newRecord);
              }
              if (newRecords.length) {
                addCount += newRecords.length;
                context.dispatch('saveData', ['indexToAddress', 'indexToTxHash']);
                await db.tokenSetTokenEvents.bulkAdd(newRecords).then(function(lastKey) {
                  // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenEvents.bulkAdd - lastKey: " + JSON.stringify(lastKey));
                }).catch(Dexie.BulkError, function(e) {
                  // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenEvents bulkAdd error: " + JSON.stringify(e.failures, null, 2));
                });
              }
            } catch (e) {
              split = true;
            }
          } else {
            split = true;
          }
          if (split) {
            const mid = parseInt((fromBlock + toBlock) / 2);
            await getLogs(fromBlock, mid, part, addresses);
            await getLogs(parseInt(mid) + 1, toBlock, part, addresses);
          }
        }
        context.commit('setSyncSection', { section: 'TokenSet TokenAgent events', total: null });
        const data = await db.cache.where("objectName").equals('tokenSetTokenEvents.' + parameter.chainId + '.' + parameter.tokenIndex).toArray();
        let [startBlock, lastAgentList, lastOwnerList] = [0, [], []];
        if (data.length == 1) {
          startBlock = data[0].object.blockNumber - parameter.confirmations;
          lastAgentList = data[0].object.agents || [];
          lastOwnerList = data[0].object.owners || [];
        }
        // lastAgentList = [5, 6, 7];
        // lastOwnerList = [10];
        const lastAgents = {};
        lastAgentList.forEach(e => { lastAgents[e] = 1; });
        const newAgents = {};
        Object.keys(context.state.tokenSetAgents).forEach(e => { if (!(e in lastAgents)) { newAgents[e] = 1; } });
        const lastOwners = {};
        lastOwnerList.forEach(e => { lastOwners[e] = 1; });
        const newOwners = {};
        Object.keys(context.state.tokenSetOwners).forEach(e => { if (!(e in lastOwners)) { newOwners[e] = 1; } });
        // console.log(now() + " INFO dataModule:actions.syncTokenSetTokenEvents - startBlock: " + startBlock + ", lastAgents: " + JSON.stringify(Object.keys(lastAgents)) + ", newAgents: " + JSON.stringify(Object.keys(newAgents)) + ", lastOwners: " + JSON.stringify(Object.keys(lastOwners)) + ", newOwners: " + JSON.stringify(Object.keys(newOwners)));
        deleteCount = await db.tokenSetTokenEvents.where("[tokenSet+blockNumber+logIndex]").between([parameter.tokenIndex, startBlock, Dexie.minKey],[parameter.tokenIndex, Dexie.maxKey, Dexie.maxKey]).delete();
        const BATCHSIZE = 100;
        for (let i = 0; i < 6; i++) {
          const lastAddresses = i < 2 ? Object.keys(lastAgents) : Object.keys(lastOwners);
          const newAddresses = i < 2 ? Object.keys(newAgents) : Object.keys(newOwners);
          console.log(now() + " INFO dataModule:actions.syncTokenSetTokenEvents - part: " + i + " lastAddresses: " + JSON.stringify(lastAddresses) + ", newAddresses: " + JSON.stringify(newAddresses));
          if (lastAddresses.length > 0) {
            for (let j = 0; j < lastAddresses.length; j += BATCHSIZE) {
              const batch = lastAddresses.slice(j, parseInt(j) + BATCHSIZE);
              await getLogs(startBlock, parameter.blockNumber, i, batch);
            }
          }
          if (newAddresses.length > 0) {
            for (let j = 0; j < newAddresses.length; j += BATCHSIZE) {
              const batch = newAddresses.slice(j, parseInt(j) + BATCHSIZE);
              await getLogs(0, parameter.blockNumber, i, batch);
            }
          }
        }
        await db.cache.put({ objectName: 'tokenSetTokenEvents.' + parameter.chainId + '.' + parameter.tokenIndex,
          object: {
            blockNumber: parameter.blockNumber,
            agents: Object.keys(context.state.tokenSetAgents).map(e => parseInt(e)),
            owners: Object.keys(context.state.tokenSetOwners).map(e => parseInt(e)),
          }
        }).then(function() {
        }).catch(function(error) {
          console.log("error: " + error);
        });
      }
      console.log(now() + " INFO dataModule:actions.syncTokenSetTokenEvents END - startBlock: " + startBlock + ", blockNumber: " + parameter.blockNumber+ ", deleteCount: " + deleteCount + ", addCount (with duplicates): " + addCount);
    },

    async collateTokenSet(context, parameter) {
      console.log(now() + " INFO dataModule:actions.collateTokenSet BEGIN - token: " + parameter.token);
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const approvals = {};
      const balances = {};
      const tokenAgents = {};
      // console.log("context.state.tokenSetOwners: " + JSON.stringify(context.state.tokenSetOwners, null, 2));
      let rows = 0;
      let done = false;
      const tradeHashes = {};
      do {
        let data = await db.tokenSetTokenAgentEvents.where('[tokenSet+blockNumber+logIndex]').between([parameter.tokenIndex, Dexie.minKey, Dexie.minKey],[parameter.tokenIndex, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        for (const e of data) {
          if (!(e.contract in tokenAgents)) {
            const ta = context.state.tokenAgents[parameter.chainId] && context.state.tokenAgents[parameter.chainId][e.contract];
            tokenAgents[e.contract] = {
              blockNumber: ta.blockNumber,
              logIndex: ta.logIndex,
              txIndex: ta.txIndex,
              txHash: ta.txHash,
              timestamp: ta.timestamp,
              owner: ta.owner,
              index: ta.index,
              indexByOwner: ta.indexByOwner,
              nonce: ta.nonce,
              nonceBlockNumber: ta.nonceBlockNumber,
              nonceTimestamp: ta.nonceTimestamp,
              events: [],
            };
          }
          tokenAgents[e.contract].events.push(e);
          if (e.eventType == EVENTTYPE_TRADED) {
            // console.log("Traded: " + JSON.stringify(e));
            tradeHashes[e.txHash] = e.contract;
          }
        }
        rows = parseInt(rows) + data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      // console.log("tradeHashes: " + JSON.stringify(Object.keys(tradeHashes), null, 2));
      rows = 0;
      done = false;
      do {
        let data = await db.tokenSetTokenEvents.where('[tokenSet+blockNumber+logIndex]').between([parameter.tokenIndex, Dexie.minKey, Dexie.minKey],[parameter.tokenIndex, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        for (const e of data) {
          if (e.eventType == EVENTTYPE_TRANSFER || e.eventType == EVENTTYPE_DEPOSIT || e.eventType == EVENTTYPE_WITHDRAWAL) {
            // console.log(now() + " INFO dataModule:actions.collateTokenSet - Transfer: " + JSON.stringify(e));
            if (e.to in context.state.tokenSetOwners) {
              if (!(e.contract in balances)) {
                balances[e.contract] = {};
              }
              if (!(e.to in balances[e.contract])) {
                balances[e.contract][e.to] = { tokens: e.tokens };
              } else {
                balances[e.contract][e.to].tokens = ethers.BigNumber.from(balances[e.contract][e.to].tokens).add(e.tokens).toString();
              }
            }
            if (e.from in context.state.tokenSetOwners) {
              if (!(e.contract in balances)) {
                balances[e.contract] = {};
              }
              if (!(e.from in balances[e.contract])) {
                balances[e.contract][e.from] = {
                  tokens: e.from == ADDRESS0 ? "0" : ethers.BigNumber.from(0).sub(e.tokens).toString(),
                };
              } else {
                balances[e.contract][e.from].tokens = ethers.BigNumber.from(balances[e.contract][e.from].tokens).sub(e.tokens).toString();
              }
            }
            if (e.txHash in tradeHashes) {
              // console.log(now() + " INFO dataModule:actions.collateTokenSet - Trade Transfer: " + JSON.stringify(e));
              const tokenAgent = tradeHashes[e.txHash];
              if (approvals[e.contract] && approvals[e.contract][e.from] && approvals[e.contract][e.from][tokenAgent]) {
                approvals[e.contract][e.from][tokenAgent].spent = ethers.BigNumber.from(approvals[e.contract][e.from][tokenAgent].spent).add(e.tokens).toString();
                approvals[e.contract][e.from][tokenAgent].tokens = ethers.BigNumber.from(approvals[e.contract][e.from][tokenAgent].tokens).sub(e.tokens).toString();
                approvals[e.contract][e.from][tokenAgent].spends.push({ txHash: e.txHash, logIndex: e.logIndex, tokens: e.tokens });
              }
            }
          } else if (e.eventType == EVENTTYPE_APPROVAL) {
            // console.log(now() + " INFO dataModule:actions.collateTokenSet - Approval: " + JSON.stringify(e));
            if (!(e.contract in approvals)) {
              approvals[e.contract] = {};
            }
            if (!(e.owner in approvals[e.contract])) {
              approvals[e.contract][e.owner] = {};
            }
            approvals[e.contract][e.owner][e.spender] = { tokens: e.tokens, approvedTokens: e.tokens, txHash: e.txHash, logIndex: e.logIndex, spent: 0, spends: [] };
          } else {
            console.log(now() + " INFO dataModule:actions.collateTokenSet - e: " + JSON.stringify(e));
          }
        }
        rows = parseInt(rows) + data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);

      const tokenSet = {
        chainId: parameter.chainId,
        token: parameter.token,
        tokenIndex: parameter.tokenIndex,
        symbol: parameter.symbol,
        name: parameter.name,
        decimals: parameter.decimals,
        weth: parameter.weth,
        wethIndex: parameter.wethIndex,
        blockNumber: parameter.blockNumber,
        timestamp: parameter.timestamp,
        approvals,
        balances,
        tokenAgents,
      };
      context.commit('setState', { name: 'tokenSet', data: tokenSet });
      await context.dispatch('saveData', ['tokenSet']);
      // console.log(now() + " INFO dataModule:actions.collateTokenSet END - tokenAgents: " + JSON.stringify(tokenAgents));
      // console.log(now() + " INFO dataModule:actions.collateTokenSet END - tokenSet: " + JSON.stringify(tokenSet));
    },




    async syncTokenAgentsEvents(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncTokenAgentsEvents BEGIN - token: " + parameter.token);
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      return;

      // StealthMetaAddressSet (index_topic_1 address registrant, index_topic_2 uint256 schemeId, bytes stealthMetaAddress)
      // 0x4e739a47dfa4fd3cfa92f8fe760cebe125565927e5c422cb28e7aa388a067af9
      const erc5564RegistryContract = new ethers.Contract(ERC6538REGISTRYADDRESS, ERC6538REGISTRYABI, provider);
      let total = 0;
      let t = this;
      async function processLogs(fromBlock, toBlock, logs) {
        total = parseInt(total) + logs.length;
        context.commit('setSyncCompleted', total);
        console.log(now() + " INFO dataModule:actions.syncTokenAgentsEvents.processLogs: " + fromBlock + " - " + toBlock + " " + logs.length + " " + total);
        const records = [];
        for (const log of logs) {
          if (!log.removed) {
            try {
              const logData = erc5564RegistryContract.interface.parseLog(log);
              // console.log("logData: " + JSON.stringify(logData, null, 2));
              const [ contract, schemeId ] = [ log.address, parseInt(logData.args[1]) ];
              if (schemeId == ONLY_SUPPORTED_SCHEME_ID) {
                records.push( {
                  chainId: parameter.chainId,
                  blockNumber: parseInt(log.blockNumber),
                  logIndex: parseInt(log.logIndex),
                  txIndex: parseInt(log.transactionIndex),
                  txHash: log.transactionHash,
                  contract,
                  name: logData.name,
                  registrant: ethers.utils.getAddress(logData.args[0]),
                  schemeId,
                  stealthMetaAddress: ethers.utils.toUtf8String(logData.args[2]),
                  mine: false,
                  confirmations: parameter.blockNumber - log.blockNumber,
                  timestamp: null,
                  tx: null,
                });
              }
            } catch (e) {
              console.log(now() + " ERROR dataModule:actions.syncTokenAgentsEvents.processLogs: " + e.message);
            }
          }
        }
        if (records.length) {
          await db.registrations.bulkAdd(records).then(function(lastKey) {
            console.log(now() + " INFO dataModule:actions.syncTokenAgentsEvents.bulkAdd - lastKey: " + JSON.stringify(lastKey));
          }).catch(Dexie.BulkError, function(e) {
            // console.log(now() + " INFO dataModule:actions.syncTokenAgentsEvents bulkAdd error: " + JSON.stringify(e.failures, null, 2));
          });
        }
      }
      async function getLogs(fromBlock, toBlock, processLogs) {
        console.log(now() + " INFO dataModule:actions.syncTokenAgentsEvents.getLogs: " + fromBlock + " - " + toBlock);
        let split = false;
        const maxLogScrapingSize = NETWORKS['' + parameter.chainId].maxLogScrapingSize || null;
        if (!maxLogScrapingSize || (toBlock - fromBlock) <= maxLogScrapingSize) {
          try {
            const filter = {
              address: ERC6538REGISTRYADDRESS,
              fromBlock,
              toBlock,
              topics: [
                '0x4e739a47dfa4fd3cfa92f8fe760cebe125565927e5c422cb28e7aa388a067af9',
                null,
                null
              ]
            };
            const eventLogs = await provider.getLogs(filter);
            await processLogs(fromBlock, toBlock, eventLogs);
          } catch (e) {
            split = true;
          }
        } else {
          split = true;
        }
        if (split) {
          const mid = parseInt((fromBlock + toBlock) / 2);
          await getLogs(fromBlock, mid, processLogs);
          await getLogs(parseInt(mid) + 1, toBlock, processLogs);
        }
      }
      console.log(now() + " INFO dataModule:actions.syncTokenAgentsEvents BEGIN");
      context.commit('setSyncSection', { section: 'Stealth Meta-Address Registry', total: null });
      const deleteCall = await db.registrations.where("confirmations").below(parameter.confirmations).delete();
      const latest = await db.registrations.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).last();
      // TODO: Handle incrementalSync?
      const startBlock = (parameter.incrementalSync && latest) ? parseInt(latest.blockNumber) + 1: 0;
      await getLogs(startBlock, parameter.blockNumber, processLogs);
      console.log(now() + " INFO dataModule:actions.syncTokenAgentsEvents END");
    },


    async syncStealthTransfers(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncStealthTransfers BEGIN - token: " + parameter.token);
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Announcement (index_topic_1 uint256 schemeId, index_topic_2 address stealthAddress, index_topic_3 address caller, bytes ephemeralPublicKey, bytes metadata)
      // 0x5f0eab8057630ba7676c49b4f21a0231414e79474595be8e4c432fbf6bf0f4e7
      const erc5564AnnouncerContract = new ethers.Contract(ERC5564ANNOUNCERADDRESS, ERC5564ANNOUNCERABI, provider);
      let total = 0;
      let t = this;
      async function processLogs(fromBlock, toBlock, selectedContracts, selectedCallers, logs) {
        total = parseInt(total) + logs.length;
        context.commit('setSyncCompleted', total);
        console.log(now() + " INFO dataModule:actions.syncStealthTransfers.processLogs: " + fromBlock + " - " + toBlock + " " + logs.length + " " + total);
        const records = [];
        for (const log of logs) {
          if (!log.removed) {
            // console.log(JSON.stringify(log, null, 2));
            const logData = erc5564AnnouncerContract.interface.parseLog(log);
            const contract = log.address;
            const caller = logData.args[2];
            // if (selectedContracts.includes(contract) && selectedCallers.includes(caller)) {
              // console.log("  Processing: " + JSON.stringify(log));
              const transfers = [];
              const metadata = logData.args[4];
              let segment = 0;
              let part;
              do {
                part = metadata.substring(4 + (segment * 112), 4 + (segment * 112) + 112);
                if (part.length == 112) {
                  const functionSelector = "0x" + part.substring(0, 8);
                  const token = ethers.utils.getAddress("0x" + part.substring(8, 48));
                  const valueString = part.substring(48, 112)
                  const value = ethers.BigNumber.from("0x" + valueString).toString();
                  transfers.push({ functionSelector, token, value });
                }
                segment++;
              } while (part.length == 112);
              records.push( {
                chainId: parameter.chainId,
                blockNumber: parseInt(log.blockNumber),
                logIndex: parseInt(log.logIndex),
                txIndex: parseInt(log.transactionIndex),
                txHash: log.transactionHash,
                contract,
                name: logData.name,
                schemeId: parseInt(logData.args[0]),
                stealthAddress: logData.args[1],
                linkedTo: {
                  stealthMetaAddress: null,
                  address: null,
                },
                caller,
                ephemeralPublicKey: logData.args[3],
                metadata: logData.args[4],
                transfers,
                confirmations: parameter.blockNumber - log.blockNumber,
                timestamp: null,
                tx: null,
              });
            // }
          }
        }
        // console.log("records: " + JSON.stringify(records, null, 2));
        if (records.length) {
          await db.announcements.bulkAdd(records).then(function(lastKey) {
            console.log(now() + " INFO dataModule:actions.syncStealthTransfers.bulkAdd lastKey: " + JSON.stringify(lastKey));
          }).catch(Dexie.BulkError, function(e) {
            // console.log(now() + " INFO dataModule:actions.syncStealthTransfers.bulkAdd e: " + JSON.stringify(e.failures, null, 2));
          });
        }
      }
      async function getLogs(fromBlock, toBlock, selectedContracts, selectedCallers, processLogs) {
        console.log(now() + " INFO dataModule:actions.syncStealthTransfers.getLogs: " + fromBlock + " - " + toBlock);
        let split = false;
        const maxLogScrapingSize = NETWORKS['' + parameter.chainId].maxLogScrapingSize || null;
        if (!maxLogScrapingSize || (toBlock - fromBlock) <= maxLogScrapingSize) {
          try {
            const filter = {
              // TODO: address: null,
              address: ERC5564ANNOUNCERADDRESS,
              fromBlock,
              toBlock,
              topics: [
                '0x5f0eab8057630ba7676c49b4f21a0231414e79474595be8e4c432fbf6bf0f4e7',
                null,
                null
              ]
            };
            const eventLogs = await provider.getLogs(filter);
            await processLogs(fromBlock, toBlock, selectedContracts, selectedCallers, eventLogs);
          } catch (e) {
            split = true;
          }
        } else {
          split = true;
        }
        if (split) {
          const mid = parseInt((fromBlock + toBlock) / 2);
          await getLogs(fromBlock, mid, selectedContracts, selectedCallers, processLogs);
          await getLogs(parseInt(mid) + 1, toBlock, selectedContracts, selectedCallers, processLogs);
        }
      }
      console.log(now() + " INFO dataModule:actions.syncStealthTransfers BEGIN");
      context.commit('setSyncSection', { section: 'Stealth Transfers', total: null });
      const selectedContracts = [];
      const selectedCallers = [];
      // for (const [chainId, chainData] of Object.entries(this.contracts)) {
      //   for (const [contract, contractData] of Object.entries(chainData)) {
      //     if (contractData.type == "announcer" && contractData.read) {
      //       selectedContracts.push(contract);
      //     }
      //     if (contractData.type == "caller" && contractData.read) {
      //       selectedCallers.push(contract);
      //     }
      //   }
      // }
      // console.log("selectedCallers: " + JSON.stringify(selectedCallers, null, 2));
      // if (selectedContracts.length > 0) {
        const deleteCall = await db.announcements.where("confirmations").below(parameter.confirmations).delete();
        const latest = await db.announcements.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).last();
        const startBlock = (parameter.incrementalSync && latest) ? parseInt(latest.blockNumber) + 1: 0;
        await getLogs(startBlock, parameter.blockNumber, selectedContracts, selectedCallers, processLogs);
      // }
      console.log(now() + " INFO dataModule:actions.syncStealthTransfers END");
    },

    async syncStealthTransfersData(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncStealthTransfersData: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let total = 0;
      let done = false;
      do {
        let data = await db.announcements.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(total).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        console.log(now() + " INFO dataModule:actions.syncStealthTransfersData - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        total = parseInt(total) + data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      console.log(now() + " INFO dataModule:actions.syncStealthTransfersData - total: " + total);
      context.commit('setSyncSection', { section: 'Stealth Transfer Data', total });
      let rows = 0;
      do {
        let data = await db.announcements.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        console.log(now() + " INFO dataModule:actions.syncStealthTransfersData - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        const records = [];
        for (const item of data) {
          if (item.timestamp == null) {
            const block = await provider.getBlock(item.blockNumber);
            item.timestamp = block.timestamp;
            const tx = await provider.getTransaction(item.txHash);
            const txReceipt = await provider.getTransactionReceipt(item.txHash);
            item.tx = {
              type: tx.type,
              blockHash: tx.blockHash,
              from: tx.from,
              gasPrice: ethers.BigNumber.from(tx.gasPrice).toString(),
              gasLimit: ethers.BigNumber.from(tx.gasLimit).toString(),
              to: tx.to,
              value: ethers.BigNumber.from(tx.value).toString(),
              nonce: tx.nonce,
              data: tx.to && tx.data || null, // Remove contract creation data to reduce memory footprint
              chainId: tx.chainId,
              contractAddress: txReceipt.contractAddress,
              transactionIndex: txReceipt.transactionIndex,
              gasUsed: ethers.BigNumber.from(txReceipt.gasUsed).toString(),
              blockHash: txReceipt.blockHash,
              logs: txReceipt.logs,
              cumulativeGasUsed: ethers.BigNumber.from(txReceipt.cumulativeGasUsed).toString(),
              effectiveGasPrice: ethers.BigNumber.from(txReceipt.effectiveGasPrice).toString(),
              status: txReceipt.status,
              type: txReceipt.type,
            };
            records.push(item);
          }
          rows++;
          context.commit('setSyncCompleted', rows);
        }
        if (records.length > 0) {
          await db.announcements.bulkPut(records).then(function() {
          }).catch(function(error) {
            console.log(now() + " INFO dataModule:actions.syncStealthTransfersData.bulkPut error: " + error);
          });
        }
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);

      console.log(now() + " INFO dataModule:actions.syncStealthTransfersData END");
    },

    async identifyMyStealthTransfers(context, parameter) {

      function checkStealthAddress(stealthAddress, ephemeralPublicKey, viewingPrivateKey, spendingPublicKey) {
        const result = {};
        // console.log(now() + " INFO dataModule:actions.syncStealthTransfersData.checkStealthAddress - stealthAddress: " + stealthAddress + ", ephemeralPublicKey: " + ephemeralPublicKey + ", viewingPrivateKey: " + viewingPrivateKey + ", spendingPublicKey: " + spendingPublicKey);
        result.sharedSecret = nobleCurves.secp256k1.getSharedSecret(viewingPrivateKey.substring(2), ephemeralPublicKey.substring(2), false);
        result.hashedSharedSecret = ethers.utils.keccak256(result.sharedSecret.slice(1));
        result.hashedSharedSecretPoint = nobleCurves.secp256k1.ProjectivePoint.fromPrivateKey(result.hashedSharedSecret.substring(2));
        result.stealthPublicKey = nobleCurves.secp256k1.ProjectivePoint.fromHex(spendingPublicKey.substring(2)).add(result.hashedSharedSecretPoint);
        result.stealthAddress = ethers.utils.computeAddress("0x" + result.stealthPublicKey.toHex(false));
        result.match = result.stealthAddress == stealthAddress;
        return result;
      }

      console.log(now() + " INFO dataModule:actions.identifyMyStealthTransfers: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // const accounts = store.getters['data/accounts'];
      const addresses = context.state.addresses;
      // console.log(now() + " INFO dataModule:actions.identifyMyStealthTransfers addresses BEFORE: " + JSON.stringify(addresses, null, 2));
      const checkAddresses = [];
      for (const [address, addressData] of Object.entries(addresses)) {
        if (addressData.type == "stealthMetaAddress" && addressData.mine && addressData.viewingPrivateKey) {
          checkAddresses.push({ address, ...addressData });
        }
      }
      // console.log(now() + " INFO dataModule:actions.identifyMyStealthTransfers - checkAddresses: " + JSON.stringify(checkAddresses.map(e => e.address)));

      let rows = 0;
      let done = false;
      do {
        let data = await db.announcements.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        console.log(now() + " INFO dataModule:actions.identifyMyStealthTransfers - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        const writeRecords = [];
        for (const item of data) {
          if (item.schemeId == ONLY_SUPPORTED_SCHEME_ID) {
            const sender = item.tx && item.tx.from || null;
            const senderData = sender && addresses[sender] || {};
            // console.log("sender: " + sender + " => " + JSON.stringify(senderData));
            item.iSent = senderData.mine || false;
            item.iReceived = false;
            delete item.linkedTo;
            const stealthAddress = item.stealthAddress;
            // const stealthAddressData = this.addresses[stealthAddress];
            const ephemeralPublicKey = item.ephemeralPublicKey;
            for (const account of checkAddresses) {
              const viewingPrivateKey = account.viewingPrivateKey;
              const viewingPublicKey = account.viewingPublicKey;
              const spendingPublicKey = account.spendingPublicKey;
              try {
                const status = checkStealthAddress(stealthAddress, ephemeralPublicKey, viewingPrivateKey, spendingPublicKey);
                if (status && status.match) {
                  console.log(now() + " INFO dataModule:actions.identifyMyStealthTransfers - found stealthAddress: " + stealthAddress);
                  item.linkedTo = { stealthMetaAddress: account.address, address: account.linkedToAddress };
                  item.iReceived = true;
                  if (stealthAddress in addresses) {
                    if (addresses[stealthAddress].type != "stealthAddress") {
                      context.commit('updateToStealthAddress', {
                        stealthAddress,
                        type: "stealthAddress",
                        linkedTo: {
                          stealthMetaAddress: account.address,
                          address: account.linkedToAddress,
                        },
                        junk: false,
                        mine: true,
                        watch: true,
                        sendFrom: false,
                        sendTo: false,
                      });
                    }
                  } else {
                    context.commit('addNewStealthAddress', {
                      stealthAddress,
                      type: "stealthAddress",
                      linkedTo: {
                        stealthMetaAddress: account.address,
                        address: account.linkedToAddress,
                      },
                      source: "announcer",
                      junk: false,
                      mine: true,
                      watch: true,
                      sendFrom: false,
                      sendTo: false,
                      name: null,
                      notes: null,
                      check: [],
                    });
                  }
                  break;
                }
              } catch (e) {
                console.log("ERROR: " + e.message);
              }
            }
            writeRecords.push(item);
          }
        }
        if (writeRecords.length > 0) {
          await db.announcements.bulkPut(writeRecords).then(function() {
          }).catch(function(error) {
            console.log(now() + " INFO dataModule:actions.identifyMyStealthTransfers bulkPut error: " + error);
          });
        }
        rows = parseInt(rows) + data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      // console.log(now() + " INFO dataModule:actions.identifyMyStealthTransfers addresses END: " + JSON.stringify(addresses, null, 2));
      context.commit('setState', { name: 'addresses', data: addresses });
      await context.dispatch('saveData', ['addresses']);
      console.log(now() + " INFO dataModule:actions.identifyMyStealthTransfers END");
    },

    async collateStealthTransfers(context, parameter) {
      console.log(now() + " INFO dataModule:actions.collateStealthTransfers: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      let rows = 0;
      let done = false;
      do {
        let data = await db.announcements.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        console.log(now() + " INFO dataModule:actions.collateStealthTransfers - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        for (const item of data) {
          if (item.schemeId == ONLY_SUPPORTED_SCHEME_ID) {
            context.commit('addStealthTransfer', item);
          }
        }
        rows = parseInt(rows) + data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      await context.dispatch('saveData', ['stealthTransfers']);
      console.log(now() + " INFO dataModule:actions.collateStealthTransfers END");
    },

    async syncRegistrations(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncRegistrations BEGIN: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // StealthMetaAddressSet (index_topic_1 address registrant, index_topic_2 uint256 schemeId, bytes stealthMetaAddress)
      // 0x4e739a47dfa4fd3cfa92f8fe760cebe125565927e5c422cb28e7aa388a067af9
      const erc5564RegistryContract = new ethers.Contract(ERC6538REGISTRYADDRESS, ERC6538REGISTRYABI, provider);
      let total = 0;
      let t = this;
      async function processLogs(fromBlock, toBlock, logs) {
        total = parseInt(total) + logs.length;
        context.commit('setSyncCompleted', total);
        console.log(now() + " INFO dataModule:actions.syncRegistrations.processLogs: " + fromBlock + " - " + toBlock + " " + logs.length + " " + total);
        const records = [];
        for (const log of logs) {
          if (!log.removed) {
            try {
              const logData = erc5564RegistryContract.interface.parseLog(log);
              // console.log("logData: " + JSON.stringify(logData, null, 2));
              const [ contract, schemeId ] = [ log.address, parseInt(logData.args[1]) ];
              if (schemeId == ONLY_SUPPORTED_SCHEME_ID) {
                records.push( {
                  chainId: parameter.chainId,
                  blockNumber: parseInt(log.blockNumber),
                  logIndex: parseInt(log.logIndex),
                  txIndex: parseInt(log.transactionIndex),
                  txHash: log.transactionHash,
                  contract,
                  name: logData.name,
                  registrant: ethers.utils.getAddress(logData.args[0]),
                  schemeId,
                  stealthMetaAddress: ethers.utils.toUtf8String(logData.args[2]),
                  mine: false,
                  confirmations: parameter.blockNumber - log.blockNumber,
                  timestamp: null,
                  tx: null,
                });
              }
            } catch (e) {
              console.log(now() + " ERROR dataModule:actions.syncRegistrations.processLogs: " + e.message);
            }
          }
        }
        if (records.length) {
          await db.registrations.bulkAdd(records).then(function(lastKey) {
            console.log(now() + " INFO dataModule:actions.syncRegistrations.bulkAdd - lastKey: " + JSON.stringify(lastKey));
          }).catch(Dexie.BulkError, function(e) {
            // console.log(now() + " INFO dataModule:actions.syncRegistrations bulkAdd error: " + JSON.stringify(e.failures, null, 2));
          });
        }
      }
      async function getLogs(fromBlock, toBlock, processLogs) {
        console.log(now() + " INFO dataModule:actions.syncRegistrations.getLogs: " + fromBlock + " - " + toBlock);
        let split = false;
        const maxLogScrapingSize = NETWORKS['' + parameter.chainId].maxLogScrapingSize || null;
        if (!maxLogScrapingSize || (toBlock - fromBlock) <= maxLogScrapingSize) {
          try {
            const filter = {
              address: ERC6538REGISTRYADDRESS,
              fromBlock,
              toBlock,
              topics: [
                '0x4e739a47dfa4fd3cfa92f8fe760cebe125565927e5c422cb28e7aa388a067af9',
                null,
                null
              ]
            };
            const eventLogs = await provider.getLogs(filter);
            await processLogs(fromBlock, toBlock, eventLogs);
          } catch (e) {
            split = true;
          }
        } else {
          split = true;
        }
        if (split) {
          const mid = parseInt((fromBlock + toBlock) / 2);
          await getLogs(fromBlock, mid, processLogs);
          await getLogs(parseInt(mid) + 1, toBlock, processLogs);
        }
      }
      console.log(now() + " INFO dataModule:actions.syncRegistrations BEGIN");
      context.commit('setSyncSection', { section: 'Stealth Meta-Address Registry', total: null });
      const deleteCall = await db.registrations.where("confirmations").below(parameter.confirmations).delete();
      const latest = await db.registrations.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).last();
      // TODO: Handle incrementalSync?
      const startBlock = (parameter.incrementalSync && latest) ? parseInt(latest.blockNumber) + 1: 0;
      await getLogs(startBlock, parameter.blockNumber, processLogs);
      console.log(now() + " INFO dataModule:actions.syncRegistrations END");
    },

    async syncRegistrationsData(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncRegistrationsData: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let total = 0;
      let done = false;
      do {
        let data = await db.registrations.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(total).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        console.log(now() + " INFO dataModule:actions.syncRegistrationsData - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        total = parseInt(total) + data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      console.log(now() + " INFO dataModule:actions.syncRegistrationsData - total: " + total);
      context.commit('setSyncSection', { section: 'Stealth Meta-Address Registry Data', total });
      let rows = 0;
      do {
        let data = await db.registrations.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        console.log(now() + " INFO dataModule:actions.syncRegistrationsData - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        const records = [];
        for (const item of data) {
          if (item.timestamp == null) {
            const block = await provider.getBlock(item.blockNumber);
            item.timestamp = block.timestamp;
            const tx = await provider.getTransaction(item.txHash);
            const txReceipt = await provider.getTransactionReceipt(item.txHash);
            item.tx = {
              type: tx.type,
              blockHash: tx.blockHash,
              from: tx.from,
              gasPrice: ethers.BigNumber.from(tx.gasPrice).toString(),
              gasLimit: ethers.BigNumber.from(tx.gasLimit).toString(),
              to: tx.to,
              value: ethers.BigNumber.from(tx.value).toString(),
              nonce: tx.nonce,
              data: tx.to && tx.data || null, // Remove contract creation data to reduce memory footprint
              chainId: tx.chainId,
              contractAddress: txReceipt.contractAddress,
              transactionIndex: txReceipt.transactionIndex,
              gasUsed: ethers.BigNumber.from(txReceipt.gasUsed).toString(),
              blockHash: txReceipt.blockHash,
              logs: txReceipt.logs,
              cumulativeGasUsed: ethers.BigNumber.from(txReceipt.cumulativeGasUsed).toString(),
              effectiveGasPrice: ethers.BigNumber.from(txReceipt.effectiveGasPrice).toString(),
              status: txReceipt.status,
              type: txReceipt.type,
            };
            records.push(item);
          }
        }
        if (records.length > 0) {
          await db.registrations.bulkPut(records).then(function() {
          }).catch(function(error) {
            // console.log(now() + " ERROR dataModule:actions.syncRegistrationsData.bulkPut: " + error);
          });
        }
        rows = parseInt(rows) + data.length;
        context.commit('setSyncCompleted', rows);
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      console.log(now() + " INFO dataModule:actions.syncRegistrationsData END");
    },

    async collateRegistrations(context, parameter) {
      console.log(now() + " INFO dataModule:actions.collateRegistrations: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const registry = context.state.registry;
      if (!(parameter.chainId in registry)) {
        registry[parameter.chainId] = {};
      }
      // console.log("registry BEFORE: " + JSON.stringify(registry, null, 2));
      let rows = 0;
      let done = false;
      do {
        let data = await db.registrations.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        console.log(now() + " INFO dataModule:actions.collateRegistrations - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        for (const item of data) {
          if (item.schemeId == ONLY_SUPPORTED_SCHEME_ID) {
            // console.log(now() + " INFO dataModule:actions.collateRegistrations - processing: " + JSON.stringify(item, null, 2));
            const stealthMetaAddress = item.stealthMetaAddress.match(/^st:eth:0x[0-9a-fA-F]{132}$/) ? item.stealthMetaAddress : STEALTHMETAADDRESS0;
            registry[parameter.chainId][item.registrant] = stealthMetaAddress;
          }
        }
        rows = parseInt(rows) + data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      context.commit('setState', { name: 'registry', data: registry });
      await context.dispatch('saveData', ['registry']);
      console.log(now() + " INFO dataModule:actions.collateRegistrations END");
    },

    async syncTokenEvents(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncTokenEvents: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc1155Interface = new ethers.utils.Interface(ERC1155ABI);

      // ERC-20 & ERC-721 Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 id)
      // [ '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', accountAs32Bytes, null ],
      // [ '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, accountAs32Bytes ],

      // ERC-1155 TransferSingle (index_topic_1 address operator, index_topic_2 address from, index_topic_3 address to, uint256 id, uint256 value)
      // [ '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62', null, accountAs32Bytes, null ],
      // [ '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62', null, null, accountAs32Bytes ],

      // ERC-1155 TransferBatch (index_topic_1 address operator, index_topic_2 address from, index_topic_3 address to, uint256[] ids, uint256[] values)
      // [ '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb', null, accountAs32Bytes, null ],
      // [ '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb', null, null, accountAs32Bytes ],

      // ENS:ETH Registrar Controller NameRenewed (string name, index_topic_1 bytes32 label, uint256 cost, uint256 expires)
      // [ '0x3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae', [tokenIds] ],

      // WETH Deposit (index_topic_1 address dst, uint256 wad)
      // 0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c
      // WETH Withdrawal (index_topic_1 address src, uint256 wad)
      // 0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65

      // CryptoPunks 0x6Ba6f2207e343923BA692e5Cae646Fb0F566DB8D & 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB
      // CryptoCats 0x9508008227b6b3391959334604677d60169EF540 0x19c320b43744254ebdBcb1F1BD0e2a3dc08E01dc 0x088C6Ad962812b5Aa905BA6F3c5c145f9D4C079f
      // Assign (index_topic_1 address to, uint256 punkIndex)
      // 0x8a0e37b73a0d9c82e205d4d1a3ff3d0b57ce5f4d7bccf6bac03336dc101cb7ba

      // MoonCats 0x60cd862c9C687A9dE49aecdC3A99b74A4fc54aB6
      // CatRescued (index_topic_1 address to, index_topic_2 bytes5 catId)
      // 0x80d2c1a6c75f471130a64fd71b80dc7208f721037766fb7decf53e10f82211cd

      // ERC-20 Approval (index_topic_1 address owner, index_topic_2 address spender, uint256 value)
      // 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925
      // ERC-721 Approval (index_topic_1 address owner, index_topic_2 address approved, index_topic_3 uint256 tokenId)
      // 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925
      // ERC-721 ApprovalForAll (index_topic_1 address owner, index_topic_2 address operator, bool approved)
      // 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31
      // ERC-1155 ApprovalForAll (index_topic_1 address account, index_topic_2 address operator, bool approved)
      // 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31
      let total = 0;
      async function getLogs(fromBlock, toBlock, section, selectedAddresses) {
        console.log(now() + " INFO dataModule:actions.syncTokenEvents.getLogs - fromBlock: " + fromBlock + ", toBlock: " + toBlock + ", section: " + section);
        let split = false;
        const maxLogScrapingSize = NETWORKS['' + parameter.chainId].maxLogScrapingSize || null;
        if (!maxLogScrapingSize || (toBlock - fromBlock) <= maxLogScrapingSize) {
          const address = parameter.selectedContract;
          try {
            let topics = null;
            if (section == 0) {
              topics = [[
                  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                  '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c',
                  '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65',
                  '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
                  '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31',
                  '0x8a0e37b73a0d9c82e205d4d1a3ff3d0b57ce5f4d7bccf6bac03336dc101cb7ba',
                  '0x80d2c1a6c75f471130a64fd71b80dc7208f721037766fb7decf53e10f82211cd',
                ],
                selectedAddresses,
                null
              ];
            } else if (section == 1) {
              topics = [[
                  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
                ],
                null,
                selectedAddresses
              ];
            } else if (section == 2) {
              topics = [[
                  '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
                  '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb',
                ],
                null,
                selectedAddresses
              ];
            } else if (section == 3) {
              topics = [ [
                  '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
                  '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb',
                ],
                null,
                null,
                selectedAddresses
              ];
            }
            const logs = await provider.getLogs({ address, fromBlock, toBlock, topics });
            total = parseInt(total) + logs.length;
            context.commit('setSyncCompleted', toBlock);
            console.log(now() + " INFO dataModule:actions.syncTokenEvents - fromBlock: " + fromBlock + ", toBlock: " + toBlock + ", section: " + section + ", logs.length: " + logs.length + ", total: " + total);
            const records = parseEventLogs(logs, parameter.chainId, parameter.blockNumber);
            if (records.length) {
              await db.tokenEvents.bulkAdd(records).then(function(lastKey) {
                console.log(now() + " INFO dataModule:actions.syncTokenEvents.bulkAdd lastKey: " + JSON.stringify(lastKey));
              }).catch(Dexie.BulkError, function(e) {
                // console.log(now() + " INFO dataModule:actions.syncTokenEvents.bulkAdd BulkError: " + JSON.stringify(e.failures, null, 2));
              });
            }
          } catch (e) {
            split = true;
          }
        } else {
          split = true;
        }
        if (split) {
          const mid = parseInt((fromBlock + toBlock) / 2);
          await getLogs(fromBlock, mid, section, selectedAddresses);
          await getLogs(parseInt(mid) + 1, toBlock, section, selectedAddresses);
        }
      }
      console.log(now() + " INFO dataModule:actions.syncTokenEvents BEGIN");
      const selectedAddresses = [];
      for (const [address, addressData] of Object.entries(context.state.addresses)) {
        if (address.substring(0, 2) == "0x" && !addressData.junk && addressData.watch) {
          selectedAddresses.push('0x000000000000000000000000' + address.substring(2, 42).toLowerCase());
        }
      }
      // console.log("selectedAddresses: " + JSON.stringify(selectedAddresses));
      if (selectedAddresses.length > 0) {
        const deleteCall = await db.tokenEvents.where("confirmations").below(parameter.confirmations).delete();
        const latest = await db.tokenEvents.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).last();
        // const startBlock = (parameter.incrementalSync && latest) ? parseInt(latest.blockNumber) + 1: 0;
        const startBlock = 0;
        for (let section = 0; section < 4; section++) {
          context.commit('setSyncSection', { section: 'Token Events #' + (section + 1), total: parameter.blockNumber });
          context.commit('setSyncCompleted', startBlock);
          await getLogs(startBlock, parameter.blockNumber, section, selectedAddresses);
        }
      }
      console.log(now() + " INFO dataModule:actions.syncTokenEvents END");
    },

    async syncTokenEventTimestamps(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncTokenEventTimestamps: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let rows = 0;
      let done = false;
      const existingTimestamps = context.state.timestamps[parameter.chainId] || {};
      const newBlocks = {};
      do {
        let data = await db.tokenEvents.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        console.log(now() + " INFO dataModule:actions.syncTokenEventTimestamps - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        for (const item of data) {
          if (!(item.blockNumber in existingTimestamps) && !(item.blockNumber in newBlocks)) {
            newBlocks[item.blockNumber] = true;
          }
        }
        rows += data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      const total = Object.keys(newBlocks).length;
      console.log(now() + " INFO dataModule:actions.syncTokenEventTimestamps - total: " + total);
      context.commit('setSyncSection', { section: 'Token Event Timestamps', total });
      let completed = 0;
      for (let blockNumber of Object.keys(newBlocks)) {
        const block = await provider.getBlock(parseInt(blockNumber));
        context.commit('addTimestamp', {
          chainId: parameter.chainId,
          blockNumber,
          timestamp: block.timestamp,
        });
        completed++;
        context.commit('setSyncCompleted', completed);
        if (context.state.sync.halt) {
          break;
        }
      }
      // console.log("context.state.timestamps: " + JSON.stringify(context.state.timestamps, null, 2));
      await context.dispatch('saveData', ['timestamps']);
      console.log(now() + " INFO dataModule:actions.syncTokenEventTimestamps END");
    },

    async syncTokenEventTxData(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncTokenEventTxData: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let rows = 0;
      let done = false;
      const existingTxs = context.state.txs[parameter.chainId] || {};
      const newTxs = {};
      do {
        let data = await db.tokenEvents.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        console.log(now() + " INFO dataModule:actions.syncTokenEventTxData - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        for (const item of data) {
          if (!(item.txHash in existingTxs) && !(item.txHash in newTxs)) {
            newTxs[item.txHash] = true;
          }
        }
        rows += data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      const total = Object.keys(newTxs).length;
      console.log(now() + " INFO dataModule:actions.syncTokenEventTxData - total: " + total);
      context.commit('setSyncSection', { section: 'Token Event Transaction Data', total });
      let completed = 0;
      for (let txHash of Object.keys(newTxs)) {
        const tx = await provider.getTransaction(txHash);
        const txReceipt = await provider.getTransactionReceipt(txHash);
        context.commit('addTx', {
          chainId: parameter.chainId,
          txHash,
          type: tx.type,
          blockHash: tx.blockHash,
          from: tx.from,
          gasPrice: ethers.BigNumber.from(tx.gasPrice).toString(),
          gasLimit: ethers.BigNumber.from(tx.gasLimit).toString(),
          to: tx.to,
          value: ethers.BigNumber.from(tx.value).toString(),
          nonce: tx.nonce,
          data: tx.to && tx.data || null, // Remove contract creation data to reduce memory footprint
          contractAddress: txReceipt.contractAddress,
          transactionIndex: txReceipt.transactionIndex,
          gasUsed: ethers.BigNumber.from(txReceipt.gasUsed).toString(),
          blockHash: txReceipt.blockHash,
          logs: txReceipt.logs,
          cumulativeGasUsed: ethers.BigNumber.from(txReceipt.cumulativeGasUsed).toString(),
          effectiveGasPrice: ethers.BigNumber.from(txReceipt.effectiveGasPrice).toString(),
          status: txReceipt.status,
          type: txReceipt.type,
        });
        completed++;
        context.commit('setSyncCompleted', completed);
        if (context.state.sync.halt) {
          break;
        }
      }
      // console.log("context.state.txs: " + JSON.stringify(context.state.txs, null, 2));
      await context.dispatch('saveData', ['txs']);
      console.log(now() + " INFO dataModule:actions.syncTokenEventTxData END");
    },

    async computeBalances(context, parameter) {
      console.log(now() + " INFO dataModule:actions.computeBalances: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(now() + " INFO dataModule:actions.computeBalances BEGIN");
      const selectedAddressesMap = {};
      for (const [address, addressData] of Object.entries(context.state.addresses)) {
        if (address.substring(0, 2) == "0x" && !addressData.junk && addressData.watch) {
          selectedAddressesMap[address] = true;
        }
      }
      // console.log("selectedAddressesMap: " + Object.keys(selectedAddressesMap));
      let rows = 0;
      let done = false;
      const collator = {};
      do {
        let data = await db.tokenEvents.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        console.log(now() + " INFO dataModule:actions.computeBalances - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        for (const item of data) {
          const contract = item.contract;
          if (item.type == "Transfer" || item.type == "TransferSingle" || item.type == "TransferBatch") {
            if (!(contract in collator)) {
              if (item.eventType == "erc20") {
                collator[contract] = {
                  type: item.eventType,
                  balances: {},
                };
              } else {
                collator[contract] = {
                  type: item.eventType,
                  tokens: {},
                };
              }
            }
            if (item.eventType == "erc20" && item.type == "Transfer") {
              if (item.from in selectedAddressesMap) {
                if (!(item.from in collator[contract].balances)) {
                  collator[contract].balances[item.from] = "0";
                }
                collator[contract].balances[item.from] = ethers.BigNumber.from(collator[contract].balances[item.from]).sub(item.tokens).toString();
              }
              if (item.to in selectedAddressesMap) {
                if (!(item.to in collator[contract].balances)) {
                  collator[contract].balances[item.to] = "0";
                }
                collator[contract].balances[item.to] = ethers.BigNumber.from(collator[contract].balances[item.to]).add(item.tokens).toString();
              }
            } else if (item.eventType == "erc721" && item.type == "Transfer") {
              if (item.from in selectedAddressesMap || item.to in selectedAddressesMap) {
                collator[contract].tokens[item.tokenId] = item.to;
              }
            } else if (item.eventType == "erc1155" && item.type == "TransferSingle") {
              if (item.from in selectedAddressesMap) {
                if (!(item.tokenId in collator[contract].tokens)) {
                  collator[contract].tokens[item.tokenId] = {};
                }
                if (item.from in collator[contract].tokens[item.tokenId]) {
                  collator[contract].tokens[item.tokenId][item.from] = ethers.BigNumber.from(collator[contract].tokens[item.tokenId][item.from]).sub(item.value).toString();
                  if (collator[contract].tokens[item.tokenId][item.from] == "0") {
                    delete collator[contract].tokens[item.tokenId][item.from];
                  }
                }
              }
              if (item.to in selectedAddressesMap) {
                if (!(item.tokenId in collator[contract].tokens)) {
                  collator[contract].tokens[item.tokenId] = {};
                }
                if (!(item.to in collator[contract].tokens[item.tokenId])) {
                  collator[contract].tokens[item.tokenId][item.to] = "0";
                }
                collator[contract].tokens[item.tokenId][item.to] = ethers.BigNumber.from(collator[contract].tokens[item.tokenId][item.to]).add(item.value).toString();
              }
            } else if (item.eventType == "erc1155" && item.type == "TransferBatch") {
              for (const [index, tokenId] of item.tokenIds.entries()) {
                if (item.from in selectedAddressesMap) {
                  if (!(tokenId in collator[contract].tokens)) {
                    collator[contract].tokens[tokenId] = {};
                  }
                  if (item.from in collator[contract].tokens[tokenId]) {
                    collator[contract].tokens[tokenId][item.from] = ethers.BigNumber.from(collator[contract].tokens[tokenId][item.from]).sub(item.values[index]).toString();
                    if (collator[contract].tokens[tokenId][item.from] == "0") {
                      delete collator[contract].tokens[tokenId][item.from];
                    }
                  }
                }
                if (item.to in selectedAddressesMap) {
                  if (!(tokenId in collator[contract].tokens)) {
                    collator[contract].tokens[tokenId] = {};
                  }
                  if (!(item.to in collator[contract].tokens[tokenId])) {
                    collator[contract].tokens[tokenId][item.to] = "0";
                  }
                  collator[contract].tokens[tokenId][item.to] = ethers.BigNumber.from(collator[contract].tokens[tokenId][item.to]).add(item.values[index]).toString();
                }
              }
            }
          }
        }
        rows = parseInt(rows) + data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      // console.log("collator: " + JSON.stringify(collator, null, 2));
      context.commit('updateBalances', { chainId: parameter.chainId, balances: collator });
      await context.dispatch('saveData', ['balances']);
      console.log(now() + " INFO dataModule:actions.computeBalances END");
    },

    async computeApprovals(context, parameter) {
      console.log(now() + " INFO dataModule:actions.computeApprovals: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(now() + " INFO dataModule:actions.computeApprovals BEGIN");
      const selectedAddressesMap = {};
      for (const [address, addressData] of Object.entries(context.state.addresses)) {
        if (address.substring(0, 2) == "0x" && !addressData.junk && addressData.watch) {
          selectedAddressesMap[address] = true;
        }
      }
      let rows = 0;
      let done = false;
      const collator = {};
      do {
        let data = await db.tokenEvents.where('[chainId+blockNumber+logIndex]').between([parameter.chainId, Dexie.minKey, Dexie.minKey],[parameter.chainId, Dexie.maxKey, Dexie.maxKey]).offset(rows).limit(context.state.DB_PROCESSING_BATCH_SIZE).toArray();
        console.log(now() + " INFO dataModule:actions.computeApprovals - data.length: " + data.length + ", first[0..9]: " + JSON.stringify(data.slice(0, 10).map(e => e.blockNumber + '.' + e.logIndex )));
        for (const item of data) {
          if ((item.type == "Approval" || item.type == "ApprovalForAll") && item.owner in selectedAddressesMap) {
            const [ eventType, type, contract, owner, spender ] = [ item.eventType, item.type, item.contract, item.owner, item.spender ];
            const tokenType = context.state.tokens[parameter.chainId] && context.state.tokens[parameter.chainId][contract] && context.state.tokens[parameter.chainId][contract].type || null;
            if (!(owner in collator)) {
              collator[owner] = {};
            }
            if (!(contract in collator[owner])) {
              if (eventType == "erc20") {
                collator[owner][contract] = {};
              } else {
                collator[owner][contract] = {
                  tokens: {},
                  approvalForAll: {},
                };
              }
            }
            if (eventType == "erc20") {
              collator[owner][contract][spender] = item.tokens;
            } else if (eventType == "erc721" && type == "Approval") {
              // TODO
              const testing = false;
              if (item.approved == ADDRESS0 && !testing) {
                if (item.tokenId in collator[owner][contract].tokens) {
                  delete collator[owner][contract].tokens[item.tokenId];
                }
              } else {
                collator[owner][contract].tokens[item.tokenId] = item.approved;
              }
            } else if (type == "ApprovalForAll") {
              // TODO: Can remove !! after new db change
              collator[owner][contract].approvalForAll[item.operator] = !!item.approved;
            }
          }
        }
        rows = parseInt(rows) + data.length;
        done = data.length < context.state.DB_PROCESSING_BATCH_SIZE;
      } while (!done);
      // console.log("collator: " + JSON.stringify(collator, null, 2));
      context.commit('updateApprovals', { chainId: parameter.chainId, approvals: collator });
      await context.dispatch('saveData', ['approvals']);
      console.log(now() + " INFO dataModule:actions.computeApprovals END");
    },

    async syncENSEvents(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncENSEvents: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const oldETHRegistarControllerInterface = new ethers.utils.Interface(ENS_OLDETHREGISTRARCONTROLLER_ABI);
      const ethRegistarControllerInterface = new ethers.utils.Interface(ENS_ETHREGISTRARCONTROLLER_ABI);
      const nameWrapperInterface = new ethers.utils.Interface(ENS_NAMEWRAPPER_ABI);

      const mapERC721ToERC1155 = {};
      let total = 0;
      let t = this;
      async function processLogs(logs) {
        total = parseInt(total) + logs.length;
        context.commit('setSyncCompleted', total);
        console.log(now() + " INFO dataModule:actions.syncENSEvents.processLogs - logs.length: " + logs.length + ", total: " + total);
        const records = [];
        for (const log of logs) {
          if (!log.removed) {
            // TODO console.log(JSON.stringify(log));
            const contract = log.address;
            let eventRecord = null;
            if (log.topics[0] == "0xca6abbe9d7f11422cb6ca7629fbf6fe9efb1c621f71ce8f02b9f2a230097404f" && ((contract == ENS_OLDETHREGISTRARCONTROLLER_ADDRESS || contract == ENS_OLDETHREGISTRARCONTROLLER1_ADDRESS || contract == ENS_OLDETHREGISTRARCONTROLLER2_ADDRESS) || contract == ENS_OLDETHREGISTRARCONTROLLER1_ADDRESS || contract == ENS_OLDETHREGISTRARCONTROLLER2_ADDRESS)) {
              // ERC-721 NameRegistered (string name, index_topic_1 bytes32 label, index_topic_2 address owner, uint256 cost, uint256 expires)
              const logData = oldETHRegistarControllerInterface.parseLog(log);
              const [name, label, owner, cost, expires] = logData.args;
              const labelhashDecimals = ethers.BigNumber.from(label).toString();
              eventRecord = { contract: ENS_ERC721_ADDRESS, type: "NameRegistered", name, label, tokenId: labelhashDecimals, owner, cost: cost.toString(), expiry: parseInt(expires) };
            } else if (log.topics[0] == "0x3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae" && (contract == ENS_OLDETHREGISTRARCONTROLLER_ADDRESS || contract == ENS_OLDETHREGISTRARCONTROLLER1_ADDRESS || contract == ENS_OLDETHREGISTRARCONTROLLER2_ADDRESS)) {
              // NameRenewed (string name, index_topic_1 bytes32 label, uint256 cost, uint256 expires)
              const logData = oldETHRegistarControllerInterface.parseLog(log);
              const [name, label, cost, expires] = logData.args;
              const labelhashDecimals = ethers.BigNumber.from(label).toString();
              eventRecord = { contract: ENS_ERC721_ADDRESS, type: "NameRenewed", name, label, tokenId: labelhashDecimals, cost: cost.toString(), expiry: parseInt(expires) };
            } else if (log.topics[0] == "0x3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae" && contract == ENS_ETHREGISTRARCONTROLLER_ADDRESS) {
              // NameRenewed (string name, index_topic_1 bytes32 label, uint256 cost, uint256 expires)
              const logData = ethRegistarControllerInterface.parseLog(log);
              const [name, label, cost, expires] = logData.args;
              const labelhashDecimals = ethers.BigNumber.from(label).toString();
              eventRecord = { contract: ENS_ERC721_ADDRESS, type: "NameRenewed", name, label, tokenId: labelhashDecimals, cost: cost.toString(), expiry: parseInt(expires) };
            } else if (log.topics[0] == "0x8ce7013e8abebc55c3890a68f5a27c67c3f7efa64e584de5fb22363c606fd340" && contract == ENS_NAMEWRAPPER_ADDRESS) {
              // NameWrapped (index_topic_1 bytes32 node, bytes name, address owner, uint32 fuses, uint64 expiry)
              const logData = nameWrapperInterface.parseLog(log);
              const [node, name, owner, fuses, expiry] = logData.args;
              let parts = decodeNameWrapperBytes(name);
              let nameString = parts.join(".");
              let label = null;
              let labelhash = null;
              let labelhashDecimals = null;
              if (parts.length >= 2 && parts[parts.length - 1] == "eth") {
                label = parts[parts.length - 2];
                labelhash = ethers.utils.solidityKeccak256(["string"], [label]);
                labelhashDecimals = ethers.BigNumber.from(labelhash).toString();
              }
              const namehashDecimals = ethers.BigNumber.from(node).toString();
              const subdomain = parts.length >= 3 && parts[parts.length - 3] || null;
              eventRecord = { contract, type: "NameWrapped", namehash: node, tokenId: namehashDecimals, name: nameString, label, labelhash, subdomain, owner, fuses, expiry: parseInt(expiry), expirym90: moment.unix(parseInt(expiry)).subtract(90, 'days').unix() };
              if (!subdomain) {
                ens721TokenIds.push(labelhashDecimals);
                mapERC721ToERC1155[labelhashDecimals] = namehashDecimals;
              }
            } else {
              console.log(now() + " INFO dataModule:actions.syncENSEvents.processLogs - NOT HANDLED: " + JSON.stringify(log));
            }
            if (eventRecord) {
              let remapToERC1155 = null;
              if (eventRecord.type == "NameRegistered" || eventRecord.type == "NameRenewed") {
                if (eventRecord.tokenId in mapERC721ToERC1155) {
                  remapToERC1155 = mapERC721ToERC1155[eventRecord.tokenId];
                  console.log(now() + " INFO dataModule:actions.syncENSEvents.processLogs - Remapping ERC-721 to ERC-1155: " + eventRecord.tokenId + " to " + remapToERC1155);
                }
              }
              if (remapToERC1155) {
                context.commit('addExpiry', {
                  chainId: parameter.chainId,
                   ...eventRecord,
                   contract: ENS_ERC1155_ADDRESS,
                   tokenId: remapToERC1155,
                });
              }
              context.commit('addExpiry', {
                chainId: parameter.chainId,
                 ...eventRecord,
              });
            }
          }
        }
      }

      console.log(now() + " INFO dataModule:actions.syncENSEvents BEGIN");
      const ens721TokenIds = [];
      const ens1155TokenIds = [];
      for (const [contract, contractData] of Object.entries(context.state.balances[parameter.chainId] || {})) {
        if (contract == ENS_ERC721_ADDRESS || contract == ENS_ERC1155_ADDRESS) {
          for (const [tokenId, tokenData] of Object.entries(contractData.tokens)) {
            // if (tokenId == "27727362303445643037535452095569739813950020376856883309402147522300287323280") {
            //   console.log(tokenId + " => " + JSON.stringify(tokenData));
            //   const tokenMetadata = context.state.tokens[parameter.chainId] && context.state.tokens[parameter.chainId][contract] && context.state.tokens[parameter.chainId][contract].tokens[tokenId] || {};
            //   console.log("  tokenMetadata: " + JSON.stringify(tokenMetadata, null, 2));
              if (contract == ENS_ERC721_ADDRESS) {
                ens721TokenIds.push(tokenId);
              } else {
                ens1155TokenIds.push(tokenId);
              }
            // }
          }
        }
      }
      // TODO console.log("ens721TokenIds: " + JSON.stringify(ens721TokenIds));
      // console.log("ens1155TokenIds: " + JSON.stringify(ens1155TokenIds));
      // return;
      const BATCHSIZE = 100;
      context.commit('setSyncSection', { section: 'ENS Events', total: null });
      context.commit('setSyncCompleted', 0);

      // ERC-1155 portraits.eth 27727362303445643037535452095569739813950020376856883309402147522300287323280
      // ERC-1155 yourmum.lovesyou.eth 57229065116737680790555199455465332171886850449809000367294662727325932836690
      // - ENS: Name Wrapper 0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401 NameWrapped (index_topic_1 bytes32 node, bytes name, address owner, uint32 fuses, uint64 expiry) 0x8ce7013e8abebc55c3890a68f5a27c67c3f7efa64e584de5fb22363c606fd340
      //   [ '0x8ce7013e8abebc55c3890a68f5a27c67c3f7efa64e584de5fb22363c606fd340', namehash, null ],
      for (let i = 0; i < ens1155TokenIds.length && !context.state.sync.halt; i += BATCHSIZE) {
        const tokenIds = ens1155TokenIds.slice(i, parseInt(i) + BATCHSIZE).map(e => "0x" + ethers.BigNumber.from(e).toHexString().slice(2).padStart(64, '0'));
        try {
          let topics = null;
          topics = [[
              '0x8ce7013e8abebc55c3890a68f5a27c67c3f7efa64e584de5fb22363c606fd340',
            ],
            tokenIds,
            null,
          ];
          const logs = await provider.getLogs({ address: null, fromBlock: 0, toBlock: parameter.blockNumber, topics });
          await processLogs(logs);
        } catch (e) {
          console.log(now() + " INFO dataModule:actions.syncENSEvents - getLogs ERROR: " + e.message);
        }
      }

      // console.log("ens721TokenIds: " + JSON.stringify(ens721TokenIds));
      // 925.eth ERC-721 0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85:53835211818918528779359817553631021141919078878710948845228773628660104698081
      // - ENS: Old ETH Registrar Controller 0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5 NameRegistered (string name, index_topic_1 bytes32 label, index_topic_2 address owner, uint256 cost, uint256 expires) 0xca6abbe9d7f11422cb6ca7629fbf6fe9efb1c621f71ce8f02b9f2a230097404f
      //   [ '0xca6abbe9d7f11422cb6ca7629fbf6fe9efb1c621f71ce8f02b9f2a230097404f', namehash, null ],
      // - ENS: Old ETH Registrar Controller 0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5 NameRenewed (string name, index_topic_1 bytes32 label, uint256 cost, uint256 expires) 0x3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae
      //   [ '0x3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae', namehash, null ],
      for (let i = 0; i < ens721TokenIds.length && !context.state.sync.halt; i += BATCHSIZE) {
        const tokenIds = ens721TokenIds.slice(i, parseInt(i) + BATCHSIZE).map(e => "0x" + ethers.BigNumber.from(e).toHexString().slice(2).padStart(64, '0'));
        try {
          let topics = [[
              '0xca6abbe9d7f11422cb6ca7629fbf6fe9efb1c621f71ce8f02b9f2a230097404f',
              '0x3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae',
            ],
            tokenIds,
            null,
          ];
          const logs = await provider.getLogs({ address: null, fromBlock: 0, toBlock: parameter.blockNumber, topics });
          await processLogs(logs);
        } catch (e) {
          console.log(now() + " INFO dataModule:actions.syncENSEvents - getLogs ERROR: " + e.message);
        }
      }

      await context.dispatch('saveData', ['expiries']);
      console.log(now() + " INFO dataModule:actions.syncENSEvents END");
    },

    async syncFungiblesMetadata(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncFungiblesMetadata: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(now() + " INFO dataModule:actions.syncFungiblesMetadata BEGIN");
      const contractsToProcess = {};
      for (const [contract, contractData] of Object.entries(context.state.balances[parameter.chainId] || {})) {
        if (contractData.type == "erc20") {
          if (!context.state.tokens[parameter.chainId] || !context.state.tokens[parameter.chainId][contract]) {
            contractsToProcess[contract] = contractData;
          }
        }
      }
      context.commit('setSyncSection', { section: 'Fungibles Metadata', total: Object.keys(contractsToProcess).length });
      let completed = 0;
      for (const [contract, contractData] of Object.entries(contractsToProcess)) {
        context.commit('setSyncCompleted', completed);
        const interface = new ethers.Contract(contract, ERC20ABI, provider);
        let symbol = null;
        let name = null;
        let decimals = null;
        let totalSupply = null;
        try {
          symbol = await interface.symbol();
        } catch (e) {
        }
        try {
          name = await interface.name();
        } catch (e) {
        }
        try {
          decimals = await interface.decimals();
        } catch (e) {
        }
        try {
          totalSupply = await interface.totalSupply();
        } catch (e) {
        }
        await delay(1000);
        const erc20Logos = NETWORKS['' + parameter.chainId].erc20Logos || [];
        let image = null;
        for (let i = 0; i < erc20Logos.length && !image; i++) {
          const url = erc20Logos[i].replace(/\${contract}/, contract);
          image = await imageUrlToBase64(url);
        }
        console.log(now() + " INFO dataModule:actions.syncFungiblesMetadata: " + contract + " " + contractData.type + " " + symbol + " " + name + " " + decimals + " " + totalSupply);
        context.commit('addFungibleMetadata', {
          chainId: parameter.chainId,
          contract,
          symbol: symbol && symbol.trim() || null,
          name: name && name.trim() || null,
          decimals: decimals,
          totalSupply: totalSupply && totalSupply.toString() || null,
          image,
          ...contractData,
        });
        completed++;
        if ((completed % 10) == 0) {
          await context.dispatch('saveData', ['tokens']);
        }
        if (context.state.sync.halt) {
          break;
        }
      }
      await context.dispatch('saveData', ['tokens']);
      console.log(now() + " INFO dataModule:actions.syncFungiblesMetadata END");
    },

    async syncNonFungiblesMetadata(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncNonFungiblesMetadata: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(now() + " INFO dataModule:actions.syncNonFungiblesMetadata BEGIN");
      const FETCH_TIMEOUT_MILLIS = 15000;
      const contractsToProcess = {};
      const tokensToProcess = {};
      let totalTokensToProcess = 0;
      for (const [contract, balance] of Object.entries(context.state.balances[parameter.chainId] || {})) {
        if (balance.type == "erc721" || balance.type == "erc1155") {
          if (!context.state.tokens[parameter.chainId] || !context.state.tokens[parameter.chainId][contract]) {
            contractsToProcess[contract] = balance;
          }
          for (const [tokenId, tokenData] of Object.entries(balance.tokens)) {
            if (!context.state.tokens[parameter.chainId] || !context.state.tokens[parameter.chainId][contract] || !context.state.tokens[parameter.chainId][contract].tokens[tokenId] || !context.state.tokens[parameter.chainId][contract].tokens[tokenId].name) {
              if (!(contract in tokensToProcess)) {
                tokensToProcess[contract] = {};
              }
              tokensToProcess[contract][tokenId] = tokenData;
              totalTokensToProcess++;
            }
          }
        }
      }
      context.commit('setSyncSection', { section: 'Non-Fungibles Contract Metadata', total: Object.keys(contractsToProcess).length });
      let completed = 0;
      for (const [contract, contractData] of Object.entries(contractsToProcess)) {
        console.log("Processing: " + contract + " => " + JSON.stringify(contractData));
        context.commit('setSyncCompleted', completed);
        const interface = new ethers.Contract(contract, ERC721ABI, provider);
        let symbol = null;
        let name = null;
        if (contractData.type == "erc721") {
          try {
            symbol = await interface.symbol();
          } catch (e) {
          }
          try {
            name = await interface.name();
          } catch (e) {
          }
        }
        console.log(now() + " INFO dataModule:actions.syncNonFungiblesMetadata: " + contract + " " + contractData.type + " " + symbol + " " + name);
        context.commit('addNonFungibleContractMetadata', {
          chainId: parameter.chainId,
          contract,
          symbol,
          name,
          ...contractData,
        });
        completed++;
        if ((completed % 10) == 0) {
          await context.dispatch('saveData', ['tokens']);
        }
        if (context.state.sync.halt) {
          break;
        }
      }
      await context.dispatch('saveData', ['tokens']);

      completed = 0;
      context.commit('setSyncSection', { section: 'Non-Fungible Token Metadata', total: totalTokensToProcess });
      context.commit('setSyncCompleted', 0);
      // data:application/json;base64, 0x72A94e6c51CB06453B84c049Ce1E1312f7c05e2c Wiiides
      // https:// -> ipfs://           0x31385d3520bCED94f77AaE104b406994D8F2168C BGANPUNKV2
      // data:application/json;base64, 0x1C60841b70821dcA733c9B1a26dBe1a33338bD43 GLICPIXXXVER002
      // IPFS data in another contract 0xC2C747E0F7004F9E8817Db2ca4997657a7746928 Hashmask
      // No tokenURI                   0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85 ENS
      // TODO ?                        0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401 ENS Name Wrapper
      // IPFS retrieval failure        0xbe9371326F91345777b04394448c23E2BFEaa826 OSP Gemesis

      for (const [contract, contractData] of Object.entries(tokensToProcess)) {
        const contractType = context.state.balances[parameter.chainId][contract].type;
        console.log(contract + " => " + contractType);
        for (const [tokenId, tokenData] of Object.entries(contractData)) {
          context.commit('setSyncCompleted', completed);
          try {
            let tokenURIResult = null;
            if (contract == ENS_ERC721_ADDRESS || contract == ENS_ERC1155_ADDRESS) {
              tokenURIResult = "https://metadata.ens.domains/mainnet/" + contract + "/" + tokenId;
            // } else if (contract == HASHMASK) {
            //   // Cannot access to server CORS configuration tokenURIResult = "https://hashmap.azurewebsites.net/getMask/" + tokenId;
            //   tokenURIResult = "https://api.reservoir.tools/tokens/v7?tokens=" + contract + "%3A" + tokenId + "&includeAttributes=true";
            } else {
              if (contractType == "erc721") {
                const interface = new ethers.Contract(contract, ERC721ABI, provider);
                tokenURIResult = await interface.tokenURI(tokenId);
              } else if (contractType == "erc1155") {
                const interface = new ethers.Contract(contract, ERC1155ABI, provider);
                tokenURIResult = await interface.uri(tokenId);
                // console.log("ERC-1155 tokenURIResult: " + tokenURIResult);
              }
            }
            // console.log("FIRST: " + contract + "/" + tokenId + " => " + JSON.stringify(tokenURIResult));
            let name = null;
            let description = null;
            let attributes = null;
            let imageSource = null;
            let image = null;
            let expiry = null;
            let expired = false;
            if (tokenURIResult && tokenURIResult.substring(0, 29) == "data:application/json;base64,") {
              const decodedJSON = atob(tokenURIResult.substring(29));
              const data = JSON.parse(decodedJSON);
              name = data.name || undefined;
              description = data.description || undefined;
              attributes = data.attributes || {};
              image = data.image || undefined;
              context.commit('addNonFungibleMetadata', {
                chainId: parameter.chainId,
                contract,
                tokenId,
                name,
                description,
                image,
                attributes,
              });
            } else if (tokenURIResult && (tokenURIResult.substring(0, 7) == "ipfs://" || tokenURIResult.substring(0, 8) == "https://")) {
              let metadataFile = null;
              if (tokenURIResult.substring(0, 12) == "ipfs://ipfs/") {
                metadataFile = "https://ipfs.io/" + tokenURIResult.substring(7)
              } else if (tokenURIResult.substring(0, 7) == "ipfs://") {
                metadataFile = "https://ipfs.io/ipfs/" + tokenURIResult.substring(7);
              } else {
                metadataFile = tokenURIResult;
              }
              // let metadataFile = tokenURIResult.substring(0, 7) == "ipfs://" ? ("https://ipfs.io/ipfs/" + tokenURIResult.substring(7)) : tokenURIResult;
              // console.log("tokenURIResult: " + tokenURIResult + ", metadataFile: " + metadataFile);

              // console.log("metadataFile: " + JSON.stringify(metadataFile, null, 2));
              if (contractType == "erc1155") {
                // console.log("ERC-1155 metadataFile BEFORE: " + JSON.stringify(metadataFile, null, 2));
                metadataFile = metadataFile.replace(/0x{id}/, tokenId).replace(/{id}/, tokenId);
                // console.log("ERC-1155 metadataFile AFTER: " + JSON.stringify(metadataFile, null, 2));
              }
              try {
                const metadataFileContent = await fetch(metadataFile, { mode: 'cors', signal: AbortSignal.timeout(FETCH_TIMEOUT_MILLIS) }).then(response => response.json());
                // console.log("metadataFile: " + metadataFile + " => " + JSON.stringify(metadataFileContent, null, 2));

                if (contract == ENS_ERC721_ADDRESS || contract == ENS_ERC1155_ADDRESS) {
                  if (metadataFileContent && metadataFileContent.message) {
                    // metadataFileContent: {
                    //   "message": "'©god.eth' is already been expired at Fri, 29 Sep 2023 06:31:14 GMT."
                    // }
                    // console.log("EXPIRED: " + metadataFileContent.message);
                    let inputString;
                    [inputString, name, expiryString] = metadataFileContent.message.match(/'(.*)'.*at\s(.*)\./) || [null, null, null]
                    expiry = moment.utc(expiryString).unix();
                    console.log("EXPIRED - name: '" + name + "', expiryString: '" + expiryString + "', expiry: " + expiry);
                    expired = true;
                    context.commit('addNonFungibleMetadata', {
                      chainId: parameter.chainId,
                      contract,
                      tokenId,
                      created: null,
                      registration: null,
                      expiry,
                      name: name,
                      description: "Expired '" + name + "'",
                      image: null,
                      attributes: [],
                    });
                  } else { // if (metadataFileContent && metadataFileContent.attributes) {
                    if (contract == ENS_ERC721_ADDRESS) {
                      const createdRecord = metadataFileContent.attributes.filter(e => e.trait_type == "Created Date");
                      created = createdRecord.length == 1 && createdRecord[0].value / 1000 || null;
                      const registrationRecord = metadataFileContent.attributes.filter(e => e.trait_type == "Registration Date");
                      registration = registrationRecord.length == 1 && registrationRecord[0].value / 1000 || null;
                      const expiryRecord = metadataFileContent.attributes.filter(e => e.trait_type == "Expiration Date");
                      expiry = expiryRecord.length == 1 && expiryRecord[0].value / 1000 || null;
                      const attributes = metadataFileContent.attributes || [];
                      attributes.sort((a, b) => {
                        return ('' + a.trait_type).localeCompare(b.trait_type);
                      });
                      context.commit('addNonFungibleMetadata', {
                        chainId: parameter.chainId,
                        contract,
                        tokenId,
                        created,
                        registration,
                        expiry,
                        name: metadataFileContent.name || null,
                        description: metadataFileContent.name || null,
                        image: metadataFileContent.image || null,
                        attributes,
                      });
                    } else if (contract == ENS_ERC1155_ADDRESS) {
                      const createdRecord = metadataFileContent.attributes.filter(e => e.trait_type == "Created Date");
                      created = createdRecord.length == 1 && createdRecord[0].value / 1000 || null;
                      const expiryRecord = metadataFileContent.attributes.filter(e => e.trait_type == "Namewrapper Expiry Date");
                      expiry = expiryRecord.length == 1 && expiryRecord[0].value / 1000 || null;
                      const attributes = metadataFileContent.attributes || [];
                      attributes.sort((a, b) => {
                        return ('' + a.trait_type).localeCompare(b.trait_type);
                      });
                      context.commit('addNonFungibleMetadata', {
                        chainId: parameter.chainId,
                        contract,
                        tokenId,
                        created,
                        expiry,
                        name: metadataFileContent.name || null,
                        description: metadataFileContent.name || null,
                        image: metadataFileContent.image || null,
                        attributes,
                      });
                    }
                  }
                } else {
                  console.log("NON-ENS");
                  const attributes = metadataFileContent.attributes || [];
                  attributes.sort((a, b) => {
                    return ('' + a.trait_type).localeCompare(b.trait_type);
                  });
                  const image = metadataFileContent.image || null;
                  console.log(contract + "/" + tokenId + " => " + image);
                  context.commit('addNonFungibleMetadata', {
                    chainId: parameter.chainId,
                    contract,
                    tokenId,
                    name: metadataFileContent.name || null,
                    description: metadataFileContent.name || null,
                    image: metadataFileContent.image || null,
                    attributes,
                  });
                }
              } catch (e1) {
                if (e1.name === 'AbortError') {
                  console.error("TIMEOUT: " + e1.message);
                } else {
                  console.error("ERROR: " + e1.message);
                }
              }
            }
          } catch (e) {
            console.error(e.message);
          }
          completed++;
          if ((completed % 10) == 0) {
            await context.dispatch('saveData', ['tokens']);
          }
          if (context.state.sync.halt) {
            break;
          }
        }
        if (context.state.sync.halt) {
          break;
        }
        // console.log("context.state.tokens: " + JSON.stringify(context.state.tokens, null, 2));
      }
      await context.dispatch('saveData', ['tokens']);
      console.log(now() + " INFO dataModule:actions.syncNonFungiblesMetadata END");
    },

    async syncNonFungiblesMetadataFromReservoir(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncNonFungiblesMetadataFromReservoir: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const FETCH_TIMEOUT_MILLIS = 15000;
      const tokensToProcess = {};
      let totalTokensToProcess = 0;
      for (const [contract, balance] of Object.entries(context.state.balances[parameter.chainId] || {})) {
        if (balance.type == "erc721" || balance.type == "erc1155") {
          for (const [tokenId, tokenData] of Object.entries(balance.tokens)) {
            if (!context.state.tokens[parameter.chainId] || !context.state.tokens[parameter.chainId][contract] || !context.state.tokens[parameter.chainId][contract].tokens[tokenId] || !context.state.tokens[parameter.chainId][contract].tokens[tokenId].name) {
              if (!(contract in tokensToProcess)) {
                tokensToProcess[contract] = {};
              }
              tokensToProcess[contract][tokenId] = tokenData;
              totalTokensToProcess++;
            }
          }
        }
      }
      let completed = 0;
      context.commit('setSyncSection', { section: 'Non-Fungible Token Metadata', total: totalTokensToProcess });
      context.commit('setSyncCompleted', 0);
      const tokens = [];
      for (const [contract, contractData] of Object.entries(tokensToProcess)) {
        for (const [tokenId, tokenData] of Object.entries(contractData)) {
          tokens.push({ contract, tokenId });
        }
      }
      const reservoirPrefix = NETWORKS[parameter.chainId] && NETWORKS[parameter.chainId].reservoir || null;
      if (reservoirPrefix) {
        const BATCHSIZE = 40; // 50 causes the Reservoir API to fail for some fetches
        const DELAYINMILLIS = 2500;
        for (let i = 0; i < tokens.length && !context.state.sync.halt; i += BATCHSIZE) {
          const batch = tokens.slice(i, parseInt(i) + BATCHSIZE);
          let continuation = null;
          do {
            if (continuation) {
              await delay(DELAYINMILLIS);
            }
            let url = reservoirPrefix + "tokens/v7?" + batch.map(e => 'tokens=' + e.contract + ':' + e.tokenId).join("&");
            url = url + (continuation != null ? "&continuation=" + continuation : '');
            url = url + "&limit=50&includeAttributes=true&includeTopBid=true&includeLastSale=true";
            console.log(url);
            const data = await fetch(url).then(response => response.json());
            continuation = data.continuation;
            if (data.tokens) {
              for (let record of data.tokens) {
                const token = parseReservoirTokenData(record);
                context.commit('addNonFungibleMetadata', token);
                completed++;
                if ((completed % 250) == 0) {
                  await context.dispatch('saveData', ['tokens']);
                }
              }
            }
          } while (continuation != null);
          context.commit('setSyncCompleted', completed);
        }
      }
      await context.dispatch('saveData', ['tokens']);
      console.log(now() + " INFO dataModule:actions.syncNonFungiblesMetadataFromReservoir END");
    },

    async syncReverseENS(context, parameter) {
      console.log(now() + " INFO dataModule:actions.syncReverseENS BEGIN: " + JSON.stringify(parameter));
      const db = new Dexie(context.state.db.name);
      db.version(context.state.db.version).stores(context.state.db.schemaDefinition);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const owners = {};
      for (const [address, addressData] of Object.entries(context.state.addresses)) {
        if (addressData.type == "address" && !addressData.junk) {
          owners[address] = true;
        }
      }
      console.log(now() + " INFO dataModule:actions.syncReverseENS - owners: " + JSON.stringify(owners));
      context.commit('setSyncSection', { section: "ENS", total: Object.keys(owners).length });
      let completed = 0;
      const ensReverseRecordsContract = new ethers.Contract(ENSREVERSERECORDSADDRESS, ENSREVERSERECORDSABI, provider);
      const addresses = Object.keys(owners);
      const ENSOWNERBATCHSIZE = 25; // Can do 200, but incorrectly misconfigured reverse ENS causes the whole call to fail
      for (let i = 0; i < addresses.length; i += ENSOWNERBATCHSIZE) {
        const batch = addresses.slice(i, parseInt(i) + ENSOWNERBATCHSIZE);
        try {
          const allnames = await ensReverseRecordsContract.getNames(batch);
          for (let j = 0; j < batch.length; j++) {
            const address = batch[j];
            const name = allnames[j] && ethers.utils.isValidName(allnames[j]) && allnames[j] || null;
            // const imageUrl = name && ("https://metadata.ens.domains/mainnet/avatar/" + name) || null;
            // console.log("imageUrl: " + JSON.stringify(imageUrl));
            // const image = name && imageUrlToBase64(imageUrl) || null;
            // console.log("image: " + JSON.stringify(image));
            context.commit('setENS', { address, name });
          }
        } catch (e) {
          for (let j = 0; j < batch.length; j++) {
            try {
              const address = batch[j];
              const allnames = await ensReverseRecordsContract.getNames([address]);
              const name = allnames[0] && ethers.utils.isValidName(allnames[0]) && allnames[0] || null;
              context.commit('setENS', { address, name });
            } catch (e1) {
              console.log("Error - address: " + batch[j] + ", message: " + e1.message);
            }
          }
        }
        completed += batch.length;
        context.commit('setSyncCompleted', completed);
      }
      context.dispatch('saveData', ['ens']);
    },

    async collateNames(context, parameter) {
      console.log(now() + " INFO dataModule:actions.collateNames BEGIN: " + JSON.stringify(parameter));
      for (const [address, addressData] of Object.entries(CONTRACTS)) {
        if (!(address in context.state.names)) {
          context.commit('updateName', { address, name: addressData.name });
        }
      }
      for (const [contract, contractData] of Object.entries(context.state.tokens[parameter.chainId] || {})) {
        if (contractData.name && !(contract in context.state.names)) {
          context.commit('updateName', { address: contract, name: contractData.name });
        }
      }
      for (const [address, addressData] of Object.entries(context.state.addresses)) {
        if (address.substring(0, 2) == "0x") {
          if (addressData.name && addressData.name.length > 0 && !(address in context.state.names)) {
            context.commit('updateName', { address, name: addressData.name });
          }
        }
      }
      for (const [address, name] of Object.entries(context.state.ens)) {
        if (!(address in context.state.names)) {
          context.commit('updateName', { address, name });
        }
      }
      // console.log(now() + " INFO dataModule:actions.collateNames - context.state.names: " + JSON.stringify(context.state.names, null, 2));
      context.dispatch('saveData', ['names']);
    },

    async syncImportExchangeRates(context, parameter) {
      const reportingCurrency = store.getters['config/settings'].reportingCurrency;
      console.log(now() + " INFO dataModule:actions.syncImportExchangeRates - reportingCurrency: " + reportingCurrency);
      const MAXDAYS = 2000;
      const MINDATE = moment("2015-07-30");
      let toTs = moment();
      const results = {};
      while (toTs.year() >= 2015) {
        let days = toTs.diff(MINDATE, 'days');
        if (days > MAXDAYS) {
          days = MAXDAYS;
        }
        let url = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=ETH&tsym=" + reportingCurrency + "&toTs=" + toTs.unix() + "&limit=" + days;
        if (parameter.cryptoCompareAPIKey) {
          url = url + "&api_key=" + parameter.cryptoCompareAPIKey;
        }
        console.log(url);
        const data = await fetch(url)
          .then(response => response.json())
          .catch(function(e) {
            console.log("error: " + e);
          });
        for (day of data.Data.Data) {
          results[moment.unix(day.time).format("YYYYMMDD")] = day.close;
        }
        toTs = moment(toTs).subtract(MAXDAYS, 'days');
      }
      context.commit('setExchangeRates', results);
      context.dispatch('saveData', ['exchangeRates']);
    },

    async addTimestamp(context, info) {
      // console.log(now() + " INFO dataModule:actions.addTimestamp - info: " + JSON.stringify(info, null, 2));
      context.commit('addTimestamp', info);
      // await context.dispatch('saveData', ['timestamps']);
    },
    async saveTimestamps(context) {
      console.log(now() + " INFO dataModule:actions.saveTimestamps");
      await context.dispatch('saveData', ['timestamps']);
    },

    // async syncRefreshENS(context, parameter) {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const ensReverseRecordsContract = new ethers.Contract(ENSREVERSERECORDSADDRESS, ENSREVERSERECORDSABI, provider);
    //   const addresses = Object.keys(context.state.accounts);
    //   const ENSOWNERBATCHSIZE = 200; // Can do 200, but incorrectly misconfigured reverse ENS causes the whole call to fail
    //   for (let i = 0; i < addresses.length; i += ENSOWNERBATCHSIZE) {
    //     const batch = addresses.slice(i, parseInt(i) + ENSOWNERBATCHSIZE);
    //     const allnames = await ensReverseRecordsContract.getNames(batch);
    //     for (let j = 0; j < batch.length; j++) {
    //       const account = batch[j];
    //       const name = allnames[j];
    //       // const normalized = normalize(account);
    //       // console.log(account + " => " + name);
    //       context.commit('addENSName', { account, name });
    //     }
    //   }
    //   context.dispatch('saveData', ['ensMap']);
    // },
    // Called by Connection.execWeb3()
    async execWeb3({ state, commit, rootState }, { count, listenersInstalled }) {
      console.log(now() + " INFO dataModule:execWeb3() start[" + count + ", " + listenersInstalled + ", " + JSON.stringify(rootState.route.params) + "]");
    },
  },
};
