---
sidebar_position: 1
---

# Quick Start Guide

Elysium is a fully Ethereum-compatible smart contract platform on Polkadot. As such, you can interact with Elysium via
the Ethereum API and Substrate API.

You can interact with your Elysium account with MetaMask, Ledger, and other Ethereum-compatible wallets by simply adding
Elysium’s network configurations.

Similarly, you can develop on Elysium using Ethereum libraries and development environments.

## Elysium Networks

To get started developing on Elysium, it’s important to be aware of the various networks within the Elysium ecosystem.

| Network  | Network Type | Native Asset Symbol | Native Asset Decimals |
|----------|--------------|---------------------|-----------------------|
| Atlantis | Testnet      | LAVA                | 18                    |
| Elysium  | Mainnet      | LAVA                | 18                    |

### Network Configurations

When working with developer tools, depending on the tool, you might need to configure Elysium to interact with the
network. To do so, you can use the following information:

#### Atlantis (Testnet)

| Variable | Value	                            | 
|----------|-----------------------------------|
| Chain ID | 1338                              | 
| RPC URL  | https://rpc.atlantischain.network |
| WS URL   | wss://ws.atlantischain.network    |

#### Elysium

| Variable | Value	                        | 
|----------|-------------------------------|
| Chain ID | 1339                          | 
| RPC URL  | https://rpc.elysiumchain.tech |
| WS URL   | wss://ws.elysiumchain.tech    |

## Block Explorers

Elysium provides EVM-based explorer which used to query the Ethereum API. All EVM-based transactions are accessible
via the Ethereum API. For more information on each explorer, please check out the Block Explorers page.

#### Atlantis (Testnet)

| Block Explorer | Value	                                   | 
|----------------|------------------------------------------|
| Elysium        | https://explorer.atlantischain.network   | 
| Blockscout     | https://blockscout.atlantischain.network |

#### Elysium

| Block Explorer | Value	                               | 
|----------------|--------------------------------------|
| Elysium        | https://explorer.elysiumchain.tech   | 
| Blockscout     | https://blockscout.elysiumchain.tech |

## Funding Accounts

To get started developing on Atlantis (Testnet), you’ll need to fund your account with LAVA tokens to send
transactions.
Please note that Testnet LAVA tokens have no real value and are for testing purposes only.

Mainnet tokens are only available for those people who are bridging their assets from Polygon to
Elysium using Bridge (https://bridge.elysiumchain.tech/).

| Network  | URL	                                                                                          | 
|----------|-----------------------------------------------------------------------------------------------|
| Atlantis | The https://faucet.atlantischain.network/ website. The faucet dispenses 1 LAVA every 24 hours | 
| Elysium  | The https://faucet.elysiumchain.tech/ website. The faucet dispenses 3 LAVA for one time.      |

## Development Tools

As Elysium is a Substrate-based chain that is fully Ethereum-compatible, you can use Substrate-based tools and
Ethereum-based tools to interact with chain.

#### Javascript Tools

| Chain Base | Tool                                                  | Type    |
|------------|-------------------------------------------------------|---------|
| Ethereum   | [Web3.js ](https://web3js.readthedocs.io/en/v1.8.0/) | Library |
| Substrate  | [Polkadot.js API](https://polkadot.js.org/docs/api/)  | Library |
