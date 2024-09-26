const Agent = {
  template: `
    <div class="m-0 p-0">
      <b-card no-body no-header class="border-0">

        <b-tabs card v-model="settings.tabIndex" @input="saveSettings();" content-class="mt-0" align="left">
          <template #tabs-start>
            <div class="d-flex flex-wrap m-0 p-0">
              <div class="mt-0 pr-0" style="width: 24.0rem;">
                <b-form-group :state="!settings.tokenAgentAddress || validAddress(settings.tokenAgentAddress)" :invalid-feedback="'Invalid address'" class="m-0 p-0">
                  <b-form-input type="text" size="sm" id="explorer-tokenAgentAddress" v-model="settings.tokenAgentAddress" @change="saveSettings(); loadData(settings.contract);" placeholder="Token agent address, or select from dropdown"></b-form-input>
                </b-form-group>
              </div>
              <!-- TODO WIP -->
              <!-- <div class="mt-0 pr-1">
                <b-button size="sm" @click="showModalAddTokenContract" variant="link" v-b-popover.hover.ds500="'WIP: Search for token contracts'"><b-icon-search shift-v="+0" font-scale="1.2"></b-icon-search></b-button>
              </div> -->
              <div class="mt-0 pr-0">
                <b-dropdown size="sm" id="dropdown-left" text="" variant="link" v-b-popover.hover.ds500="'Existing Token Agents'" class="m-0 ml-1 p-0">
                  <b-dropdown-item v-if="tokenAgentsDropdownOptions.length == 0" disabled>No Token Agents contracts on this network</b-dropdown-item>
                  <div v-for="(item, index) of tokenAgentsDropdownOptions" v-bind:key="index">
                    <!-- <b-dropdown-item @click="settings.tokenAgentAddress = item.tokenAgent; saveSettings(); loadData(settings.contract);">{{ index }}. {{ 'ERC-' + item.type }} {{ item.contract.substring(0, 8) + '...' + item.contract.slice(-6) + ' ' + item.name }}</b-dropdown-item> -->
                    <b-dropdown-item @click="settings.tokenAgentAddress = indexToAddress[item.tokenAgent]; settings.tokenAgentOwner = indexToAddress[item.owner]; saveSettings(); loadData(settings.tokenAgentAddress);">{{ index }}. {{ indexToAddress[item.tokenAgent].substring(0, 8) + '...' + indexToAddress[item.tokenAgent].slice(-6) + ' ' + indexToAddress[item.owner].substring(0, 8) + '...' + indexToAddress[item.owner].slice(-6) }}</b-dropdown-item>
                  </div>
                </b-dropdown>
              </div>
              <div class="mt-0 pr-1">
                <b-button size="sm" :disabled="!validAddress(settings.tokenAgentAddress)" :href="explorer + 'address/' + settings.tokenAgentAddress + '#code'" variant="link" v-b-popover.hover.ds500="'View in explorer'" target="_blank" class="m-0 ml-2 mr-2 p-0"><b-icon-link45deg shift-v="-1" font-scale="1.2"></b-icon-link45deg></b-button>
              </div>
              <div class="mt-0 pr-1">
                <b-button size="sm" :disabled="!networkSupported || sync.completed != null || !validAddress(settings.tokenAgentAddress)" @click="loadData(settings.tokenAgentAddress);" variant="primary">Retrieve</b-button>
              </div>
              <!-- <div class="mt-0 pr-1">
                <b-button :disabled="!settings.contract || !validAddress(settings.contract)" @click="copyToClipboard(settings.contract);" variant="link" v-b-popover.hover.ds500="'Copy ERC-20 contract address to clipboard'" class="m-0 ml-2 p-0"><b-icon-clipboard shift-v="+1" font-scale="1.1"></b-icon-clipboard></b-button>
              </div> -->
              <div class="mt-0 pr-1" style="width: 23.0rem;">
                <font size="-1">
                  <b-link :href="explorer + 'address/' + settings.tokenAgentOwner" v-b-popover.hover.ds500="'Token Agent owner ' + settings.tokenAgentOwner" target="_blank">
                    <b-badge v-if="settings.tokenAgentOwner" variant="link" class="m-0 mt-1">
                      {{ settings.tokenAgentOwner.substring(0, 10) + '...' + settings.tokenAgentOwner.slice(-8) }}
                    </b-badge>
                  </b-link>
                  <b-badge variant="light" v-b-popover.hover.ds500="'Nonce'" class="m-0 mt-1">
                    {{ nonce }}
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
            </div>
          </template>
          <b-tab no-body active>
            <template #title>
              <span v-b-popover.hover.ds500="'Token Agent offers'">Offers</span>
            </template>
          </b-tab>
          <b-tab no-body>
            <template #title>
              <span v-b-popover.hover.ds500="'Token Agent events'">Events</span>
            </template>
          </b-tab>
          <b-tab no-body>
            <template #title>
              <span v-b-popover.hover.ds500="'Token Contract Approvals to this Token Agent'">Approvals</span>
            </template>
          </b-tab>
          <b-tab no-body>
            <template #title>
              <span v-b-popover.hover.ds500="'Raw command console'">Console</span>
            </template>
          </b-tab>
        </b-tabs>

        <div v-if="settings.tabIndex == 0 || settings.tabIndex == 1 || settings.tabIndex == 2" class="d-flex flex-wrap m-0 mt-1 p-0">
          <div class="mt-0 flex-grow-1">
          </div>
          <div v-if="false && sync.section == null" class="mt-0 pr-1">
            <b-button size="sm" :disabled="!networkSupported" @click="viewSyncOptions" variant="link" v-b-popover.hover.ds500="'Sync data from the blockchain'"><b-icon-arrow-repeat shift-v="+1" font-scale="1.2"></b-icon-arrow-repeat></b-button>
          </div>
          <div v-if="false && sync.section != null" class="mt-1" style="width: 300px;">
            <b-progress height="1.5rem" :max="sync.total" show-progress :animated="sync.section != null" :variant="sync.section != null ? 'success' : 'secondary'" v-b-popover.hover.ds500="'Click the button on the right to stop. This process can be continued later'">
              <b-progress-bar :value="sync.completed">
                {{ sync.total == null ? (sync.completed + ' ' + sync.section) : (sync.completed + '/' + sync.total + ' ' + ((sync.completed / sync.total) * 100).toFixed(0) + '% ' + sync.section) }}
              </b-progress-bar>
            </b-progress>
          </div>
          <div v-if="false" class="ml-0 mt-1">
            <b-button v-if="sync.section != null" size="sm" @click="halt" variant="link" v-b-popover.hover.ds500="'Click to stop. This process can be continued later'"><b-icon-stop-fill shift-v="+1" font-scale="1.0"></b-icon-stop-fill></b-button>
          </div>
          <div class="mt-0 flex-grow-1">
          </div>
          <div v-if="false" class="mt-0 pr-1">
            <b-button size="sm" :disabled="!transferHelper" @click="newTransfer(null); " variant="link" v-b-popover.hover.ds500="'New Stealth Transfer'"><b-icon-caret-right shift-v="+1" font-scale="1.1"></b-icon-caret-right></b-button>
          </div>
          <div class="mt-0 flex-grow-1">
          </div>
          <div class="mt-0 pr-1">
            <div v-if="settings.tabIndex == 0">
              <b-form-select size="sm" v-model="settings.offers.sortOption" @change="saveSettings" :options="sortOptions" v-b-popover.hover.ds500="'Yeah. Sort'"></b-form-select>
            </div>
            <div v-else-if="settings.tabIndex == 1">
              <b-form-select size="sm" v-model="settings.events.sortOption" @change="saveSettings" :options="sortOptions" v-b-popover.hover.ds500="'Yeah. Sort'"></b-form-select>
            </div>
            <div v-else>
              <b-form-select size="sm" v-model="settings.approvals.sortOption" @change="saveSettings" :options="sortOptions" v-b-popover.hover.ds500="'Yeah. Sort'"></b-form-select>
            </div>
          </div>
          <div class="mt-0 pr-1">
            <div v-if="settings.tabIndex == 0">
              <font size="-2" v-b-popover.hover.ds500="'# filtered / all entries'">{{ filteredSortedOffers.length + '/' + offers.length }}</font>
            </div>
            <div v-else-if="settings.tabIndex == 1">
              <font size="-2" v-b-popover.hover.ds500="'# filtered / all entries'">{{ filteredSortedEvents.length + '/' + events.length }}</font>
            </div>
            <div v-else>
              <font size="-2" v-b-popover.hover.ds500="'# filtered / all entries'">{{ filteredSortedApprovals.length + '/' + approvals.length }}</font>
            </div>
          </div>
          <div class="mt-0 pr-1">
            <div v-if="settings.tabIndex == 0">
              <b-pagination size="sm" v-model="settings.offers.currentPage" @input="saveSettings" :total-rows="filteredSortedOffers.length" :per-page="settings.offers.pageSize" style="height: 0;"></b-pagination>
            </div>
            <div v-else-if="settings.tabIndex == 1">
              <b-pagination size="sm" v-model="settings.events.currentPage" @input="saveSettings" :total-rows="filteredSortedEvents.length" :per-page="settings.events.pageSize" style="height: 0;"></b-pagination>
            </div>
            <div v-else>
              <b-pagination size="sm" v-model="settings.approvals.currentPage" @input="saveSettings" :total-rows="filteredSortedApprovals.length" :per-page="settings.approvals.pageSize" style="height: 0;"></b-pagination>
            </div>
          </div>
          <div class="mt-0 pl-1">
            <div v-if="settings.tabIndex == 0">
              <b-form-select size="sm" v-model="settings.offers.pageSize" @change="saveSettings" :options="pageSizes" v-b-popover.hover.ds500="'Page size'"></b-form-select>
            </div>
            <div v-else-if="settings.tabIndex == 1">
              <b-form-select size="sm" v-model="settings.events.pageSize" @change="saveSettings" :options="pageSizes" v-b-popover.hover.ds500="'Page size'"></b-form-select>
            </div>
            <div v-else>
              <b-form-select size="sm" v-model="settings.approvals.pageSize" @change="saveSettings" :options="pageSizes" v-b-popover.hover.ds500="'Page size'"></b-form-select>
            </div>
          </div>
        </div>

        <!-- Offers -->
        <b-card v-if="settings.tabIndex == 0" class="m-0 p-0 border-0" body-class="m-0 p-0">
          <!-- <b-table ref="offersTable" small fixed striped responsive hover :fields="fields" :items="pagedFilteredSortedItems" show-empty head-variant="light" class="m-0 mt-1"> -->
          <b-table ref="offersTable" small fixed striped responsive hover :fields="offersFields" :items="pagedFilteredSortedOffers" show-empty head-variant="light" class="m-0 mt-1">
            <template #cell(number)="data">
              <font size="-1">
                {{ parseInt(data.index) + ((settings.currentPage - 1) * settings.pageSize) + 1 }}
              </font>
            </template>
            <template #cell(when)="data">
              <font size="-1">
                <b-link size="sm" :href="explorer + 'tx/' + data.item.txHash + '#eventlog#' + data.item.logIndex" variant="link" v-b-popover.hover.ds500="data.item.blockNumber + ':' + data.item.txIndex + '.' + data.item.logIndex" target="_blank">
                  {{ formatTimestamp(data.item.timestamp) }}
                </b-link>
              </font>
              <!-- <b-link size="sm" :href="explorer + 'tx/' + data.item.txHash + '#eventlog#' + data.item.logIndex" variant="link" v-b-popover.hover.ds500="(timestamps[chainId] && timestamps[chainId][data.item.blockNumber]) ? ('Block ' + formatNumber(data.item.blockNumber)) : 'blockNumber:txIndex'" target="_blank">
                <span v-if="timestamps[chainId] && timestamps[chainId][data.item.blockNumber]">
                  {{ formatTimestamp(timestamps[chainId][data.item.blockNumber]) }}
                </span>
                <span v-else>
                  {{ data.item.blockNumber + ':' + data.item.txIndex }}
                </span>
              </b-link> -->
            </template>
            <template #cell(token)="data">
              <font size="-1">
                <b-link size="sm" :href="explorer + 'token/' + data.item.token" variant="link" v-b-popover.hover.ds500="data.item.token" target="_blank">
                  {{ data.item.token.substring(0, 10) + '...' + data.item.token.slice(-8) }}
                </b-link>
              </font>
            </template>
            <template #cell(tokenType)="data">
              <font size="-1">
                <!-- <b-badge variant="light" class="m-0 p-0"> -->
                  {{ data.item.tokenType == 1 ? 'ERC-20' : (data.item.tokenType == 2 ? 'ERC-721' : 'ERC-1155') }}
                <!-- </b-badge> -->
              </font>
            </template>
            <template #cell(buySell)="data">
              <font size="-1">
                {{ data.item.buySell == 0 ? 'Buy' : 'Sell' }}
              </font>
            </template>
            <template #cell(price)="data">
              <div v-if="data.item.tokenType == 1">
                <font size="-1">
                  <div v-if="data.item.tokenss.length == 0">
                    {{ formatDecimals(data.item.prices[0], 18) }}
                  </div>
                  <div v-else>
                    <span v-for="(tokens, index) of data.item.tokenss" v-bind:key="index">
                      {{ formatDecimals(tokens, 18) }} @ {{ formatDecimals(data.item.prices[index], 18) }}
                    </span>
                  </div>
                </font>
              </div>
              <div v-else>
                <font size="-2"><pre>
{{ JSON.stringify(data.item, null, 2) }}
                </pre></font>
              </div>
            </template>
            <template #cell(expiry)="data">
              <font size="-1">
                {{ data.item.expiry == 0 ? '(no expiry)' : formatTimestamp(data.item.expiry) }}
              </font>
            </template>
            <template #cell(nonce)="data">
              <font size="-1">
                <div v-if="data.item.nonce < nonce" v-b-popover.hover.ds500="'Invalidated. Latest nonce is ' + nonce">
                  <strike>{{ data.item.nonce }}</strike>
                </div>
                <div v-else>
                  {{ data.item.nonce }}
                </div>
              </font>
            </template>
          </b-table>
        </b-card>

        <!-- Events -->
        <b-card v-if="settings.tabIndex == 1" class="m-0 p-0 border-0" body-class="m-0 p-0">
          <b-table ref="offersTable" small fixed striped responsive hover :fields="eventsFields" :items="pagedFilteredSortedEvents" show-empty head-variant="light" class="m-0 mt-1">
            <template #cell(number)="data">
              <font size="-1">
                {{ parseInt(data.index) + ((settings.currentPage - 1) * settings.pageSize) + 1 }}
              </font>
            </template>
            <template #cell(when)="data">
              <font size="-1">
                <b-link size="sm" :href="explorer + 'tx/' + data.item.txHash + '#eventlog#' + data.item.logIndex" variant="link" v-b-popover.hover.ds500="data.item.blockNumber + ':' + data.item.txIndex + '.' + data.item.logIndex" target="_blank">
                  {{ formatTimestamp(data.item.timestamp) }}
                </b-link>
              </font>
            </template>
            <template #cell(eventType)="data">
              <font size="-1">
                <!-- <b-badge variant="light" class="m-0 p-0"> -->
                  {{ data.item.eventType }}
                <!-- </b-badge> -->
              </font>
            </template>
            <template #cell(token)="data">
              <font v-if="data.item.token" size="-1">
                <b-link size="sm" :href="explorer + 'token/' + data.item.token" variant="link" v-b-popover.hover.ds500="data.item.token" target="_blank">
                  {{ data.item.token.substring(0, 10) + '...' + data.item.token.slice(-8) }}
                </b-link>
              </font>
            </template>
            <template #cell(taker)="data">
              <font v-if="data.item.taker" size="-1">
                <b-link size="sm" :href="explorer + 'address/' + data.item.taker" variant="link" v-b-popover.hover.ds500="data.item.taker" target="_blank">
                  {{ data.item.taker.substring(0, 10) + '...' + data.item.taker.slice(-8) }}
                </b-link>
              </font>
            </template>
            <template #cell(maker)="data">
              <font v-if="data.item.maker" size="-1">
                <b-link size="sm" :href="explorer + 'address/' + data.item.maker" variant="link" v-b-popover.hover.ds500="data.item.maker" target="_blank">
                  {{ data.item.maker.substring(0, 10) + '...' + data.item.maker.slice(-8) }}
                </b-link>
              </font>
            </template>
            <template #cell(info)="data">
              <div v-if="data.item.eventType == 'Offered'">
                <font size="-1">
                  index: {{ data.item.index }},
                  type: {{ data.item.tokenType == 1 ? 'ERC-20' : (data.item.tokenType == 2 ? 'ERC-721' : 'ERC-1155') }},
                  buySell: {{ data.item.buySell == 0 ? 'Buy' : 'Sell' }},
                  expiry: {{ data.item.expiry == 0 ? '(no expiry)' : formatTimestamp(data.item.expiry) }},
                  count: {{ data.item.count }},
                  nonce: {{ data.item.nonce }},
                  prices: [{{ data.item.prices.map(e => formatDecimals(e, 18)).join(', ') }}]
                  tokenIds: [{{ data.item.tokenIds.map(e => parseInt(e)).join(', ') }}]
                  tokenss: [{{ data.item.tokenss.map(e => formatDecimals(e, 18)).join(', ') }}]
                </font>
              </div>
              <div v-else-if="data.item.eventType == 'OffersInvalidated'">
                <font size="-1">
                  newNonce: {{ data.item.newNonce }}
                </font>
                <!-- <font size="-2"><pre>
{{ JSON.stringify(data.item, null, 2) }}
                </pre></font> -->
              </div>
            </template>
          </b-table>
        </b-card>

        <!-- Approvals -->
        <b-card v-if="settings.tabIndex == 2" class="m-0 p-0 border-0" body-class="m-0 p-0">
          <b-table ref="approvalsTable" small fixed striped responsive hover :fields="approvalsFields" :items="pagedFilteredSortedApprovals" show-empty head-variant="light" class="m-0 mt-1">
            <template #cell(number)="data">
              <font size="-1">
                {{ parseInt(data.index) + ((settings.currentPage - 1) * settings.pageSize) + 1 }}
              </font>
            </template>
            <template #cell(when)="data">
              <font size="-1">
                <b-link size="sm" :href="explorer + 'tx/' + data.item.txHash + '#eventlog#' + data.item.logIndex" variant="link" v-b-popover.hover.ds500="data.item.txHash" target="_blank">
                  <!-- {{ formatTimestamp(data.item.timestamp) }} -->
                  {{ data.item.blockNumber + ':' + data.item.txIndex + '.' + data.item.logIndex }}
                </b-link>
              </font>
            </template>
            <template #cell(contract)="data">
              <font size="-1">
                <b-link size="sm" :href="explorer + 'contract/' + data.item.contract" variant="link" v-b-popover.hover.ds500="data.item.contract" target="_blank">
                  {{ data.item.contract.substring(0, 10) + '...' + data.item.contract.slice(-8) }}
                </b-link>
              </font>
            </template>
            <template #cell(eventType)="data">
              <font size="-1">
                {{ data.item.eventType }}
              </font>
            </template>
            <template #cell(owner)="data">
              <font size="-1">
                <b-link size="sm" :href="explorer + 'address/' + data.item.owner" variant="link" v-b-popover.hover.ds500="data.item.owner" target="_blank">
                  {{ data.item.owner.substring(0, 10) + '...' + data.item.owner.slice(-8) }}
                </b-link>
              </font>
            </template>
            <template #cell(spenderOperator)="data">
              <font size="-1">
                <div v-if="data.item.spender">
                  <b-link size="sm" :href="explorer + 'address/' + data.item.spender" variant="link" v-b-popover.hover.ds500="data.item.spender" target="_blank">
                    {{ (data.item.spender.substring(0, 10) + '...' + data.item.spender.slice(-8)) }}
                  </b-link>
                </div>
                <div v-else-if="data.item.operator">
                  <b-link size="sm" :href="explorer + 'address/' + data.item.operator" variant="link" v-b-popover.hover.ds500="data.item.operator" target="_blank">
                    {{ (data.item.operator.substring(0, 10) + '...' + data.item.operator.slice(-8)) }}
                  </b-link>
                </div>
              </font>
            </template>
            <template #cell(tokensApproved)="data">
              <font size="-1">
                <div v-if="data.item.tokens">
                  {{ formatDecimals(data.item.tokens, 18) }}
                </div>
                <div v-else-if="data.item.approved">
                  {{ data.item.approved }}
                </div>
              </font>
              <!-- <font size="-2"><pre>
{{ JSON.stringify(data.item, null, 2) }}
              </pre></font> -->
            </template>
          </b-table>
        </b-card>

        <b-card v-if="settings.tabIndex == 3" class="m-0 p-0 border-0" body-class="m-0 p-2">
          <b-card bg-variant="light">
            <b-form-group label-cols-lg="2" label="Add Offers" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0">

              <b-form-group label="Token:" label-for="addoffers-token" label-size="sm" label-cols-sm="3" label-align-sm="right" :state="!settings.addOffers.token || validAddress(settings.addOffers.token)" :invalid-feedback="'Invalid address'" :description="settings.addOffers.token && validAddress(settings.addOffers.token) && settings.addOffers.type && ('ERC-' + settings.addOffers.type + ' ' + settings.addOffers.symbol) || 'Enter address'" class="mx-0 my-1 p-0">
                <b-input-group style="width: 28.0rem;">
                  <b-form-input size="sm" id="addoffers-token" v-model.trim="settings.addOffers.token" @change="saveSettings" placeholder="Token address, or select from dropdown"></b-form-input>
                  <b-input-group-append>
                    <b-dropdown size="sm" id="dropdown-left" text="" variant="link" v-b-popover.hover.ds500="'Token contracts'" class="m-0 ml-1 p-0">
                      <b-dropdown-item v-if="tokenContractsDropdownOptions.length == 0" disabled>No Token contracts with transfers permitted</b-dropdown-item>
                      <div v-for="(item, index) of tokenContractsDropdownOptions" v-bind:key="index">
                        <b-dropdown-item @click="settings.addOffers.token = item.tokenContract; settings.addOffers.type = item.type; settings.addOffers.symbol = item.symbol; settings.addOffers.decimals = item.decimals; saveSettings();">{{ index }}. {{ item.tokenContract.substring(0, 8) + '...' + item.tokenContract.slice(-6) + ' ' + item.symbol + ' ' + item.name + ' ' + (item.decimals != null ? parseInt(item.decimals) : '') }}</b-dropdown-item>
                      </div>
                    </b-dropdown>
                    <b-button size="sm" :disabled="!validAddress(settings.addOffers.token)" :href="explorer + 'token/' + settings.addOffers.token" variant="link" v-b-popover.hover.ds500="'View in explorer'" target="_blank" class="m-0 mt-1 ml-2 mr-2 p-0"><b-icon-link45deg shift-v="-1" font-scale="1.2"></b-icon-link45deg></b-button>
                    <!-- <font size="-1">
                      <b-badge v-if="settings.addOffers.type" variant="light" class="mt-2" v-b-popover.hover.ds500="'ERC-20/721/1155'">{{ 'ERC-' + settings.addOffers.type }}</b-badge>
                    </font> -->
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>

              <b-form-group label="Buy/Sell:" label-for="addoffers-buysell" label-size="sm" label-cols-sm="3" label-align-sm="right" class="mx-0 my-1 p-0">
                <b-form-select size="sm" id="addoffers-buysell" v-model="settings.addOffers.buySell" @change="saveSettings" :options="buySellOptions" v-b-popover.hover.ds500="'Owner BUY or SELL'" class="w-25"></b-form-select>
              </b-form-group>
              <b-form-group v-if="settings.addOffers.type == 721 || settings.addOffers.type == 1155" label="Count:" label-for="addoffers-count" label-size="sm" label-cols-sm="3" label-align-sm="right" class="mx-0 my-1 p-0">
                <b-form-input size="sm" type="number" id="addoffers-count" v-model.trim="settings.addOffers.count" @change="saveSettings" class="w-25"></b-form-input>
              </b-form-group>

              <b-form-group v-if="settings.addOffers.type == 20" label="Pricing:" label-for="addoffers-pricing" label-size="sm" label-cols-sm="3" label-align-sm="right" class="mx-0 my-1 p-0">
                <b-form-select size="sm" id="addoffers-pricing" v-model="settings.addOffers.pricing" @change="saveSettings" :options="pricing20Options" v-b-popover.hover.ds500="'Single or multiple prices and/or limits'" class="w-25"></b-form-select>
              </b-form-group>

              <b-form-group v-if="settings.addOffers.type == 20 && settings.addOffers.pricing < 2" label="Price:" label-for="addoffers-price" label-size="sm" label-cols-sm="3" label-align-sm="right" :state="!settings.addOffers.price || validNumber(settings.addOffers.price, 18)" :invalid-feedback="'Invalid price'" :description="'Enter price in [W]ETH to 18 decimal places'" class="mx-0 my-1 p-0">
                <b-form-input size="sm" type="number" id="addoffers-price" v-model.trim="settings.addOffers.price" @change="saveSettings" class="w-25"></b-form-input>
              </b-form-group>

              <b-form-group v-if="settings.addOffers.type == 20 && settings.addOffers.pricing == 1" label="Tokens:" label-for="addoffers-tokens" label-size="sm" label-cols-sm="3" label-align-sm="right" :state="!settings.addOffers.tokens || validNumber(settings.addOffers.tokens, settings.addOffers.decimals)" :invalid-feedback="'Invalid tokens'" :description="'Enter number of tokens to ' + settings.addOffers.decimals + ' decimal places'" class="mx-0 my-1 p-0">
                <b-form-input size="sm" type="number" id="addoffers-tokens" v-model.trim="settings.addOffers.tokens" @change="saveSettings" class="w-25"></b-form-input>
              </b-form-group>

              <b-form-group label="" label-size="sm" label-cols-sm="3" label-align-sm="right" :state="!addOffersFeedback" :invalid-feedback="addOffersFeedback" class="mx-0 my-1 p-0">
                <b-button size="sm" :disabled="!networkSupported || !!addOffersFeedback" @click="addOffer" variant="warning">Add Offer</b-button>
              </b-form-group>
            </b-form-group>
            <!--
            // ERC-20
            //   prices[price0], tokenIds[], tokenss[]
            //   prices[price0], tokenIds[], tokenss[tokens0, tokens1, ...]
            //   prices[price0, price1, ...], tokenIds[], tokenss[tokens0, tokens1, ...]
            // ERC-721
            //   prices[price0], tokenIds[], tokenss[]
            //   prices[price0], tokenIds[tokenId0, tokenId1, ...], tokenss[]
            //   prices[price0, price1, ...], tokenIds[tokenId0, tokenId1, ...], tokenss[]
            // ERC-1155
            //   prices[price0], tokenIds[], tokenss[]
            //   prices[price0], tokenIds[tokenId0, tokenId1, ...], tokenss[]
            //   prices[price0, price1, ...], tokenIds[tokenId0, tokenId1, ...], tokenss[tokens0, tokens1, ...]
             -->
          </b-card>
        </b-card>

        <b-table v-if="false" ref="theTable" small fixed striped responsive hover :fields="fields" :items="pagedFilteredSortedItems" show-empty head-variant="light" class="m-0 mt-1">
          <template #empty="scope">
            <h6>{{ scope.emptyText }}</h6>
            <div>
              <ul>
                <li>
                  Check you are connected to the Sepolia testnet, currently
                </li>
                <li>
                  Click <b-button size="sm" variant="link" class="m-0 p-0"><b-icon-arrow-repeat shift-v="+1" font-scale="1.2"></b-icon-arrow-repeat></b-button> above to sync this app to the blockchain
                </li>
              </ul>
            </div>
          </template>
          <template #cell(number)="data">
            {{ parseInt(data.index) + ((settings.currentPage - 1) * settings.pageSize) + 1 }}
          </template>
          <template #cell(tokenAgent)="data">
            <b-link :href="explorer + 'address/' + data.item.tokenAgent + '#code'" v-b-popover.hover.ds500="data.item.tokenAgent" target="_blank">
              {{ names[data.item.tokenAgent] || data.item.tokenAgent }}
            </b-link>
          </template>
          <template #cell(owner)="data">
            <b-link :href="explorer + 'address/' + data.item.owner" v-b-popover.hover.ds500="data.item.owner" target="_blank">
              {{ names[data.item.owner] || data.item.owner }}
            </b-link>
          </template>
          <!-- <template #cell(transfer)="data">
            <b-button size="sm" :disabled="!transferHelper" @click="newTransfer(data.item.stealthMetaAddress);" variant="link" v-b-popover.hover.ds500="'Transfer to ' + data.item.stealthMetaAddress" class="m-0 ml-2 p-0"><b-icon-caret-right shift-v="+1" font-scale="1.1"></b-icon-caret-right></b-button>
          </template> -->
        </b-table>
      </b-card>
    </div>
  `,
  data: function () {
    return {
      count: 0,
      reschedule: true,
      settings: {
        tabIndex: 0,
        tokenAgentAddress: null,
        tokenAgentOwner: null,
        addOffers: {
          offers: [],
          token: null,
          type: null,
          symbol: null,
          decimals: null,
          buySell: 0,
          expiry: null,
          count: null,
          pricing: 0,
          price: null,
          tokens: null,
          prices: [],
          tokenIds: [],
          tokenss: [],
        },
        offers: {
          filter: null,
          currentPage: 1,
          pageSize: 10,
          sortOption: 'txorderdsc',
        },
        events: {
          filter: null,
          currentPage: 1,
          pageSize: 10,
          sortOption: 'txorderdsc',
        },
        approvals: {
          filter: null,
          currentPage: 1,
          pageSize: 10,
          sortOption: 'txorderdsc',
        },

        // TODO: Delete below
        filter: null,
        currentPage: 1,
        pageSize: 10,
        sortOption: 'ownertokenagentasc',

        version: 10,
      },

      events: [],
      approvals: [],

      buySellOptions: [
        { value: 0, text: 'Buy' },
        { value: 1, text: 'Sell' },
      ],
      pricing20Options: [
        { value: 0, text: 'Single price without limit', disabled: true },
        { value: 1, text: 'Single price with limit' },
        { value: 2, text: 'Multiple prices and limits', disabled: true },
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
      offersFields: [
        { key: 'number', label: '#', sortable: false, thStyle: 'width: 5%;', tdClass: 'text-truncate' },
        { key: 'when', label: 'When', sortable: false, thStyle: 'width: 15%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'token', label: 'Token', sortable: false, thStyle: 'width: 15%;', tdClass: 'text-left' },
        { key: 'tokenType', label: 'Type', sortable: false, thStyle: 'width: 5%;', tdClass: 'text-left' },
        { key: 'buySell', label: 'B/S', sortable: false, thStyle: 'width: 5%;', tdClass: 'text-left' },
        { key: 'price', label: 'Price', sortable: false, thStyle: 'width: 35%;', tdClass: 'text-left' },
        { key: 'expiry', label: 'Expiry', sortable: false, thStyle: 'width: 15%;', tdClass: 'text-left' },
        { key: 'nonce', label: 'Nonce', sortable: false, thStyle: 'width: 5%;', thClass: 'text-right', tdClass: 'text-right' },
      ],
      eventsFields: [
        { key: 'number', label: '#', sortable: false, thStyle: 'width: 5%;', tdClass: 'text-truncate' },
        { key: 'when', label: 'When', sortable: false, thStyle: 'width: 12%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'token', label: 'Token', sortable: false, thStyle: 'width: 12%;', tdClass: 'text-left' },
        { key: 'maker', label: 'Maker', sortable: false, thStyle: 'width: 12%;', tdClass: 'text-left' },
        { key: 'taker', label: 'Taker', sortable: false, thStyle: 'width: 12%;', tdClass: 'text-left' },
        { key: 'eventType', label: 'Event Type', sortable: false, thStyle: 'width: 10%;', tdClass: 'text-left' },
        { key: 'info', label: 'Info', sortable: false, thStyle: 'width: 37%;', tdClass: 'text-left' },
      ],
      approvalsFields: [
        { key: 'number', label: '#', sortable: false, thStyle: 'width: 5%;', tdClass: 'text-truncate' },
        { key: 'when', label: 'When', sortable: false, thStyle: 'width: 15%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'contract', label: 'Token', sortable: false, thStyle: 'width: 15%;', tdClass: 'text-left' },
        { key: 'eventType', label: 'Type', sortable: false, thStyle: 'width: 10%;', tdClass: 'text-left' },
        { key: 'owner', label: 'Owner', sortable: false, thStyle: 'width: 15%;', tdClass: 'text-left' },
        { key: 'spenderOperator', label: 'Spender / Operator', sortable: false, thStyle: 'width: 15%;', tdClass: 'text-left' },
        { key: 'tokensApproved', label: 'Tokens / Approved', sortable: false, thStyle: 'width: 25%;', tdClass: 'text-left' },
      ],
      fields: [
        { key: 'number', label: '#', sortable: false, thStyle: 'width: 5%;', tdClass: 'text-truncate' },
        { key: 'tokenAgent', label: 'Token Agent', sortable: false, thStyle: 'width: 55%;', thClass: 'text-left', tdClass: 'text-left' },
        { key: 'owner', label: 'Owner', sortable: false, thStyle: 'width: 45%;', tdClass: 'text-left' },
        // TODO: Deploy new TokenContractFactory with index worked out
        // { key: 'index', label: 'Index', sortable: false, thStyle: 'width: 10%;', thClass: 'text-right', tdClass: 'text-right' },
      ],
    }
  },
  computed: {
    chainId() {
      return store.getters['connection/chainId'];
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
    addressToIndex() {
      return store.getters['data/addressToIndex'];
    },
    indexToAddress() {
      return store.getters['data/indexToAddress'];
    },
    tokenAgents() {
      return store.getters['data/tokenAgents'];
    },
    addresses() {
      return store.getters['data/addresses'];
    },
    tokenContracts() {
      return store.getters['data/tokenContracts'];
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

    tokenAgentsDropdownOptions() {
      const results = (store.getters['data/forceRefresh'] % 2) == 0 ? [] : [];
      for (const [tokenAgent, d] of Object.entries(this.tokenAgents[this.chainId] || {})) {
        results.push({ tokenAgent, owner: d.owner, index: d.index });
      }
      // console.log(now() + " INFO Agent:computed.tokenAgentsDropdownOptions - results[0..9]: " + JSON.stringify(this.filteredSortedItems.slice(0, 10), null, 2));
      return results;
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

    totalRegistryEntries() {
      return Object.keys(this.registry[this.chainId] || {}).length + ((store.getters['data/forceRefresh'] % 2) == 0 ? 0 : 0);
    },
    items() {
      const results = (store.getters['data/forceRefresh'] % 2) == 0 ? [] : [];
      for (const [tokenAgent, d] of Object.entries(this.tokenAgents[this.chainId] || {})) {
        // console.log(tokenAgent + " => " + JSON.stringify(d));
        results.push({ tokenAgent, owner: d.owner, index: d.index });
      }
      return results;
    },
    filteredSortedItems() {
      const results = this.items;
      // console.log(JSON.stringify(results, null, 2));
      if (this.settings.sortOption == 'ownertokenagentasc') {
        results.sort((a, b) => {
          if (('' + a.owner).localeCompare(b.owner) == 0) {
            return ('' + a.transferAgent).localeCompare(b.transferAgent);
          } else {
            return ('' + a.owner).localeCompare(b.owner);
          }
        });
      } else if (this.settings.sortOption == 'ownertokenagentdsc') {
        results.sort((a, b) => {
          if (('' + a.owner).localeCompare(b.owner) == 0) {
            return ('' + a.transferAgent).localeCompare(b.transferAgent);
          } else {
            return ('' + b.owner).localeCompare(a.owner);
          }
        });
      } else if (this.settings.sortOption == 'tokenagentasc') {
        results.sort((a, b) => {
          return ('' + a.tokenAgent).localeCompare(b.tokenAgent);
        });
      } else if (this.settings.sortOption == 'tokenagentdsc') {
        results.sort((a, b) => {
          return ('' + b.tokenAgent).localeCompare(a.tokenAgent);
        });
      } else if (this.settings.sortOption == 'indexasc') {
        results.sort((a, b) => {
          return a.index - b.index;
        });
      } else if (this.settings.sortOption == 'indexdsc') {
        results.sort((a, b) => {
          return b.index - a.index;
        });
      }
      return results;
    },
    pagedFilteredSortedItems() {
      // console.log(now() + " INFO Agent:computed.pagedFilteredSortedItems - results[0..1]: " + JSON.stringify(this.filteredSortedItems.slice(0, 2), null, 2));
      return this.filteredSortedItems.slice((this.settings.currentPage - 1) * this.settings.pageSize, this.settings.currentPage * this.settings.pageSize);
    },

    nonce() {
      const events = this.events.filter(e => e.eventType == "OffersInvalidated");
      if (events.length > 0) {
        return events[events.length - 1].newNonce;
      }
      return 0;
    },

    filteredSortedEvents() {
      const results = this.events;
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
      console.log(now() + " INFO Agent:computed.pagedFilteredSortedEvents - results[0..1]: " + JSON.stringify(this.filteredSortedEvents.slice(0, 2), null, 2));
      return this.filteredSortedEvents.slice((this.settings.events.currentPage - 1) * this.settings.events.pageSize, this.settings.events.currentPage * this.settings.events.pageSize);
    },

    offers() {
      return this.events.filter(e => e.eventType == "Offered");
    },
    filteredSortedOffers() {
      const results = this.offers;
      if (this.settings.offers.sortOption == 'txorderasc') {
        results.sort((a, b) => {
          if (a.blockNumber == b.blockNumber) {
            return a.logIndex - b.logIndex;
          } else {
            return a.blockNumber - b.blockNumber;
          }
        });
      } else if (this.settings.offers.sortOption == 'txorderdsc') {
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
    pagedFilteredSortedOffers() {
      console.log(now() + " INFO Agent:computed.pagedFilteredSortedOffers - results[0..1]: " + JSON.stringify(this.filteredSortedOffers.slice(0, 2), null, 2));
      return this.filteredSortedOffers.slice((this.settings.offers.currentPage - 1) * this.settings.offers.pageSize, this.settings.offers.currentPage * this.settings.offers.pageSize);
    },

    filteredSortedApprovals() {
      const results = this.approvals;
      // console.log(JSON.stringify(results, null, 2));
      // if (this.settings.sortOption == 'ownertokenagentasc') {
      //   results.sort((a, b) => {
      //     if (('' + a.owner).localeCompare(b.owner) == 0) {
      //       return ('' + a.transferAgent).localeCompare(b.transferAgent);
      //     } else {
      //       return ('' + a.owner).localeCompare(b.owner);
      //     }
      //   });
      // } else if (this.settings.sortOption == 'ownertokenagentdsc') {
      //   results.sort((a, b) => {
      //     if (('' + a.owner).localeCompare(b.owner) == 0) {
      //       return ('' + a.transferAgent).localeCompare(b.transferAgent);
      //     } else {
      //       return ('' + b.owner).localeCompare(a.owner);
      //     }
      //   });
      // } else if (this.settings.sortOption == 'tokenagentasc') {
      //   results.sort((a, b) => {
      //     return ('' + a.tokenAgent).localeCompare(b.tokenAgent);
      //   });
      // } else if (this.settings.sortOption == 'tokenagentdsc') {
      //   results.sort((a, b) => {
      //     return ('' + b.tokenAgent).localeCompare(a.tokenAgent);
      //   });
      // } else if (this.settings.sortOption == 'indexasc') {
      //   results.sort((a, b) => {
      //     return a.index - b.index;
      //   });
      // } else if (this.settings.sortOption == 'indexdsc') {
      //   results.sort((a, b) => {
      //     return b.index - a.index;
      //   });
      // }
      return results;
    },
    pagedFilteredSortedApprovals() {
      console.log(now() + " INFO Agent:computed.pagedFilteredSortedApprovals - results[0..1]: " + JSON.stringify(this.filteredSortedApprovals.slice(0, 2), null, 2));
      return this.filteredSortedApprovals.slice((this.settings.approvals.currentPage - 1) * this.settings.approvals.pageSize, this.settings.approvals.currentPage * this.settings.approvals.pageSize);
    },

  },
  methods: {
    async loadData() {
      console.log(now() + " INFO Agent:methods.loadData - tokenAgentAgentSettings: " + JSON.stringify(this.settings, null, 2));
      // TODO: Later move into data?
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const block = await provider.getBlock();
      const blockNumber = block && block.number || "latest";
      const network = NETWORKS['' + this.chainId] || {};
      const contract = new ethers.Contract(this.settings.tokenAgentAddress, network.tokenAgent.abi, provider);

      const tokenApprovalsfilter = {
        address: null,
        fromBlock: 0,
        toBlock: blockNumber,
        topics: [
          [
            // ERC-20 event Approval(address indexed owner, address indexed spender, uint tokens);
            ethers.utils.id("Approval(address,address,uint256)"),
            // ERC-721 Approval (address indexed owner, address indexed approved, uint256 indexed tokenId)
            // ethers.utils.id("Approval(address,address,uint256)"),
            // ERC-721 event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
            ethers.utils.id("ApprovalForAll(address,address,bool)"),
            // ERC-1155 event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
            // ethers.utils.id("ApprovalForAll(address,address,bool)"),
          ],
          null,
          [ '0x000000000000000000000000' + this.settings.tokenAgentAddress.substring(2, 42).toLowerCase() ],
        ],
      };
      console.log(now() + " INFO Agent:methods.loadData - tokenApprovalsfilter: " + JSON.stringify(tokenApprovalsfilter, null, 2));
      const tokenApprovalsEventLogs = await provider.getLogs(tokenApprovalsfilter);
      // console.log(now() + " INFO Agent:methods.loadData - tokenApprovalsEventLogs: " + JSON.stringify(tokenApprovalsEventLogs, null, 2));
      this.approvals = parseTokenEventLogsOld(tokenApprovalsEventLogs, this.chainId, blockNumber);
      // console.log(now() + " INFO Agent:methods.loadData - this.approvals: " + JSON.stringify(this.approvals, null, 2));
      localStorage.tokenAgentAgentApprovals = JSON.stringify(this.approvals);

      const tokenAgentEventsfilter = {
        address: this.settings.tokenAgentAddress,
        fromBlock: 0,
        toBlock: blockNumber,
        topics: [ [], null, null ],
      };
      const tokenAgentEventLogs = await provider.getLogs(tokenAgentEventsfilter);
      // console.log(now() + " INFO Agent:methods.loadData - tokenAgentEventLogs: " + JSON.stringify(tokenAgentEventLogs, null, 2));
      this.events = parseTokenAgentEventLogsOld(tokenAgentEventLogs, this.chainId, this.settings.tokenAgentAddress, network.tokenAgent.abi, blockNumber);

      localStorage.tokenAgentAgentEvents = JSON.stringify(this.events);
      // store.dispatch('syncOptions/loadData');
    },
    async addOffer() {
      console.log(now() + " INFO Agent:methods.addOffer - settings.addOffers: " + JSON.stringify(this.settings.addOffers, null, 2));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = NETWORKS['' + this.chainId] || {};
      const contract = new ethers.Contract(this.settings.tokenAgentAddress, network.tokenAgent.abi, provider);
      const contractWithSigner = contract.connect(provider.getSigner());
      if (network.tokenAgentFactory) {
        if (this.settings.addOffers.type == 20) {
          let prices = [];
          let tokens = [];
          if (this.settings.addOffers.pricing == 0) {
            console.log(now() + " INFO Agent:methods.addOffer - ERC-20 Single price without limit - price: " + this.settings.addOffers.price);
            prices = [ethers.utils.parseUnits(this.settings.addOffers.price, 18).toString()];
          } else if (this.settings.addOffers.pricing == 1) {
            console.log(now() + " INFO Agent:methods.addOffer - ERC-20 Single price with limit - price: " + this.settings.addOffers.price + ", tokens: " + this.settings.addOffers.tokens);
            prices = [ethers.utils.parseUnits(this.settings.addOffers.price, 18).toString()];
            tokens = [ethers.utils.parseUnits(this.settings.addOffers.tokens, this.settings.addOffers.decimals).toString()];
          } else {
            console.log(now() + " INFO Agent:methods.addOffer - ERC-20 Multiple prices with limits - UNSUPPORTED");
          }
          if (prices.length > 0) {
            const payload = [
              [
                this.settings.addOffers.token,
                parseInt(this.settings.addOffers.buySell),
                "2041432206", // Sat Sep 09 2034 16:30:06 GMT+0000
                prices,
                [],
                tokens,
              ],
            ];
            try {
              console.log(now() + " INFO Agent:methods.addOffer - payload: " + JSON.stringify(payload));
              const tx = await contractWithSigner.addOffers(payload, { gasLimit: 500000 });
              console.log(now() + " INFO Agent:methods.addOffer - tx: " + JSON.stringify(tx));
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
              console.log(now() + " ERROR Agent:methods.addOffer: " + JSON.stringify(e));
              this.$bvToast.toast(`${e.message}`, {
                title: 'Error!',
                autoHideDelay: 5000,
              });
            }
          }
        } else {
          console.log(now() + " INFO Agent:methods.addOffer - ERC-721/1155 - UNSUPPORTED");
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
    formatDecimals(e, decimals = 18) {
      return e ? ethers.utils.formatUnits(e, decimals).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : null;
    },
    validNumber(n, d) {
      if (n && d != null) {
        // console.log(now() + " DEBUG Agent:methods.validNumber - n: " + n + ", d: " + d);
        try {
          const n_ = ethers.utils.parseUnits(n, d);
          // console.log(now() + " DEBUG Agent:methods.validNumber - n_: " + n_.toString());
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
      console.log(now() + " INFO Agent:methods.saveSettings - tokenAgentAgentSettings: " + JSON.stringify(this.settings, null, 2));
      localStorage.tokenAgentAgentSettings = JSON.stringify(this.settings);
    },
    async viewSyncOptions() {
      store.dispatch('syncOptions/viewSyncOptions');
    },
    async halt() {
      store.dispatch('data/setSyncHalt', true);
    },
    newTransfer(stealthMetaAddress = null) {
      console.log(now() + " INFO Agent:methods.newTransfer - stealthMetaAddress: " + stealthMetaAddress);
      store.dispatch('newTransfer/newTransfer', stealthMetaAddress);
    },
    async timeoutCallback() {
      // console.log(now() + " DEBUG Agent:methods.timeoutCallback - count: " + this.count);
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
    // console.log(now() + " DEBUG Agent:beforeDestroy");
  },
  mounted() {
    // console.log(now() + " DEBUG Agent:mounted - $route: " + JSON.stringify(this.$route.params));
    store.dispatch('data/restoreState');
    if ('tokenAgentAgentSettings' in localStorage) {
      const tempSettings = JSON.parse(localStorage.tokenAgentAgentSettings);
      if ('version' in tempSettings && tempSettings.version == this.settings.version) {
        this.settings = tempSettings;
        this.settings.currentPage = 1;
        if ('tokenAgentAgentEvents' in localStorage) {
          this.events = JSON.parse(localStorage.tokenAgentAgentEvents);
        }
        if ('tokenAgentAgentApprovals' in localStorage) {
          this.approvals = JSON.parse(localStorage.tokenAgentAgentApprovals);
        }
      }
      // this.loadData(this.settings.tokenAgentAddress);
    }
    this.reschedule = true;
    // console.log(now() + " DEBUG Agent:mounted - calling timeoutCallback()");
    this.timeoutCallback();
  },
  destroyed() {
    this.reschedule = false;
  },
};

const agentModule = {
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
