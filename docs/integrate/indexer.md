---
title: Indexer
---

# Indexing Elysium with Subsquid

[Subsquid](https://subsquid.io) is a query node framework for Substrate-based blockchains. In very simple terms,
Subsquid can be thought of as an ETL (extract, transform, and load) tool with a GraphQL server included. It enables
comprehensive filtering, pagination, and even full-text search capabilities.

Subsquid has native and full support for both Ethereum Virtual Machine (EVM) and Substrate data. Since Elysium is a
Substrate-based smart contact platform that is EVM-compatible, Subsquid can be used to index both EVM and
Substrate-based data. Subsquid offers a Substrate Archive and Processor and an EVM Archive and Processor. The Substrate
Archive and Processor can be used to index both Substrate and EVM data. This allows developers to extract on-chain data
from any of the Elysium networks and process EVM logs as well as Substrate entities (events, extrinsics, and storage
items) in one single project and serve the resulting data with one single GraphQL endpoint. If you exclusively want to
index EVM data, it is recommended to use the EVM Archive and Processor.

This guide will show you how to create Substrate and EVM projects with Subsquid and configure it to index data on
Elysium.

## Checking Prerequisites

To get started with Subsquid, you'll need to have the following:

- [Node.js](https://nodejs.org/en/download/) version 16 or newer
- [Docker](https://docs.docker.com/get-docker/)
- [Squid CLI](https://docs.subsquid.io/squid-cli/installation/) v2.1.0 or newer

> **_NOTE:_**
> The squid template is not compatible with `yarn`, so you'll need to use `npm` instead.

## Index Substrate Data on Elysium

To get started indexing Substrate data on Elysium, you'll need to create a Subsquid project and configure it for Elysium
by taking the following steps:

1. Create a Subsquid project based on the Substrate template by running:

    ```
    sqd init <insert-squid-name> --template substrate
    ```

   For more information on getting started with this template, please check out
   the [Quickstart: Substrate chains](https://docs.subsquid.io/quickstart/quickstart-substrate/) guide on Subsquid's
   documentation site.

2. To configure your Subsquid project to run on Elysium, you'll need to update the `typegen.json` file.
   The `typegen.json` file is responsible for generating TypeScript interface classes for your data. Depending on the
   network you're indexing data on, the `specVersions` value in the `typegen.json` file should be configured as follows:

#### Elysium

   ```
   "specVersions": "https://Elysium.archive.subsquid.io/graphql",
   ```

3. Modify the `src/processor.ts` file, which is where squids instantiate the processor, configure it, and attach handler
   functions. The processor fetches historical on-chain data from
   an [Archive](https://docs.subsquid.io/archives/overview/), which is a specialized data lake. You'll need to configure
   your processor to pull data from the Archive that corresponds to the network you are indexing data on:

#### Elysium

```js
const processor = new SubstrateBatchProcessor();
processor.setDataSource({
    chain: '{{ networks.elysium.rpc_url }}',
    archive: lookupArchive("elysium", {type: "firesquid"}),
});
```

And that's all you have to do to configure your Subsquid project to index Substrate data on Elysium! Now you can update
the `schema.graphql`, `typgen.json`, and `src/processor.ts` files to index the data you need for your project!

## Index Ethereum Data on Elysium

To get started indexing EVM data on Elysium, you'll need to create a Subsquid project and configure it for Elysium by
taking the following steps:

1. You can create a Subsquid project for EVM data by using the
   generic [EVM template](https://github.com/subsquid-labs/squid-evm-template) or you can use
   the [ABI template](https://github.com/subsquid-labs/squid-abi-template) for indexing data related to a specific
   contract:

   === "EVM"
   ```
   sqd init <insert-squid-name> --template evm
   ```

   === "ABI"
   ```
   sqd init <insert-squid-name> --template abi
   ```

   For more information on getting started with both of these templates, please check out the following Subsquid docs:

    - [Quickstart: EVM chains](https://docs.subsquid.io/quickstart/quickstart-ethereum/)
    - [Quickstart: generate from ABI](https://docs.subsquid.io/quickstart/quickstart-abi/)

2. To configure your Subsquid project to run on Elysium, you'll need to update the `typegen.json` file.
   The `typegen.json` file is responsible for generating TypeScript interface classes for your data. Depending on the
   network you're indexing data on, the `specVersions` value in the `typegen.json` file should be configured as follows:

#### Elysium

   ```
   "specVersions": "https://elysium.archive.subsquid.io/graphql",
   ```

3. Modify the `src/processor.ts` file, which is where squids instantiate the processor, configure it, and attach handler
   functions. The processor fetches historical on-chain data from
   an [Archive](https://docs.subsquid.io/archives/overview/), which is a specialized data lake. You'll need to configure
   your processor to pull data from the Archive that corresponds to the network you are indexing data on:

#### Elysium

```js
   const processor = new EvmBatchProcessor();
processor.setDataSource({
    chain: '{{ networks.Elysium.rpc_url }}',
    // Resolves to "https://Elysium-evm.archive.subsquid.io"
    archive: lookupArchive("elysium", {type: "EVM"})
});
```

And that's all you have to do to configure your Subsquid project to index EVM data on Elysium! Now you can update
the `schema.graphql`, `typgen.json`, and `src/processor.ts` files to index the data you need for your project!