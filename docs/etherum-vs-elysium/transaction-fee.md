---
sidebar_position: 5
---

# Transaction Fees

Similar to the Ethereum and Substrate APIs for sending transfers on Elysium, the Substrate and EVM layers on Elysium
also have distinct transaction fee models that developers should be aware of when they need to calculate and keep track
of the transaction fees of their transactions.

This guide assumes you are interacting with Elysium blocks via the Substrate API Sidecar service. There are other ways
of interacting with Elysium blocks, such as using the Polkadot.js API library. The logic is identical once the blocks
are retrieved.

You can reference the Substrate API Sidecar page for information on installing and running your own Sidecar service
instance, as well as more details on how to decode Sidecar blocks for Elysium transactions.

Note that the information on this page assumes you are running latest version of the Substrate Sidecar REST API.

## Substrate API Transaction Fees

All the information around fee data for transactions sent via the Substrate API can be extracted from the following
block endpoint:

``` js
GET /blocks/{blockId}
```

The block endpoints will return data relevant to one or more blocks. You can read more about the block endpoints on the
official Sidecar documentation. Read as a JSON object, the relevant nesting structure is as follows:

``` angular2html
RESPONSE JSON Block Object:
    ...
    |--number
    |--extrinsics
        |--{extrinsic_number}
            |--method
            |--signature
            |--nonce
            |--args
            |--tip           
            |--hash
            |--info
            |--era
            |--events
                |--{event_number}
                    |--method
                        |--pallet: "transactionPayment"
                        |--method: "TransactionFeePaid"
                    |--data
                        |--0
                        |--1
                        |--2
    ...
```

The object mappings are summarized as follows:

| Tx Information     | Block JSON Field                                          |
|--------------------|-----------------------------------------------------------|
| Fee paying account | extrinsics[extrinsic_number].events[event_number].data[0] |
| Total fees paid    | extrinsics[extrinsic_number].events[event_number].data[1] | 
| Tip                | extrinsics[extrinsic_number].events[event_number].data[2] |

The transaction fee related information can be retrieved under the event of the relevant extrinsic where the method
field is set to:

```
pallet: "transactionPayment", method: "TransactionFeePaid"
```

And then the total transaction fee paid for this extrinsic is mapped to the following field of the block JSON object:

```js
extrinsics[extrinsic_number].events[event_number].data[1]
```

## Ethereum API Transaction Fees

To calculate the fee incurred on a Elysium transaction sent via the Ethereum API, the following formula can be used:

#### EIP 1559

```js
GasPrice = BaseFee + MaxPriorityFeePerGas < MaxFeePerGas ?
    BaseFee + MaxPriorityFeePerGas :
    MaxFeePerGas;
Transaction_Fee = (GasPrice * TransactionWeight) / 25000
```

#### Legacy

```js
Transaction_Fee = (GasPrice * TransactionWeight) / 25000
```

#### EIP-2930

```js 
Transaction_Fee = (GasPrice * TransactionWeight) / 25000
```

The following sections describe in more detail each of the components needed to calculate the transaction fee.

## Base Fee

The BaseFee is the minimum amount charged to send a transaction and is a value set by the network itself. It was
introduced in EIP-1559. Elysium has its own dynamic fee mechanism for calculating the base fee, which is adjusted based
on block congestion. As of now, the dynamic fee mechanism has been rolled out to all of the Elysium-based
networks.

The minimum gas price for each network is as follows:

| Network            | Value    |
|--------------------|----------|
| Elysium            | 125 Gwei |
| Atlantis (Testnet) | 0.1 Gwei |

To calculate the dynamic base fee, the following calculation is used:

| Network            | Value                                              |
|--------------------|----------------------------------------------------|
| Elysium            | BaseFee = NextFeeMultiplier * 125000000000 / 10^18 |
| Atlantis (Testnet) | BaseFee = NextFeeMultiplier * 125000000 / 10^18    |

The value of NextFeeMultiplier can be retrieved from the Substrate Sidecar API, via the following endpoint:

``` ecmascript 6
GET /pallets/transaction-payment/storage/nextFeeMultiplier?at={blockId}
```

The pallets endpoints for Sidecar returns data relevant to a pallet, such as data in a pallet’s storage. You can read
more about the pallets endpoint in the official Sidecar documentation. The data at hand that’s required from storage is
the nextFeeMultiplier, which can be found in the transaction-payment pallet. The stored nextFeeMultiplier value can be
read directly from the Sidecar storage schema. Read as a JSON object, the relevant nesting structure is as follows:

```angular2html
RESPONSE JSON Storage Object:
|--at
|--hash
|--height
|--pallet
|--palletIndex
|--storageItem
|--keys
|--value
```

The relevant data will be stored in the value key of the JSON object. This value is a fixed point data type, hence the
real value is found by dividing the value by 10^18. This is why the calculation of BaseFee includes such an operation.

