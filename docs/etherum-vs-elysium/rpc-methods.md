---
sidebar_position: 3
---

# RPC Methods

While Elysium strives to be compatible with Ethereum’s Web3 API and EVM, there are some important Elysium differences
that developers should know and understand in terms of the Ethereum API JSON-RPC support.

The Elysium team has used Frontier for add EVM compatibility. Frontier is the Ethereum compatibility
layer for Substrate based chains, and it is what allows developers to run unmodified Ethereum DApps.

Nevertheless, not all of the Ethereum JSON RPC methods are supported, and some of the supported ones return default
values (those related to Ethereum’s PoA consensus mechanism in particular). This guide will outline some of these main
differences around Ethereum RPC support and what to expect when using Elysium for the first time.

## Basic Ethereum JSON RPC Methods

- **eth_protocolVersion** — returns 1 by default
- **eth_syncing** — returns an object with data about the sync status or false
- **eth_hashrate** — returns "0x0" by default
- **eth_coinbase** — returns the latest block author. Not necessarily a finalized block
- **eth_mining** — returns false by default
- **eth_chainId** — returns the chain ID used for signing at the current block
- **eth_gasPrice** — returns the base fee per unit of gas used. This is currently the minimum gas price for each network
- **eth_accounts** — returns a list of addresses owned by the client
- **eth_blockNumber** — returns the highest available block number
- **eth_getBalance** — returns the balance of the given address
- **eth_getStorageAt** — returns the content of the storage at a given address
- **eth_getBlockByHash** — returns information about the block of the given hash including baseFeePerGas
- **eth_getBlockByNumber** — returns information about the block specified by block number including baseFeePerGas
- **eth_getTransactionCount** — returns the number of transactions sent from the given address (nonce)
- **eth_getBlockTransactionCountByHash** — returns the number of transactions in a block with a given block hash
- **eth_getBlockTransactionCountByNumber** — returns the number of transactions in a block with a given block number
- **eth_getUncleCountByBlockHash** — returns "0x0" by default
- **eth_getUncleCountByBlockNumber** — returns "0x0" by default
- **eth_getCode** — returns the code at the given address at a given block number
- **eth_sendTransaction** — creates a new message call transaction or a contract creation, if the data field contains
  code.
  Returns the transaction hash, or the zero hash if the transaction is not yet available
- **eth_sendRawTransaction** — creates a new message call transaction or a contract creation for signed transactions.
  Returns
  the transaction hash, or the zero hash if the transaction is not yet available
- **eth_call** — executes a new message call immediately without creating a transaction on the blockchain, returning
  the
  value of the executed call
- **eth_estimateGas** — returns an estimated amount of how much gas is necessary for a given transaction to succeed. You
  can
  optionally specify a gasPrice or maxFeePerGas and maxPriorityFeePerGas
- eth_feeHistory — returns baseFeePerGas, gasUsedRatio, oldestBlock, and reward for a specified range of up to 1024
  blocks
- **eth_getTransactionByHash** — returns the information about a transaction with a given hash. EIP-1559 transactions
  have
  maxPriorityFeePerGas and maxFeePerGas fields
- **eth_getTransactionByBlockHashAndIndex** — returns information about a transaction at a given block hash, and a given
  index
  position. EIP-1559 transactions have maxPriorityFeePerGas and maxFeePerGas fields
- **eth_getTransactionByBlockNumberAndIndex** — returns information about a transaction at a given block number, and a
  given
  index position. EIP-1559 transactions have maxPriorityFeePerGas and maxFeePerGas fields
- **eth_getTransactionReceipt** — returns the transaction receipt of a given transaction hash.
- **eth_getUncleByBlockHashAndIndex** — returns null by default
- **eth_getUncleByBlockNumberAndIndex** — returns null by default
- **eth_getLogs** — returns an array of all logs matching a given filter object
- **eth_getWork** — returns ["0x0","0x0","0x0"] by default
- **eth_submitWork** — not supported on Elysium
- **eth_submitHashrate** — not supported on Elysium

## Filter-related Ethereum JSON RPC Methods

At the time of writing, the filter-related JSON RPC methods from the Ethereum API supported by Elysium are:

- **eth_newFilter** — creates a filter object based on the input provided. Returns a filter ID
- **eth_newBlockFilter** — creates a filter in the node to notify when a new block arrives. Returns a filter id
- **eth_getFilterChanges** — polling method for filters (see methods above). Returns an array of logs which occurred
  since
  last poll
- **eth_getFilterLogs** — returns an array of all the logs matching the filter with a given ID
- **eth_uninstallFilter** — uninstall a filter with a given ID. Should be used when polling is no longer needed. Filters
  timeout when they are not requested using eth_getFilterChanges after a period of time

## Filter-related Ethereum JSON RPC Methods

At the time of writing, the event subscription JSON RPC methods from the Ethereum API supported by Elysium are:

- **eth_subscribe** — creates a subscription for a given subscription name. If successful, returns the subscription ID
- **eth_unsubscribe** — cancels the subscription given by its ID

## Supported Subscription Parameters

At the time of writing, the supported subscriptions are:

- **newHeads** — triggers a notification each time a new header is appended to the chain
- **logs** — returns logs that are included in new imported blocks, and match a given filter criteria
- **newPendingTransactions** — returns the hash for all transactions that are added to the pending state
- **syncing** — indicates when the node starts or stop synchronizing with the network

For a dedicated tutorial for these subscriptions checkout the Events Subscription guide.
