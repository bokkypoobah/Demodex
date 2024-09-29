const TradeFungibles = {
  template: `
    <div class="m-0 p-0">
      <b-card no-body no-header class="border-0">

        <b-modal id="config" hide-footer header-class="m-0 px-3 py-2" body-class="m-0 p-0" body-bg-variant="light" size="md">
          <template #modal-title>Config</template>
          <b-form-group label="Price display decimals:" label-for="config-pricedisplaydecimals" label-size="sm" label-cols-sm="5" label-align-sm="right" class="mx-0 my-1 p-0">
            <b-form-select size="sm" id="config-pricedisplaydecimals" v-model="settings.config.priceDisplayDecimals" @change="saveSettings" :options="priceDecimalsOptions" v-b-popover.hover.ds500="'Number of decimals to display for prices'"></b-form-select>
          </b-form-group>
          <b-form-group label="Token display decimals:" label-for="config-tokendisplaydecimals" label-size="sm" label-cols-sm="5" label-align-sm="right" class="mx-0 my-1 p-0">
            <b-form-select size="sm" id="config-tokendisplaydecimals" v-model="settings.config.tokenDisplayDecimals" @change="saveSettings" :options="decimalsOptions" v-b-popover.hover.ds500="'Number of decimals to display for prices'"></b-form-select>
          </b-form-group>
          <b-form-group label="WETH display decimals:" label-for="config-wethisplaydecimals" label-size="sm" label-cols-sm="5" label-align-sm="right" class="mx-0 my-1 p-0">
            <b-form-select size="sm" id="config-wethisplaydecimals" v-model="settings.config.wethDisplayDecimals" @change="saveSettings" :options="decimalsOptions" v-b-popover.hover.ds500="'Number of decimals to display for prices'"></b-form-select>
          </b-form-group>
        </b-modal>

        <!-- <b-modal ref="modalbuyoffer" hide-footer header-class="m-0 px-3 py-2" body-class="m-0 p-0" body-bg-variant="light" size="lg">
          <template #modal-title>Trade Fungibles - Buy Offer</template>
          <div class="m-0 p-1">
            <b-form-group label="Maker:" label-for="modalbuyoffer-maker" label-size="sm" label-cols-sm="3" label-align-sm="right" class="mx-0 my-1 p-0">
              <b-input-group style="width: 25.0rem;">
                <b-form-input size="sm" plaintext id="modalbuyoffer-maker" :value="modalBuyOffer.maker" class="pl-2 w-75"></b-form-input>
                <b-input-group-append>
                  <b-button size="sm" :href="explorer + 'address/' + modalBuyOffer.maker" variant="link" v-b-popover.hover.ds500="'View in explorer'" target="_blank" class="m-0 mt-1 ml-2 mr-2 p-0"><b-icon-link45deg shift-v="-1" font-scale="1.2"></b-icon-link45deg></b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-form-group label="Token Agent:" label-for="modalbuyoffer-tokenagent" label-size="sm" label-cols-sm="3" label-align-sm="right" class="mx-0 my-1 p-0">
              <b-input-group style="width: 25.0rem;">
                <b-form-input size="sm" plaintext id="modalbuyoffer-tokenagent" :value="modalBuyOffer.tokenAgent" class="pl-2 w-75"></b-form-input>
                <b-input-group-append>
                  <b-button size="sm" :href="explorer + 'address/' + modalBuyOffer.tokenAgent + '#code'" variant="link" v-b-popover.hover.ds500="'View in explorer'" target="_blank" class="m-0 mt-1 ml-2 mr-2 p-0"><b-icon-link45deg shift-v="-1" font-scale="1.2"></b-icon-link45deg></b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-form-group label="Timestamp:" label-for="modalbuyoffer-timestamp" label-size="sm" label-cols-sm="3" label-align-sm="right" class="mx-0 my-1 p-0">
              <b-input-group style="width: 25.0rem;">
                <b-form-input size="sm" plaintext id="modalbuyoffer-timestamp" :value="modalBuyOffer.offer && formatTimestamp(modalBuyOffer.offer.timestamp)" class="pl-2 w-75"></b-form-input>
                <b-input-group-append>
                  <b-button size="sm" :disabled="!modalBuyOffer.offer" :href="explorer + 'tx/' + (modalBuyOffer.offer && modalBuyOffer.offer.txHash || '') + '#eventlog#' + modalBuyOffer.logIndex" variant="link" v-b-popover.hover.ds500="'View transaction in explorer'" target="_blank" class="m-0 mt-1 ml-2 mr-2 p-0"><b-icon-link45deg shift-v="-1" font-scale="1.2"></b-icon-link45deg></b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-form-group label="Expiry:" label-for="modalbuyoffer-expiry" label-size="sm" label-cols-sm="3" label-align-sm="right" class="mx-0 my-1 p-0">
              <b-input-group style="width: 25.0rem;">
                <b-form-input size="sm" plaintext id="modalbuyoffer-expiry" :value="modalBuyOffer.expiry == 0 ? 'n/a' : formatTimestamp(modalBuyOffer.expiry)" class="pl-2 w-75"></b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group label="Nonce:" label-for="modalbuyoffer-nonce" label-size="sm" label-cols-sm="3" label-align-sm="right" class="mx-0 my-1 p-0">
              <b-input-group style="width: 25.0rem;">
                <b-form-input size="sm" plaintext id="modalbuyoffer-nonce" :value="modalBuyOffer.offer && modalBuyOffer.offer.nonce" class="pl-2 w-75"></b-form-input>
              </b-input-group>
            </b-form-group>
            <font size="-2">
              <pre>
buyOffer: {{ buyOffer }}
              </pre>
              <pre>
modalBuyOffer: {{ modalBuyOffer }}
              </pre>
            </font>
          </div>
        </b-modal> -->

        <b-tabs small card v-model="settings.tabIndex" @input="saveSettings();" content-class="mt-0" align="left">
          <template #tabs-start>
            <div class="d-flex flex-wrap m-0 p-0">
              <div class="mt-0 pr-0" style="width: 24.0rem;">
                <b-form-group label-for="explorer-tokencontractaddress" :state="!settings.tokenContractAddress || validAddress(settings.tokenContractAddress)" :invalid-feedback="'Invalid address'" class="m-0 p-0">
                  <b-form-input type="text" size="sm" id="explorer-tokencontractaddress" v-model="settings.tokenContractAddress" @change="saveSettings(); loadData(settings.tokenContractAddress);" placeholder="Token contract address, or select from dropdown"></b-form-input>
                </b-form-group>
              </div>
              <!-- TODO WIP -->
              <!-- <div class="mt-0 pr-1">
                <b-button size="sm" @click="showModalAddTokenContract" variant="link" v-b-popover.hover.ds500="'WIP: Search for token contracts'"><b-icon-search shift-v="+0" font-scale="1.2"></b-icon-search></b-button>
              </div> -->
              <div class="mt-0 pr-0">
                <b-dropdown size="sm" id="dropdown-left" text="" variant="link" v-b-popover.hover.ds500="'Configured token contracts'" class="m-0 ml-1 p-0">
                  <b-dropdown-item v-if="tokenContractsDropdownOptions.length == 0" disabled>No Token contracts with transfers permitted</b-dropdown-item>
                  <div v-for="(item, index) of tokenContractsDropdownOptions" v-bind:key="index">
                    <!-- <b-dropdown-item @click="settings.tokenAgentAddress = item.tokenAgent; saveSettings(); loadData(settings.contract);">{{ index }}. {{ 'ERC-' + item.type }} {{ item.contract.substring(0, 8) + '...' + item.contract.slice(-6) + ' ' + item.name }}</b-dropdown-item> -->
                    <b-dropdown-item @click="settings.tokenContractAddress = item.tokenContract; settings.symbol = item.symbol; settings.name = item.name; settings.decimals = item.decimals; saveSettings(); loadData(settings.tokenAgentAddress);">{{ index }}. {{ item.tokenContract.substring(0, 8) + '...' + item.tokenContract.slice(-6) + ' ' + item.symbol + ' ' + item.name + ' ' + (item.decimals != null ? parseInt(item.decimals) : '') }}</b-dropdown-item>
                  </div>
                </b-dropdown>
              </div>
              <div class="mt-0 pr-1">
                <b-button size="sm" :disabled="!validAddress(settings.tokenContractAddress)" :href="explorer + 'address/' + settings.tokenContractAddress + '#code'" variant="link" v-b-popover.hover.ds500="'View in explorer'" target="_blank" class="m-0 ml-2 mr-2 p-0"><b-icon-link45deg shift-v="-1" font-scale="1.2"></b-icon-link45deg></b-button>
              </div>
              <div class="mt-0 pr-1">
                <b-button size="sm" :disabled="!networkSupported || sync.completed != null || !validAddress(settings.tokenContractAddress)" @click="loadData(settings.tokenContractAddress);" variant="primary">Retrieve</b-button>
              </div>
              <!-- <div class="mt-0 pr-1">
                <b-button :disabled="!settings.contract || !validAddress(settings.contract)" @click="copyToClipboard(settings.contract);" variant="link" v-b-popover.hover.ds500="'Copy ERC-20 contract address to clipboard'" class="m-0 ml-2 p-0"><b-icon-clipboard shift-v="+1" font-scale="1.1"></b-icon-clipboard></b-button>
              </div> -->
              <div class="mt-0 pr-1" style="width: 18.0rem;">
                <font size="-1">
                  <!-- <b-link v-if="false" :href="explorer + 'address/' + settings.tokenAgentOwner" v-b-popover.hover.ds500="'Token Agent owner ' + settings.tokenAgentOwner" target="_blank">
                    <b-badge v-if="settings.tokenAgentOwner" variant="link" class="m-0 mt-1">
                      {{ settings.tokenAgentOwner.substring(0, 10) + '...' + settings.tokenAgentOwner.slice(-8) }}
                    </b-badge>
                  </b-link> -->
                  <b-badge v-if="false" variant="light" v-b-popover.hover.ds500="'Nonce'" class="m-0 mt-1">
                    {{ nonce }}
                  </b-badge>
                  <b-badge v-if="settings.symbol" variant="light" v-b-popover.hover.ds500="'Symbol'" class="m-0 mt-1">
                    {{ settings.symbol }}
                  </b-badge>
                  <b-badge v-if="settings.name" variant="light" v-b-popover.hover.ds500="'Name'" class="m-0 mt-1">
                    {{ settings.name }}
                  </b-badge>
                  <b-badge v-if="settings.decimals" variant="light" v-b-popover.hover.ds500="'Decimals'" class="m-0 mt-1">
                    {{ settings.decimals }}
                  </b-badge>
                  <!-- <b-badge variant="light" v-b-popover.hover.ds500="contract.decimals != null && contract.totalSupply && ('symbol: ' + contract.symbol + ', name: ' + contract.name + ', decimals: ' + contract.decimals + ', totalSupply: ' + formatDecimals(contract.totalSupply, contract.decimals) + ' (' + formatNumber(contract.totalSupply) + ')') || ''" class="m-0 mt-1 ml-2 mr-1">
                    {{ (contract.contractType && ('ERC-' + contract.contractType) || 'Enter token contract address and click [Retrieve]') }}
                  </b-badge>
                  <b-badge v-if="contract.symbol" variant="light" v-b-popover.hover.ds500="'symbol'" class="m-0 mt-1">
                    {{ contract.symbol }}
                  </b-badge>
                  <b-badge v-if="contract.name" variant="light" v-b-popover.hover.ds500="'name'" class="m-0 mt-1">
                    {{ contract.name }}
                  </b-badge>
                  <b-badge v-if="contract.decimals" variant="light" v-b-popover.hover.ds500="'decimals'" class="m-0 mt-1">
                    {{ contract.decimals }}
                  </b-badge>
                  <b-badge v-if="contract.totalSupply" variant="light" v-b-popover.hover.ds500="'totalSupply ' + (contract.totalSupply && formatNumber(contract.totalSupply) || '')" class="m-0 mt-1">
                    {{ formatDecimals(contract.totalSupply, contract.decimals) }}
                  </b-badge> -->
                </font>
              </div>

              <div class="mt-0 pr-3">
                <b-button size="sm" :disabled="!networkSupported || sync.completed != null || !validAddress(settings.tokenContractAddress)" @click="syncNow" v-b-popover.hover.ds500="'Sync'" variant="link"><b-icon-arrow-repeat shift-v="+1" font-scale="1.2"></b-icon-arrow-repeat></b-button>
              </div>
              <div class="mt-0 pr-3">
                <b-button size="sm" :disabled="!networkSupported || sync.completed != null || !validAddress(settings.tokenContractAddress)" @click="invalidateAllOffers" v-b-popover.hover.ds500="'Invalidate all of my offers'" variant="transparent"><b-icon-stop-fill shift-v="+1" font-scale="1.2" variant="danger"></b-icon-stop-fill></b-button>
              </div>
              <div class="mt-0 pr-3">
                <b-button size="sm" v-b-modal.config variant="link" v-b-popover.hover.ds500="'Config'" class="m-0 ml-2 mr-2 p-0"><b-icon-tools shift-v="-1" font-scale="0.9"></b-icon-tools></b-button>
              </div>
            </div>
          </template>
          <b-tab no-body active>
            <template #title>
              <span v-b-popover.hover.ds500="'Current market'">Market</span>
            </template>
          </b-tab>
          <b-tab no-body>
            <template #title>
              <span v-b-popover.hover.ds500="'Events'">Events</span>
            </template>
          </b-tab>
          <b-tab no-body>
            <template #title>
              <span v-b-popover.hover.ds500="'Data view'">Data</span>
            </template>
          </b-tab>
          <b-tab no-body>
            <template #title>
              <span v-b-popover.hover.ds500="'Raw command console'">Console</span>
            </template>
          </b-tab>
        </b-tabs>

        <b-card v-if="settings.tabIndex == 0" class="m-0 p-0 border-0" body-class="m-0 p-0">
          <b-row class="m-0 p-0">
            <b-col v-if="settings.viewMode == 0 || settings.viewMode == 1" class="m-0 mr-1 p-0">
              <div class="d-flex flex-wrap m-0 mt-1 p-0">
                <div class="mt-1 pr-1">
                  Sell Offers
                </div>
                <div class="mt-0 pr-1">
                  <b-dropdown size="sm" id="dropdown-left" variant="link" no-caret v-b-popover.hover.ds500="'Filters'" class="m-0 p-0">
                    <template #button-content>
                      <b-icon-list-task shift-v="-1" font-scale="1.2"></b-icon-list-task><span class="sr-only">Menu</span>
                    </template>
                    <b-dropdown-item href="#" @click="settings.sellOffers.mineOnly = !settings.sellOffers.mineOnly; saveSettings(); ">
                      <b-form-checkbox size="sm" v-model="settings.sellOffers.mineOnly">
                        Mine Only
                      </b-form-checkbox>
                    </b-dropdown-item>
                    <b-dropdown-item href="#" @click="settings.sellOffers.ignoreMyApprovals = !settings.sellOffers.ignoreMyApprovals; saveSettings(); ">
                      <b-form-checkbox size="sm" v-model="settings.sellOffers.ignoreMyApprovals">
                        Ignore My Approvals
                      </b-form-checkbox>
                    </b-dropdown-item>
                    <b-dropdown-item href="#" @click="settings.sellOffers.includeInvalidated = !settings.sellOffers.includeInvalidated; saveSettings(); ">
                      <b-form-checkbox size="sm" v-model="settings.sellOffers.includeInvalidated">
                        Include Invalidated
                      </b-form-checkbox>
                    </b-dropdown-item>
                    <b-dropdown-item href="#" @click="settings.sellOffers.includeExpired = !settings.sellOffers.includeExpired; saveSettings(); ">
                      <b-form-checkbox size="sm" v-model="settings.sellOffers.includeExpired">
                        Include Expired
                      </b-form-checkbox>
                    </b-dropdown-item>
                    <b-dropdown-item href="#" @click="settings.sellOffers.simulate = !settings.sellOffers.simulate; saveSettings(); ">
                      <b-form-checkbox size="sm" v-model="settings.sellOffers.simulate">
                        Simulate
                      </b-form-checkbox>
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
                <!-- <div class="mt-0 pr-1" style="min-width: 9rem;"> -->
                  <!-- x {{ settings.sellOffers.select.tokenAgent }}
                  <b-button size="sm" v-if="settings.sellOffers.select.tokenAgent" @click="resetFilterSellOffersByTokenAgent" variant="link">
                    <b-badge variant="link">
                      {{ settings.sellOffers.select.tokenAgent == null ? '' : (settings.sellOffers.select.owner && indexToAddress[settings.sellOffers.select.owner] && indexToAddress[settings.sellOffers.select.owner].substring(0, 12) + (settings.sellOffers.select.indexByOwner != 0 ? ':' + settings.sellOffers.select.indexByOwner : '')) }}
                      <b-icon-x shift-v="-1" font-scale="1.2"></b-icon-x>
                    </b-badge>
                  </b-button> -->
                  <!-- <b-button size="sm" v-if="settings.sellOffers.select.tokenAgent" @click="resetFilterSellOffersByTokenAgent" variant="link">
                    <b-badge variant="link">
                      {{ settings.sellOffers.select.tokenAgent == null ? '' : ((indexToAddress[settings.sellOffers.select.owner] && indexToAddress[settings.sellOffers.select.owner].substring(0, 12))) }}
                      <b-icon-x shift-v="-1" font-scale="1.2"></b-icon-x>
                    </b-badge>
                  </b-button> -->
                <!-- </div> -->
                <div class="mt-0 flex-grow-1">
                </div>
                <!-- <div class="mt-0 pr-1">
                  <b-form-select size="sm" v-model="settings.sellOffers.sortOption" @change="saveSettings" :options="sortOptions" v-b-popover.hover.ds500="'Yeah. Sort'"></b-form-select>
                </div> -->
                <div class="mt-0 pr-1">
                  <font size="-2" v-b-popover.hover.ds500="'# filtered / all entries'">{{ filteredSortedSellOffers.length + '/' + newSellOffers.records.length }}</font>
                </div>
                <div class="mt-0 pr-1">
                  <b-pagination size="sm" v-model="settings.sellOffers.currentPage" @input="saveSettings" :total-rows="filteredSortedSellOffers.length" :per-page="settings.sellOffers.pageSize" style="height: 0;"></b-pagination>
                </div>
                <div class="mt-0 pl-1">
                  <b-form-select size="sm" v-model="settings.sellOffers.pageSize" @change="saveSettings" :options="pageSizes" v-b-popover.hover.ds500="'Page size'"></b-form-select>
                </div>
                <div class="mt-0 pl-1">
                  <b-button v-if="settings.viewMode == 0" size="sm" @click="settings.viewMode = 1; saveSettings();" variant="link" v-b-popover.hover.ds500="'Sell offers view'" class="m-0 p-0">
                    <b-icon-chevron-right shift-v="+1" font-scale="0.9"></b-icon-chevron-right>
                  </b-button>
                  <b-button v-if="settings.viewMode == 1" size="sm" @click="settings.viewMode = 0; saveSettings();" variant="link" v-b-popover.hover.ds500="'Split view'" class="m-0 p-0">
                    <b-icon-chevron-left shift-v="+1" font-scale="0.9"></b-icon-chevron-left>
                  </b-button>
                </div>
              </div>
              <font size="-1">
                <b-table ref="sellOffersTable" small fixed striped responsive hover sticky-header="400px" selectable select-mode="single" @row-selected='sellOffersRowSelected' :fields="settings.viewMode == 0 ? sellOffersFields : extendedSellOffersFields" :items="pagedFilteredSellOffers" show-empty head-variant="light" class="m-0 mt-1" style="min-height: 250px;">
                  <template #cell(number)="data">
                    {{ parseInt(data.index) + ((settings.sellOffers.currentPage - 1) * settings.sellOffers.pageSize) + 1 }}
                  </template>
                  <template #cell(expiry)="data">
                    <span v-b-popover.hover.ds500="formatTimestamp(data.item.expiry)">
                      {{ formatExpiry(data.item.expiry) }}
                    </span>
                  </template>
                  <template #cell(maker)="data">
                    <!-- <b-button size="sm" @click="viewOldTakeSellOffer([data.item]);" variant="link" v-b-popover.hover.ds500="'Old Take Sell Offer'" class="m-0 p-0">
                      <b-icon-asterisk shift-v="+10" font-scale="0.6"></b-icon-asterisk>
                    </b-button> -->
                    <!-- <b-button size="sm" @click="filterSellOffersByTokenAgent(data.item)" variant="link" v-b-popover.hover.ds500="'Filter by Token Agent: ' + indexToAddress[data.item.tokenAgent]" class="m-0 p-0">
                      <b-icon-filter shift-v="+2" font-scale="1.1"></b-icon-filter>
                    </b-button> -->
                    {{ (indexToAddress[data.item.maker] && indexToAddress[data.item.maker].substring(0, 12) || '') }}
                    <!-- <font size="-1">
                      <b-link size="sm" :href="explorer + 'token/' + settings.tokenContractAddress + '?a=' + data.item.maker" variant="link" v-b-popover.hover.ds500="data.item.maker" target="_blank">
                        {{ data.item.maker.substring(0, 8) + '...' + data.item.maker.slice(-6) }}
                      </b-link>
                      <b-badge variant="light" v-b-popover.hover.ds500="'Owners token agent #' + data.item.tokenAgentIndexByOwner + ' ' + data.item.tokenAgent" class="m-0 p-0">
                        {{ data.item.tokenAgentIndexByOwner }}
                      </b-badge>
                      <b-badge variant="light" v-b-popover.hover.ds500="'Offer index ' + data.item.offerIndex" class="m-0 p-0">
                        {{ data.item.offerIndex }}
                      </b-badge>
                      <b-badge variant="light" v-b-popover.hover.ds500="'Price index ' + data.item.priceIndex" class="m-0 p-0">
                        {{ data.item.priceIndex }}
                      </b-badge>
                    </font> -->
                  </template>
                  <template #head(totalWeth)="data">
                    {{ settings.sellOffers.paymentType == 'eth' ? '∑ ETH' : '∑ WETH' }}
                  </template>
                  <template #cell(totalWeth)="data">
                    <span v-b-popover.hover.ds500="formatDecimals(data.item.totalWeth, 18)" :style="!data.item.valid ? 'text-decoration: line-through;' : ''">
                      {{ formatWeth(data.item.totalWeth) }}
                    </span>
                  </template>
                  <template #head(wethAmount)="data">
                    {{ settings.sellOffers.paymentType == 'eth' ? 'ETH' : 'WETH' }}
                  </template>
                  <template #cell(wethAmount)="data">
                    <span v-b-popover.hover.ds500="formatDecimals(data.item.wethAmount, 18)" :style="!data.item.valid ? 'text-decoration: line-through;' : ''">
                      {{ formatWeth(data.item.wethAmount) }}
                    </span>
                  </template>
                  <template #head(totalTokens)="data">
                    {{ '∑ ' + settings.symbol }}
                  </template>
                  <template #cell(totalTokens)="data">
                    <span v-b-popover.hover.ds500="formatDecimals(data.item.totalTokens, settings.decimals)" :style="!data.item.valid ? 'text-decoration: line-through;' : ''">
                      {{ formatTokens(data.item.totalTokens) }}
                    </span>
                  </template>
                  <template #head(tokens)="data">
                    {{ settings.symbol }}
                  </template>
                  <template #cell(tokens)="data">
                    <span v-b-popover.hover.ds500="formatDecimals(data.item.tokens, settings.decimals)" :style="!data.item.valid ? 'text-decoration: line-through;' : ''">
                      {{ formatTokens(data.item.tokens) }}
                    </span>
                  </template>
                  <template #cell(price)="data">
                    <span v-b-popover.hover.ds500="formatDecimals(data.item.price, 18)" :style="!data.item.valid ? 'text-decoration: line-through;' : ''">
                      {{ formatPrice(data.item.price) }}
                    </span>
                  </template>
                </b-table>
              </font>
            </b-col>
            <b-col v-if="settings.viewMode == 0 || settings.viewMode == 2" class="m-0 ml-1 p-0">
              <div class="d-flex flex-wrap m-0 mt-1 p-0">
                <div class="mt-0 pr-1">
                  <b-button v-if="settings.viewMode == 0" size="sm" @click="settings.viewMode = 2; saveSettings();" variant="link" v-b-popover.hover.ds500="'Buy offers view'" class="m-0 p-0">
                    <b-icon-chevron-left shift-v="+1" font-scale="0.9"></b-icon-chevron-left>
                  </b-button>
                  <b-button v-if="settings.viewMode == 2" size="sm" @click="settings.viewMode = 0; saveSettings();" variant="link" v-b-popover.hover.ds500="'Split view'" class="m-0 p-0">
                    <b-icon-chevron-right shift-v="+1" font-scale="0.9"></b-icon-chevron-right>
                  </b-button>
                </div>
                <div class="mt-1 pr-1">
                  Buy Offers
                </div>
                <div class="mt-0 pr-1">
                  <b-dropdown size="sm" id="dropdown-left" variant="link" no-caret v-b-popover.hover.ds500="'Filters'" class="m-0 p-0">
                    <template #button-content>
                      <b-icon-list-task shift-v="-1" font-scale="1.2"></b-icon-list-task><span class="sr-only">Menu</span>
                    </template>
                    <b-dropdown-item href="#" @click="settings.buyOffers.mineOnly = !settings.buyOffers.mineOnly; saveSettings(); ">
                      <b-form-checkbox size="sm" v-model="settings.buyOffers.mineOnly">
                        Mine Only
                      </b-form-checkbox>
                    </b-dropdown-item>
                    <b-dropdown-item href="#" @click="settings.buyOffers.ignoreMyApprovals = !settings.buyOffers.ignoreMyApprovals; saveSettings(); ">
                      <b-form-checkbox size="sm" v-model="settings.buyOffers.ignoreMyApprovals">
                        Ignore My Approvals
                      </b-form-checkbox>
                    </b-dropdown-item>
                    <b-dropdown-item href="#" @click="settings.buyOffers.includeInvalidated = !settings.buyOffers.includeInvalidated; saveSettings(); ">
                      <b-form-checkbox size="sm" v-model="settings.buyOffers.includeInvalidated">
                        Include Invalidated
                      </b-form-checkbox>
                    </b-dropdown-item>
                    <b-dropdown-item href="#" @click="settings.buyOffers.includeExpired = !settings.buyOffers.includeExpired; saveSettings(); ">
                      <b-form-checkbox size="sm" v-model="settings.buyOffers.includeExpired">
                        Include Expired
                      </b-form-checkbox>
                    </b-dropdown-item>
                    <b-dropdown-item href="#" @click="settings.buyOffers.simulate = !settings.buyOffers.simulate; saveSettings(); ">
                      <b-form-checkbox size="sm" v-model="settings.buyOffers.simulate">
                        Simulate
                      </b-form-checkbox>
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
                <div class="mt-0 flex-grow-1">
                </div>
                <!-- <div class="mt-0 pr-1">
                  <b-button size="sm" :disabled="!networkSupported" @click="addBuyOffer" variant="link" v-b-popover.hover.ds500="'Add Buy Offer'"><b-icon-plus shift-v="+1" font-scale="1.2"></b-icon-plus></b-button>
                </div> -->
                <!-- <div class="mt-0 flex-grow-1">
                </div> -->
                <!-- <div class="mt-0 pr-1">
                  <b-form-select size="sm" v-model="settings.buyOffers.sortOption" @change="saveSettings" :options="sortOptions" v-b-popover.hover.ds500="'Yeah. Sort'"></b-form-select>
                </div> -->
                <div class="mt-0 pr-1">
                  <font size="-2" v-b-popover.hover.ds500="'# filtered / all entries'">{{ filteredSortedBuyOffers.length + '/' + newBuyOffers.records.length }}</font>
                </div>
                <div class="mt-0 pr-1">
                  <b-pagination size="sm" v-model="settings.buyOffers.currentPage" @input="saveSettings" :total-rows="filteredSortedBuyOffers.length" :per-page="settings.buyOffers.pageSize" style="height: 0;"></b-pagination>
                </div>
                <div class="mt-0 pl-1">
                  <b-form-select size="sm" v-model="settings.buyOffers.pageSize" @change="saveSettings" :options="pageSizes" v-b-popover.hover.ds500="'Page size'"></b-form-select>
                </div>
              </div>
              <font size="-1">
                <b-table ref="buyOffersTable" small fixed striped responsive hover sticky-header="400px" selectable select-mode="single" @row-selected='buyOffersRowSelected' :fields="settings.viewMode == 0 ? buyOffersFields : extendedBuyOffersFields" :items="pagedFilteredBuyOffers" show-empty head-variant="light" class="m-0 mt-1" style="min-height: 250px;">
                  <template #cell(price)="data">
                    <span v-b-popover.hover.ds500="formatDecimals(data.item.price, 18)" :style="!data.item.valid ? 'text-decoration: line-through;' : ''">
                      {{ formatPrice(data.item.price) }}
                    </span>
                    <!-- <font size="-1">
                      {{ formatDecimals(data.item.price, 18) }}
                    </font> -->
                  </template>
                  <template #head(tokens)="data">
                    {{ settings.symbol }}
                  </template>
                  <template #cell(tokens)="data">
                    <span v-b-popover.hover.ds500="formatDecimals(data.item.tokens, settings.decimals)" :style="!data.item.valid ? 'text-decoration: line-through;' : ''">
                      {{ formatTokens(data.item.tokens) }}
                    </span>
                  </template>
                  <template #head(totalTokens)="data">
                    {{ '∑ ' + settings.symbol }}
                  </template>
                  <template #cell(totalTokens)="data">
                    <span v-b-popover.hover.ds500="formatDecimals(data.item.totalTokens, settings.decimals)" :style="!data.item.valid ? 'text-decoration: line-through;' : ''">
                      {{ formatTokens(data.item.totalTokens) }}
                    </span>
                  </template>
                  <template #head(wethAmount)="data">
                    {{ settings.buyOffers.paymentType == 'eth' ? 'ETH' : 'WETH' }}
                  </template>
                  <template #cell(wethAmount)="data">
                    <span v-b-popover.hover.ds500="formatDecimals(data.item.wethAmount, 18)" :style="!data.item.valid ? 'text-decoration: line-through;' : ''">
                      {{ formatWeth(data.item.wethAmount) }}
                    </span>
                  </template>
                  <template #head(totalWeth)="data">
                    {{ settings.buyOffers.paymentType == 'eth' ? '∑ ETH' : '∑ WETH' }}
                  </template>
                  <template #cell(totalWeth)="data">
                    <span v-b-popover.hover.ds500="formatDecimals(data.item.totalWeth, 18)" :style="!data.item.valid ? 'text-decoration: line-through;' : ''">
                      {{ formatWeth(data.item.totalWeth) }}
                    </span>
                  </template>
                  <template #cell(maker)="data">
                    {{ (indexToAddress[data.item.maker] && indexToAddress[data.item.maker].substring(0, 12) || '') }}
                    <!-- <font size="-1">
                      <b-link size="sm" :href="explorer + 'token/' + data.weth + '?a=' + data1.item.maker" variant="link" v-b-popover.hover.ds500="data1.item.maker" target="_blank">
                        {{ data1.item.maker.substring(0, 8) + '...' + data1.item.maker.slice(-6) }}
                      </b-link>
                      <b-badge variant="light" v-b-popover.hover.ds500="'Owners token agent #' + data1.item.tokenAgentIndexByOwner + ' ' + data1.item.tokenAgent" class="m-0 p-0">
                        {{ data1.item.tokenAgentIndexByOwner }}
                      </b-badge>
                      <b-badge variant="light" v-b-popover.hover.ds500="'Offer index ' + data1.item.offerIndex" class="m-0 p-0">
                        {{ data1.item.offerIndex }}
                      </b-badge>
                      <b-badge variant="light" v-b-popover.hover.ds500="'Price index ' + data1.item.priceIndex" class="m-0 p-0">
                        {{ data1.item.priceIndex }}
                      </b-badge>
                    </font> -->
                  </template>
                  <template #cell(expiry)="data">
                    <span v-b-popover.hover.ds500="formatTimestamp(data.item.expiry)">
                      {{ formatExpiry(data.item.expiry) }}
                    </span>
                  </template>
                  <template #cell(number)="data">
                    {{ parseInt(data.index) + ((settings.buyOffers.currentPage - 1) * settings.buyOffers.pageSize) + 1 }}
                  </template>
                </b-table>
              </font>
            </b-col>
          </b-row>
          <b-row class="m-0 mt-1 p-0">
            <b-col class="m-0 mr-1 p-0">
              <b-card v-if="settings.viewMode == 0 || settings.viewMode == 1" :cols="settings.viewMode == 0 ? null : 6" no-body>
                <b-tabs small card v-model="settings.sellOffers.tabIndex" @input="saveSettings();" pills card vertical nav-class="m-0 p-1" content-class="mt-0" active-tab-class="m-1 p-1" align="left" style="min-height: 260px;">
                  <b-tab title="Take Offer" active>
                    <b-card-text class="m-0 p-0">
                      <b-form-group label="Requested amount:" label-for="takeselloffer-amounttype" label-size="sm" label-cols-sm="4" label-align-sm="right" class="m-0 p-0">
                        <b-input-group class="w-75">
                          <b-form-input size="sm" type="number" id="takeselloffer-amount" v-model="settings.sellOffers.amount" @update="saveSettings();" debounce="600"></b-form-input>
                          <b-input-group-append>
                            <b-form-radio-group size="sm" buttons id="takeselloffer-amounttype" v-model="settings.sellOffers.amountType" @change="saveSettings();" button-variant="outline-primary">
                              <b-form-radio value="tokens">{{ settings.symbol }}</b-form-radio>
                              <b-form-radio value="weth">{{ settings.sellOffers.paymentType == 'weth' ? 'WETH' : 'ETH' }}</b-form-radio>
                            </b-form-radio-group>
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group :label="'Receive ' + settings.symbol + ':'" label-for="takeselloffer-filledtokens" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-input size="sm" plaintext id="takeselloffer-filledtokens" :value="newSellOffers.filled.tokens && formatDecimals(newSellOffers.filled.tokens, 18)" class="pl-2 w-75"></b-form-input>
                      </b-form-group>
                      <b-form-group :label="settings.sellOffers.paymentType == 'weth' ? 'Pay WETH:' : 'Pay ETH:'" label-for="takeselloffer-filledweth" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-input size="sm" plaintext id="takeselloffer-filledweth" :value="newSellOffers.filled.weth && formatDecimals(newSellOffers.filled.weth, 18)" class="pl-2 w-75"></b-form-input>
                      </b-form-group>
                      <b-form-group label="Average Price:" label-for="takeselloffer-filledaverageprice" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-input size="sm" plaintext id="takeselloffer-filledaverageprice" :value="newSellOffers.filled.averagePrice && formatDecimals(newSellOffers.filled.averagePrice, 18)" class="pl-2 w-75"></b-form-input>
                      </b-form-group>
                      <b-form-group label="Pay:" label-for="takeselloffer-paymenttype" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-radio-group size="sm" buttons id="takeselloffer-paymenttype" v-model="settings.sellOffers.paymentType" @change="saveSettings();" button-variant="outline-primary">
                          <b-form-radio value="weth">WETH</b-form-radio>
                          <b-form-radio value="eth">ETH</b-form-radio>
                        </b-form-radio-group>
                      </b-form-group>
                      <b-form-group label="ETH balance:" label-for="takeselloffer-ethbalance" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-input size="sm" plaintext id="takeselloffer-ethbalance" :value="formatDecimals(balance, 18)" class="pl-2 w-75"></b-form-input>
                      </b-form-group>
                      <b-form-group v-if="settings.sellOffers.paymentType == 'weth'" label="WETH balance:" label-for="takeselloffer-wethbalance" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-input size="sm" plaintext id="takeselloffer-wethbalance" :value="formatDecimals(coinbaseWethBalance, 18)" class="pl-2 w-75"></b-form-input>
                      </b-form-group>
                      <b-form-group v-if="settings.sellOffers.paymentType == 'weth'" label="WETH approved:" label-for="takeselloffer-wethapproved" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-input size="sm" plaintext id="takeselloffer-wethapproved" :value="formatDecimals(coinbaseWethApproval, 18)" class="pl-2 w-75"></b-form-input>
                      </b-form-group>
                      <b-form-group label="" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-button size="sm" :disabled="!networkSupported || !newSellOffers.filled.tokens" @click="newSellOffersTrade" variant="warning">Buy {{ settings.symbol }}</b-button>
                      </b-form-group>
                    </b-card-text>
                  </b-tab>
                  <b-tab title="Make Offer">
                    <b-card-text>
                      <b-form-group label="Points:" label-size="sm" label-cols-sm="4" label-align-sm="right" :state="!sellOfferPointsFeedback" :invalid-feedback="sellOfferPointsFeedback" class="mx-0 my-1 p-0">
                        <font size="-1">
                          <b-table ref="addSellOfferPointsTable" small fixed striped sticky-header="600px" responsive hover :fields="addSellOfferPointsFields" :items="settings.sellOffers.points" show-empty head-variant="light" class="m-0 mt-1">
                            <template #empty="scope">
                              Click [+] below to add a new row
                            </template>
                            <template #cell(price)="data">
                              <b-form-input size="sm" type="number" v-model.trim="data.item.price" @change="saveSettings();" debounce="600" class="text-right"></b-form-input>
                            </template>
                            <template #cell(tokens)="data">
                              <b-form-input size="sm" type="number" v-model.trim="data.item.tokens" @change="saveSettings();" debounce="600" class="text-right"></b-form-input>
                            </template>
                            <!-- <template #cell(wethAmount)="data">
                              <b-form-input size="sm" readonly :value="formatNumber(bigNumberMultiply(data.item.price, data.item.tokens))" class="text-right"></b-form-input>
                            </template> -->
                            <template #cell(option)="data">
                              <b-button size="sm" @click="settings.sellOffers.points.splice(data.index, 1); saveSettings();" variant="link" v-b-popover.hover.ds500="'Delete row'"><b-icon-dash shift-v="+1" font-scale="1.2"></b-icon-dash></b-button>
                            </template>
                            <template #bottom-row="data">
                              <b-td>
                                <!-- <b-form-checkbox size="sm" v-model="settings.sellOffers.simulate" @input="saveSettings" v-b-popover.hover.ds500="'Simulate in offers table above?'" class="ml-1 mt-1"> -->
                                <b-form-checkbox size="sm" v-model="settings.sellOffers.simulate" @input="saveSettings" class="ml-1 mt-1">
                                  Simulate
                                </b-form-checkbox>
                              </b-td>
                              <b-td>
                              </b-td>
                              <b-td class="text-right">
                                <b-button size="sm" @click="settings.sellOffers.points.push({ price: null, tokens: null }); saveSettings();" variant="link" v-b-popover.hover.ds500="'Add new row'"><b-icon-plus shift-v="+1" font-scale="1.2"></b-icon-plus></b-button>
                              </b-td>
                            </template>
                          </b-table>
                        </font>
                      </b-form-group>
                      <b-form-group label="Expiry:" label-for="addselloffer-expirytime" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-datepicker size="sm" id="addselloffer-expirydate" v-model="sellExpiryDate" :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' }" reset-button today-button close-button label-reset-button="No Expiry" label-no-date-selected="No Expiry" class="w-75"></b-form-datepicker>
                      </b-form-group>
                      <b-form-group v-if="sellExpiryDate" label="" label-for="addselloffer-expirytime" label-size="sm" label-cols-sm="4" label-align-sm="right" :description="formatTimestampUTC(settings.sellOffers.expiry)" class="mx-0 my-1 p-0">
                        <b-form-timepicker size="sm" id="addselloffer-expirytime" v-model="sellExpiryTime" minutes-step="15" now-button label-no-time-selected="Select" class="w-50"></b-form-timepicker>
                      </b-form-group>
                      <b-form-group label="" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-button size="sm" :disabled="settings.sellOffers.points.length == 0 || !!sellOfferPointsFeedback" @click="execAddSellOffer" variant="warning">Add Sell {{ settings.symbol }} Offer</b-button>
                      </b-form-group>
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </b-col>
            <b-col class="m-0 ml-1 p-0">
              <b-card v-if="settings.viewMode == 0 || settings.viewMode == 2" :cols="settings.viewMode == 0 ? null : 6" no-body>
                <b-tabs small card v-model="settings.buyOffers.tabIndex" @input="saveSettings();" pills card vertical nav-class="m-0 p-1" content-class="mt-0" active-tab-class="m-1 p-1" align="left" style="min-height: 260px;">
                  <b-tab title="Take Offer" active>
                    <b-card-text class="m-0 p-0">
                      <b-form-group label="Requested amount:" label-for="takebuyoffer-amounttype" label-size="sm" label-cols-sm="4" label-align-sm="right" class="m-0 p-0">
                        <b-input-group class="w-75">
                          <b-form-input size="sm" type="number" id="takebuyoffer-amount" v-model="settings.buyOffers.amount" @update="saveSettings();" debounce="600"></b-form-input>
                          <b-input-group-append>
                            <b-form-radio-group size="sm" buttons id="takebuyoffer-amounttype" v-model="settings.buyOffers.amountType" @change="saveSettings();" button-variant="outline-primary">
                              <b-form-radio value="tokens">{{ settings.symbol }}</b-form-radio>
                              <b-form-radio value="weth">{{ settings.buyOffers.paymentType == 'weth' ? 'WETH' : 'ETH' }}</b-form-radio>
                            </b-form-radio-group>
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group :label="settings.buyOffers.paymentType == 'weth' ? 'Receive WETH:' : 'Receive ETH:'" label-for="takebuyoffer-filledweth" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-input size="sm" plaintext id="takebuyoffer-filledweth" :value="newBuyOffers.filled.weth && formatDecimals(newBuyOffers.filled.weth, 18)" class="pl-2 w-75"></b-form-input>
                      </b-form-group>
                      <b-form-group :label="'Pay ' + settings.symbol + ':'" label-for="takebuyoffer-filledtokens" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-input size="sm" plaintext id="takebuyoffer-filledtokens" :value="newBuyOffers.filled.tokens && formatDecimals(newBuyOffers.filled.tokens, 18)" class="pl-2 w-75"></b-form-input>
                      </b-form-group>
                      <b-form-group label="Average Price:" label-for="takebuyoffer-filledaverageprice" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-input size="sm" plaintext id="takebuyoffer-filledaverageprice" :value="newBuyOffers.filled.averagePrice && formatDecimals(newBuyOffers.filled.averagePrice, 18)" class="pl-2 w-75"></b-form-input>
                      </b-form-group>
                      <b-form-group label="Receive:" label-for="takebuyoffer-paymenttype" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-radio-group size="sm" buttons id="takebuyoffer-paymenttype" v-model="settings.buyOffers.paymentType" @change="saveSettings();" button-variant="outline-primary">
                          <b-form-radio value="weth">WETH</b-form-radio>
                          <b-form-radio value="eth">ETH</b-form-radio>
                        </b-form-radio-group>
                      </b-form-group>
                      <b-form-group label="ETH Balance:" label-for="takebuyoffer-ethbalance" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-input size="sm" plaintext id="takebuyoffer-ethbalance" :value="formatDecimals(balance, 18)" class="pl-2 w-75"></b-form-input>
                      </b-form-group>
                      <b-form-group :label="settings.symbol + ' balance:'" label-for="takebuyoffer-wethbalance" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-input size="sm" plaintext id="takebuyoffer-wethbalance" :value="formatDecimals(coinbaseTokenBalance, 18)" class="pl-2 w-75"></b-form-input>
                      </b-form-group>
                      <b-form-group :label="settings.symbol + ' approved:'" label-for="takebuyoffer-wethapproved" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-input size="sm" plaintext id="takebuyoffer-wethapproved" :value="formatDecimals(coinbaseTokenApproval, 18)" class="pl-2 w-75"></b-form-input>
                      </b-form-group>
                      <b-form-group label="" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-button size="sm" :disabled="!networkSupported || !newBuyOffers.filled.tokens" @click="newBuyOffersTrade" variant="warning">Sell {{ settings.symbol }}</b-button>
                      </b-form-group>
                    </b-card-text>
                  </b-tab>
                  <b-tab title="Make Offer">
                    <b-card-text>
                      <b-form-group label="Points:" label-size="sm" label-cols-sm="4" label-align-sm="right" :state="!buyOfferPointsFeedback" :invalid-feedback="buyOfferPointsFeedback" class="mx-0 my-1 p-0">
                        <font size="-1">
                          <b-table ref="addSellOfferPointsTable" small fixed striped sticky-header="600px" responsive hover :fields="addSellOfferPointsFields" :items="settings.buyOffers.points" show-empty head-variant="light" class="m-0 mt-1">
                            <template #empty="scope">
                              Click [+] below to add a new row
                            </template>
                            <template #cell(price)="data">
                              <b-form-input size="sm" type="number" v-model.trim="data.item.price" @change="saveSettings();" debounce="600" class="text-right"></b-form-input>
                            </template>
                            <template #cell(tokens)="data">
                              <b-form-input size="sm" type="number" v-model.trim="data.item.tokens" @change="saveSettings();" debounce="600" class="text-right"></b-form-input>
                            </template>
                            <!-- <template #cell(wethAmount)="data">
                              <b-form-input size="sm" readonly :value="formatNumber(bigNumberMultiply(data.item.price, data.item.tokens))" class="text-right"></b-form-input>
                            </template> -->
                            <template #cell(option)="data">
                              <b-button size="sm" @click="settings.buyOffers.points.splice(data.index, 1); saveSettings();" variant="link" v-b-popover.hover.ds500="'Delete row'"><b-icon-dash shift-v="+1" font-scale="1.2"></b-icon-dash></b-button>
                            </template>
                            <template #bottom-row="data">
                              <b-td>
                                <!-- <b-form-checkbox size="sm" v-model="settings.buyOffers.simulate" @input="saveSettings" v-b-popover.hover.ds500="'Simulate in offers table above?'" class="ml-1 mt-1"> -->
                                <b-form-checkbox size="sm" v-model="settings.buyOffers.simulate" @input="saveSettings" class="ml-1 mt-1">
                                  Simulate
                                </b-form-checkbox>
                              </b-td>
                              <b-td>
                              </b-td>
                              <b-td class="text-right">
                                <b-button size="sm" @click="settings.buyOffers.points.push({ price: null, tokens: null }); saveSettings();" variant="link" v-b-popover.hover.ds500="'Add new row'"><b-icon-plus shift-v="+1" font-scale="1.2"></b-icon-plus></b-button>
                              </b-td>
                            </template>
                          </b-table>
                        </font>
                      </b-form-group>
                      <b-form-group label="Expiry:" label-for="addbuyoffer-expirytime" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-form-datepicker size="sm" id="addbuyoffer-expirydate" v-model="buyExpiryDate" :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' }" reset-button today-button close-button label-reset-button="No Expiry" label-no-date-selected="No Expiry" class="w-75"></b-form-datepicker>
                      </b-form-group>
                      <b-form-group v-if="buyExpiryDate" label="" label-for="addbuyoffer-expirytime" label-size="sm" label-cols-sm="4" label-align-sm="right" :description="formatTimestampUTC(settings.buyOffers.expiry)" class="mx-0 my-1 p-0">
                        <b-form-timepicker size="sm" id="addbuyoffer-expirytime" v-model="buyExpiryTime" minutes-step="15" now-button label-no-time-selected="Select" class="w-50"></b-form-timepicker>
                      </b-form-group>
                      <b-form-group label="" label-size="sm" label-cols-sm="4" label-align-sm="right" class="mx-0 my-1 p-0">
                        <b-button size="sm" :disabled="settings.buyOffers.points.length == 0 || !!buyOfferPointsFeedback" @click="execAddBuyOffer" variant="warning">Add Buy {{ settings.symbol }} Offer</b-button>
                      </b-form-group>
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>

              <!-- <b-tabs size="sm" card v-model="settings.buyOffers.tabIndex" @input="saveSettings();" content-class="mt-0" align="left">
                <b-tab no-body>
                  <template #title>
                    <span v-b-popover.hover.ds500="'Take offer'">Take Offer</span>
                  </template>
                </b-tab>
                <b-tab no-body>
                  <template #title>
                    <span v-b-popover.hover.ds500="'Make offer'">Make Offer</span>
                  </template>
                </b-tab>
              </b-tabs> -->
              <!-- <b-card-text v-if="settings.buyOffers.tabIndex == 0" class="m-0 p-0">

              </b-card-text> -->
              <!-- <font v-if="settings.buyOffers.tabIndex != 0" size="-2">
                <pre>
newBuyOffers: {{ newBuyOffers }}
                </pre>
              </font> -->
            </b-col>
          </b-row>
          <!-- <b-row class="m-0 mt-2 p-0">
            <b-col class="m-0 mr-1 p-0">
              <font size="-2">
                <pre>
sellOffers: {{ sellOffers }}
                </pre>
              </font>
            </b-col>
            <b-col class="m-0 mr-1 p-0">
              <font size="-2">
                <pre>
buyOffers: {{ buyOffers }}
                </pre>
              </font>
            </b-col>
          </b-row> -->
        </b-card>

        <b-card v-if="settings.tabIndex == 1" class="m-0 p-0 border-0" body-class="m-0 p-0">
          <div class="d-flex flex-wrap m-0 mt-1 p-0">
            <div class="mt-0 pr-1">
              <b-form-select size="sm" v-model="settings.events.eventTypeOption" @change="saveSettings" :options="eventTypeOptions"></b-form-select>
            </div>
            <div class="mt-0 flex-grow-1">
            </div>
            <div class="mt-0 pr-1">
              <b-form-select size="sm" v-model="settings.events.sortOption" @change="saveSettings" :options="sortOptions" v-b-popover.hover.ds500="'Yeah. Sort'"></b-form-select>
            </div>
            <div class="mt-0 pr-1">
              <font size="-2" v-b-popover.hover.ds500="'# filtered / all entries'">{{ filteredSortedEvents.length + '/' + eventsList.length }}</font>
            </div>
            <div class="mt-0 pr-1">
              <b-pagination size="sm" v-model="settings.events.currentPage" @input="saveSettings" :total-rows="filteredSortedEvents.length" :per-page="settings.events.pageSize" style="height: 0;"></b-pagination>
            </div>
            <div class="mt-0 pl-1">
              <b-form-select size="sm" v-model="settings.events.pageSize" @change="saveSettings" :options="pageSizes" v-b-popover.hover.ds500="'Page size'"></b-form-select>
            </div>
          </div>
          <font size="-1">
            <b-table ref="eventsTable" small fixed striped responsive hover :fields="eventsFields" :items="pagedFilteredSortedEvents" show-empty head-variant="light" class="m-0 mt-1">
              <template #cell(number)="data">
                {{ parseInt(data.index) + ((settings.events.currentPage - 1) * settings.events.pageSize) + 1 }}
              </template>
              <template #cell(when)="data">
                <b-link size="sm" :href="explorer + 'tx/' + indexToTxHash[data.item.txHash] + '#eventlog#' + data.item.logIndex" variant="link" v-b-popover.hover.ds500="data.item.blockNumber + ':' + data.item.txIndex + '.' + data.item.logIndex" target="_blank">
                  <span v-if="data.item.timestamp">
                    {{ formatTimestamp(data.item.timestamp) }}
                  </span>
                  <span v-else>
                    {{ data.item.blockNumber + ':' + data.item.txIndex }}
                  </span>
                </b-link>
              </template>
              <!-- <template #cell(from)="data">
                <b-link v-if="data.item.from" size="sm" :href="explorer + 'address/' + data.item.from" variant="link" v-b-popover.hover.ds500="data.item.from" target="_blank">
                  {{ data.item.from.substring(0, 8) + '...' + data.item.from.slice(-6) }}
                </b-link>
              </template> -->
              <!-- <template #cell(to)="data">
                <b-link v-if="data.item.to" size="sm" :href="explorer + 'address/' + data.item.to" variant="link" v-b-popover.hover.ds500="data.item.to" target="_blank">
                  {{ data.item.to.substring(0, 8) + '...' + data.item.to.slice(-6) }}
                </b-link>
              </template> -->
              <template #head(info)="data">
                <b-row>
                  <b-col cols="1">
                    Event
                  </b-col>
                  <b-col cols="2">
                    Maker / From / Owner
                  </b-col>
                  <b-col cols="2">
                    Taker / To / Spender
                  </b-col>
                  <b-col cols="1">
                    Token
                  </b-col>
                  <b-col cols="6" class="text-left">
                    Tokens/Info
                  </b-col>
                </b-row>
              </template>
              <template #cell(info)="data1">
                <div v-if="data1.item.eventType == 'Transfer' || data1.item.eventType == 'Approval'">
                  <b-row>
                    <b-col cols="1">
                      <b-link size="sm" :href="explorer + 'tx/' + indexToTxHash[data1.item.txHash] + '#eventlog#' + data1.item.logIndex" variant="link" v-b-popover.hover.ds500="'Log index: ' + data1.item.logIndex" target="_blank">
                        {{ data1.item.eventType }}
                      </b-link>
                    </b-col>
                    <b-col cols="2">
                      <div v-if="data1.item.eventType == 'Transfer'">
                        <b-link size="sm" :href="explorer + 'address/' + indexToAddress[data1.item.events[0].from]" variant="link" v-b-popover.hover.ds500="'From: ' + indexToAddress[data1.item.events[0].from]" target="_blank">
                          {{ indexToAddress[data1.item.events[0].from].substring(0, 8) + '...' + indexToAddress[data1.item.events[0].from].slice(-6) }}
                        </b-link>
                      </div>
                      <div v-else>
                        <b-link size="sm" :href="explorer + 'address/' + indexToAddress[data1.item.events[0].owner]" variant="link" v-b-popover.hover.ds500="'Owner: ' + indexToAddress[data1.item.events[0].owner]" target="_blank">
                          {{ indexToAddress[data1.item.events[0].owner].substring(0, 8) + '...' + indexToAddress[data1.item.events[0].owner].slice(-6) }}
                        </b-link>
                      </div>
                    </b-col>
                    <b-col cols="2">
                      <div v-if="data1.item.eventType == 'Transfer'">
                        <b-link size="sm" :href="explorer + 'address/' + indexToAddress[data1.item.events[0].to]" variant="link" v-b-popover.hover.ds500="'To: ' + indexToAddress[data1.item.events[0].to]" target="_blank">
                          {{ indexToAddress[data1.item.events[0].to].substring(0, 8) + '...' + indexToAddress[data1.item.events[0].to].slice(-6) }}
                        </b-link>
                      </div>
                      <div v-else>
                        <b-link size="sm" :href="explorer + 'address/' + indexToAddress[data1.item.events[0].spender]" variant="link" v-b-popover.hover.ds500="'Spender: ' + indexToAddress[data1.item.events[0].spender]" target="_blank">
                          {{ indexToAddress[data1.item.events[0].spender].substring(0, 8) + '...' + indexToAddress[data1.item.events[0].spender].slice(-6) }}
                        </b-link>
                      </div>
                    </b-col>
                    <b-col cols="1">
                      <b-link size="sm" :href="explorer + 'token/' + indexToAddress[data1.item.events[0].contract]" variant="link" v-b-popover.hover.ds500="indexToAddress[data1.item.events[0].contract]" target="_blank">
                        <span v-if="data1.item.events[0].contract == tokenSet.tokenIndex">
                          {{ settings.symbol }}
                        </span>
                        <span v-else-if="data1.item.events[0].contract == tokenSet.wethIndex">
                          WETH
                        </span>
                        <span v-else>
                          {{ indexToAddress[data1.item.events[0].contract].substring(0, 8) + '...' + indexToAddress[data1.item.events[0].contract].slice(-6) }}
                        </span>
                      </b-link>
                    </b-col>
                    <b-col cols="6" class="text-left">
                      {{ formatDecimals(data1.item.events[0].tokens, 18) }}
                    </b-col>
                  </b-row>
                </div>
                <div v-else-if="data1.item.eventType == 'Offered'">
                  <div v-for="(info, i) in data1.item.events"  v-bind:key="i" class="m-0 p-0">
                    <b-row>
                      <b-col cols="1">
                        <b-link size="sm" :href="explorer + 'tx/' + indexToTxHash[data1.item.txHash] + '#eventlog#' + info.logIndex" variant="link" v-b-popover.hover.ds500="'Log index: ' + info.logIndex" target="_blank">
                          {{ data1.item.eventType }}
                        </b-link>
                      </b-col>
                      <b-col cols="2">
                        <b-link size="sm" :href="explorer + 'address/' + indexToAddress[info.maker]" variant="link" v-b-popover.hover.ds500="'Maker ' + indexToAddress[info.maker]" target="_blank">
                          {{ indexToAddress[info.maker].substring(0, 8) + '...' + indexToAddress[info.maker].slice(-6) }}
                        </b-link>
                      </b-col>
                      <b-col cols="2">
                      </b-col>
                      <b-col cols="1">
                        <b-link size="sm" :href="explorer + 'token/' + indexToAddress[info.token]" variant="link" v-b-popover.hover.ds500="indexToAddress[info.token]" target="_blank">
                          <span v-if="info.token == tokenSet.tokenIndex">
                            {{ settings.symbol }}
                          </span>
                          <span v-else-if="info.token == tokenSet.wethIndex">
                            WETH
                          </span>
                          <span v-else>
                            {{ indexToAddress[info.token].substring(0, 8) + '...' + indexToAddress[info.token].slice(-6) }}
                          </span>
                        </b-link>
                      </b-col>
                      <b-col cols="6" class="text-left">
                        {{ info.buySell == 0 ? 'BUY' : 'SELL' }} offerId: {{ info.index }}, nonce: {{ info.nonce }}, exp: {{ formatTimestamp(info.expiry )}}
                        <div v-for="(point, i) in info.prices"  v-bind:key="i" class="m-0 p-0">
                          <li>{{ formatDecimals(info.tokenss[i], settings.decimals) }} @ {{ formatDecimals(point, 18) }}</li>
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </div>
                <div v-else-if="data1.item.eventType == 'Traded'">
                  <div v-for="(info, i) in data1.item.events"  v-bind:key="i" class="m-0 p-0">
                    <!-- {{ logIndex }} . {{ info }} -->
                    <b-row>
                      <b-col cols="1">
                        <b-link size="sm" :href="explorer + 'tx/' + indexToTxHash[data1.item.txHash] + '#eventlog#' + info.logIndex" variant="link" v-b-popover.hover.ds500="'Log index: ' + info.logIndex" target="_blank">
                          {{ info.eventType == 10 ? 'Traded' : 'Transfer' }}
                        </b-link>
                      </b-col>
                      <b-col cols="2">
                        <!-- <div v-if="info.eventType == 'Transfer' || info.eventType == 'InternalTransfer' || info.eventType == 'Deposit' || info.eventType == 'Withdrawal'"> -->
                        <div v-if="info.eventType == 0 || info.eventType == 6 || info.eventType == 1 || info.eventType == 2">
                          <b-link size="sm" :href="explorer + 'address/' + indexToAddress[info.from]" variant="link" v-b-popover.hover.ds500="'From: ' + indexToAddress[info.from]" target="_blank">
                            <span v-if="info.from == tokenSet.wethIndex">
                              WETH
                            </span>
                            <span v-else>
                              {{ indexToAddress[info.from].substring(0, 8) + '...' + indexToAddress[info.from].slice(-6) }}
                            </span>
                          </b-link>
                        </div>
                        <div v-else>
                          <b-link size="sm" :href="explorer + 'address/' + indexToAddress[info.maker]" variant="link" v-b-popover.hover.ds500="'Maker ' + indexToAddress[info.maker]" target="_blank">
                            {{ indexToAddress[info.maker].substring(0, 8) + '...' + indexToAddress[info.maker].slice(-6) }}
                          </b-link>
                        </div>
                      </b-col>
                      <b-col cols="2">
                        <!-- <div v-if="info.eventType == 'Transfer' || info.eventType == 'InternalTransfer' || info.eventType == 'Deposit' || info.eventType == 'Withdrawal'"> -->
                        <div v-if="info.eventType == 0 || info.eventType == 6 || info.eventType == 1 || info.eventType == 2">
                          <b-link size="sm" :href="explorer + 'address/' + indexToAddress[info.to]" variant="link" v-b-popover.hover.ds500="indexToAddress[info.to]" target="_blank">
                            <span v-if="info.to == tokenSet.wethIndex">
                              WETH
                            </span>
                            <span v-else>
                              {{ indexToAddress[info.to].substring(0, 8) + '...' + indexToAddress[info.to].slice(-6) }}
                            </span>
                          </b-link>
                        </div>
                        <div v-else>
                          <b-link v-if="info.taker" size="sm" :href="explorer + 'address/' + indexToAddress[info.taker]" variant="link" v-b-popover.hover.ds500="'Taker ' + indexToAddress[info.taker]" target="_blank">
                            {{ indexToAddress[info.taker].substring(0, 8) + '...' + indexToAddress[info.taker].slice(-6) }}
                          </b-link>
                        </div>
                      </b-col>
                      <b-col cols="1">
                        <!-- <div v-if="info.eventType == 'Transfer' || info.eventType == 'Deposit' || info.eventType == 'Withdrawal'"> -->
                        <div v-if="info.eventType == 0 || info.eventType == 1 || info.eventType == 2">
                          <b-link size="sm" :href="explorer + 'contract/' + indexToAddress[info.contract]" variant="link" v-b-popover.hover.ds500="indexToAddress[info.contract]" target="_blank">
                            <span v-if="info.contract == tokenSet.tokenIndex">
                              {{ settings.symbol }}
                            </span>
                            <span v-else-if="info.contract == tokenSet.wethIndex">
                              WETH
                            </span>
                            <span v-else>
                              {{ indexToAddress[info.contract].substring(0, 8) + '...' + indexToAddress[info.contract].slice(-6) }}
                            </span>
                          </b-link>
                        </div>
                        <!-- <div v-else-if="info.eventType == 'InternalTransfer'"> -->
                        <div v-else-if="info.eventType == 6">
                          ETH
                        </div>
                        <div v-else>
                          <b-link size="sm" :href="explorer + 'token/' + indexToAddress[info.token]" variant="link" v-b-popover.hover.ds500="indexToAddress[info.token]" target="_blank">
                            <span v-if="info.token == tokenSet.tokenIndex">
                              {{ settings.symbol }}
                            </span>
                            <span v-else-if="info.token == tokenSet.wethIndex">
                              WETH
                            </span>
                            <span v-else>
                              {{ indexToAddress[info.token].substring(0, 8) + '...' + indexToAddress[info.token].slice(-6) }}
                            </span>
                          </b-link>
                        </div>
                      </b-col>
                      <b-col cols="6" class="text-left">
                        <!-- <div v-if="info.eventType == 'Transfer' || info.eventType == 'Deposit' || info.eventType == 'Withdrawal'"> -->
                        <div v-if="info.eventType == 0 || info.eventType == 1 || info.eventType == 2">
                          {{ formatDecimals(info.tokens, 18) }}
                        </div>
                        <!-- <div v-else-if="info.eventType == 'InternalTransfer'"> -->
                        <div v-else-if="info.eventType == 6">
                          {{ formatDecimals(info.ethers, 18) }}
                        </div>
                        <div v-else>
                          maker {{ info.makerBuySell == 0 ? 'BUY' : 'SELL' }} offerId: {{ info.index }}, avg price: {{ formatDecimals(info.price, 18) }}
                          <div v-for="(point, i) in info.prices"  v-bind:key="i" class="m-0 p-0">
                            <li>{{ formatDecimals(info.tokenss[i], settings.decimals) }} @ {{ formatDecimals(point, 18) }}, remain: {{ formatDecimals(info.remainingTokenss[i], settings.decimals) }}</li>
                          </div>
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </div>
                <div v-else>
                  <div v-for="(info, i) in data1.item.events"  v-bind:key="i" class="m-0 p-0">
                    <b-row>
                      <b-col cols="1">
                        <b-link size="sm" :href="explorer + 'tx/' + indexToTxHash[data1.item.txHash] + '#eventlog#' + info.logIndex" variant="link" v-b-popover.hover.ds500="'Log index: ' + info.logIndex" target="_blank">
                          {{ info.eventType == 0 ? 'Transfer' : 'Huh?' }}
                        </b-link>
                      </b-col>
                      <b-col cols="2">
                        <!-- <div v-if="info.eventType == 'Transfer'"> -->
                        <div v-if="info.eventType == 0">
                          <b-link size="sm" :href="explorer + 'address/' + indexToAddress[info.from]" variant="link" v-b-popover.hover.ds500="indexToAddress[info.from]" target="_blank">
                            <span v-if="info.from == tokenSet.wethIndex">
                              WETH
                            </span>
                            <span v-else>
                              {{ indexToAddress[info.from].substring(0, 8) + '...' + indexToAddress[info.from].slice(-6) }}
                            </span>
                          </b-link>
                        </div>
                      </b-col>
                      <b-col cols="2">
                        <div v-if="info.eventType == 0">
                          <b-link size="sm" :href="explorer + 'address/' + indexToAddress[info.to]" variant="link" v-b-popover.hover.ds500="indexToAddress[info.to]" target="_blank">
                            <span v-if="info.to == data.weth">
                              WETH
                            </span>
                            <span v-else>
                              {{ indexToAddress[info.to].substring(0, 8) + '...' + indexToAddress[info.to].slice(-6) }}
                            </span>
                          </b-link>
                        </div>
                      </b-col>
                      <b-col cols="1">
                        <div v-if="info.eventType == 0">
                          <b-link size="sm" :href="explorer + 'contract/' + indexToAddress[info.contract]" variant="link" v-b-popover.hover.ds500="indexToAddress[info.contract]" target="_blank">
                            <span v-if="info.contract == tokenSet.tokenIndex">
                              {{ settings.symbol }}
                            </span>
                            <span v-else-if="info.contract == tokenSet.wethIndex">
                              WETH
                            </span>
                            <span v-else>
                              {{ indexToAddress[info.contract].substring(0, 8) + '...' + indexToAddress[info.contract].slice(-6) }}
                            </span>
                          </b-link>
                        </div>
                      </b-col>
                      <b-col cols="6" class="text-left">
                        <div v-if="info.eventType == 0">
                          {{ formatDecimals(info.tokens, 18) }}
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </template>
            </b-table>
          </font>
        </b-card>

        <font v-if="settings.tabIndex == 2 || settings.tabIndex == 3" size="-2">
          <pre>
tokenSet: {{ tokenSet }}
events: {{ events }}
balances: {{ balances }}
approvals: {{ approvals }}
data: {{ data }}
          </pre>
        </font>

      </b-card>
    </div>
  `,
  data: function () {
    return {
      count: 0,
      reschedule: true,
      settings: {
        tabIndex: 0,

        tokenContractAddress: null,
        symbol: null,
        name: null,
        decimals: null,

        viewMode: 0, // 0:split, 1:sell, 2:buy

        sellOffers: {
          mineOnly: false,
          ignoreMyApprovals: false,
          includeInvalidated: false,
          includeExpired: false,
          simulate: false,
          points: [],
          expiry: null,
          expiryDate: null,
          expiryTime: null,

          tabIndex: 0,
          amountType: 'tokens',
          amount: null,
          paymentType: 'weth',

          filter: null,
          currentPage: 1,
          pageSize: 10,
          sortOption: 'txorderdsc',
        },
        buyOffers: {
          mineOnly: false,
          ignoreMyApprovals: false,
          includeInvalidated: false,
          includeExpired: false,
          simulate: false,
          points: [],
          expiry: null,
          expiryDate: null,
          expiryTime: null,

          tabIndex: 0,
          amountType: 'tokens',
          amount: null,
          paymentType: 'weth',

          filter: null,
          currentPage: 1,
          pageSize: 10,
          sortOption: 'txorderdsc',
        },
        events: {
          filter: null,
          eventTypeOption: null,
          currentPage: 1,
          pageSize: 10,
          sortOption: 'txorderdsc',
        },
        config: {
          priceDisplayDecimals: 6,
          tokenDisplayDecimals: 9,
          wethDisplayDecimals: 9,
        },
        version: 4,
      },

      tokenAgentFactoryEvents: [],

      data: {
        chainId: null,
        blockNumber: null,
        timestamp: null,
        token: null,
        weth: null,
        tokenAgents: {},
        tokenAgentEvents: [],
        approvalAddresses: [],
        balanceAddresses: [],

        tokenApprovals: [],
        wethApprovals: [],
        tokenTransfers: [],
        wethTransfers: [],
      },

      events: {},
      balances: {},
      approvals: {},

      sellByMakers: {},
      buyByMakers: {},

      // tokenBalances: {},
      // wethBalances: {},
      // tokenApprovals: {},
      // wethApprovals: {},

      modalSellOffer: {
        // amount: "0.12345123", // null,
        amount: "0.10345123", // null,
        amountType: 'payWeth', // 'receiveTokens' or 'payWeth'

        paymentsInEth: false,

        txHash: null,
        logIndex: null,
        maker: null,
        tokenAgent: null,
        tokenAgentIndexByOwner: null,
        offerIndex: null,
        priceIndex: null,
        price: null,
        tokens: null,
        expiry: null,
        offer: null,
      },
      modalBuyOffer: {
        txHash: null,
        logIndex: null,
        maker: null,
        tokenAgent: null,
        tokenAgentIndexByOwner: null,
        offerIndex: null,
        priceIndex: null,
        price: null,
        tokens: null,
        expiry: null,
        offer: null,
      },

      events: [],
      approvals: [],

      buySellOptions: [
        { value: 0, text: 'Buy' },
        { value: 1, text: 'Sell' },
      ],
      pricing20Options: [
        { value: 0, text: 'Single price without limit' },
        { value: 1, text: 'Single price with limit' },
        { value: 1, text: 'Multiple prices and limits', disabled: true },
      ],
      priceDecimalsOptions: [
        {
          label: "Common",
          options: [
            { value: 0, text: '9,999' },
            { value: 3, text: '9,999.999' },
            { value: 6, text: '9,999.999999' },
            { value: 9, text: '9,999.999999999' },
          ],
        },
        // { value: 0, text: '9,999' },
        { value: 1, text: '9,999.9' },
        { value: 2, text: '9,999.99' },
        // { value: 3, text: '9,999.999' },
        { value: 4, text: '9,999.9999' },
        { value: 5, text: '9,999.99999' },
        // { value: 6, text: '9,999.999999' },
        { value: 7, text: '9,999.9999999' },
        { value: 8, text: '9,999.99999999' },
        // { value: 9, text: '9,999.999999999' },
      ],
      decimalsOptions: [
        {
          label: "Common",
          options: [
            { value: 0, text: '9,999' },
            { value: 3, text: '9,999.999' },
            { value: 6, text: '9,999.999999' },
            { value: 9, text: '9,999.999999999' },
            { value: 18, text: '9,999.999999999999999999' },
          ],
        },
        // { value: 0, text: '9,999' },
        { value: 1, text: '9,999.9' },
        { value: 2, text: '9,999.99' },
        // { value: 3, text: '9,999.999' },
        { value: 4, text: '9,999.9999' },
        { value: 5, text: '9,999.99999' },
        // { value: 6, text: '9,999.999999' },
        { value: 7, text: '9,999.9999999' },
        { value: 8, text: '9,999.99999999' },
        // { value: 9, text: '9,999.999999999' },
        { value: 10, text: '9,999.9999999999' },
        { value: 11, text: '9,999.99999999999' },
        { value: 12, text: '9,999.999999999999' },
        { value: 13, text: '9,999.9999999999999' },
        { value: 14, text: '9,999.99999999999999' },
        { value: 15, text: '9,999.999999999999999' },
        { value: 16, text: '9,999.9999999999999999' },
        { value: 17, text: '9,999.99999999999999999' },
        // { value: 18, text: '9,999.999999999999999999' },
      ],
      paymentsInEthOptions: [
        { text: 'WETH', value: false },
        { text: 'ETH', value: true },
      ],
      sortOptions: [
        { value: 'txorderasc', text: '▲ TxOrder' },
        { value: 'txorderdsc', text: '▼ TxOrder' },
        // { value: 'ownertokenagentasc', text: '▲ Owner, ▲ Token Agent' },
        // { value: 'ownertokenagentdsc', text: '▼ Owner, ▲ Token Agent' },
        // { value: 'tokenagentasc', text: '▲ Token Agent' },
        // { value: 'tokenagentdsc', text: '▼ Token Agent' },
        // TODO: Deploy new TokenContractFactory with index worked out
        // { value: 'indexasc', text: '▲ Index' },
        // { value: 'indexdsc', text: '▼ Index' },
      ],
      eventTypeOptions: [
        { value: null, text: 'All' },
        { value: 'Offered', text: 'Offers' },
        { value: 'Traded', text: 'Trades' },
        { value: 'Transfer', text: 'Transfers' },
        { value: 'Approval', text: 'Approvals' },
        { value: 'Other', text: 'Others' },
      ],
      addSellOfferFields: [
        { key: 'price', label: 'Price', sortable: false, thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'tokens', label: 'Tokens', sortable: false, thStyle: 'width: 15%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'totalTokens', label: '∑ Tokens', sortable: false, thStyle: 'width: 15%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'wethAmount', label: '[W]ETH', sortable: false, thStyle: 'width: 15%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'totalWeth', label: '∑ [W]ETH', sortable: false, thStyle: 'width: 15%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'maker', label: 'Maker', sortable: false, thStyle: 'width: 15%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'expiry', label: 'Expiry', sortable: false, thStyle: 'width: 15%;', thClass: 'text-left', tdClass: 'text-left' },
      ],
      addSellOfferViewPointsFields: [
        { key: 'price', label: 'Price', sortable: false, thStyle: 'width: 35%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'tokens', label: 'Tokens', sortable: false, thStyle: 'width: 35%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'wethAmount', label: 'WETH', sortable: false, thStyle: 'width: 30%;', thClass: 'text-right', tdClass: 'text-right' },
      ],
      addSellOfferPointsFields: [
        { key: 'price', label: 'Price', sortable: false, thStyle: 'width: 30%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'tokens', label: 'Tokens', sortable: false, thStyle: 'width: 30%;', thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'wethAmount', label: 'WETH', sortable: false, thStyle: 'width: 30%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'option', label: '', sortable: false, thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
      ],
      sellOfferFields: [
        // { key: 'nonce', label: 'Nonce', sortable: false, thStyle: 'width: 5%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'price', label: 'Price', sortable: false, thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'offer', label: 'Offered', sortable: false, thStyle: 'width: 15%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'tokens', label: 'Tokens', sortable: false, thStyle: 'width: 15%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'totalTokens', label: '∑ Tokens', sortable: false, thStyle: 'width: 15%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'wethAmount', label: '[W]ETH', sortable: false, thStyle: 'width: 15%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'totalWeth', label: '∑ [W]ETH', sortable: false, thStyle: 'width: 15%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'expiry', label: 'Expiry', sortable: false, thStyle: 'width: 15%;', thClass: 'text-right', tdClass: 'text-right' },
      ],
      sellOffersFields: [
        { key: 'number', label: '#', sortable: false, thStyle: 'width: 5%;', tdClass: 'text-left' },
        { key: 'expiry', label: 'Expiry', sortable: false, thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'maker', label: 'Maker', sortable: false, thStyle: 'width: 20%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'totalWeth', label: '∑ WETH', sortable: false, thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'wethAmount', label: 'WETH', sortable: false, thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'totalTokens', label: '∑ Tokens', sortable: false, thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'tokens', label: 'Tokens', sortable: false, thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'price', label: 'Price', sortable: false, thStyle: 'width: 20%;', thClass: 'text-right', tdClass: 'text-right' },
      ],
      extendedSellOffersFields: [
        { key: 'number', label: '#', sortable: false, thStyle: 'width: 5%;', tdClass: 'text-left' },
        { key: 'expiry', label: 'Expiry', sortable: false, thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'maker', label: 'Maker', sortable: false, thStyle: 'width: 20%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'totalWeth', label: '∑ WETH', sortable: false, thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'wethAmount', label: 'WETH', sortable: false, thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'totalTokens', label: '∑ Tokens', sortable: false, thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'tokens', label: 'Tokens', sortable: false, thStyle: 'width: 25%;', thClass: 'text-right', tdClass: 'text-right' },
        { key: 'price', label: 'Price', sortable: false, thStyle: 'width: 20%;', thClass: 'text-right', tdClass: 'text-right' },
      ],
      buyOffersFields: [
        { key: 'price', label: 'Price', sortable: false, thStyle: 'width: 20%;', tdClass: 'text-left' },
        // { key: 'tokens', label: 'Tokens', sortable: false, thStyle: 'width: 25%;', tdClass: 'text-left' },
        { key: 'totalTokens', label: '∑ Tokens', sortable: false, thStyle: 'width: 25%;', tdClass: 'text-left' },
        // { key: 'wethAmount', label: 'WETH', sortable: false, thStyle: 'width: 25%;', tdClass: 'text-left' },
        { key: 'totalWeth', label: '∑ WETH', sortable: false, thStyle: 'width: 25%;', tdClass: 'text-left' },
        { key: 'maker', label: 'Maker', sortable: false, thStyle: 'width: 20%;', tdClass: 'text-left' },
        { key: 'expiry', label: 'Expiry', sortable: false, thStyle: 'width: 10%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'number', label: '#', sortable: false, thStyle: 'width: 5%;', thClass: 'text-left', tdClass: 'text-left' },
      ],
      extendedBuyOffersFields: [
        { key: 'price', label: 'Price', sortable: false, thStyle: 'width: 20%;', tdClass: 'text-left' },
        { key: 'tokens', label: 'Tokens', sortable: false, thStyle: 'width: 25%;', tdClass: 'text-left' },
        { key: 'totalTokens', label: '∑ Tokens', sortable: false, thStyle: 'width: 25%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'wethAmount', label: 'WETH', sortable: false, thStyle: 'width: 25%;', tdClass: 'text-left' },
        { key: 'totalWeth', label: '∑ WETH', sortable: false, thStyle: 'width: 25%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'maker', label: 'Maker', sortable: false, thStyle: 'width: 20%;', tdClass: 'text-left' },
        { key: 'expiry', label: 'Expiry', sortable: false, thStyle: 'width: 10%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'number', label: '#', sortable: false, thStyle: 'width: 5%;', thClass: 'text-left', tdClass: 'text-left' },
      ],
      eventsFields: [
        { key: 'number', label: '#', sortable: false, thStyle: 'width: 4%;', tdClass: 'text-left' },
        { key: 'when', label: 'When', sortable: false, thStyle: 'width: 12%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'eventType', label: 'Type', sortable: false, thStyle: 'width: 7%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'info', label: 'Info', sortable: false, thStyle: 'width: 77%;', thClass: 'text-left', tdClass: 'text-left' },
      ],
    }
  },
  computed: {
    chainId() {
      return store.getters['connection/chainId'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    balance() {
      return store.getters['connection/balance'];
    },
    networkSupported() {
      return store.getters['connection/networkSupported'];
    },
    transferHelper() {
      return store.getters['connection/transferHelper'];
    },
    explorer() {
      return store.getters['connection/explorer'];
    },
    addresses() {
      return store.getters['data/addresses'];
    },
    tokenAgents() {
      return store.getters['data/tokenAgents'];
    },
    tokenContracts() {
      return store.getters['data/tokenContracts'];
    },
    addressToIndex() {
      return store.getters['data/addressToIndex'];
    },
    indexToAddress() {
      return store.getters['data/indexToAddress'];
    },
    txHashToIndex() {
      return store.getters['data/txHashToIndex'];
    },
    indexToTxHash() {
      return store.getters['data/indexToTxHash'];
    },
    tokenSet() {
      return store.getters['data/tokenSet'];
    },
    names() {
      return store.getters['data/names'];
    },
    sync() {
      return store.getters['data/sync'];
    },
    pageSizes() {
      return store.getters['config/pageSizes'];
    },
    registry() {
      return store.getters['data/registry'];
    },
    sellExpiryDate: {
      get: function () {
        return this.settings.sellOffers.expiryDate;
      },
      set: function (d) {
        this.settings.sellOffers.expiryDate = d;
        if (this.settings.sellOffers.expiryDate == null || this.settings.sellOffers.expiryDate == '') {
          this.settings.sellOffers.expiry = null;
        } else if (this.settings.sellOffers.expiryTime == null || this.settings.sellOffers.expiryTime == '') {
          this.settings.sellOffers.expiry = moment(this.settings.sellOffers.expiryDate + 'T00:00:00');
        } else {
          this.settings.sellOffers.expiry = moment(this.settings.sellOffers.expiryDate + 'T' + this.settings.sellOffers.expiryTime).unix();
        }
        this.saveSettings();
      },
    },
    sellExpiryTime: {
      get: function () {
        return this.settings.sellOffers.expiryTime;
      },
      set: function (t) {
        this.settings.sellOffers.expiryTime = t;
        if (this.settings.sellOffers.expiryDate == null || this.settings.sellOffers.expiryDate == '') {
          this.settings.sellOffers.expiry = null;
        } else if (this.settings.sellOffers.expiryTime == null || this.settings.sellOffers.expiryTime == '') {
          this.settings.sellOffers.expiry = moment(this.settings.sellOffers.expiryDate + 'T00:00:00').unix();
        } else {
          this.settings.sellOffers.expiry = moment(this.settings.sellOffers.expiryDate + 'T' + this.settings.sellOffers.expiryTime).unix();
        }
        this.saveSettings();
      },
    },
    buyExpiryDate: {
      get: function () {
        return this.settings.buyOffers.expiryDate;
      },
      set: function (d) {
        this.settings.buyOffers.expiryDate = d;
        if (this.settings.buyOffers.expiryDate == null || this.settings.buyOffers.expiryDate == '') {
          this.settings.buyOffers.expiry = null;
        } else if (this.settings.buyOffers.expiryTime == null || this.settings.buyOffers.expiryTime == '') {
          this.settings.buyOffers.expiry = moment(this.settings.buyOffers.expiryDate + 'T00:00:00');
        } else {
          this.settings.buyOffers.expiry = moment(this.settings.buyOffers.expiryDate + 'T' + this.settings.buyOffers.expiryTime).unix();
        }
        this.saveSettings();
      },
    },
    buyExpiryTime: {
      get: function () {
        return this.settings.buyOffers.expiryTime;
      },
      set: function (t) {
        this.settings.buyOffers.expiryTime = t;
        if (this.settings.buyOffers.expiryDate == null || this.settings.buyOffers.expiryDate == '') {
          this.settings.buyOffers.expiry = null;
        } else if (this.settings.buyOffers.expiryTime == null || this.settings.buyOffers.expiryTime == '') {
          this.settings.buyOffers.expiry = moment(this.settings.buyOffers.expiryDate + 'T00:00:00').unix();
        } else {
          this.settings.buyOffers.expiry = moment(this.settings.buyOffers.expiryDate + 'T' + this.settings.buyOffers.expiryTime).unix();
        }
        this.saveSettings();
      },
    },

    coinbaseTokenBalance() {
      let result =
        this.tokenSet.tokenIndex &&
        this.tokenSet.balances[this.tokenSet.tokenIndex] &&
        this.tokenSet.balances[this.tokenSet.tokenIndex][this.tokenSet.coinbaseIndex] &&
        this.tokenSet.balances[this.tokenSet.tokenIndex][this.tokenSet.coinbaseIndex].tokens || '0';
      return result;
    },
    coinbaseTokenApproval() {
      let result =
        this.tokenSet.tokenIndex &&
        this.tokenSet.approvals[this.tokenSet.tokenIndex] &&
        this.tokenSet.approvals[this.tokenSet.tokenIndex][this.tokenSet.coinbaseIndex] &&
        this.tokenSet.approvals[this.tokenSet.tokenIndex][this.tokenSet.coinbaseIndex][this.tokenSet.demodexIndex] &&
        this.tokenSet.approvals[this.tokenSet.tokenIndex][this.tokenSet.coinbaseIndex][this.tokenSet.demodexIndex].tokens || '0';
      return result;
    },
    coinbaseWethBalance() {
      let result =
        this.tokenSet.wethIndex &&
        this.tokenSet.balances[this.tokenSet.wethIndex] &&
        this.tokenSet.balances[this.tokenSet.wethIndex][this.tokenSet.coinbaseIndex] &&
        this.tokenSet.balances[this.tokenSet.wethIndex][this.tokenSet.coinbaseIndex].tokens || '0';
      return result;
    },
    coinbaseWethApproval() {
      let result =
        this.tokenSet.wethIndex &&
        this.tokenSet.approvals[this.tokenSet.wethIndex] &&
        this.tokenSet.approvals[this.tokenSet.wethIndex][this.tokenSet.coinbaseIndex] &&
        this.tokenSet.approvals[this.tokenSet.wethIndex][this.tokenSet.coinbaseIndex][this.tokenSet.demodexIndex] &&
        this.tokenSet.approvals[this.tokenSet.wethIndex][this.tokenSet.coinbaseIndex][this.tokenSet.demodexIndex].tokens || '0';
      return result;
    },

    tokenContractsDropdownOptions() {
      const results = (store.getters['data/forceRefresh'] % 2) == 0 ? [] : [];
      for (const [tokenContract, d] of Object.entries(this.tokenContracts[this.chainId] || {})) {
        if (d.transfers) {
          results.push({ tokenContract, type: d.type, symbol: d.symbol, name: d.name, decimals: d.decimals });
        }
      }
      return results;
    },

    sellOfferPointsFeedback() {
      // console.log(now() + " INFO TradeFungibles:computed.sellOfferPointsFeedback - this.settings.addSellOffer.points: " + JSON.stringify(this.settings.addSellOffer.points));
      for (const [i, point] of this.settings.sellOffers.points.entries()) {
        // console.log(i + " => " + JSON.stringify(point));
        if (point.price == null || point.price == "") {
          return "Invalid price";
        }
        if (point.tokens == null || point.tokens == "") {
          return "Invalid tokens";
        }
        if (i > 0) {
          // console.log(i + " => " + JSON.stringify(point) + " vs prev: " + JSON.stringify(this.settings.sellOffers.points[i - 1]));
          if (parseFloat(point.price) <= parseFloat(this.settings.sellOffers.points[i - 1].price)) {
            return "Prices must be in descending order with no duplicates";
          }
        }
      }
      return  null;
    },

    buyOfferPointsFeedback() {
      // console.log(now() + " INFO TradeFungibles:computed.buyOfferPointsFeedback - this.settings.buyOffers.points: " + JSON.stringify(this.settings.buyOffers.points));
      for (const [i, point] of this.settings.buyOffers.points.entries()) {
        // console.log(i + " => " + JSON.stringify(point));
        if (point.price == null || point.price == "") {
          return "Invalid price";
        }
        if (point.tokens == null || point.tokens == "") {
          return "Invalid tokens";
        }
        if (i > 0) {
          // console.log(i + " => " + JSON.stringify(point) + " vs prev: " + JSON.stringify(this.settings.buyOffers.points[i - 1]));
          if (parseFloat(point.price) >= parseFloat(this.settings.buyOffers.points[i - 1].price)) {
            return "Prices must be in descending order with no duplicates";
          }
        }
      }
      return  null;
    },

    tradeFeedback() {
      // console.log(now() + " INFO TradeFungibles:computed.tradeFeedback");
      // if (this.coinbase == this.sellOffer.maker) {
      //   return "Cannot self trade";
      // }
      const filledWeth = ethers.BigNumber.from(this.sellOffer.filledWeth || 0);
      if (this.modalSellOffer.paymentsInEth) {
        const balance = ethers.BigNumber.from(this.balance);
        if (balance.lt(filledWeth)) {
          return "Insufficient ETH balance"
        }
      } else {
        const wethBalance = ethers.BigNumber.from(this.balances[this.data.weth] && this.balances[this.data.weth][this.coinbase] && this.balances[this.data.weth][this.coinbase].tokens || 0);
        // console.log("wethBalance: " + ethers.utils.formatEther(wethBalance));
        if (wethBalance.lt(filledWeth)) {
          return "Insufficient WETH balance"
        }
        const wethApproved = ethers.BigNumber.from(this.approvals[this.data.weth] && this.approvals[this.data.weth][this.coinbase] && this.approvals[this.data.weth][this.coinbase][this.sellOffer.tokenAgent] && this.approvals[this.data.weth][this.coinbase][this.sellOffer.tokenAgent].tokens || 0);
        // console.log("wethApproved: " + ethers.utils.formatEther(wethApproved));
        if (wethApproved.lt(filledWeth)) {
          return "Insufficient WETH approved to Token Agent"
        }
      }
      return null;
    },

    addOffersFeedback() {
      if (!this.settings.tokenAgentAddress || !this.validAddress(this.settings.tokenAgentAddress)) {
        return "Enter token agent address";
      }
      if (!this.settings.addOffers.token || !this.validAddress(this.settings.addOffers.token)) {
        return "Enter token contract address";
      }
      if (this.settings.addOffers.type == 20) {
        if (this.settings.addOffers.pricing == 0) {
          if (this.validNumber(this.settings.addOffers.price, 18)) {
            return null;
          } else {
            return "Invalid price";
          }
        }
        if (this.settings.addOffers.pricing == 1) {
          if (this.validNumber(this.settings.addOffers.price, 18)) {
          } else {
            return "Invalid price";
          }
          if (this.validNumber(this.settings.addOffers.tokens, this.settings.addOffers.decimals)) {
            return null;
          } else {
            return "Invalid tokens";
          }
        }
        return "Only single price with or without tokens limit supported"
      } else if (this.settings.addOffers.type == 721 || this.settings.addOffers.type == 1155) {
        return "ERC-721/1155 not supported yet";
      }
      return null;
    },

    addSellOfferSelectedPoints() {
      // console.log(now() + " INFO TradeFungibles:computed.addSellOfferSelectedPoints - this.settings.addSellOffer.selectedItem: " + JSON.stringify(this.settings.addSellOffer.selectedItem, null, 2));
      const results = [];
      if (this.settings.addSellOffer.selectedItem) {
        const tokenAgent = this.data.tokenAgents[this.settings.addSellOffer.selectedItem.tokenAgent];
        // console.log(now() + " INFO TradeFungibles:computed.addSellOfferSelectedPoints - tokenAgent: " + JSON.stringify(tokenAgent, null, 2));
        const offer = tokenAgent.offers[this.settings.addSellOffer.selectedItem.offerIndex];
        // console.log(now() + " INFO TradeFungibles:computed.addSellOfferSelectedPoints - offer: " + JSON.stringify(offer, null, 2));
        const prices = tokenAgent.offers[this.settings.addSellOffer.selectedItem.offerIndex].prices;
        const tokenss = tokenAgent.offers[this.settings.addSellOffer.selectedItem.offerIndex].tokenss;
        // console.log(now() + " INFO TradeFungibles:computed.addSellOfferSelectedPoints - prices: " + JSON.stringify(prices, null, 2));
        // console.log(now() + " INFO TradeFungibles:computed.addSellOfferSelectedPoints - tokenss: " + JSON.stringify(tokenss, null, 2));
        if (prices.length == tokenss.length) {
          for (const [i, price] of prices.entries()) {
            const bPrice = ethers.BigNumber.from(price);
            const bTokens = ethers.BigNumber.from(tokenss[i]);
            const wethAmount = bPrice.mul(bTokens).div(ethers.BigNumber.from("1000000000000000000"));
            // console.log(i + " " + price + " " + bTokens + " " + wethAmount);
            results.push({ price: bPrice.toString(), tokens: bTokens.toString(), wethAmount: wethAmount.toString() });
          }
        }
      }
      // console.log(now() + " INFO TradeFungibles:computed.addSellOfferSelectedPoints - results: " + JSON.stringify(results, null, 2));
      return results;
    },

    nonce() {
      const events = this.events.filter(e => e.eventType == "OffersInvalidated");
      if (events.length > 0) {
        return events[events.length - 1].newNonce;
      }
      return 0;
    },

    newSellOffers() {
      // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - this.tokenSet: " + JSON.stringify(this.tokenSet, null, 2));
      // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - tokenSet.timestamp: " + this.formatTimestamp(this.tokenSet.timestamp) + ", token.symbol: " + this.tokenSet.symbol + ", token.decimals: " + this.tokenSet.decimals);
      const TENPOW18 = ethers.BigNumber.from("1000000000000000000");

      const mineOnly = this.settings.sellOffers.mineOnly;
      const ignoreMyApprovals = this.settings.sellOffers.ignoreMyApprovals;
      const includeInvalidated = this.settings.sellOffers.includeInvalidated;
      const includeExpired = this.settings.sellOffers.includeExpired;
      const simulate = this.settings.sellOffers.simulate;
      const points = this.settings.sellOffers.points;
      const coinbaseIndex = this.coinbase && this.addressToIndex[this.coinbase] || null;
      // const selectedTokenAgent = this.settings.sellOffers.select.tokenAgent;
      let maxTokens = this.settings.sellOffers.amount != null && this.settings.sellOffers.amount.trim().length != 0 && this.settings.sellOffers.amountType == 'tokens' ? ethers.utils.parseEther(this.settings.sellOffers.amount) : null;
      let maxWeth = this.settings.sellOffers.amount != null && this.settings.sellOffers.amount.trim().length != 0 && this.settings.sellOffers.amountType != 'tokens' ? ethers.utils.parseEther(this.settings.sellOffers.amount) : null;
      // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - maxTokens: " + (maxTokens && ethers.utils.formatEther(maxTokens) || 'null') + ", maxWeth: " + (maxWeth && ethers.utils.formatEther(maxWeth) || 'null'));

      const collator = {};
      for (const e of (this.tokenSet.events || [])) {
        if (e.eventType == EVENTTYPE_OFFERED && e.buySell == 1) {
          // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - OFFERED e: " + JSON.stringify(e));
          if ((!mineOnly || e.maker == coinbaseIndex) && /*(includeInvalidated || d.nonce == e.nonce) &&*/ (includeExpired || (e.expiry == 0 || e.expiry >= this.tokenSet.timestamp))) {
            // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - OFFERED SELL e: " + JSON.stringify(e));
            if (!(e.maker in collator)) {
              collator[e.maker] = {
                nonce: this.tokenSet.nonces[e.maker] && this.tokenSet.nonces[e.maker].nonce|| 0,
                offers: {},
              };
            }
            collator[e.maker].offers[e.index] = e;
          }
        } else if (e.eventType == EVENTTYPE_TRADED) {
          // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - TRADED e: " + JSON.stringify(e));
          if (!(e.maker in collator)) {
            collator[e.maker] = {
              nonce: this.tokenSet.nonces[e.maker] && this.tokenSet.nonces[e.maker].nonce|| 0,
              offers: {},
            };
          }
          // collator[e.maker][tokenAgent].trades.push(e);
          if (e.index in collator[e.maker].offers) {
            collator[e.maker].offers[e.index].tokenss = e.remainingTokenss;
          }
        } else {
          // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - OTHER e: " + JSON.stringify(e));
        }
      }
      // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - collator: " + JSON.stringify(collator, null, 2));

      const prices = [];
      for (const [maker, d1] of Object.entries(collator)) {
        for (const [offerIndex, d2] of Object.entries(d1.offers)) {
          if (d2.prices.length == d2.tokenss.length) {
            for (let i = 0; i < d2.prices.length; i++) {
              if ((includeInvalidated || d2.nonce == d1.nonce) && (includeExpired || d2.expiry == 0 || d2.expiry >= this.tokenSet.timestamp)) {
                prices.push({
                  txHash: d2.txHash, logIndex: d2.logIndex,
                  maker,
                  offerIndex: d2.index, nonce: d2.nonce, expiry: d2.expiry,
                  priceIndex: i, price: d2.prices[i], tokens: d2.tokenss[i],
                  valid: d2.nonce == d1.nonce && (d2.expiry == 0 || d2.expiry >= this.tokenSet.timestamp),
                });
              }
            }
          }
        }
      }
      // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - prices: " + JSON.stringify(prices, null, 2));

      if (simulate && this.tokenSet.timestamp) {
        for (const [i, point] of points.entries()) {
          // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - point[" + i + "]: " + JSON.stringify(point));
          try {
            prices.push({
              txHash: null, logIndex: null,
              maker: this.tokenSet.coinbaseIndex,
              offerIndex: null, nonce: null, expiry: 0,
              priceIndex: i, price: ethers.utils.parseEther(point.price).toString(),
              tokens: ethers.utils.parseUnits(point.tokens, this.tokenSet.decimals).toString(),
              valid: true,
            });
          } catch (e) {
            console.log(now() + " ERROR TradeFungibles:computed.newSellOffers - point[" + i + "]: " + JSON.stringify(point));
          }
        }
      }
      // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - prices: " + JSON.stringify(prices, null, 2));

      prices.sort((a, b) => {
        if (a.valid && !b.valid) {
          return -1;
        } else if (!a.valid && b.valid) {
          return 1;
        }
        const [priceA, tokensA] = [ethers.BigNumber.from(a.price), ethers.BigNumber.from(a.tokens)];
        const [priceB, tokensB] = [ethers.BigNumber.from(b.price), ethers.BigNumber.from(b.tokens)];
        if (priceA.lt(priceB)) {
          return -1;
        } else if (priceA.gt(priceB)) {
          return 1;
        }
        return tokensA.lt(tokensB) ? 1 : -1;
      });
      // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - prices: " + JSON.stringify(prices, null, 2));
      const tokenBalances = {};
      const tokenApprovals = {};
      for (const [maker, d1] of Object.entries(this.tokenSet.tokenIndex && this.tokenSet.balances[this.tokenSet.tokenIndex] || {})) {
        tokenBalances[maker] = { tokens: d1.tokens, originalTokens: d1.tokens };
      }
      for (const [owner, d1] of Object.entries(this.tokenSet.tokenIndex && this.tokenSet.approvals[this.tokenSet.tokenIndex] || {})) {
        if (!(owner in tokenApprovals)) {
          tokenApprovals[owner] = {};
        }
        for (const [spender, d2] of Object.entries(d1)) {
          tokenApprovals[owner][spender] = { tokens: d2.tokens, originalTokens: d2.tokens };
        }
      }
      // for (const [maker, d1] of Object.entries(collator)) {
      //   const balance = this.tokenSet.balances[this.tokenSet.tokenIndex] && this.tokenSet.balances[this.tokenSet.tokenIndex][maker].tokens || "0";
      //   tokenBalances[maker] = { tokens: balance, originalTokens: balance };
      //   const approval = this.tokenSet.approvals[this.tokenSet.tokenIndex] && this.tokenSet.approvals[this.tokenSet.tokenIndex][maker] && this.tokenSet.approvals[this.tokenSet.tokenIndex][maker][this.tokenSet.demodexIndex].tokens || "0";
      //   if (!(maker in tokenApprovals)) {
      //     tokenApprovals[maker] = {};
      //   }
      //   tokenApprovals[maker][this.tokenSet.demodexIndex] = { tokens: approval, originalTokens: approval };
      // }
      // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - this.tokenSet.balances: " + JSON.stringify(this.tokenSet.balances, null, 2));
      // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - tokenBalances: " + JSON.stringify(tokenBalances, null, 2));
      // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - tokenApprovals: " + JSON.stringify(tokenApprovals, null, 2));

      const records = [];
      const trades = [];
      let totalTokens = ethers.BigNumber.from(0);
      let totalWeth = ethers.BigNumber.from(0);
      let filledTokens = null;
      let filledWeth = null;
      let filledAveragePrice = null;
      for (const [i, price] of prices.entries()) {
        const ignoreApproval = price.maker == coinbaseIndex && ignoreMyApprovals;
        const tokenBalance = ethers.BigNumber.from(tokenBalances[price.maker] && tokenBalances[price.maker].tokens || 0);
        const tokenApproval = ethers.BigNumber.from(!price.simulated && tokenApprovals[price.maker] && tokenApprovals[price.maker][this.tokenSet.demodexIndex] && tokenApprovals[price.maker][this.tokenSet.demodexIndex].tokens || 0);
        // console.log(i + " " + ignoreApproval + " " + ethers.utils.formatEther(tokenBalance) + " " + ethers.utils.formatEther(tokenApproval) + " " + JSON.stringify(price));
        let tokens = ethers.BigNumber.from(price.tokens);
        let wethAmount = null;
        // if (price.txHash == null) {
        //   console.log("SIMULATED prices[" + i + "]: " + JSON.stringify(price));
        // } else if (!price.valid) {
        //   console.log("INVALID prices[" + i + "]: " + JSON.stringify(price));
        // }
        if (price.valid) {
          if (tokens.gt(tokenBalance)) {
            tokens = tokenBalance;
          }
          if (!ignoreApproval && !simulate && tokens.gt(tokenApproval)) {
            tokens = tokenApproval;
          }
          if (maxTokens != null) {
            if (tokens.gt(maxTokens)) {
              tokens = maxTokens;
            }
            maxTokens = maxTokens.sub(tokens);
          }
          if (maxWeth != null) {
            wethAmount = tokens.mul(ethers.BigNumber.from(price.price)).div(TENPOW18);
            // maxTokensFromWeth = maxWeth * 10**18 / e.price
            const maxTokensFromWeth = maxWeth.mul(TENPOW18).div(price.price);
            if (tokens.gt(maxTokensFromWeth)) {
              wethAmount = maxWeth;
              tokens = maxTokensFromWeth;
            }
            maxWeth = maxWeth.sub(wethAmount);
          }
          if (tokens.gt(0)) {
            wethAmount = tokens.mul(ethers.BigNumber.from(price.price)).div(TENPOW18);
            totalTokens = ethers.BigNumber.from(totalTokens).add(tokens);
            totalWeth = ethers.BigNumber.from(totalWeth).add(wethAmount);
            tokenBalances[price.maker].tokens = ethers.BigNumber.from(tokenBalances[price.maker].tokens).sub(tokens).toString();
            if (!ignoreApproval && price.txHash != null && tokenApprovals[price.maker] && tokenApprovals[price.maker][this.tokenSet.demodexIndex]) {
              tokenApprovals[price.maker][this.tokenSet.demodexIndex].tokens = ethers.BigNumber.from(tokenApprovals[price.maker][this.tokenSet.demodexIndex].tokens).sub(tokens).toString();
            }
            trades.push({ index: price.offerIndex, price: price.price, execution: 1, tokenIds: [], tokenss: [tokens.toString()] });
          }
        }
        records.push({ ...price, originalTokens: price.tokens, tokens: tokens.toString(), totalTokens: totalTokens.toString(), wethAmount: wethAmount != null && wethAmount.toString() || null, totalWeth: totalWeth.toString() });
      }
      if (maxTokens != null || maxWeth != null) {
        filledTokens = totalTokens;
        filledWeth = totalWeth;
        filledAveragePrice = totalTokens > 0 ? totalWeth.mul(TENPOW18).div(totalTokens) : 0;
      }
      const filled = {
        tokens: filledTokens != null && filledTokens.toString() || null,
        weth: filledWeth != null && filledWeth.toString() || null,
        averagePrice: filledAveragePrice != null && filledAveragePrice.toString() || null,
      };

      // console.log(now() + " INFO TradeFungibles:computed.newSellOffers - prices: " + JSON.stringify(prices, null, 2));
      return { trades, filled, records, tokenBalances, tokenApprovals, prices, collator };
    },

    newBuyOffers() {
      // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - this.tokenSet: " + JSON.stringify(this.tokenSet, null, 2));
      // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - tokenSet.timestamp: " + this.formatTimestamp(this.tokenSet.timestamp) + ", token.symbol: " + this.tokenSet.symbol + ", token.decimals: " + this.tokenSet.decimals);
      const TENPOW18 = ethers.BigNumber.from("1000000000000000000");

      const mineOnly = this.settings.buyOffers.mineOnly;
      const ignoreMyApprovals = this.settings.buyOffers.ignoreMyApprovals;
      const includeInvalidated = this.settings.buyOffers.includeInvalidated;
      const includeExpired = this.settings.buyOffers.includeExpired;
      const simulate = this.settings.buyOffers.simulate;
      const points = this.settings.buyOffers.points;
      const coinbaseIndex = this.coinbase && this.addressToIndex[this.coinbase] || null;
      // const selectedTokenAgent = this.settings.buyOffers.select.tokenAgent;
      let maxTokens = this.settings.buyOffers.amount != null && this.settings.buyOffers.amount.trim().length != 0 && this.settings.buyOffers.amountType == 'tokens' ? ethers.utils.parseEther(this.settings.buyOffers.amount) : null;
      let maxWeth = this.settings.buyOffers.amount != null && this.settings.buyOffers.amount.trim().length != 0 && this.settings.buyOffers.amountType != 'tokens' ? ethers.utils.parseEther(this.settings.buyOffers.amount) : null;
      console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - maxTokens: " + (maxTokens && ethers.utils.formatEther(maxTokens) || 'null') + ", maxWeth: " + (maxWeth && ethers.utils.formatEther(maxWeth) || 'null'));

      const collator = {};
      for (const e of (this.tokenSet.events || [])) {
        if (e.eventType == EVENTTYPE_OFFERED && e.buySell == 0) {
          // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - OFFERED e: " + JSON.stringify(e));
          if ((!mineOnly || e.maker == coinbaseIndex) && /*(includeInvalidated || d.nonce == e.nonce) &&*/ (includeExpired || (e.expiry == 0 || e.expiry >= this.tokenSet.timestamp))) {
            // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - OFFERED BUY e: " + JSON.stringify(e));
            if (!(e.maker in collator)) {
              collator[e.maker] = {
                nonce: this.tokenSet.nonces[e.maker] && this.tokenSet.nonces[e.maker].nonce|| 0,
                offers: {},
              };
            }
            collator[e.maker].offers[e.index] = e;
          }
        } else if (e.eventType == EVENTTYPE_TRADED) {
          // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - TRADED e: " + JSON.stringify(e));
          if (!(e.maker in collator)) {
            collator[e.maker] = {
              nonce: this.tokenSet.nonces[e.maker] && this.tokenSet.nonces[e.maker].nonce|| 0,
              offers: {},
            };
          }
          // collator[e.maker][tokenAgent].trades.push(e);
          if (e.index in collator[e.maker].offers) {
            collator[e.maker].offers[e.index].tokenss = e.remainingTokenss;
          }
        } else {
          // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - OTHER e: " + JSON.stringify(e));
        }
      }
      // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - collator: " + JSON.stringify(collator, null, 2));

      const prices = [];
      for (const [maker, d1] of Object.entries(collator)) {
        for (const [offerIndex, d2] of Object.entries(d1.offers)) {
          if (d2.prices.length == d2.tokenss.length) {
            for (let i = 0; i < d2.prices.length; i++) {
              if ((includeInvalidated || d2.nonce == d1.nonce) && (includeExpired || d2.expiry == 0 || d2.expiry >= this.tokenSet.timestamp)) {
                prices.push({
                  txHash: d2.txHash, logIndex: d2.logIndex,
                  maker,
                  offerIndex: d2.index, nonce: d2.nonce, expiry: d2.expiry,
                  priceIndex: i, price: d2.prices[i], tokens: d2.tokenss[i],
                  valid: d2.nonce == d1.nonce && (d2.expiry == 0 || d2.expiry >= this.tokenSet.timestamp),
                });
              }
            }
          }
        }
      }
      // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - prices: " + JSON.stringify(prices, null, 2));

      if (simulate && this.tokenSet.timestamp) {
        for (const [i, point] of points.entries()) {
          // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - point[" + i + "]: " + JSON.stringify(point));
          try {
            prices.push({
              txHash: null, logIndex: null,
              maker: this.tokenSet.coinbaseIndex,
              offerIndex: null, nonce: null, expiry: 0,
              priceIndex: i, price: ethers.utils.parseEther(point.price).toString(),
              tokens: ethers.utils.parseUnits(point.tokens, this.tokenSet.decimals).toString(),
              valid: true,
            });
          } catch (e) {
            console.log(now() + " ERROR TradeFungibles:computed.newBuyOffers - point[" + i + "]: " + JSON.stringify(point));
          }
        }
      }
      // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - prices: " + JSON.stringify(prices, null, 2));

      prices.sort((a, b) => {
        if (a.valid && !b.valid) {
          return -1;
        } else if (!a.valid && b.valid) {
          return 1;
        }
        const [priceA, tokensA] = [ethers.BigNumber.from(a.price), ethers.BigNumber.from(a.tokens)];
        const [priceB, tokensB] = [ethers.BigNumber.from(b.price), ethers.BigNumber.from(b.tokens)];
        if (priceA.lt(priceB)) {
          return 1;
        } else if (priceA.gt(priceB)) {
          return -1;
        }
        return tokensA.lt(tokensB) ? 1 : -1;
      });
      // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - prices: " + JSON.stringify(prices, null, 2));
      const wethBalances = {};
      const wethApprovals = {};
      for (const [maker, d1] of Object.entries(this.tokenSet.wethIndex && this.tokenSet.balances[this.tokenSet.wethIndex] || {})) {
        wethBalances[maker] = { tokens: d1.tokens, originalTokens: d1.tokens };
      }
      // TODO
      // wethBalances[4] = { tokens: "20000000000000000", originalTokens: "20000000000000000" };
      for (const [owner, d1] of Object.entries(this.tokenSet.wethIndex && this.tokenSet.approvals[this.tokenSet.wethIndex] || {})) {
        if (!(owner in wethApprovals)) {
          wethApprovals[owner] = {};
        }
        for (const [spender, d2] of Object.entries(d1)) {
          wethApprovals[owner][spender] = { tokens: d2.tokens, originalTokens: d2.tokens };
        }
      }
      // TODO
      // if (!(4 in wethApprovals)) {
      //   wethApprovals[4] = {};
      // }
      // wethApprovals[4][3] = { tokens: "20000000000000000", originalTokens: "20000000000000000" };

      // for (const [maker, d1] of Object.entries(collator)) {
      //   const balance = this.tokenSet.balances[this.tokenSet.tokenIndex] && this.tokenSet.balances[this.tokenSet.tokenIndex][maker].tokens || "0";
      //   wethBalances[maker] = { tokens: balance, originalTokens: balance };
      //   const approval = this.tokenSet.approvals[this.tokenSet.tokenIndex] && this.tokenSet.approvals[this.tokenSet.tokenIndex][maker] && this.tokenSet.approvals[this.tokenSet.tokenIndex][maker][this.tokenSet.demodexIndex].tokens || "0";
      //   if (!(maker in wethApprovals)) {
      //     wethApprovals[maker] = {};
      //   }
      //   wethApprovals[maker][this.tokenSet.demodexIndex] = { tokens: approval, originalTokens: approval };
      // }
      // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - this.tokenSet.balances: " + JSON.stringify(this.tokenSet.balances, null, 2));
      // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - wethBalances: " + JSON.stringify(wethBalances, null, 2));
      // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - wethApprovals: " + JSON.stringify(wethApprovals, null, 2));

      const records = [];
      const trades = [];
      let totalTokens = ethers.BigNumber.from(0);
      let totalWeth = ethers.BigNumber.from(0);
      let filledTokens = null;
      let filledWeth = null;
      let filledAveragePrice = null;
      for (const [i, price] of prices.entries()) {
        const ignoreApproval = price.maker == coinbaseIndex && ignoreMyApprovals;
        const wethBalance = ethers.BigNumber.from(wethBalances[price.maker] && wethBalances[price.maker].tokens || 0);
        const wethApproval = ethers.BigNumber.from(!price.simulated && wethApprovals[price.maker] && wethApprovals[price.maker][this.tokenSet.demodexIndex] && wethApprovals[price.maker][this.tokenSet.demodexIndex].tokens || 0);
        // console.log(i + " " + ignoreApproval + " " + ethers.utils.formatEther(wethBalance) + " " + ethers.utils.formatEther(wethApproval) + " " + JSON.stringify(price));
        let tokens = ethers.BigNumber.from(price.tokens);
        let wethAmount = null;
        // if (price.txHash == null) {
        //   console.log("SIMULATED prices[" + i + "]: " + JSON.stringify(price));
        // } else if (!price.valid) {
        //   console.log("INVALID prices[" + i + "]: " + JSON.stringify(price));
        // }
        if (price.valid) {
          const tokensWethBalance = wethBalance.mul(TENPOW18).div(price.price);
          const tokensWethApproval = wethApproval.mul(TENPOW18).div(price.price);
          console.log("tokens: " + ethers.utils.formatEther(tokens) + ", price: " + ethers.utils.formatEther(price.price));
          console.log("wethBalance: " + ethers.utils.formatEther(wethBalance) + ", tokensWethBalance: " + ethers.utils.formatEther(tokensWethBalance));
          console.log("wethApproval: " + ethers.utils.formatEther(wethApproval) + ", tokensWethApproval: " + ethers.utils.formatEther(tokensWethApproval));
          if (tokens.gt(tokensWethBalance)) {
            tokens = tokensWethBalance;
          }
          if (!ignoreApproval && !simulate && tokens.gt(tokensWethApproval)) {
            tokens = tokensWethApproval;
          }
          if (maxTokens != null) {
            if (tokens.gt(maxTokens)) {
              tokens = maxTokens;
            }
            maxTokens = maxTokens.sub(tokens);
          }
          wethAmount = tokens.mul(ethers.BigNumber.from(price.price)).div(TENPOW18);
          if (maxWeth != null) {
            // maxTokensFromWeth = maxWeth * 10**18 / e.price
            const maxTokensFromWeth = maxWeth.mul(TENPOW18).div(price.price);
            const maxWethFromMaxTokensFromWeth = maxTokensFromWeth.mul(ethers.BigNumber.from(price.price)).div(TENPOW18);
            const tokensFromMaxWethFromMaxTokensFromWeth = maxWethFromMaxTokensFromWeth.mul(TENPOW18).div(price.price);
            const maxWethFilledAveragePrice = tokensFromMaxWethFromMaxTokensFromWeth > 0 ? maxWethFromMaxTokensFromWeth.mul(TENPOW18).div(tokensFromMaxWethFromMaxTokensFromWeth) : 0;
            console.log("HERE maxWeth: " + ethers.utils.formatEther(maxWeth) + ", wethAmount: " + ethers.utils.formatEther(wethAmount) + ", maxTokensFromWeth: " + ethers.utils.formatEther(maxTokensFromWeth) + ", maxWethFromMaxTokensFromWeth: " + ethers.utils.formatEther(maxWethFromMaxTokensFromWeth) + ", maxWethFilledAveragePrice: " + ethers.utils.formatEther(maxWethFilledAveragePrice));
            if (tokens.gt(tokensFromMaxWethFromMaxTokensFromWeth)) {
              wethAmount = maxWethFromMaxTokensFromWeth;
              // TODO
              tokens = tokensFromMaxWethFromMaxTokensFromWeth;
              // wethAmount = tokens.mul(ethers.BigNumber.from(price.price)).div(TENPOW18);
            }
            maxWeth = maxWeth.sub(wethAmount);
          }
          if (tokens.gt(0)) {
            // wethAmount = tokens.mul(ethers.BigNumber.from(price.price)).div(TENPOW18);
            totalTokens = ethers.BigNumber.from(totalTokens).add(tokens);
            totalWeth = ethers.BigNumber.from(totalWeth).add(wethAmount);
            wethBalances[price.maker].tokens = ethers.BigNumber.from(wethBalances[price.maker].tokens).sub(wethAmount).toString();
            if (!ignoreApproval && price.txHash != null && wethApprovals[price.maker] && wethApprovals[price.maker][this.tokenSet.demodexIndex]) {
              wethApprovals[price.maker][this.tokenSet.demodexIndex].tokens = ethers.BigNumber.from(wethApprovals[price.maker][this.tokenSet.demodexIndex].tokens).sub(wethAmount).toString();
            }
            trades.push({ index: price.offerIndex, price: price.price, execution: 1, tokenIds: [], tokenss: [tokens.toString()] });
          }
        }
        records.push({ ...price, originalTokens: price.tokens, tokens: tokens.toString(), totalTokens: totalTokens.toString(), wethAmount: wethAmount != null && wethAmount.toString() || null, totalWeth: totalWeth.toString() });
      }
      if (maxTokens != null || maxWeth != null) {
        filledTokens = totalTokens;
        filledWeth = totalWeth;
        filledAveragePrice = totalTokens > 0 ? totalWeth.mul(TENPOW18).div(totalTokens) : 0;
        console.log("filledTokens: " + ethers.utils.formatEther(filledTokens) + ", filledWeth: " + ethers.utils.formatEther(filledWeth) + ", filledAveragePrice: " + ethers.utils.formatEther(filledAveragePrice));
        // console.log("wethApproval: " + ethers.utils.formatEther(wethApproval) + ", tokensWethApproval: " + ethers.utils.formatEther(tokensWethApproval));
      }
      const filled = {
        tokens: filledTokens != null && filledTokens.toString() || null,
        weth: filledWeth != null && filledWeth.toString() || null,
        averagePrice: filledAveragePrice != null && filledAveragePrice.toString() || null,
      };

      // console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - prices: " + JSON.stringify(prices, null, 2));
      console.log(now() + " INFO TradeFungibles:computed.newBuyOffers - trades: " + JSON.stringify(trades, null, 2));
      return { trades, filled, records, wethBalances, wethApprovals, prices, collator };
    },

    filteredSortedSellOffers() {
      const results = this.newSellOffers.records;
      // if (this.settings.events.sortOption == 'txorderasc') {
      //   results.sort((a, b) => {
      //     if (a.blockNumber == b.blockNumber) {
      //       return a.logIndex - b.logIndex;
      //     } else {
      //       return a.blockNumber - b.blockNumber;
      //     }
      //   });
      // } else if (this.settings.events.sortOption == 'txorderdsc') {
      //   results.sort((a, b) => {
      //     if (a.blockNumber == b.blockNumber) {
      //       return b.logIndex - a.logIndex;
      //     } else {
      //       return b.blockNumber - a.blockNumber;
      //     }
      //   });
      // }
      return results;
    },
    pagedFilteredSellOffers() {
      // console.log(now() + " INFO TradeFungibles:computed.pagedFilteredSellOffers - results[0..1]: " + JSON.stringify(this.filteredSortedSellOffers.slice(0, 2), null, 2));
      return this.filteredSortedSellOffers.slice((this.settings.sellOffers.currentPage - 1) * this.settings.sellOffers.pageSize, this.settings.sellOffers.currentPage * this.settings.sellOffers.pageSize);
    },

    // buyOffersToDelete() {
    //   const TENPOW18 = ethers.BigNumber.from("1000000000000000000");
    //   const results = [];
    //   console.log(now() + " INFO TradeFungibles:computed.buyOffers - this.buyByMakers: " + JSON.stringify(this.buyByMakers, null, 2));
    //   const collator = {};
    //   for (const [tokenAgent, d] of Object.entries(this.data.tokenAgents)) {
    //     if (!(d.owner in collator)) {
    //       collator[d.owner] = {
    //         wethBalance: this.balances[this.data.weth] && this.balances[this.data.weth][d.owner] && this.balances[this.data.weth][d.owner].tokens || 0,
    //         tokenAgents: {},
    //       };
    //     }
    //     collator[d.owner].tokenAgents[tokenAgent] = {
    //       wethApproval: this.approvals[this.data.weth] && this.approvals[this.data.weth][d.owner] && this.approvals[this.data.weth][d.owner][tokenAgent] && this.approvals[this.data.weth][d.owner][tokenAgent].tokens || 0,
    //       offers: {},
    //       prices: [],
    //     };
    //     const prices = [];
    //     for (const [offerIndex, o] of Object.entries(d.offers)) {
    //       if (d.nonce == o.nonce && (o.expiry == 0 || o.expiry > this.data.timestamp) && o.buySell == 0) {
    //         collator[d.owner].tokenAgents[tokenAgent].offers[offerIndex] = o;
    //         if (o.prices.length == 1 && o.tokenss.length == 0) {
    //           prices.push({ offerIndex: o.index, priceIndex: 0, price: o.prices[0], tokens: null });
    //         } else {
    //           for (let i = 0; i < o.prices.length; i++) {
    //             prices.push({ offerIndex: o.index, priceIndex: i, price: o.prices[i], tokens: o.tokenss[i], tokensAvailable: null });
    //           }
    //         }
    //       }
    //     }
    //     prices.sort((a, b) => {
    //       const aP = ethers.BigNumber.from(a.price);
    //       // TODO: handle null tokens
    //       const aT = a.tokens != null && ethers.BigNumber.from(a.tokens) || null;
    //       const bP = ethers.BigNumber.from(b.price);
    //       const bT = b.tokens != null && ethers.BigNumber.from(b.tokens) || null;
    //       if (aP.eq(bP)) {
    //         if (aT == null) {
    //           return 1;
    //         } else if (bT == null) {
    //           return -1;
    //         } else {
    //           return aT.lt(bT) ? 1 : -1;
    //         }
    //       } else {
    //         return aP.lt(bP) ? 1 : -1;
    //       }
    //     });
    //     const wethBalance = ethers.BigNumber.from(collator[d.owner].wethBalance);
    //     // const wethBalance = ethers.BigNumber.from("100000000000000003");
    //     const wethApproval = ethers.BigNumber.from(collator[d.owner].tokenAgents[tokenAgent].wethApproval);
    //     let wethRemaining = wethBalance.lte(wethApproval) ? wethBalance: wethApproval;
    //     console.log(now() + " INFO TradeFungibles:computed.buyOffers - maker: " + d.owner.substring(0, 10) + ", tokenAgent: " + tokenAgent.substring(0, 10) + ", wethBalance: " + ethers.utils.formatEther(wethBalance) + ", wethApproval: " + ethers.utils.formatEther(wethApproval) + ", wethRemaining: " + ethers.utils.formatEther(wethRemaining));
    //     for (const [i, e] of prices.entries()) {
    //       const tokens = ethers.BigNumber.from(e.tokens);
    //       const tokensRemaining = wethRemaining.mul(TENPOW18).div(e.price);
    //       const tokensAvailable = tokens.lte(tokensRemaining) ? tokens : tokensRemaining;
    //       const wethAvailable = tokensAvailable.mul(ethers.BigNumber.from(e.price)).div(TENPOW18);
    //       wethRemaining = wethRemaining.sub(wethAvailable);
    //       console.log("    offerIndex: " + e.offerIndex + ", priceIndex: " + e.priceIndex + ", price: " + ethers.utils.formatEther(e.price) +
    //         ", tokens: " + ethers.utils.formatEther(tokens) +
    //         ", tokensAvailable: " + ethers.utils.formatEther(tokensAvailable) +
    //         ", wethRemaining: " + ethers.utils.formatEther(wethRemaining)
    //       );
    //       prices[i].tokensAvailable = tokensAvailable.toString();
    //       if (tokensAvailable.gt(0)) {
    //         const o = d.offers[e.offerIndex];
    //         results.push({
    //           txHash: o.txHash, logIndex: o.logIndex, maker: d.owner, tokenAgent,
    //           tokenAgentIndexByOwner: this.data.tokenAgents[tokenAgent].indexByOwner,
    //           offerIndex: e.offerIndex, priceIndex: e.priceIndex, price: e.price, tokens: tokens.toString(), tokensAvailable: tokensAvailable.toString(),
    //           expiry: o.expiry,
    //         });
    //       }
    //     }
    //     collator[d.owner].tokenAgents[tokenAgent].prices = prices;
    //   }
    //   // console.log(now() + " INFO TradeFungibles:computed.buyOffers - collator: " + JSON.stringify(collator, null, 2));
    //   return results;
    // },

    filteredSortedBuyOffers() {
      // const results = this.buyOffers;
      const results = this.newBuyOffers.records;
      // if (this.settings.events.sortOption == 'txorderasc') {
      //   results.sort((a, b) => {
      //     if (a.blockNumber == b.blockNumber) {
      //       return a.logIndex - b.logIndex;
      //     } else {
      //       return a.blockNumber - b.blockNumber;
      //     }
      //   });
      // } else if (this.settings.events.sortOption == 'txorderdsc') {
      //   results.sort((a, b) => {
      //     if (a.blockNumber == b.blockNumber) {
      //       return b.logIndex - a.logIndex;
      //     } else {
      //       return b.blockNumber - a.blockNumber;
      //     }
      //   });
      // }
      return results;
    },
    pagedFilteredBuyOffers() {
      // console.log(now() + " INFO TradeFungibles:computed.pagedFilteredBuyOffers - results[0..1]: " + JSON.stringify(this.filteredSortedBuyOffers.slice(0, 2), null, 2));
      return this.filteredSortedBuyOffers.slice((this.settings.buyOffers.currentPage - 1) * this.settings.buyOffers.pageSize, this.settings.buyOffers.currentPage * this.settings.buyOffers.pageSize);
    },

    buyOffersToDelete() {
      const TENPOW18 = ethers.BigNumber.from("1000000000000000000");
      const results = [];
      // console.log(now() + " INFO TradeFungibles:computed.buyOffers - this.buyByMakers: " + JSON.stringify(this.buyByMakers, null, 2));
      const collator = {};
      for (const [tokenAgent, d] of Object.entries(this.data.tokenAgents)) {
        if (!(d.owner in collator)) {
          collator[d.owner] = {
            wethBalance: this.balances[this.data.weth] && this.balances[this.data.weth][d.owner] && this.balances[this.data.weth][d.owner].tokens || 0,
            tokenAgents: {},
          };
        }
        collator[d.owner].tokenAgents[tokenAgent] = {
          wethApproval: this.approvals[this.data.weth] && this.approvals[this.data.weth][d.owner] && this.approvals[this.data.weth][d.owner][tokenAgent] && this.approvals[this.data.weth][d.owner][tokenAgent].tokens || 0,
          offers: {},
          prices: [],
        };
        const prices = [];
        for (const [offerIndex, o] of Object.entries(d.offers)) {
          if (d.nonce == o.nonce && (o.expiry == 0 || o.expiry > this.data.timestamp) && o.buySell == 0) {
            collator[d.owner].tokenAgents[tokenAgent].offers[offerIndex] = o;
            if (o.prices.length == 1 && o.tokenss.length == 0) {
              prices.push({ offerIndex: o.index, priceIndex: 0, price: o.prices[0], tokens: null });
            } else {
              for (let i = 0; i < o.prices.length; i++) {
                prices.push({ offerIndex: o.index, priceIndex: i, price: o.prices[i], tokens: o.tokenss[i], tokensAvailable: null });
              }
            }
          }
        }
        prices.sort((a, b) => {
          const aP = ethers.BigNumber.from(a.price);
          // TODO: handle null tokens
          const aT = a.tokens != null && ethers.BigNumber.from(a.tokens) || null;
          const bP = ethers.BigNumber.from(b.price);
          const bT = b.tokens != null && ethers.BigNumber.from(b.tokens) || null;
          if (aP.eq(bP)) {
            if (aT == null) {
              return 1;
            } else if (bT == null) {
              return -1;
            } else {
              return aT.lt(bT) ? 1 : -1;
            }
          } else {
            return aP.lt(bP) ? 1 : -1;
          }
        });
        const wethBalance = ethers.BigNumber.from(collator[d.owner].wethBalance);
        // const wethBalance = ethers.BigNumber.from("100000000000000003");
        const wethApproval = ethers.BigNumber.from(collator[d.owner].tokenAgents[tokenAgent].wethApproval);
        let wethRemaining = wethBalance.lte(wethApproval) ? wethBalance: wethApproval;
        // console.log(now() + " INFO TradeFungibles:computed.buyOffers - maker: " + d.owner.substring(0, 10) + ", tokenAgent: " + tokenAgent.substring(0, 10) + ", wethBalance: " + ethers.utils.formatEther(wethBalance) + ", wethApproval: " + ethers.utils.formatEther(wethApproval) + ", wethRemaining: " + ethers.utils.formatEther(wethRemaining));
        for (const [i, e] of prices.entries()) {
          const tokens = ethers.BigNumber.from(e.tokens);
          const tokensRemaining = wethRemaining.mul(TENPOW18).div(e.price);
          const tokensAvailable = tokens.lte(tokensRemaining) ? tokens : tokensRemaining;
          const wethAvailable = tokensAvailable.mul(ethers.BigNumber.from(e.price)).div(TENPOW18);
          wethRemaining = wethRemaining.sub(wethAvailable);
          console.log("    offerIndex: " + e.offerIndex + ", priceIndex: " + e.priceIndex + ", price: " + ethers.utils.formatEther(e.price) +
            ", tokens: " + ethers.utils.formatEther(tokens) +
            ", tokensAvailable: " + ethers.utils.formatEther(tokensAvailable) +
            ", wethRemaining: " + ethers.utils.formatEther(wethRemaining)
          );
          prices[i].tokensAvailable = tokensAvailable.toString();
          if (tokensAvailable.gt(0)) {
            const o = d.offers[e.offerIndex];
            results.push({
              txHash: o.txHash, logIndex: o.logIndex, maker: d.owner, tokenAgent,
              tokenAgentIndexByOwner: this.data.tokenAgents[tokenAgent].indexByOwner,
              offerIndex: e.offerIndex, priceIndex: e.priceIndex, price: e.price, tokens: tokens.toString(), tokensAvailable: tokensAvailable.toString(),
              expiry: o.expiry,
            });
          }
        }
        collator[d.owner].tokenAgents[tokenAgent].prices = prices;
      }
      // console.log(now() + " INFO TradeFungibles:computed.buyOffers - collator: " + JSON.stringify(collator, null, 2));
      return results;
    },

    addSellOfferToDelete() {
      // console.log(now() + " INFO TradeFungibles:computed.addSellOffer - this.settings.addSellOffer: " + JSON.stringify(this.settings.addSellOffer));
      const TENPOW18 = ethers.BigNumber.from("1000000000000000000");
      const points = this.settings.addSellOffer.points;
      // console.log(now() + " INFO TradeFungibles:computed.addSellOffer - points: " + JSON.stringify(points) + ", sellOfferPointsFeedback: " + this.sellOfferPointsFeedback);
      const simulate = this.settings.addSellOffer.simulate && this.sellOfferPointsFeedback == null;
      // console.log(now() + " INFO TradeFungibles:computed.addSellOffer - simulate: " + simulate);
      const collator = {};
      const prices = [];
      for (const [tokenAgent, d] of Object.entries(this.data.tokenAgents)) {
        // console.log(tokenAgent + " => " + JSON.stringify(d));
        if (!this.settings.addSellOffer.mineOnly || d.owner == this.coinbase) {
          for (const [offerIndex, o] of Object.entries(d.offers)) {
            let include = o.buySell == 1;
            if (include && (!this.settings.addSellOffer.includeInvalidated && d.nonce != o.nonce)) {
              include = false;
            }
            if (include && (!this.settings.addSellOffer.includeExpired && o.expiry != 0 && o.expiry < this.data.timestamp)) {
              include = false;
            }
            if (include) {
              if (!(d.owner in collator)) {
                collator[d.owner] = {
                  tokenBalance: this.balances[this.data.token] && this.balances[this.data.token][d.owner] && this.balances[this.data.token][d.owner].tokens || 0,
                  tokenAgents: {},
                };
              }
              if (!(tokenAgent in collator[d.owner].tokenAgents)) {
                collator[d.owner].tokenAgents[tokenAgent] = {
                  tokenApproval: this.approvals[this.data.token] && this.approvals[this.data.token][d.owner] && this.approvals[this.data.token][d.owner][tokenAgent] && this.approvals[this.data.token][d.owner][tokenAgent].tokens || 0,
                  indexByOwner: d.indexByOwner,
                  nonce: d.nonce,
                  offers: {},
                  prices: [],
                };
              }
              collator[d.owner].tokenAgents[tokenAgent].offers[offerIndex] = o;
              if (o.prices.length == o.tokenss.length) {
                for (let i = 0; i < o.prices.length; i++) {
                  prices.push({
                    txHash: o.txHash, logIndex: o.logIndex,
                    tokenAgent, owner: d.owner, indexByOwner: collator[d.owner].tokenAgents[tokenAgent].indexByOwner,
                    offerIndex: o.index, nonce: o.nonce, currentNonce: d.nonce, valid: d.nonce == o.nonce && (o.expiry == 0 || o.expiry > this.data.timestamp),
                    priceIndex: i, price: o.prices[i], tokens: o.tokenss[i],
                    expiry: o.expiry, tokensAvailable: null,
                  });
                }
              }
            }
          }
        }
      }
      // console.log("this.coinbase: " + this.coinbase);
      if (simulate) {
        for (const [i, point] of points.entries()) {
          console.log(i + " => " + JSON.stringify(point));
          prices.push({
            // txHash: o.txHash, logIndex: o.logIndex,
            // tokenAgent,
            owner: this.coinbase,
            // indexByOwner: collator[d.owner].tokenAgents[tokenAgent].indexByOwner,
            // offerIndex: o.index, nonce: o.nonce, currentNonce: d.nonce,
            // valid: d.nonce == o.nonce && (o.expiry == 0 || o.expiry > this.data.timestamp),
            valid: true,
            simulated: true,
            priceIndex: i,
            price: ethers.utils.parseEther(point.price).toString(),
            tokens: ethers.utils.parseUnits(point.tokens, this.settings.decimals).toString(),
            // expiry: o.expiry, tokensAvailable: null,
          });
        }
      }
      // console.log("prices: " + JSON.stringify(prices, null, 2));
      prices.sort((a, b) => {
        if (a.valid && !b.valid) {
          return -1;
        } else if (!a.valid && b.valid) {
          return 1;
        }
        const priceA = ethers.BigNumber.from(a.price);
        const tokensA = ethers.BigNumber.from(a.tokens);
        const priceB = ethers.BigNumber.from(b.price);
        const tokensB = ethers.BigNumber.from(b.tokens);
        if (priceA.lt(priceB)) {
          return -1;
        } else if (priceA.gt(priceB)) {
          return 1;
        }
        return tokensA.lt(tokensB) ? 1 : -1;
      });
      // collator[d.owner].tokenAgents[tokenAgent].prices = prices;
      const records = [];
      const tokenBalances = {};
      const tokenApprovals = {};
      for (const [owner, d1] of Object.entries(collator)) {
        tokenBalances[owner] = { tokens: d1.tokenBalance, originalTokens: d1.tokenBalance };
        tokenApprovals[owner] = {};
        for (const [tokenAgent, d2] of Object.entries(d1.tokenAgents)) {
          // console.log(tokenAgent + " => " + JSON.stringify(d2));
          tokenApprovals[owner][tokenAgent] = { tokens: d2.tokenApproval, originalTokens: d2.tokenApproval };
          for (const [i1, e1] of d2.prices.entries()) {
            const o = d2.offers[e1.offerIndex];
            // records.push({ tokenAgent, txHash: o.txHash, logIndex: o.logIndex, offerIndex: e1.offerIndex, nonce: e1.nonce, currentNonce: d2.nonce, valid: e1.valid, priceIndex: e1.priceIndex, price: e1.price, offer: e1.tokens, tokens: e1.tokens, totalTokens: null, wethAmount: null, totalWeth: null, expiry: e1.expiry });
          }
        }
      }
      if (!(this.coinbase in tokenBalances)) {
        tokenBalances[this.coinbase] = {
          tokens: this.balances[this.data.token] && this.balances[this.data.token][this.coinbase] && this.balances[this.data.token][this.coinbase].tokens || "0",
          originalTokens: this.balances[this.data.token] && this.balances[this.data.token][this.coinbase] && this.balances[this.data.token][this.coinbase].tokens || "0",
        };
      }
      // TODO: Testing
      // if ("0x000001f568875F378Bf6d170B790967FE429C81A" in tokenBalances) {
      //   tokenBalances["0x000001f568875F378Bf6d170B790967FE429C81A"].tokens = "16660000000000000000";
      // }
      // if ("0x000001f568875F378Bf6d170B790967FE429C81A" in tokenApprovals) {
      //   tokenApprovals["0x000001f568875F378Bf6d170B790967FE429C81A"]["0x9cb5B0C7839B2b770335f592966fFDA2BbFB7E8D"].tokens = "13330000000000000000";
      // }
      // console.log("tokenBalances: " + JSON.stringify(tokenBalances, null, 2));
      // console.log("tokenApprovals: " + JSON.stringify(tokenApprovals, null, 2));
      let totalTokens = ethers.BigNumber.from(0);
      let totalWeth = ethers.BigNumber.from(0);
      for (const [i, price] of prices.entries()) {
        const ignoreApproval = price.owner == this.coinbase && this.settings.addSellOffer.ignoreMyApprovals;
        const tokenBalance = ethers.BigNumber.from(tokenBalances[price.owner] && tokenBalances[price.owner].tokens || 0);
        const tokenApproval = ethers.BigNumber.from(!price.simulated && tokenApprovals[price.owner][price.tokenAgent] && tokenApprovals[price.owner][price.tokenAgent].tokens || 0);
        let tokens = ethers.BigNumber.from(price.tokens);
        let wethAmount = null;
        // console.log("  price: " + JSON.stringify(price));
        if (price.valid) {
          // console.log("  tokens BEFORE: " + ethers.utils.formatEther(tokens) + ", tokenBalance: " + ethers.utils.formatEther(tokenBalances[price.owner] && tokenBalances[price.owner].tokens || 0) + ", ignoreApproval: " + ignoreApproval);
          if (tokens.gt(tokenBalance)) {
            tokens = tokenBalance;
          }
          if (!ignoreApproval && !price.simulated && tokens.gt(tokenApproval)) {
            tokens = tokenApproval;
          }
          if (tokens.gt(0)) {
            wethAmount = tokens.mul(ethers.BigNumber.from(price.price)).div(TENPOW18);
            totalTokens = ethers.BigNumber.from(totalTokens).add(tokens).toString();
            totalWeth = ethers.BigNumber.from(totalWeth).add(wethAmount).toString();
            tokenBalances[price.owner].tokens = ethers.BigNumber.from(tokenBalances[price.owner].tokens).sub(tokens).toString();
            if (!ignoreApproval && !price.simulated) {
              tokenApprovals[price.owner][price.tokenAgent].tokens = ethers.BigNumber.from(tokenApprovals[price.owner][price.tokenAgent].tokens).sub(tokens).toString();
            }
          }
          // console.log("  tokens AFTER: " + ethers.utils.formatEther(tokens) + ", tokenBalance: " + ethers.utils.formatEther(tokenBalances[price.owner] && tokenBalances[price.owner].tokens || 0));
        }
        records.push({ ...price, offer: price.tokens, tokens: tokens.toString(), totalTokens: totalTokens.toString(), wethAmount: wethAmount != null && wethAmount.toString() || null, totalWeth: totalWeth.toString() });
      }
      // console.log("records: " + JSON.stringify(records, null, 2));
      // console.log("collator: " + JSON.stringify(collator, null, 2));
      return { tokenBalances, tokenApprovals, records, collator };
    },

    eventsList() {
      // console.log(now() + " INFO TradeFungibles:computed.eventsList - this.tokenSet: " + JSON.stringify(this.tokenSet, null, 2));
      const results = [];

      const collator = {};
      for (const e of (this.tokenSet.events || [])) {
        // console.log(JSON.stringify(e));
        if (!(e.txHash in collator)) {
          collator[e.txHash] = {
            type: null,
            blockNumber: e.blockNumber,
            txIndex: e.txIndex,
            logIndex: e.logIndex,
            timestamp: null,
            events: [],
          };
        }
        if (e.eventType == EVENTTYPE_OFFERED) {
          collator[e.txHash].type = "Offered";
          collator[e.txHash].timestamp = e.timestamp;
        } else if (e.eventType == EVENTTYPE_TRADED) {
          collator[e.txHash].type = "Traded";
          collator[e.txHash].timestamp = e.timestamp;
        }
        collator[e.txHash].events.push({ ...e, tokenSet: undefined, chainId: undefined, blockNumber: undefined, txHash: undefined, txIndex: undefined, timestamp: undefined });
      }
      // console.log(now() + " INFO TradeFungibles:computed.eventsList - collator: " + JSON.stringify(collator, null, 2));

      for (const [txHash, d1] of Object.entries(collator)) {
        let eventType = null;
        if (d1.type == "Offered") {
          // console.log("Offered " + txHash + " => " + JSON.stringify(d1));
          eventType = "Offered";
        } else if (d1.type == "Traded") {
          // console.log("Traded " + txHash + " => " + JSON.stringify(d1));
          eventType = "Traded";
        } else {
          if (d1.events.length == 1) {
            if (d1.events[0].eventType == EVENTTYPE_APPROVAL) {
              // console.log("Single Approval " + txHash + " => " + JSON.stringify(d1));
              eventType = "Approval";
            } else {
              // console.log("Single Transfer " + txHash + " => " + JSON.stringify(d1));
              eventType = "Transfer";
            }
          } else {
            // console.log("Other " + txHash + " => " + JSON.stringify(d1));
            eventType = "Other";
          }
        }

        results.push({
          blockNumber: d1.blockNumber,
          txIndex: d1.txIndex,
          logIndex: d1.logIndex,
          timestamp: d1.timestamp,
          txHash,
          eventType,
          // from,
          // to,
          // logIndex,
          // tokenAgent: tokenAgent,
          // timestamp: d1.timestamp,
          // ...record,
          events: d1.events
        });

      }

      // for (const [txHash, d1] of Object.entries(this.events)) {
      //   let record = null;
      //
      //   let isOffered = false;
      //   let isTraded = false;
      //   let tokenAgent = null;
      //   let logIndex = null;
      //   let timestamp = null;
      //   let from = null;
      //   let to = null;
      //   for (const [logIndex2, d2] of Object.entries(d1.events)) {
      //     if (d2.eventType == "Offered") {
      //       isOffered = true;
      //       tokenAgent = d2.contract;
      //       logIndex = logIndex2;
      //       timestamp = d2.timestamp;
      //       from = d2.maker;
      //       break;
      //     } else if (d2.eventType == "Traded") {
      //       isTraded = true;
      //       tokenAgent = d2.contract;
      //       logIndex = logIndex2;
      //       timestamp = d2.timestamp;
      //       from = d2.taker;
      //       to = d2.maker;
      //       break;
      //     }
      //   }
      //   // console.log("tokenAgent: " + tokenAgent + ", isOffered: " + isOffered + ", isTraded: " + isTraded + ", timestamp: " + timestamp);
      //
      //   if (isOffered) {
      //     // console.log("isOffered: " + txHash + " => " + JSON.stringify(d1.events));
      //     record = { timestamp, logIndex, tokenAgent, eventType: "Offered", events: d1.events };
      //   } else if (isTraded) {
      //     // console.log("isTraded: " + txHash + " => " + JSON.stringify(d1.events));
      //     record = { timestamp, logIndex, tokenAgent, eventType: "Traded", events: d1.events };
      //   } else if (Object.keys(d1.events).length == 1) {
      //     // Regular transfers and approvals
      //     for (const [logIndex2, d2] of Object.entries(d1.events)) {
      //       // console.log("One: " + txHash + "/" + logIndex2 + " => " + JSON.stringify(d2));
      //       if (d2.eventType == "Transfer" || d2.eventType == "Deposit" || d2.eventType == "Withdrawal") {
      //         from = d2.from;
      //         to = d2.to;
      //         record = { logIndex: logIndex2, contract: d2.contract, eventType: d2.eventType, tokens: d2.tokens };
      //       } else if (d2.eventType == "Approval") {
      //         from = d2.owner;
      //         to = d2.spender;
      //         record = { logIndex: logIndex2, contract: d2.contract, eventType: d2.eventType, tokens: d2.tokens };
      //       }
      //     }
      //   } else {
      //     // console.log("Other: " + txHash + " => " + JSON.stringify(d1.events));
      //     record = { eventType: "Other", events: d1.events };
      //   }
      //   if (record) {
      //     results.push({
      //       blockNumber: d1.blockNumber,
      //       txIndex: d1.txIndex,
      //       txHash,
      //       from,
      //       to,
      //       // logIndex,
      //       // tokenAgent: tokenAgent,
      //       // timestamp: d1.timestamp,
      //       ...record,
      //       // events: d1.events
      //     });
      //   }
      // }
      console.log("eventsList: " + JSON.stringify(results, null, 2));
      // console.log("eventsList.length: " + results.length);
      return results;
    },
    filteredSortedEvents() {
      const results = [];
      const eventTypeOption = this.settings.events.eventTypeOption;
      for (const e of this.eventsList) {
        if (eventTypeOption == null) {
          results.push(e);
        } else if (eventTypeOption == e.eventType) {
          results.push(e);
        }
      }
      if (this.settings.events.sortOption == 'txorderasc') {
        results.sort((a, b) => {
          if (a.blockNumber == b.blockNumber) {
            return a.logIndex - b.logIndex;
          } else {
            return a.blockNumber - b.blockNumber;
          }
        });
      } else if (this.settings.events.sortOption == 'txorderdsc') {
        results.sort((a, b) => {
          if (a.blockNumber == b.blockNumber) {
            return b.logIndex - a.logIndex;
          } else {
            return b.blockNumber - a.blockNumber;
          }
        });
      }
      return results;
    },
    pagedFilteredSortedEvents() {
      // console.log(now() + " INFO TradeFungibles:computed.pagedFilteredSortedEvents - results[0..1]: " + JSON.stringify(this.filteredSortedEvents.slice(0, 2), null, 2));
      return this.filteredSortedEvents.slice((this.settings.events.currentPage - 1) * this.settings.events.pageSize, this.settings.events.currentPage * this.settings.events.pageSize);
    },

  },
  methods: {
    syncNow() {
      console.log(now() + " INFO TradeFungibles:methods.syncNow - settings.tokenContractAddress: " + this.settings.tokenContractAddress);
      store.dispatch('data/syncIt', {
        tokenContractAddress: this.settings.tokenContractAddress,
      });
    },

    async invalidateAllOffers() {
      console.log(now() + " INFO TradeFungibles:methods.invalidateAllOffers - BEGIN");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = this.chainId && NETWORKS[this.chainId.toString()] || {};
      if (network.demodex) {
        const contract = new ethers.Contract(network.demodex.address, network.demodex.abi, provider);
        const contractWithSigner = contract.connect(provider.getSigner());
        try {
          const tx = await contractWithSigner.invalidateOffers();
          // const tx = { hash: "blah" };
          console.log(now() + " INFO TradeFungibles:methods.invalidateAllOffers - tx: " + JSON.stringify(tx));
          const h = this.$createElement;
          const vNodesMsg = h(
            'p',
            { class: ['text-left', 'mb-0'] },
            [
              h('a', { attrs: { href: this.explorer + 'tx/' + tx.hash, target: '_blank' } }, tx.hash.substring(0, 20) + '...' + tx.hash.slice(-18)),
              h('br'),
              h('br'),
              'Resync after this tx has been included',
            ]
          );
          this.$bvToast.toast([vNodesMsg], {
            title: 'Transaction submitted',
            autoHideDelay: 5000,
          });
          // this.$refs['modalnewtokenagent'].hide();
          // this.settings.newTokenAgent.show = false;
          // this.saveSettings();
        } catch (e) {
          console.log(now() + " ERROR TradeFungibles:methods.invalidateAllOffers: " + JSON.stringify(e));
          this.$bvToast.toast(`${e.message}`, {
            title: 'Error!',
            autoHideDelay: 5000,
          });
        }
      }
    },

    async newSellOffersTrade() {
      console.log(now() + " INFO TradeFungibles:methods.newSellOffersTrade - this.newSellOffers.trades: " + JSON.stringify(this.newSellOffers.trades));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = this.chainId && NETWORKS[this.chainId.toString()] || {};
      console.log("token: " + this.tokenSet.token);
      console.log("WETH: " + this.tokenSet.weth);
      console.log("taker: " + this.coinbase);

      if (network.demodex) {
        const contract = new ethers.Contract(network.demodex.address, network.demodex.abi, provider);
        const contractWithSigner = contract.connect(provider.getSigner());

        const token = new ethers.Contract(this.tokenSet.token, ERC20ABI, provider);
        const weth = new ethers.Contract(this.tokenSet.weth, ERC20ABI, provider);

        // const makerTokenBalance = await token.balanceOf(maker);
        // console.log("makerTokenBalance: " + ethers.utils.formatEther(makerTokenBalance));
        // const makerTokenApproved = await token.allowance(maker, tokenAgent);
        // console.log("makerTokenApproved: " + ethers.utils.formatEther(makerTokenApproved));

        // const makerWethBalance = await weth.balanceOf(maker);
        // console.log("makerWethBalance: " + ethers.utils.formatEther(makerWethBalance));
        // const makerWethApproved = await weth.allowance(maker, tokenAgent);
        // console.log("makerWethApproved: " + ethers.utils.formatEther(makerWethApproved));

        const takerTokenBalance = await token.balanceOf(this.coinbase);
        console.log("takerTokenBalance: " + ethers.utils.formatEther(takerTokenBalance));
        const takerTokenApproved = await token.allowance(this.coinbase, network.demodex.address);
        console.log("takerTokenApproved: " + ethers.utils.formatEther(takerTokenApproved));

        const takerWethBalance = await weth.balanceOf(this.coinbase);
        console.log("takerWethBalance: " + ethers.utils.formatEther(takerWethBalance));
        const takerWethApproved = await weth.allowance(this.coinbase, network.demodex.address);
        console.log("takerWethApproved: " + ethers.utils.formatEther(takerWethApproved));

        try {
          const tx = await contractWithSigner.trade(this.newSellOffers.trades, this.settings.sellOffers.paymentType == 'eth' ? 1 : 0, { value: this.settings.sellOffers.paymentType == 'eth' ? this.newSellOffers.filled.weth : 0 });
          // const tx = { hash: "blah" };
          console.log(now() + " INFO TradeFungibles:methods.newSellOffersTrade - tx: " + JSON.stringify(tx));
          const h = this.$createElement;
          const vNodesMsg = h(
            'p',
            { class: ['text-left', 'mb-0'] },
            [
              h('a', { attrs: { href: this.explorer + 'tx/' + tx.hash, target: '_blank' } }, tx.hash.substring(0, 20) + '...' + tx.hash.slice(-18)),
              h('br'),
              h('br'),
              'Resync after this tx has been included',
            ]
          );
          this.$bvToast.toast([vNodesMsg], {
            title: 'Transaction submitted',
            autoHideDelay: 5000,
          });
          // this.$refs['modalnewtokenagent'].hide();
          // this.settings.newTokenAgent.show = false;
          // this.saveSettings();
        } catch (e) {
          console.log(now() + " ERROR TradeFungibles:methods.newSellOffersTrade: " + JSON.stringify(e));
          this.$bvToast.toast(`${e.message}`, {
            title: 'Error!',
            autoHideDelay: 5000,
          });
        }
      }
    },

    async newBuyOffersTrade() {
      console.log(now() + " INFO TradeFungibles:methods.newBuyOffersTrade - this.newBuyOffers.trades: " + JSON.stringify(this.newBuyOffers.trades));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = this.chainId && NETWORKS[this.chainId.toString()] || {};
      console.log("token: " + this.tokenSet.token);
      console.log("WETH: " + this.tokenSet.weth);
      console.log("taker: " + this.coinbase);

      if (network.demodex) {
        const contract = new ethers.Contract(network.demodex.address, network.demodex.abi, provider);
        const contractWithSigner = contract.connect(provider.getSigner());

        const token = new ethers.Contract(this.tokenSet.token, ERC20ABI, provider);
        const weth = new ethers.Contract(this.tokenSet.weth, ERC20ABI, provider);

        // const makerTokenBalance = await token.balanceOf(maker);
        // console.log("makerTokenBalance: " + ethers.utils.formatEther(makerTokenBalance));
        // const makerTokenApproved = await token.allowance(maker, tokenAgent);
        // console.log("makerTokenApproved: " + ethers.utils.formatEther(makerTokenApproved));

        // const makerWethBalance = await weth.balanceOf(maker);
        // console.log("makerWethBalance: " + ethers.utils.formatEther(makerWethBalance));
        // const makerWethApproved = await weth.allowance(maker, tokenAgent);
        // console.log("makerWethApproved: " + ethers.utils.formatEther(makerWethApproved));

        const takerTokenBalance = await token.balanceOf(this.coinbase);
        console.log("takerTokenBalance: " + ethers.utils.formatEther(takerTokenBalance));
        const takerTokenApproved = await token.allowance(this.coinbase, network.demodex.address);
        console.log("takerTokenApproved: " + ethers.utils.formatEther(takerTokenApproved));

        const takerWethBalance = await weth.balanceOf(this.coinbase);
        console.log("takerWethBalance: " + ethers.utils.formatEther(takerWethBalance));
        const takerWethApproved = await weth.allowance(this.coinbase, network.demodex.address);
        console.log("takerWethApproved: " + ethers.utils.formatEther(takerWethApproved));

        console.log("this.newBuyOffers.trades: " + JSON.stringify(this.newBuyOffers.trades, null, 2));

        try {
          const tx = await contractWithSigner.trade(this.newBuyOffers.trades, this.settings.buyOffers.paymentType == 'eth' ? 1 : 0, { value: 0 });
          // const tx = { hash: "blah" };
          console.log(now() + " INFO TradeFungibles:methods.newBuyOffersTrade - tx: " + JSON.stringify(tx));
          const h = this.$createElement;
          const vNodesMsg = h(
            'p',
            { class: ['text-left', 'mb-0'] },
            [
              h('a', { attrs: { href: this.explorer + 'tx/' + tx.hash, target: '_blank' } }, tx.hash.substring(0, 20) + '...' + tx.hash.slice(-18)),
              h('br'),
              h('br'),
              'Resync after this tx has been included',
            ]
          );
          this.$bvToast.toast([vNodesMsg], {
            title: 'Transaction submitted',
            autoHideDelay: 5000,
          });
          // this.$refs['modalnewtokenagent'].hide();
          // this.settings.newTokenAgent.show = false;
          // this.saveSettings();
        } catch (e) {
          console.log(now() + " ERROR TradeFungibles:methods.newBuyOffersTrade: " + JSON.stringify(e, null, 2));

          try {
            const decodedError = contract.interface.parseError(e.error.data.originalError.data)
            console.log(now() + " ERROR TradeFungibles:methods.newBuyOffersTrade - decodedError.name: " + decodedError.name + ", args: " + JSON.stringify(decodedError.args.map(e => ethers.utils.formatEther(e)), null, 2));
          } catch (e1) {            
          }

          // console.log(now() + " ERROR TradeFungibles:methods.newBuyOffersTrade - decodedError: " + JSON.stringify(decodedError, null, 2));

          // console.log(`Transaction failed: ${decodedError.name}`)

          this.$bvToast.toast(`${e.message}`, {
            title: 'Error!',
            autoHideDelay: 5000,
          });
        }
      }
    },

    async trade() {
      console.log(now() + " INFO TradeFungibles:methods.trade - trades: " + JSON.stringify(this.sellOffer.trades));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = this.chainId && NETWORKS[this.chainId.toString()] || {};
      if (network.tokenAgentFactory) {
        const contract = new ethers.Contract(this.sellOffer.tokenAgent, network.tokenAgent.abi, provider);
        const contractWithSigner = contract.connect(provider.getSigner());

        console.log("tokenAgent: " + this.sellOffer.tokenAgent);
        console.log("token: " + this.data.token);
        console.log("WETH: " + this.data.weth);
        console.log("maker: " + this.modalSellOffer.maker);
        console.log("taker: " + this.coinbase);

        const token = new ethers.Contract(this.data.token, ERC20ABI, provider);
        const weth = new ethers.Contract(this.data.weth, ERC20ABI, provider);

        const makerTokenBalance = await token.balanceOf(this.modalSellOffer.maker);
        console.log("makerTokenBalance: " + ethers.utils.formatEther(makerTokenBalance));
        const makerTokenApproved = await token.allowance(this.modalSellOffer.maker, this.sellOffer.tokenAgent);
        console.log("makerTokenApproved: " + ethers.utils.formatEther(makerTokenApproved));

        const makerWethBalance = await weth.balanceOf(this.modalSellOffer.maker);
        console.log("makerWethBalance: " + ethers.utils.formatEther(makerWethBalance));
        const makerWethApproved = await weth.allowance(this.modalSellOffer.maker, this.sellOffer.tokenAgent);
        console.log("makerWethApproved: " + ethers.utils.formatEther(makerWethApproved));

        const takerTokenBalance = await token.balanceOf(this.coinbase);
        console.log("takerTokenBalance: " + ethers.utils.formatEther(takerTokenBalance));
        const takerTokenApproved = await token.allowance(this.coinbase, this.sellOffer.tokenAgent);
        console.log("takerTokenApproved: " + ethers.utils.formatEther(takerTokenApproved));

        const takerWethBalance = await weth.balanceOf(this.coinbase);
        console.log("takerWethBalance: " + ethers.utils.formatEther(takerWethBalance));
        const takerWethApproved = await weth.allowance(this.coinbase, this.sellOffer.tokenAgent);
        console.log("takerWethApproved: " + ethers.utils.formatEther(takerWethApproved));

        // const maker = this.modalSellOffer.maker;
        // const makerTokenBalance = maker && this.tokenBalances[maker] && this.tokenBalances[maker].tokens && ethers.BigNumber.from(this.tokenBalances[maker].tokens) || 0;
        // // const makerTokenBalance = ethers.BigNumber.from("5100000000000000000");
        // const tokenAgent = maker && this.modalSellOffer.tokenAgent || null;
        // const tokenAgentTokenApproval = maker && this.tokenApprovals[maker] && this.tokenApprovals[maker][tokenAgent] && ethers.BigNumber.from(this.tokenApprovals[maker][tokenAgent].tokens) || 0;


        try {
          const tx = await contractWithSigner.trade(this.sellOffer.trades, this.modalSellOffer.paymentsInEth ? 1 : 0, { value: this.modalSellOffer.paymentsInEth ? this.sellOffer.filledWeth : 0 });
          // const tx = { hash: "blah" };
          console.log(now() + " INFO TradeFungibles:methods.trade - tx: " + JSON.stringify(tx));
          const h = this.$createElement;
          const vNodesMsg = h(
            'p',
            { class: ['text-left', 'mb-0'] },
            [
              h('a', { attrs: { href: this.explorer + 'tx/' + tx.hash, target: '_blank' } }, tx.hash.substring(0, 20) + '...' + tx.hash.slice(-18)),
              h('br'),
              h('br'),
              'Resync after this tx has been included',
            ]
          );
          this.$bvToast.toast([vNodesMsg], {
            title: 'Transaction submitted',
            autoHideDelay: 5000,
          });
          // this.$refs['modalnewtokenagent'].hide();
          // this.settings.newTokenAgent.show = false;
          // this.saveSettings();
        } catch (e) {
          console.log(now() + " ERROR TradeFungibles:methods.trade: " + JSON.stringify(e));
          this.$bvToast.toast(`${e.message}`, {
            title: 'Error!',
            autoHideDelay: 5000,
          });
        }
      }
    },
    async loadData() {
      console.log(now() + " INFO TradeFungibles:methods.loadData - tokenAgentAgentSettings: " + JSON.stringify(this.settings));
      // TODO: Later move into data?
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const block = await provider.getBlock();
      const blockNumber = block && block.number || "latest";
      const network = NETWORKS['' + this.chainId] || {};

      if (network.tokenAgentFactory) {
        const tokenAgentFactoryEventsfilter = {
          address: network.tokenAgentFactory.address, fromBlock: 0, toBlock: blockNumber,
          topics: [ [], null, null ],
        };
        const tokenAgentFactoryEventLogs = await provider.getLogs(tokenAgentFactoryEventsfilter);
        this.tokenAgentFactoryEvents = parseTokenAgentFactoryEventLogsOld(tokenAgentFactoryEventLogs, this.chainId, network.tokenAgentFactory.address, network.tokenAgentFactory.abi, blockNumber);
        localStorage.tokenAgentTradeFungiblesTokenAgentFactoryEvents = JSON.stringify(this.tokenAgentFactoryEvents);
        const tokenAgents = {};
        for (const record of this.tokenAgentFactoryEvents) {
          tokenAgents[record.tokenAgent] = { index: record.index, indexByOwner: record.indexByOwner, owner: record.owner, nonce: 0, blockNumber: record.blockNumber, timestamp: record.timestamp, offers: {} };
        }
        console.log(now() + " INFO TradeFungibles:methods.loadData - tokenAgents: " + JSON.stringify(tokenAgents, null, 2));

        // Get latest nonces
        const tokenAgentOffersInvalidatedEventsfilter = {
          address: null, fromBlock: 0, toBlock: blockNumber,
          topics: [[
              // event OffersInvalidated(Nonce newNonce, Unixtime timestamp);
              ethers.utils.id("OffersInvalidated(uint24,uint40)"),
            ],
            null,
            null,
          ]};
        const tokenAgentOffersInvalidatedEventLogs = await provider.getLogs(tokenAgentOffersInvalidatedEventsfilter);
        const tokenAgentOffersInvalidated = parseTokenAgentEventLogsOld(tokenAgentOffersInvalidatedEventLogs, this.chainId, this.settings.tokenAgentAddress, network.tokenAgent.abi, blockNumber);
        const validTokenAgentOffersInvalidatedEvents = [];
        for (const record of tokenAgentOffersInvalidated) {
          if (record.contract in tokenAgents) {
            validTokenAgentOffersInvalidatedEvents.push(record);
            tokenAgents[record.contract].nonce = record.newNonce;
            tokenAgents[record.contract].blockNumber = record.blockNumber;
            tokenAgents[record.contract].timestamp = record.timestamp;
          }
        }
        console.log(now() + " INFO TradeFungibles:methods.loadData - tokenAgents after invalidations: " + JSON.stringify(tokenAgents, null, 2));
        this.data.chainId = this.chainId;
        this.data.blockNumber = blockNumber;
        this.data.timestamp = block.timestamp;
        this.data.token = this.settings.tokenContractAddress;
        this.data.weth = network.weth.address;

        const tokenAgentEventsfilter = {
          address: null, fromBlock: 0, toBlock: blockNumber,
          topics: [[
              // event Offered(Index index, Token indexed token, TokenType tokenType, Account indexed maker, BuySell buySell, Unixtime expiry, Nonce nonce, Price[] prices, TokenId[] tokenIds, Tokens[] tokenss, Unixtime timestamp);
              ethers.utils.id("Offered(uint32,address,uint8,address,uint8,uint40,uint24,uint128[],uint256[],uint128[],uint40)"),

              // event Traded(Index index, Token indexed token, TokenType tokenType, Account indexed maker, Account indexed taker, BuySell makerBuySell, uint[] prices, uint[] tokenIds, uint[] tokenss, Tokens[] remainingTokenss, Price price, Unixtime timestamp);
              // Traded (uint32 index, index_topic_1 address token, uint8 tokenType, index_topic_2 address maker, index_topic_3 address taker, uint8 makerBuySell, uint256[] prices, uint256[] tokenIds, uint256[] tokenss, uint128[] remainingTokenss, uint128 price, uint40 timestamp)
              ethers.utils.id("Traded(uint32,address,uint8,address,address,uint8,uint256[],uint256[],uint256[],uint128[],uint128,uint40)"),

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
            ],
            [ '0x000000000000000000000000' + this.settings.tokenContractAddress.substring(2, 42).toLowerCase() ],
            null,
          ]};
        const tokenAgentEventLogs = await provider.getLogs(tokenAgentEventsfilter);
        const tokenAgentEvents = parseTokenAgentEventLogsOld(tokenAgentEventLogs, this.chainId, this.settings.tokenAgentAddress, network.tokenAgent.abi, blockNumber);

        for (const e of tokenAgentEvents) {
          if (e.contract in tokenAgents) {
            if (e.eventType == "Offered") {
              tokenAgents[e.contract].offers[e.index] = e;
            } else if (e.eventType == "Traded") {
              tokenAgents[e.contract].offers[e.index].tokenss = e.remainingTokenss;
            }
          }
        }
        Vue.set(this.data, 'tokenAgents', tokenAgents);
        console.log(now() + " INFO TradeFungibles:methods.loadData - tokenAgents: " + JSON.stringify(tokenAgents, null, 2));

        // TODO: const balance = await provider.getBalance(e.maker);
        const approvalAddressMap = {};
        const balanceAddressMap = {};
        const internalTransferAddressMap = {};
        balanceAddressMap[this.coinbase] = 1;
        internalTransferAddressMap[this.coinbase] = 1;
        for (const e of tokenAgentEvents) {
          if (!(e.contract in approvalAddressMap)) {
            approvalAddressMap[e.contract] = 1;
          }
          if (!(e.maker in balanceAddressMap)) {
            balanceAddressMap[e.maker] = 1;
          }
          if (!(e.contract in internalTransferAddressMap)) {
            internalTransferAddressMap[e.contract] = 1;
          }
          if (!(e.maker in internalTransferAddressMap)) {
            internalTransferAddressMap[e.maker] = 1;
          }
        }
        const approvalAddresses = Object.keys(approvalAddressMap);
        Vue.set(this.data, 'approvalAddresses', approvalAddresses);
        const balanceAddresses = Object.keys(balanceAddressMap);
        Vue.set(this.data, 'balanceAddresses', balanceAddresses);
        const internalTransferAddresses = Object.keys(internalTransferAddressMap);
        // console.log(now() + " INFO TradeFungibles:methods.loadData - balanceAddresses: " + JSON.stringify(balanceAddresses) + ", internalTransferAddresses: " + JSON.stringify(internalTransferAddresses));

        const internalTransferFromEventsfilter = {
          address: null, fromBlock: 0, toBlock: blockNumber,
          topics: [[
              // event InternalTransfer(address indexed from, address indexed to, uint ethers, Unixtime timestamp);
              ethers.utils.id("InternalTransfer(address,address,uint256,uint40)"),
            ],
            internalTransferAddresses.map(e => '0x000000000000000000000000' + e.substring(2, 42).toLowerCase()),
            null,
            null,
          ]};
        const internalTransferFromEventsEventLogs = await provider.getLogs(internalTransferFromEventsfilter);
        const internalTransferFromEvents = parseTokenAgentEventLogsOld(internalTransferFromEventsEventLogs, this.chainId, this.settings.tokenAgentAddress, network.tokenAgent.abi, blockNumber);
        // console.log(now() + " INFO TradeFungibles:methods.loadData - internalTransferFromEvents: " + JSON.stringify(internalTransferFromEvents));
        const validInternalTransferFromEvents = [];
        for (const record of internalTransferFromEvents) {
          if (record.contract in tokenAgents) {
            validInternalTransferFromEvents.push(record);
          }
        }
        // console.log(now() + " INFO TradeFungibles:methods.loadData - validInternalTransferFromEvents: " + JSON.stringify(validInternalTransferFromEvents));

        const internalTransferToEventsfilter = {
          address: null, fromBlock: 0, toBlock: blockNumber,
          topics: [[
              // event InternalTransfer(address indexed from, address indexed to, uint ethers, Unixtime timestamp);
              ethers.utils.id("InternalTransfer(address,address,uint256,uint40)"),
            ],
            null,
            internalTransferAddresses.map(e => '0x000000000000000000000000' + e.substring(2, 42).toLowerCase()),
            null,
          ]};
        const internalTransferToEventsEventLogs = await provider.getLogs(internalTransferToEventsfilter);
        const internalTransferToEvents = parseTokenAgentEventLogsOld(internalTransferToEventsEventLogs, this.chainId, this.settings.tokenAgentAddress, network.tokenAgent.abi, blockNumber);
        // console.log(now() + " INFO TradeFungibles:methods.loadData - internalTransferToEvents: " + JSON.stringify(internalTransferToEvents));
        const validInternalTransferToEvents = [];
        for (const record of internalTransferToEvents) {
          if (record.contract in tokenAgents) {
            validInternalTransferToEvents.push(record);
          }
        }
        // console.log(now() + " INFO TradeFungibles:methods.loadData - validInternalTransferToEvents: " + JSON.stringify(validInternalTransferToEvents));

        Vue.set(this.data, 'tokenAgentEvents', [...validTokenAgentOffersInvalidatedEvents, ...validInternalTransferFromEvents, ...validInternalTransferToEvents, ...tokenAgentEvents]);

        if (approvalAddresses.length > 0) {
          const tokenApprovalsfilter = {
            address: this.settings.tokenContractAddress, fromBlock: 0, toBlock: blockNumber,
            topics: [[
                // ERC-20 event Approval(address indexed owner, address indexed spender, uint tokens);
                ethers.utils.id("Approval(address,address,uint256)"),
              ],
              null,
              approvalAddresses.map(e => '0x000000000000000000000000' + e.substring(2, 42).toLowerCase()),
            ]};
          const tokenApprovalsEventLogs = await provider.getLogs(tokenApprovalsfilter);
          const tokenApprovals = parseTokenEventLogsOld(tokenApprovalsEventLogs, this.chainId, blockNumber);
          Vue.set(this.data, 'tokenApprovals', tokenApprovals);
        }

        if (approvalAddresses.length > 0) {
          const wethApprovalsfilter = {
            address: network.weth.address, fromBlock: 0, toBlock: blockNumber,
            topics: [[
                // ERC-20 event Approval(address indexed owner, address indexed spender, uint tokens);
                ethers.utils.id("Approval(address,address,uint256)"),
              ],
              null,
              approvalAddresses.map(e => '0x000000000000000000000000' + e.substring(2, 42).toLowerCase()),
            ]};
          const wethApprovalsEventLogs = await provider.getLogs(wethApprovalsfilter);
          const wethApprovals = parseTokenEventLogsOld(wethApprovalsEventLogs, this.chainId, blockNumber);
          Vue.set(this.data, 'wethApprovals', wethApprovals);
        }

        const tokenTransferToEventsfilter = {
          address: this.settings.tokenContractAddress, fromBlock: 0, toBlock: blockNumber,
          topics: [[
              // ERC-20 event Transfer(address indexed from, address indexed to, uint tokens);
              ethers.utils.id("Transfer(address,address,uint256)"),
            ],
            null,
            balanceAddresses.map(e => '0x000000000000000000000000' + e.substring(2, 42).toLowerCase()),
            null,
          ]};
        const tokenTransferToEventsEventLogs = await provider.getLogs(tokenTransferToEventsfilter);
        const tokenTransferToEvents = parseTokenEventLogsOld(tokenTransferToEventsEventLogs, this.chainId, blockNumber);

        const tokenTransferFromEventsfilter = {
          address: this.settings.tokenContractAddress, fromBlock: 0, toBlock: blockNumber,
          topics: [[
              // ERC-20 event Transfer(address indexed from, address indexed to, uint tokens);
              ethers.utils.id("Transfer(address,address,uint256)"),
            ],
            balanceAddresses.map(e => '0x000000000000000000000000' + e.substring(2, 42).toLowerCase()),
            null,
            null,
          ]};
        const tokenTransferFromEventsEventLogs = await provider.getLogs(tokenTransferFromEventsfilter);
        const tokenTransferFromEvents = parseTokenEventLogsOld(tokenTransferFromEventsEventLogs, this.chainId, blockNumber);

        const wethTransferToEventsfilter = {
          address: network.weth.address, fromBlock: 0, toBlock: blockNumber,
          topics: [[
              // ERC-20 event Transfer(address indexed from, address indexed to, uint tokens);
              ethers.utils.id("Transfer(address,address,uint256)"),
            ],
            null,
            internalTransferAddresses.map(e => '0x000000000000000000000000' + e.substring(2, 42).toLowerCase()),
            null,
          ]};
        const wethTransferToEventsEventLogs = await provider.getLogs(wethTransferToEventsfilter);
        const wethTransferToEvents = parseTokenEventLogsOld(wethTransferToEventsEventLogs, this.chainId, blockNumber);
        // console.log(now() + " INFO TradeFungibles:methods.loadData - wethTransferToEvents: " + JSON.stringify(wethTransferToEvents));

        const wethTransferFromEventsfilter = {
          address: network.weth.address, fromBlock: 0, toBlock: blockNumber,
          topics: [[
              // ERC-20 event Transfer(address indexed from, address indexed to, uint tokens);
              ethers.utils.id("Transfer(address,address,uint256)"),
              // WETH event  Deposit(address indexed dst, uint wad);
              ethers.utils.id("Deposit(address,uint256)"),
              // WETH event  Withdrawal(address indexed src, uint wad);
              ethers.utils.id("Withdrawal(address,uint256)"),
            ],
            internalTransferAddresses.map(e => '0x000000000000000000000000' + e.substring(2, 42).toLowerCase()),
            null,
            null,
          ]};
        const wethTransferFromEventsEventLogs = await provider.getLogs(wethTransferFromEventsfilter);
        const wethTransferFromEvents = parseTokenEventLogsOld(wethTransferFromEventsEventLogs, this.chainId, blockNumber);
        // console.log(now() + " INFO TradeFungibles:methods.loadData - wethTransferFromEvents: " + JSON.stringify(wethTransferFromEvents));

        const tokenTransfers = [...tokenTransferToEvents, ...tokenTransferFromEvents];
        tokenTransfers.sort((a, b) => {
          if (a.blockNumber == b.blockNumber) {
            return a.logIndex - b.logIndex;
          } else {
            return a.blockNumber - b.blockNumber;
          }
        });
        Vue.set(this.data, 'tokenTransfers', tokenTransfers);

        const wethTransfers = [...wethTransferToEvents, ...wethTransferFromEvents];
        wethTransfers.sort((a, b) => {
          if (a.blockNumber == b.blockNumber) {
            return a.logIndex - b.logIndex;
          } else {
            return a.blockNumber - b.blockNumber;
          }
        });
        Vue.set(this.data, 'wethTransfers', wethTransfers);
        // console.log(now() + " INFO TradeFungibles:methods.loadData - this.data: " + JSON.stringify(this.data));
      }
      localStorage.demodexTradeFungiblesData = JSON.stringify(this.data);

      this.computeState();
    },

    computeState() {
      // console.log(now() + " INFO TradeFungibles:methods.computeState");
      const events = {};
      const allEvents = [...this.data.tokenAgentEvents, ...this.data.tokenTransfers, ...this.data.tokenApprovals, ...this.data.wethTransfers, ...this.data.wethApprovals];
      // console.log("allEvents: " + JSON.stringify(allEvents, null, 2));
      for (const e of allEvents) {
        // console.log("e: " + JSON.stringify(e));
        if (!(e.txHash in events)) {
          events[e.txHash] = {
            chainId: e.chainId,
            blockNumber: e.blockNumber,
            txIndex: e.txIndex,
            // logIndex: e.logIndex,
            tokenAgent: null,
            // timestamp: e.timestamp || null,
            events: {},
          }
        }
        events[e.txHash].events[e.logIndex] = { ...e, chainId: undefined, txHash: undefined, blockNumber: undefined, txIndex: undefined, confirmations: undefined };
        if (e.eventType == "Traded" || e.eventType == "Offered") {
          // console.log("Traded: " + JSON.stringify(e));
          events[e.txHash].tokenAgent = e.contract;
        }
        if (events[e.txHash].timestamp == null && e.eventType != "Transfer" && e.eventType != "Approval") {
          // console.log("Traded: " + JSON.stringify(e));
          // events[e.txHash].timestamp = e.timestamp || null;
          // events[e.txHash].logIndex = e.logIndex || null;
        }
      }
      const list = [];
      for (const [txHash, d] of Object.entries(events)) {
        list.push({ blockNumber: d.blockNumber, txIndex: d.txIndex, txHash, tokenAgent: d.tokenAgent, events: d.events });
      }
      list.sort((a, b) => {
        if (a.blockNumber == b.blockNumber) {
          return a.txIndex - b.txIndex;
        } else {
          return a.blockNumber - b.blockNumber;
        }
      });

      const balanceAddressMap = {};
      for (const a of this.data.balanceAddresses) {
        balanceAddressMap[a] = 1;
      }

      const balances = {};
      const approvals = {};

      for (const l of list) {
        const logIndexes = Object.keys(l.events);
        logIndexes.sort((a, b) => {
          return a - b;
        });
        for (const logIndex of logIndexes) {
          const e = l.events[logIndex];
          if (e.eventType == "Transfer" || e.eventType == "Deposit" || e.eventType == "Withdrawal") {
            // console.log(logIndex + ". Transfer - l.tokenAgent: " + l.tokenAgent + ", from: " + e.from + ", to: " + e.to + ", tokens: " + ethers.utils.formatEther(e.tokens));
            if (e.to in balanceAddressMap) {
              if (!(e.contract in balances)) {
                balances[e.contract] = {};
              }
              if (!(e.to in balances[e.contract])) {
                balances[e.contract][e.to] = { tokens: e.tokens };
              } else {
                balances[e.contract][e.to].tokens = ethers.BigNumber.from(balances[e.contract][e.to].tokens).add(e.tokens).toString();
              }
            }
            if (e.from in balanceAddressMap) {
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
              if (l.tokenAgent != null) {
                if (approvals[e.contract] && approvals[e.contract][e.from] && approvals[e.contract][e.from][l.tokenAgent]) {
                  approvals[e.contract][e.from][l.tokenAgent].spent = ethers.BigNumber.from(approvals[e.contract][e.from][l.tokenAgent].spent).add(e.tokens).toString();
                  approvals[e.contract][e.from][l.tokenAgent].tokens = ethers.BigNumber.from(approvals[e.contract][e.from][l.tokenAgent].tokens).sub(e.tokens).toString();
                  approvals[e.contract][e.from][l.tokenAgent].spends.push({ txHash: e.txHash, logIndex: e.logIndex, tokens: e.tokens });
                }
              }
            }

          } else if (e.eventType == "Approval") {
            // console.log(logIndex + ". Approval - trade: " + trade + " " + JSON.stringify(e));
            if (!(e.contract in approvals)) {
              approvals[e.contract] = {};
            }
            if (!(e.owner in approvals[e.contract])) {
              approvals[e.contract][e.owner] = {};
            }
            approvals[e.contract][e.owner][e.spender] = { tokens: e.tokens, approvedTokens: e.tokens, txHash: e.txHash, logIndex: e.logIndex, spent: 0, spends: [] };

          } else if (e.eventType == "Offered") {
            // console.log(logIndex + ". Offered - trade: " + trade + " " + JSON.stringify(e));

          } else if (e.eventType == "Traded") {
            // console.log(logIndex + ". Traded - trade: " + trade + " " + JSON.stringify(e));

          } else {
            // console.log(logIndex + ". ELSE - trade: " + trade + " " + JSON.stringify(e));
          }
        }
      }
      // console.log("balances: " + JSON.stringify(balances, null, 2));
      // console.log("approvals: " + JSON.stringify(approvals, null, 2));
      Vue.set(this, 'events', events);
      Vue.set(this, 'balances', balances);
      Vue.set(this, 'approvals', approvals);
    },

    // viewAddSellOffer() {
    //   console.log(now() + " INFO Addresses:methods.viewAddSellOffer BEGIN");
    //   this.$refs.modaladdselloffer.show();
    // },

    // addBuyOffer() {
    //   console.log(now() + " INFO Addresses:methods.addBuyOffer TODO");
    // },

    addSellOfferRowSelected(item) {
      console.log(now() + " INFO Addresses:methods.addSellOfferRowSelected BEGIN: " + JSON.stringify(item, null, 2));
      if (item && item.length > 0) {
        if (!item[0].simulated) {
          if (this.settings.addSellOffer.selectedItem != null && this.settings.addSellOffer.selectedItem.txHash == item[0].txHash) {
            this.settings.addSellOffer.selectedItem = null;
          } else {
            this.settings.addSellOffer.selectedItem = item[0];
          }
        }
        this.$refs.addSellOfferTable.clearSelected();
        this.saveSettings();
      }
    },

    // viewOldTakeSellOffer(item) {
    //   console.log(now() + " INFO Addresses:methods.viewOldTakeSellOffer BEGIN: " + JSON.stringify(item, null, 2));
    //   if (item && item.length > 0) {
    //     this.modalSellOffer.txHash = item[0].txHash;
    //     this.modalSellOffer.logIndex = item[0].logIndex;
    //     this.modalSellOffer.maker = this.indexToAddress[item[0].owner];
    //     this.modalSellOffer.tokenAgent = this.indexToAddress[item[0].tokenAgent];
    //     this.$refs.modalselloffer.show();
    //   }
    // },

    filterSellOffersByTokenAgent(item) {
      console.log(now() + " INFO Addresses:methods.filterSellOffersByTokenAgent BEGIN: " + JSON.stringify(item, null, 2));
      if (!this.settings.sellOffers.select.tokenAgent) {
        this.settings.sellOffers.select = {
          tokenAgent: item.tokenAgent,
          owner: item.owner,
          indexByOwner: item.indexByOwner,
        };
      } else {
        this.settings.sellOffers.select = {
          tokenAgent: null,
          owner: null,
          indexByOwner: null,
        };
      }
      // console.log(now() + " INFO Addresses:methods.filterSellOffersByTokenAgent - this.settings.sellOffers.select: " + JSON.stringify(this.settings.sellOffers.select, null, 2));
    },

    resetFilterSellOffersByTokenAgent() {
      console.log(now() + " INFO Addresses:methods.resetFilterSellOffersByTokenAgent BEGIN");
      this.settings.sellOffers.select = {
        tokenAgent: null,
        owner: null,
      };
      console.log(now() + " INFO Addresses:methods.resetFilterSellOffersByTokenAgent - this.settings.sellOffers.select: " + JSON.stringify(this.settings.sellOffers.select, null, 2));
    },

    sellOffersRowSelected(item) {
      console.log(now() + " INFO Addresses:methods.sellOffersRowSelected BEGIN: " + JSON.stringify(item, null, 2));
      // if (item && item.length > 0) {
      //   if (item[0].tokenAgent != this.settings.sellOffers.select.tokenAgent) {
      //     this.settings.sellOffers.select = {
      //       tokenAgent: item[0].tokenAgent,
      //       owner: item[0].owner,
      //     };
      //   } else {
      //     this.settings.sellOffers.select = {
      //       tokenAgent: null,
      //       owner: null,
      //     };
      //   }
      // }
      // this.saveSettings();
      // this.$refs.sellOffersTable.clearSelected();
    },

    buyOffersRowSelected(item) {
      console.log(now() + " INFO Addresses:methods.buyOffersRowSelected BEGIN: " + JSON.stringify(item, null, 2));
      if (item && item.length > 0) {
        // this.modalBuyOffer = {
        //   txHash: item[0].txHash,
        //   logIndex: item[0].logIndex,
        //   maker: item[0].maker,
        //   tokenAgent: item[0].tokenAgent,
        //   tokenAgentIndexByOwner: item[0].tokenAgentIndexByOwner,
        //   offerIndex: item[0].offerIndex,
        //   priceIndex: item[0].priceIndex,
        //   price: item[0].price,
        //   tokens: item[0].token,
        //   expiry: item[0].expiry,
        //   offer: this.data.tokenAgents[item[0].tokenAgent].offers[item[0].offerIndex],
        // };
        // this.$refs.modalbuyoffer.show();
        // this.$refs.buyOffersTable.clearSelected();
      }
    },

    async deployNewTokenAgent() {
      console.log(now() + " INFO TradeFungibles:methods.deployNewTokenAgent");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = this.chainId && NETWORKS[this.chainId.toString()] || {};
      if (network.tokenAgentFactory) {
        const contract = new ethers.Contract(network.tokenAgentFactory.address, network.tokenAgentFactory.abi, provider);
        const contractWithSigner = contract.connect(provider.getSigner());
        try {
          const tx = await contractWithSigner.newTokenAgent();
          // const tx = { hash: "blah" };
          console.log(now() + " INFO TradeFungibles:methods.deployNewTokenAgent - tx: " + JSON.stringify(tx));
          const h = this.$createElement;
          const vNodesMsg = h(
            'p',
            { class: ['text-left', 'mb-0'] },
            [
              h('a', { attrs: { href: this.explorer + 'tx/' + tx.hash, target: '_blank' } }, tx.hash.substring(0, 20) + '...' + tx.hash.slice(-18)),
              h('br'),
              h('br'),
              'Resync after this tx has been included',
            ]
          );
          this.$bvToast.toast([vNodesMsg], {
            title: 'Transaction submitted',
            autoHideDelay: 5000,
          });
          this.$refs['modalnewtokenagent'].hide();
          this.settings.newTokenAgent.show = false;
          this.saveSettings();
        } catch (e) {
          console.log(now() + " ERROR TradeFungibles:methods.deployNewTokenAgent: " + JSON.stringify(e));
          this.$bvToast.toast(`${e.message}`, {
            title: 'Error!',
            autoHideDelay: 5000,
          });
        }
      }
    },

    async execAddSellOffer() {
      console.log(now() + " INFO TradeFungibles:methods.execAddSellOffer - this.settings.sellOffers: " + JSON.stringify(this.settings.sellOffers));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = this.chainId && NETWORKS[this.chainId.toString()] || {};
      if (network.demodex) {
        const contract = new ethers.Contract(network.demodex.address, network.demodex.abi, provider);
        const contractWithSigner = contract.connect(provider.getSigner());
        const prices = [];
        const tokenss = [];
        for (const [i, point] of this.settings.sellOffers.points.entries()) {
          prices.push(ethers.utils.parseEther(point.price).toString());
          tokenss.push(ethers.utils.parseUnits(point.tokens, this.tokenSet.decimals).toString());
        }

        try {
          const payload = [
            [
              this.tokenSet.token,
              1, // SELL
              this.settings.sellOffers.expiry || 0,
              prices,
              [],
              tokenss,
            ],
          ];
          // struct AddOffer {
          //     Token token;             // 160 bits
          //     BuySell buySell;         // 8 bits
          //     Unixtime expiry;         // 40 bits
          //     Price[] prices;          // token/WETH 18dp
          //     TokenId[] tokenIds;      // ERC-721/1155
          //     Tokens[] tokenss;        // ERC-20/721/1155
          // }
          // function addOffers(AddOffer[] calldata inputs) external onlyOwner {
          console.log(now() + " INFO TradeFungibles:methods.execAddSellOffer - payload: " + JSON.stringify(payload));
          const tx = await contractWithSigner.addOffers(payload);
          // const tx = { hash: "blah" };
          console.log(now() + " INFO TradeFungibles:methods.execAddSellOffer - tx: " + JSON.stringify(tx));
          const h = this.$createElement;
          const vNodesMsg = h(
            'p',
            { class: ['text-left', 'mb-0'] },
            [
              h('a', { attrs: { href: this.explorer + 'tx/' + tx.hash, target: '_blank' } }, tx.hash.substring(0, 20) + '...' + tx.hash.slice(-18)),
              h('br'),
              h('br'),
              'Resync after this tx has been included',
            ]
          );
          this.$bvToast.toast([vNodesMsg], {
            title: 'Transaction submitted',
            autoHideDelay: 5000,
          });
          // this.$refs['modalnewtokenagent'].hide();
          // this.settings.newTokenAgent.show = false;
          // this.saveSettings();
        } catch (e) {
          console.log(now() + " ERROR TradeFungibles:methods.execAddSellOffer: " + JSON.stringify(e));
          this.$bvToast.toast(`${e.message}`, {
            title: 'Error!',
            autoHideDelay: 5000,
          });
        }
      }
    },

    async execAddBuyOffer() {
      console.log(now() + " INFO TradeFungibles:methods.execAddBuyOffer - this.settings.sellOffers: " + JSON.stringify(this.settings.sellOffers));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = this.chainId && NETWORKS[this.chainId.toString()] || {};
      if (network.demodex) {
        const contract = new ethers.Contract(network.demodex.address, network.demodex.abi, provider);
        const contractWithSigner = contract.connect(provider.getSigner());
        const prices = [];
        const tokenss = [];
        for (const [i, point] of this.settings.buyOffers.points.entries()) {
          prices.push(ethers.utils.parseEther(point.price).toString());
          tokenss.push(ethers.utils.parseUnits(point.tokens, this.tokenSet.decimals).toString());
        }

        try {
          const payload = [
            [
              this.tokenSet.token,
              0, // BUY
              this.settings.buyOffers.expiry || 0,
              prices,
              [],
              tokenss,
            ],
          ];
          // struct AddOffer {
          //     Token token;             // 160 bits
          //     BuySell buySell;         // 8 bits
          //     Unixtime expiry;         // 40 bits
          //     Price[] prices;          // token/WETH 18dp
          //     TokenId[] tokenIds;      // ERC-721/1155
          //     Tokens[] tokenss;        // ERC-20/721/1155
          // }
          // function addOffers(AddOffer[] calldata inputs) external onlyOwner {
          console.log(now() + " INFO TradeFungibles:methods.execAddBuyOffer - payload: " + JSON.stringify(payload));
          const tx = await contractWithSigner.addOffers(payload);
          // const tx = { hash: "blah" };
          console.log(now() + " INFO TradeFungibles:methods.execAddBuyOffer - tx: " + JSON.stringify(tx));
          const h = this.$createElement;
          const vNodesMsg = h(
            'p',
            { class: ['text-left', 'mb-0'] },
            [
              h('a', { attrs: { href: this.explorer + 'tx/' + tx.hash, target: '_blank' } }, tx.hash.substring(0, 20) + '...' + tx.hash.slice(-18)),
              h('br'),
              h('br'),
              'Resync after this tx has been included',
            ]
          );
          this.$bvToast.toast([vNodesMsg], {
            title: 'Transaction submitted',
            autoHideDelay: 5000,
          });
          // this.$refs['modalnewtokenagent'].hide();
          // this.settings.newTokenAgent.show = false;
          // this.saveSettings();
        } catch (e) {
          console.log(now() + " ERROR TradeFungibles:methods.execAddBuyOffer: " + JSON.stringify(e));
          this.$bvToast.toast(`${e.message}`, {
            title: 'Error!',
            autoHideDelay: 5000,
          });
        }
      }
    },

    async addOffer() {
      console.log(now() + " INFO TradeFungibles:methods.addOffer - settings.addOffers: " + JSON.stringify(this.settings.addOffers, null, 2));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = NETWORKS['' + this.chainId] || {};
      const contract = new ethers.Contract(this.settings.tokenAgentAddress, network.tokenAgent.abi, provider);
      const contractWithSigner = contract.connect(provider.getSigner());
      if (network.tokenAgentFactory) {
        if (this.settings.addOffers.type == 20) {
          let prices = [];
          let tokens = [];
          if (this.settings.addOffers.pricing == 0) {
            console.log(now() + " INFO TradeFungibles:methods.addOffer - ERC-20 Single price without limit - price: " + this.settings.addOffers.price);
            prices = [ethers.utils.parseUnits(this.settings.addOffers.price, 18).toString()];
          } else if (this.settings.addOffers.pricing == 1) {
            console.log(now() + " INFO TradeFungibles:methods.addOffer - ERC-20 Single price with limit - price: " + this.settings.addOffers.price + ", tokens: " + this.settings.addOffers.tokens);
            prices = [ethers.utils.parseUnits(this.settings.addOffers.price, 18).toString()];
            tokens = [ethers.utils.parseUnits(this.settings.addOffers.tokens, this.settings.addOffers.decimals).toString()];
          } else {
            console.log(now() + " INFO TradeFungibles:methods.addOffer - ERC-20 Multiple prices with limits - UNSUPPORTED");
          }
          if (prices.length > 0) {
            const payload = [
              [
                this.settings.addOffers.token,
                parseInt(this.settings.addOffers.buySell),
                "2041432206", // Sat Sep 09 2034 16:30:06 GMT+0000
                0,
                prices,
                [],
                tokens,
              ],
            ];
            try {
              console.log(now() + " INFO TradeFungibles:methods.addOffer - payload: " + JSON.stringify(payload));
              const tx = await contractWithSigner.addOffers(payload, { gasLimit: 500000 });
              console.log(now() + " INFO TradeFungibles:methods.addOffer - tx: " + JSON.stringify(tx));
              const h = this.$createElement;
              const vNodesMsg = h(
                'p',
                { class: ['text-left', 'mb-0'] },
                [
                  h('a', { attrs: { href: this.explorer + 'tx/' + tx.hash, target: '_blank' } }, tx.hash.substring(0, 20) + '...' + tx.hash.slice(-18)),
                  h('br'),
                  h('br'),
                  'Resync after this tx has been included',
                ]
              );
              this.$bvToast.toast([vNodesMsg], {
                title: 'Transaction submitted',
                autoHideDelay: 5000,
              });
            } catch (e) {
              console.log(now() + " ERROR TradeFungibles:methods.addOffer: " + JSON.stringify(e));
              this.$bvToast.toast(`${e.message}`, {
                title: 'Error!',
                autoHideDelay: 5000,
              });
            }
          }
        } else {
          console.log(now() + " INFO TradeFungibles:methods.addOffer - ERC-721/1155 - UNSUPPORTED");
        }
      }
    },

    formatExpiry(e) {
      if (e == 0) {
        return "n/a";
      } else {
        const s = e - moment().unix();
        if (s >= (365 * 24 * 60 * 60)) {
          const years = parseInt(s / (365 * 24 * 60 * 60));
          return years + "y";
        } else if (s >= (30 * 24 * 60 * 60)) {
          const months = parseInt(s / (30 * 24 * 60 * 60));
          return months + "mo";
        } else if (s >= (24 * 60 * 60)) {
          const days = parseInt(s / (24 * 60 * 60));
          return days + "d";
        } else if (s >= (60 * 60)) {
          const hours = parseInt(s / (60 * 60));
          return hours + "h";
        } else if (s >= 60) {
          const minutes = parseInt(s / 60);
          return minutes + "mi";
        } else if (s >= 0) {
          return parseInt(s) + "s";
        } else {
          return "sim";
        }
      }
    },
    formatTimestamp(ts) {
      if (ts != null) {
        // if (this.settings.reportingDateTime == 1) {
        //   return moment.unix(ts).utc().format("YYYY-MM-DD HH:mm:ss");
        // } else {
          return moment.unix(ts).format("YYYY-MM-DD HH:mm:ss");
        // }
      }
      return null;
    },
    formatTimestampUTC(ts) {
      if (ts != null) {
        // if (this.settings.reportingDateTime == 1) {
        //   return moment.unix(ts).utc().format("YYYY-MM-DD HH:mm:ss");
        // } else {
          return moment.unix(ts).utc().toString(); // format("YYYY-MM-DD HH:mm:ss");
        // }
      }
      return null;
    },
    formatPrice(e) {
      // console.log("formatPrice: " + e + ", this.settings.config.priceDisplayDecimals: " + this.settings.config.priceDisplayDecimals);
      // if (this.settings.config.priceDisplayDecimals <= 9) {
      return e ? parseFloat(ethers.utils.formatUnits(e, 18).toString()).toFixed(this.settings.config.priceDisplayDecimals) : null;
      // } else {
      //   e = "10123456789012345";
      //   const p = ethers.utils.formatUnits(e, 18);
      //   console.log("p: " + p.toString());
      //   if (this.settings.config.priceDisplayDecimals != 18) {
      //     const p1 = ethers.utils.parseUnits(p, this.settings.config.priceDisplayDecimals);
      //     console.log("p1: " + p1.toString());
      //   }
      //   return e ? 'y' + ethers.utils.formatUnits(e, 18) : null;
      // }
    },
    formatTokens(e) {
      if (e) {
        let p = ethers.FixedNumber.from(ethers.utils.formatUnits(e, this.settings.decimals)).round(this.settings.config.tokenDisplayDecimals).toString();
        const dotPosition = p.indexOf('.');
        if (dotPosition >= 0) {
          const decimals = p.length - dotPosition - 1;
          for (let i = 0; i < (this.settings.config.tokenDisplayDecimals - decimals); i++) {
            p = p + "0";
          }
        }
        return p;
      }
      return null;
    },
    formatWeth(e) {
      if (e) {
        let p = ethers.FixedNumber.from(ethers.utils.formatUnits(e, 18)).round(this.settings.config.wethDisplayDecimals).toString();
        const dotPosition = p.indexOf('.');
        if (dotPosition >= 0) {
          const decimals = p.length - dotPosition - 1;
          for (let i = 0; i < (this.settings.config.wethDisplayDecimals - decimals); i++) {
            p = p + "0";
          }
        }
        return p;
      }
      return null;
    },
    formatDecimals(e, decimals = 18) {
      return e ? ethers.utils.formatUnits(e, decimals).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : null;
    },
    formatNumber(n) {
      return n == null ? "" : n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    },
    bigNumberMultiply(price, tokens) {
      try {
        const bPrice = ethers.utils.parseEther(price);
        const bTokens = ethers.utils.parseUnits(tokens, this.settings.decimals);
        return ethers.utils.formatUnits(bPrice.mul(bTokens).div(ethers.BigNumber.from("1000000000000000000")), this.settings.decimals).toString();
      } catch (e) {
      }
      return 0;
    },
    validNumber(n, d) {
      if (n && d != null) {
        // console.log(now() + " DEBUG TradeFungibles:methods.validNumber - n: " + n + ", d: " + d);
        try {
          const n_ = ethers.utils.parseUnits(n, d);
          // console.log(now() + " DEBUG TradeFungibles:methods.validNumber - n_: " + n_.toString());
          return true;
        } catch (e) {
        }
      }
      return false;
    },

    validAddress(a) {
      if (a) {
        try {
          const address = ethers.utils.getAddress(a);
          return true;
        } catch (e) {
        }
      }
      return false;
    },
    saveSettings() {
      // console.log(now() + " INFO TradeFungibles:methods.saveSettings - tokenAgentAgentSettings: " + JSON.stringify(this.settings, null, 2));
      localStorage.demodexTradeFungiblesSettings = JSON.stringify(this.settings);
    },
    async viewSyncOptions() {
      store.dispatch('syncOptions/viewSyncOptions');
    },
    async halt() {
      store.dispatch('data/setSyncHalt', true);
    },
    newTransfer(stealthMetaAddress = null) {
      console.log(now() + " INFO TradeFungibles:methods.newTransfer - stealthMetaAddress: " + stealthMetaAddress);
      store.dispatch('newTransfer/newTransfer', stealthMetaAddress);
    },
    async timeoutCallback() {
      // console.log(now() + " DEBUG TradeFungibles:methods.timeoutCallback - count: " + this.count);
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
    // console.log(now() + " DEBUG TradeFungibles:beforeDestroy");
  },
  mounted() {
    // console.log(now() + " DEBUG TradeFungibles:mounted - $route: " + JSON.stringify(this.$route.params));
    store.dispatch('data/restoreState');
    if ('demodexTradeFungiblesSettings' in localStorage) {
      const tempSettings = JSON.parse(localStorage.demodexTradeFungiblesSettings);
      if ('version' in tempSettings && tempSettings.version == this.settings.version) {
        this.settings = tempSettings;
        // this.settings.currentPage = 1;
        if ('demodexTradeFungiblesData' in localStorage) {
          this.data = JSON.parse(localStorage.demodexTradeFungiblesData);
          this.computeState();
        }
      }
      // this.loadData(this.settings.tokenAgentAddress);
    }
    this.reschedule = true;
    // console.log(now() + " DEBUG TradeFungibles:mounted - calling timeoutCallback()");
    this.timeoutCallback();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const tradeFungiblesModule = {
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
};
