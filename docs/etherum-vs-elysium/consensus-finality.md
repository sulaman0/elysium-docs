---
sidebar_position: 4
---

# Consensus and Finality

While Elysium strives to be compatible with Ethereum’s Web3 API and EVM, there are some important Elysium differences
that developers should know and understand in terms of consensus and finality.

In short, consensus is a way for different parties to agree on a shared state. As blocks are created, nodes in the
network must decide which block will represent the next valid state. Finality defines when that valid state cannot be
altered or reversed.

Ethereum began by using a consensus protocol based on Proof-of-Work (PoW), which provides probabilistic finality.
However, in 2022, Ethereum switched to Proof-of-Stake (PoS), which provides deterministic finality, and no longer uses
PoW. In contrast, Elysium uses a consensus protocol based on Delegated Proof-of-Authority (PoA).

This guide will outline some of these main differences around consensus and finality, and what to expect when using
Elysium for the first time.

## Ethereum Consensus and Finality

As stated before, Ethereum is currently using a PoS consensus protocol, in which validators stake ETH in the network and
are responsible for producing blocks and checking the validity of new blocks. The timing of block production is fixed
and is divided into 12 second slots and 32 slot epochs. One validator per slot is randomly selected to produce a block
and broadcast it to the network. There is a randomly selected committee of validators per slot that is responsible for
determining the validity of the block. The greater the stake in the network, the greater the chance the validator will
be chosen to produce or validate a block.

Finality is deterministic in Ethereum’s PoS consensus protocol and is achieved through “checkpoint” blocks. Validators
agree on the state of a block at particular checkpoint blocks, which are always the first block in an epoch, and if
two-thirds of the validators agree, the block is finalized. Block finality can be reverted; however, there are strong
economic incentives in place so validators do not attempt to collude to revert a block. You can find out more
information in Vitalik’s On Settlement Finality blog, under the Finality in Casper section.

## Elysium Consensus and Finality

In Polkadot, there are collators and validators. Validators are working by collecting
transactions from users and producing state transition proofs for the chain validators. The validator set (nodes
that produce blocks) is allocated based on the stake they have in the network.

For finality, Polkadot and Kusama rely on GRANDPA. GRANDPA provides deterministic finality for any given transaction (
block). In other words, when a block or transaction is marked as final, it can’t be reverted except via on-chain
governance or forking. Elysium follows this deterministic finality.

## Strategy to Check Transaction Finality

Although the finality gadgets differ, you can use the same, fairly simple strategy to check for transaction finality on
both Ethereum and Elysium:

- You ask the network for the hash of the latest finalized block
- You retrieve the block number using the hash
- You compare it with the block number of your transaction. If your transaction was included in a previous block, it is
  finalized
- As a safety check, retrieve the block by number and verify that the given transaction hash is in the block

The following sections outline how you can check for transaction finality using both the Ethereum JSON-RPC (custom Web3
request) and the Substrate (Polkadot) JSON-RPC.

