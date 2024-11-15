---
sidebar_position: 2
---

# Network Endpoints

Elysium has two types of endpoints available for users to connect to: one for HTTPS and one for WSS.

If you are looking for an API provider suitable for production use, you can check out the Node Operator section of
this guide to setup your own node.

| Provider | RPC URL                          | WebSocket                  |
|----------|----------------------------------|----------------------------|
| Elysium  | https://rpc.elysiumchain.tech    | wss://ws.elysiumchain.tech |
| Atlantis | http://rpc.atlantischain.network | wss://ws.atlantischain.network |

## Quick Started

For the Web3.js library, you can create a local Web3 instance and set the provider to connect to Elysium (both HTTP and
WS are supported):

For the [Ether.js library](https://docs.ethers.org/v5/),
define the provider by using `ethers.JsonRpcProvider(
providerURL, {object})` and setting the
provider URL to Elysium:

``` js
const ethers = require('ethers'); // Load Ethers library
// Testnet RPC url is: https://rpc.atlantischain.network
const providerURL = 'https://rpc.elysiumchain.tech';
// Define provider
const provider = new ethers.JsonRpcProvider(providerURL, {
    chainId: 1339,
    name: 'elysium'
});
```

## Chain ID

Elysium Chain Mainnet chain ID is: 1339 & Testnet chain ID is: 1338 for more information follow [Elysium Network](/docs/intro#elysium-networks)

### Public Endpoints

Elysium has two endpoints available for users to connect to: one for RPC and one for Websocket connection.

The endpoints in this section are for development purposes only and are not meant to be used in production applications.

If you are looking for an API provider suitable for production use, you can check out the Node Operator section of
this guide to setup your own node.

#### Atlantis (Testnet)

| Variable  | Value                             |
|-----------|-----------------------------------|
| Chain ID	 | 1338                              |
| RPC URL   | https://rpc.atlantischain.network | 
| WSS URL	  | wss://ws.atlantischain.network    | 

#### Elysium Mainnet

| Variable  | Value                         |
|-----------|-------------------------------|
| Chain ID	 | 1339                          |
| RPC URL   | https://rpc.elysiumchain.tech | 
| WSS URL	  | wss://ws.elysiumchain.tech    | 

## Block Explorers

For Elysium, you can use any of the following block explorers:

- Ethereum API (Etherscan Equivalent) — Elysium
- Ethereum API with Indexing — Blockscout

For more information on each of the available block explorers, please head to the Block Explorers section of the
documentation.

## Get Tokens

To start building on Elysium, you can get LAVA from the [Elysium Faucet](https://faucet.atlantischain.network/). For specific amounts, you can always reach
out directly to us via our community channels.

To request LAVA tokens from the faucet, you can enter your address on the [Elysium Faucet](https://faucet.atlantischain.network/).

> **_NOTE:_**  
> Elysium Testnet tokens have no value. Please don’t spam the faucet with unnecessary requests.