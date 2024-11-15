---
sidebar_position: 6
---

# Balance Transfers

While Elysium strives to be compatible with Ethereum’s Web3 API and EVM, there are some important Elysium differences
that developers should know and understand in terms of balance transfers of the base network token (for example, LAVA).

Token holders have two ways of initiating a balance transfer on Elysium. On one hand, users can use the Ethereum API via
apps like MetaMask, MathWallet, or any other tools that use the Ethereum JSON-RPC. On the other hand, users can use the
Substrate API, via the Polkadot.js Apps website, or directly using the Substrate RPC.

Developers need to be aware that token holders can leverage both APIs to transfer the base layer network token. Note
that these comments do not apply to transfers of other assets like ERC-20 based assets in the Elysium EVMs. Transfers of
these assets are only done via the Ethereum APIs since these are smart contract interactions.

This guide will outline some of these main differences around both APIs for base layer network token balance transfers
and what to expect when using Elysium for the first time.

## Ethereum Transfers

A simple balance transfer using the Ethereum API relies on the `eth_sendRawTransaction` JSON RPC. This can be directly
from one account to another or via a smart contract.

There are different strategies to listen for transfers or balance changes on Ethereum, which are not covered in this
documentation. But they are all focused on different strategies using the Ethereum JSON RPC.

## Elysium Transfers

As stated before, Elysium enables token holders to execute base layer network token transfers via both the Ethereum and
Substrate API. There are multiple scenarios to trigger token transfer on Elysium. Consequently, to monitor all
transfers, you should use the Polkadot.js SDK (Substrate API).

Before going over the different scenarios, there are two different elements associated with a block:

- **Extrinsic** — refers to state changes that originated outside of the system itself. The most common form of
  extrinsic is
  a transaction. They are ordered by execution
- **Events** — refers to logs generated from the extrinsic. There can be multiple events per extrinsic. They are ordered
  by
  execution

The different transfer scenarios are:

- **Substrate transfer** — it will create an extrinsic, either `balances.transfer` or `balances.transferKeepAlive`. It
  will
  trigger one `balances.Transfer` event
- **Substrate feature** — some native Substrate features can create extrinsic that would send tokens to an address. For
  example, Treasury can create an extrinsic such as `treasury.proposeSend`, which will trigger one or multiple
  `balances.Transfer` events
- **Ethereum transfer** — it will create an `ethereum.transact` extrinsic, with an empty input. It will trigger one
  `balances.Transfer` event
- **Ethereum transfers** via smart contracts — it will create an `ethereum.transact` extrinsic, with some data as input.
  It
  will trigger one or multiple `balances.Transfer` events

All the scenarios described above will effectively transfer base-layer network tokens. The easiest way to monitor them
all is to rely on the balances.Transfer event.

### Monitor Native Token Balance Transfers

The following code samples will demonstrate how to listen to both types of native token transfers, sent via Substrate or
Ethereum API, using either the Polkadot.js API library or Substrate API Sidecar. The following code snippets are for
demo purposes only and should not be used without modification and further testing in a production environment.

### Using Polkadot.js API

The Polkadot.js API package provides developers a way to interact with Substrate chains using JavaScript.

The following code snippet uses subscribeFinalizedHeads to subscribe to new finalized block headers, and loops through
extrinsics fetched from the block, and retrieves the events of each extrinsic. Then, it checks if any event corresponds
to a balances.Transfer event. If so, it will extract the from, to, amount, and the tx hash of the transfer and display
it on the console. Note that the amount is shown in the smallest unit (Wei). You can find all the available information
about Polkadot.js and the Substrate JSON RPC in their official documentation site.

```typescript
import { ApiPromise, WsProvider } from "@polkadot/api";

// This script will listen to all LAVA transfers (Substrate & Ethereum) and extract the tx hash
// It can be adapted for Elysium

const main = async () => {
  // Define the provider for Elysium
  const wsProvider = new WsProvider("wss://ws:faucet.atlantischain.network");
  // Create the provider using Elysium types
  const polkadotApi = await ApiPromise.create({
    provider: wsProvider
  });

  // Subscribe to finalized blocks
  await polkadotApi.rpc.chain.subscribeFinalizedHeads(async (lastFinalizedHeader) => {
    const [{ block }, records] = await Promise.all([
      polkadotApi.rpc.chain.getBlock(lastFinalizedHeader.hash),
      polkadotApi.query.system.events.at(lastFinalizedHeader.hash),
    ]);

    block.extrinsics.forEach((extrinsic, index) => {
      const {
        method: { args, method, section },
      } = extrinsic;

      const isEthereum = section == "ethereum" && method == "transact";

      // Gets the transaction object
      const tx = (args[0] as any);

      // Convert to the correct Ethereum Transaction format
      const ethereumTx = isEthereum && 
        ((tx.isLegacy && tx.asLegacy) ||
        (tx.isEip1559 && tx.asEip1559) ||
        (tx.isEip2930 && tx.asEip2930));

      // Check if the transaction is a transfer
      const isEthereumTransfer = ethereumTx && ethereumTx.input.length === 0 && ethereumTx.action.isCall;

      // Retrieve all events for this extrinsic
      const events = records.filter(
        ({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)
      );

      // This hash will only exist if the transaction was executed through Ethereum.
      let ethereumHash = "";

      if (isEthereum) {
        // Search for Ethereum execution
        events.forEach(({ event }) => {
          if (event.section == "ethereum" && event.method == "Executed") {
            ethereumHash = event.data[2].toString();
          }
        });
      }

      // Search if it is a transfer
      events.forEach(({ event }) => {
        if (event.section == "balances" && event.method == "Transfer") {
          const from = event.data[0].toString();
          const to = event.data[1].toString();
          const balance = (event.data[2] as any).toBigInt();

          const substrateHash = extrinsic.hash.toString();

          console.log(`Transfer from ${from} to ${to} of ${balance} (block #${lastFinalizedHeader.number})`);
          console.log(`  - Triggered by extrinsic: ${substrateHash}`);
          if (isEthereum) {
            console.log(`  - Ethereum (isTransfer: ${isEthereumTransfer}) hash: ${ethereumHash}`);
          }
        }
      });
    });
  });
};

main();
```