## GasPrice, MaxFeePerGas and MaxPriorityFeePerGas

The GasPrice is used to specify the gas price of legacy transactions prior to EIP-1559. The MaxFeePerGas and
MaxPriorityFeePerGas were both introduced in EIP-1559 alongside the BaseFee. The MaxFeePerGas defines the maximum fee
permitted to be paid per unit of gas and is the sum of the BaseFee and the MaxPriorityFeePerGas. The
MaxPriorityFeePerGas is the maximum priority fee configured by the sender of a transaction that is used to incentive the
prioritization of a transaction in a block.

Although Elysium is Ethereum-compatible, it is also a Substrate-based chain at its core, and priorities work differently
in Substrate than in Ethereum. In Substrate, transactions are not prioritized by gas price. To address this, Elysium
uses a modified prioritization system that reprioritizes Substrate transactions using an Ethereum-first solution. A
Substrate transaction still goes through the validity process, where it is assigned transaction tags, longevity, and a
priority. The original priority is then overwritten with a new priority based on the transaction’s fee per gas, which is
derived from the transaction’s tip and weight. If the transaction is an Ethereum transaction, the priority is set
according to the priority fee.

It’s important to note that priority is not the sole component responsible for determining the order of transactions in
a block. Other components, such as the longevity of a transaction, also play a role in the sorting process.

The values of GasPrice, MaxFeePerGas and MaxPriorityFeePerGas for the applicable transaction types can be read from the
block JSON object according to the structure described in the Sidecar API page.

The data for an Ethereum transaction in a particular block can be extracted from the following block endpoint:

```js 
GET / blocks / {blockId}
```

The paths to the relevant values have also truncated and reproduced below:

#### EIP 1559

| EVM Field            | Block JSON Field                                                           |
|----------------------|----------------------------------------------------------------------------|
| MaxFeePerGas         | extrinsics[extrinsic_number].args.transaction.eip1559.maxFeePerGas         |
| MaxPriorityFeePerGas | extrinsics[extrinsic_number].args.transaction.eip1559.maxPriorityFeePerGas |

#### Legacy

| EVM Field | Block JSON Field                                              |
|-----------|---------------------------------------------------------------|
| GasPrice  | extrinsics[extrinsic_number].args.transaction.legacy.gasPrice |

#### EIP-2930

| EVM Field | Block JSON Field                                               |
|-----------|----------------------------------------------------------------|
| GasPrice  | extrinsics[extrinsic_number].args.transaction.eip2930.gasPrice |

## Transaction Weight

TransactionWeight is a Substrate mechanism used to measure the execution time a given transaction takes to be executed
within a block. For all transactions types, TransactionWeight can be retrieved under the event of the relevant extrinsic
where the method field is set to:

```
pallet: "system", method: "ExtrinsicSuccess"
```

And then TransactionWeight is mapped to the following field of the block JSON object:

```js
extrinsics[extrinsic_number].events[event_number].data[0].weight
```

## Key Differences with Ethereum

As seen in the sections above, there are some key differences between the transaction fee model on Elysium and the one
on Ethereum that developers should be mindful of when developing on Elysium:

- The dynamic fee mechanism resembles that of EIP-1559 but the implementation is different
- The amount of gas used in Elysium's transaction fee model is mapped from the transaction's Substrate extrinsic weight
  value via a fixed factor of 25000. This value is then multiplied by the unit gas price to calculate the transaction
  fee. This fee model means it can potentially be significantly cheaper to send transactions such as basic balance
  transfers via the Ethereum API than the Substrate API

## Fee History Endpoint

Elysium networks implement the eth_feeHistory JSON-RPC endpoint as a part of the support for EIP-1559.

`eth_feeHistory` returns a collection of historical gas information from which you can reference and calculate what to
set for the `MaxFeePerGas` and `MaxPriorityFeePerGas` fields when submitting EIP-1559 transactions.

## Sample Code for Calculating Transaction Fees

The following code snippet uses the Axios HTTP client to query the Sidecar endpoint /blocks/head for the latest
finalized block. It then calculates the transaction fees of all transactions in the block according to the transaction
type (for Ethereum API: legacy, EIP-1559 or EIP-2930 standards, and for Substrate API), as well as calculating the total
transaction fees in the block.

The following code sample is for demo purposes only and should not be used without modification and further testing in a
production environment.

You can use the following snippet for any Elysium-based network, but you'll need to modify the baseFee accordingly. You
can refer back to the Base Fee section to get the calculation for each network.

