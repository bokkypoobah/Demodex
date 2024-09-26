const Welcome = {
  template: `
    <div class="m-0 p-0">

      <b-card no-body no-header class="border-0" header-class="p-1">
        <b-card no-body class="border-0 m-0 mt-2">

          <b-card-body class="p-0">
            <b-card class="mb-2 border-0">

              <b-card-text>
                <h5>Welcome</h5>

                Demodex is a decentralised <b-link href="https://eips.ethereum.org/EIPS/eip-20" target="_blank">ERC-20</b-link>, <b-link href="https://eips.ethereum.org/EIPS/eip-721" target="_blank">ERC-721</b-link> and <b-link href="https://eips.ethereum.org/EIPS/eip-1155" target="_blank">ERC-1155</b-link> token exchange.

                <br />
                Status: <b>WIP</b>
              </b-card-text>

              <b-card-text class="mt-3 mb-2">
                <h6>Supported Networks</h6>
                <ul>
                  <li>
                    <b-link href="https://sepolia.etherscan.io/address/0x2e5D59C1b7da9324eD29891BA060866948dd6b88#code" target="_blank">Sepolia</b-link> only
                  </li>
                </ul>
              </b-card-text>

              <b-card-text class="mt-3 mb-2">
                <h6>Contracts</h6>
                <ul>
                  <li>
                    Demodex v0.8.0:
                      <span v-if="networkSupported">
                        <b-link :href="explorer + 'address/0x2e5D59C1b7da9324eD29891BA060866948dd6b88#code'" target="_blank">0x2e5D59C1b7da9324eD29891BA060866948dd6b88</b-link>
                      </span>
                      <span v-else-if="networkSupported === false">
                        Not Supported
                      </span>
                  </li>
                  <li>
                    WETH:
                      <span v-if="networkSupported">
                        <b-link :href="explorer + 'address/0x07391dbE03e7a0DEa0fce6699500da081537B6c3#code'" target="_blank">0x07391dbE03e7a0DEa0fce6699500da081537B6c3</b-link>
                      </span>
                      <span v-else-if="networkSupported === false">
                        Not Supported
                      </span>
                  </li>
                </ul>
              </b-card-text>

              <b-card-text class="mt-3 mb-2">
                <h6>This Web3 Dapp</h6>
                <ul>
                  <li>
                    <b-link href="https://bokkypoobah.github.io/Demodex/" target="_blank">https://bokkypoobah.github.io/Demodex/</b-link>
                  </li>
                </ul>
              </b-card-text>

              <b-card-text class="mt-3 mb-2">
                <h6>Source Code</h6>
                <ul>
                  <li>
                    <b-link href="https://github.com/bokkypoobah/Demodex" target="_blank">https://github.com/bokkypoobah/Demodex</b-link>
                  </li>
                </ul>
              </b-card-text>

            </b-card>
          </b-card-body>
        </b-card>
      </b-card>
    </div>
  `,
  data: function () {
    return {
      count: 0,
      reschedule: true,
    }
  },
  computed: {
    networkSupported() {
      return store.getters['connection/networkSupported'];
    },
    transferHelper() {
      return store.getters['connection/transferHelper'];
    },
    explorer() {
      return store.getters['connection/explorer'];
    },
  },
  methods: {
    async timeoutCallback() {
      logDebug("Welcome", "timeoutCallback() count: " + this.count);
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
    logDebug("Welcome", "beforeDestroy()");
  },
  mounted() {
    logDebug("Welcome", "mounted() $route: " + JSON.stringify(this.$route.params));
    this.reschedule = true;
    logDebug("Welcome", "Calling timeoutCallback()");
    this.timeoutCallback();
    // this.loadNFTs();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const welcomeModule = {
  namespaced: true,
  state: {
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    deQueue(state) {
      logDebug("welcomeModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("welcomeModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("welcomeModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
  },
};