```js
const axios = require('axios');

// This script calculates the transaction fees of all transactions in a block
// according to the transaction type (for Ethereum API: legacy, EIP-1559 or
// EIP-2930 standards, and Substrate API) using the dynamic fee mechanism.
// It also calculates the total fees in the block

// Endpoint to retrieve the latest block
const endpointBlock = 'http://127.0.0.1:8080/blocks/head';
// Endpoint to retrieve the latest nextFeeMultiplier
const endpointPallet =
    'http://127.0.0.1:8080/pallets/transaction-payment/storage/nextFeeMultiplier?at=';
// Endpoint to retrieve the node client's information
const endpointNodeVersion = 'http://127.0.0.1:8080/node/version';

// Define the minimum base fee for each network
const baseFee = {
    elysium: 100000000000n
}

async function main() {
    try {
        // Create a variable to sum the transaction fees in the whole block
        let totalFees = 0n;

        // Find which Elysium network the Sidecar is pointing to
        const response_client = await axios.get(endpointNodeVersion);
        const network = response_client.data.clientImplName;

        // Retrieve the block from the Sidecar endpoint
        const response_block = await axios.get(endpointBlock);
        // Retrieve the block height of the current block
        console.log('Block Height: ' + response_block.data.number);

        // Find the block's nextFeeMultiplier
        const response_pallet = await axios.get(
            endpointPallet + response_block.data.number
        );

        // Iterate through all extrinsics in the block
        response_block.data.extrinsics.forEach((extrinsic) => {
            // Create an object to store transaction information
            let transactionData = new Object();
            // Set the network field
            transactionData['network'] = network;

            // Filter for Ethereum Transfers
            if (
                extrinsic.method.pallet === 'ethereum' &&
                extrinsic.method.method === 'transact'
            ) {
                // Iterate through the events to get non type specific parameters
                extrinsic.events.forEach((event) => {
                    if (
                        event.method.pallet === 'ethereum' &&
                        event.method.method === 'Executed'
                    ) {
                        // Get Transaction Hash
                        transactionData['hash'] = event.data[2];
                    }
                    if (
                        event.method.pallet === 'system' &&
                        event.method.method === 'ExtrinsicSuccess'
                    ) {
                        // Add correction weight if needed to Transaction Weight!
                        transactionData['weight'] = BigInt(event.data[0].weight.refTime);
                    }
                });

                // Get the transaction type and type specific parameters and compute the
                // transaction fee
                if (extrinsic.args.transaction.legacy) {
                    transactionData['txType'] = 'legacy';
                    transactionData['gasPrice'] = BigInt(
                        extrinsic.args.transaction.legacy.gasPrice
                    );
                    transactionData['txFee'] =
                        (transactionData['gasPrice'] * transactionData['weight']) / 25000n;
                } else if (extrinsic.args.transaction.eip1559) {
                    transactionData['txType'] = 'eip1599';
                    transactionData['maxFeePerGas'] = BigInt(
                        extrinsic.args.transaction.eip1559.maxFeePerGas
                    );
                    transactionData['maxPriorityFeePerGas'] = BigInt(
                        extrinsic.args.transaction.eip1559.maxPriorityFeePerGas
                    );
                    // Update based on the network you're getting tx fees for
                    transactionData['baseFee'] =
                        (BigInt(response_pallet.data.value) * baseFee.elysium) /
                        BigInt('1000000000000000000');

                    // Gas price dependes on the MaxFeePerGas and MaxPriorityFeePerGas set
                    transactionData['gasPrice'] =
                        transactionData['baseFee'] +
                        transactionData['maxPriorityFeePerGas'] <
                        transactionData['maxFeePerGas']
                            ? transactionData['baseFee'] +
                            transactionData['maxPriorityFeePerGas']
                            : transactionData['maxFeePerGas'];

                    transactionData['txFee'] =
                        (transactionData['gasPrice'] * transactionData['weight']) / 25000n;
                } else if (extrinsic.args.transaction.eip2930) {
                    transactionData['txType'] = 'eip2930';
                    transactionData['gasPrice'] = BigInt(
                        extrinsic.args.transaction.eip2930.gasPrice
                    );
                    transactionData['txFee'] =
                        (transactionData['gasPrice'] * transactionData['weight']) / 25000n;
                }

                // Increment totalFees
                totalFees += transactionData['txFee'];

                // Display the tx information to console
                console.log(transactionData);
            }
                // Filter for Substrate transactions, check if the extrinsic has a
            // 'TransactionFeePaid' event
            else {
                extrinsic.events.forEach((event) => {
                    if (
                        event.method.pallet === 'transactionPayment' &&
                        event.method.method === 'TransactionFeePaid'
                    ) {
                        transactionData['txType'] = 'substrate';
                        transactionData['txFee'] = event.data[1];
                        transactionData['tip'] = event.data[1];
                    }
                    if (
                        event.method.pallet === 'system' &&
                        event.method.method === 'ExtrinsicSuccess'
                    ) {
                        transactionData['weight'] = event.data[0].weight.refTime;
                    }
                });
            }
        });

        // Output the total amount of fees in the block
        console.log('Total fees in block: ' + totalFees);
    } catch (err) {
        console.log(err);
    }
}

main();
```
