---
title: Ethers.rs
description: Learn how to use the Ethereum EthersRS Library to send transactions and deploy Solidity smart contracts to Elysium via the Rust language.
---

# Ethers.rs Rust Library

The [Ethers.rs](https://ethers.rs) library provides a set of tools to interact with Ethereum Nodes via
the Rust programming language that works similar to [Ethers.js](/docs/build/ethereum-api/libraries/EthersJs).
Elysium has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations.
Therefore, developers can leverage this compatibility and use the Ethers.rs library to interact with a Elysium node as
if they were doing so on Ethereum. You can read more about how to use Ethers.rs on
their [official crate documentation](https://docs.rs/crate/ethers/latest).

In this guide, you'll learn how to use the Ethers.rs library to send a transaction and deploy a contract on Atlantis
. This guide can be adapted for [Elysium](/docs/network-endpoints).

## Checking Prerequisites

For the examples in this guide, you will need to have the following:

- An account with funds. You can get LAVA for testing on once every 24 hours
  from [Elysium Faucet](https://faucet.atlantischain.network/ )
- To test out the examples in this guide on Elysium, you will need to have your own endpoint and API key,
  which you can get from one of the supported [Endpoint Providers](/docs/network-endpoints).
- Have [Rust installed](https://www.rust-lang.org/tools/install) on your device
- Have [solc installed](https://docs.soliditylang.org/en/v0.8.1/installing-solidity.html) on your device. Using
  [solc-select](https://github.com/crytic/solc-select) is recommended by the Ethers.rs package

> **_NOTE:_**
> The examples in this guide assumes you have a macOS or Ubuntu 20.04-based environment and will need to be adapted
> accordingly for Windows.

## Create a Rust Project

To get started, you can create a new Rust project with the Cargo tool:

```
cargo init ethers-examples && cd ethers-examples
```

For this guide, you'll need to install the Ethers.rs library among others. To tell the Rust project to install it, you
must edit the `Cargo.toml` file that's included with the document to include it under dependencies:

```toml
[package]
name = "ethers-examples"
version = "0.1.0"
edition = "2021"

[dependencies]
ethers = "1.0.2"
ethers-solc = "1.0.2"
tokio = { version = "1", features = ["full"] }
serde_json = "1.0.89"
serde = "1.0.149"
```

This example is using the `ethers` and `ethers-solc` crate versions `1.0.2` for RPC interactions and Solidity compiling.
It also includes the `tokio` crate to run asynchronous Rust environments, since interacting with RPCs requires
asynchronous code. Finally, it includes the `serde_json` and `serde` crates to help serialize/deserialize this example's
code.

If this is your first time using `solc-select`, you'll need to install and configure the Solidity version using the
following commands:

```
solc-select install 0.8.1 && solc-select use 0.8.1
```

## Setting up the Ethers Provider and Client

Throughout this guide, you'll be writing multiple functions that provide different functionality such as sending a
transaction, deploying a contract, and interacting with a deployed contract. In most of these scripts you'll need to use
an [Ethers provider](https://docs.rs/ethers-providers/latest/ethers_providers/index.html) or
an [Ethers signer client](https://docs.rs/ethers/1.0.2/ethers/middleware/struct.SignerMiddleware.html) to
interact with the network.

There are multiple ways to create a provider and signer, but the easiest way is through `try_from`. In the `src/main.rs`
file, you can take the following steps:

1. Import `Provider` and `Http` from the `ethers` crate
2. Add a `Client` type for convenience, which will be used once you start to create the functions for sending a
   transaction and deploying a contract
3. Add a `tokio` attribute above `async fn main()` for asynchronous excution
4. Use `try_from` to attempt to instantiate a JSON RPC provider object from an RPC endpoint
5. Use a private key to create a wallet object (the private key will be used to sign transactions). **Note: This is for
   example purposes only. Never store your private keys in a plain Rust file**
6. Wrap the provider and wallet together into a client by providing them to a `SignerMiddleware` object

```rust
// 1. Import ethers crate
use ethers::providers::{Provider, Http};

// 2. Add client type
type Client = SignerMiddleware<Provider<Http>, Wallet<k256::ecdsa::SigningKey>>;

// 3. Add annotation
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 4. Use try_from with RPC endpoint
    let provider = Provider::<Http>::try_from(
        "INSERT_RPC_API_ENDPOINT"
    )?;
    // 5. Use a private key to create a wallet
    // Do not include the private key in plain text in any production code
    // This is just for demonstration purposes
    // Do not include '0x' at the start of the private key
    let wallet: LocalWallet = "YOUR_PRIVATE_KEY"
        .parse::<LocalWallet>()?
        .with_chain_id(Chain::Elysium);

    // 6. Wrap the provider and wallet together to create a signer client
    let client = SignerMiddleware::new(provider.clone(), wallet.clone());
    Ok(())
}
```

## Send a Transaction

During this section, you'll be creating a couple of functions, which will be contained in the same `main.rs` file to
avoid additional complexity from implementing modules. The first function will be to check the balances of your accounts
before trying to send a transaction. The second function will actually send the transaction. To run each of these
functions, you will edit the `main` function and run the `main.rs` script.

You should already have your provider and client set up in `main.rs` in the way described in
the [previous section](#setting-up-the-ethers-provider-and-client). In order to send a transaction, you'll need to add a
few more lines of code:

1. Add `use ethers::{utils, prelude::*};` to your imports, which will provide you access to utility functions and the
   prelude imports all the necessary data types and traits
2. As you'll be sending a transaction from one address to another, you can specify the sending and receiving addresses
   in the `main` function. **Note: the `address_from` value should correspond to the private key that is used in
   the `main` function**

```rust
// ...
// 1. Add to imports
use ethers::{utils, prelude::*};

// ...

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 2. Add from and to address
    let address_from = "YOUR_FROM_ADDRESS".parse::<Address>()?
    let address_to = "YOUR_TO_ADDRESS".parse::<Address>()?
}
```

### Check Balances Function

Next, you will create the function for getting the sending and receiving accounts' balances by completing the following
steps:

1. Create a new asynchronous function named `print_balances` that takes a provider object's reference and the sending
   and receiving addresses as input
2. Use the `provider` object's `get_balance` function to get the balances of the sending and receiving addresses of the
   transaction
3. Print the resultant balances for the sending and receiving addresses
4. Call the `print_balances` function in the `main` function

```rust
// ...

// 1. Create an asynchronous function that takes a provider reference and from and to address as input
async fn print_balances(provider: &Provider<Http>, address_from: Address, address_to: Address) -> Result<(), Box<dyn std::error::Error>> {
    // 2. Use the get_balance function
    let balance_from = provider.get_balance(address_from, None).await?;
    let balance_to = provider.get_balance(address_to, None).await?;

    // 3. Print the resultant balance
    println!("{} has {}", address_from, balance_from);
    println!("{} has {}", address_to, balance_to);

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 4. Call print_balances function in main
    print_balances(&provider).await?;

    Ok(())
}
```

### Send Transaction Script

For this example, you'll be transferring 1 LAVA from an origin address (of which you hold the private key) to another
address.

1. Create a new asynchronous function named `send_transaction` that takes a client object's reference and the sending
   and receiving addresses as input
2. Create the transaction object, and include the `to`, `value`, and `from`. When writing the `value` input, use
   the `ethers::utils::parse_ether` function
3. Use the `client` object to send the transaction
4. Print the transaction after it is confirmed
5. Call the `send_transaction` function in the `main` function

```rust
// ...

// 1. Define an asynchronous function that takes a client provider and the from and to addresses as input
async fn send_transaction(client: &Client, address_from: Address, address_to: Address) -> Result<(), Box<dyn std::error::Error>> {
    println!(
        "Beginning transfer of 1 native currency from {} to {}.",
        address_from, address_to
    );

    // 2. Create a TransactionRequest object
    let tx = TransactionRequest::new()
        .to(address_to)
        .value(U256::from(utils::parse_ether(1)?))
        .from(address_from);
        
    // 3. Send the transaction with the client
    let tx = client.send_transaction(tx, None).await?.await?;

    // 4. Print out the result
    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 5. Call send_transaction function in main
    send_transaction(&client, address_from, address_to).await?;

    Ok(())
}
```

To run the script, which will send the transaction and then check the balances once the transaction has been sent, you
can run the following command:

```
cargo run
```

If the transaction was succesful, in your terminal you'll see the transaction details printed out along with the balance
of your address.

## Deploy a Contract

The contract you'll be compiling and deploying in the next couple of sections is a simple incrementer contract,
arbitrarily named Incrementer.sol. You can get started by creating a file for the contract:

```
touch Incrementer.sol
 ```

Next you can add the Solidity code to the file:

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Incrementer {
    uint256 public number;

    constructor(uint256 _initialNumber) {
        number = _initialNumber;
    }

    function increment(uint256 _value) public {
        number = number + _value;
    }

    function reset() public {
        number = 0;
    }
}
```

The `constructor` function, which runs when the contract is deployed, sets the initial value of the number variable
stored
on-chain (default is 0). The `increment` function adds the `_value` provided to the current number, but a transaction
needs
to be sent, which modifies the stored data. Lastly, the reset function resets the stored value to zero.

During the rest of this section, you'll be creating a couple of functions, which will be contained in the `main.rs` file
to avoid additional complexity from implementing modules. The first function will be to compile and deploy the contract.
The remaining functions will interact with the deployed contract.

You should already have your provider and client set up in `main.rs` in the way described in
the [Setting up the Ethers Provider and Client section](#setting-up-the-ethers-provider-and-client).

Before getting started with the contract deployment, you'll need to add a few more imports to your `main.rs` file:

```rust
use ethers_solc::Solc;
use ethers::{prelude::*};
use std::{path::Path, sync::Arc};
```

The `ethers_solc` import will be used to compile the smart contract. The `prelude` from Ethers imports some necessary
data types and traits. Lastly, the `std` imports will enable you to store your smart contracts and wrap the client into
an `Arc` type for thread safety.

### Compile and Deploy Contract Script

This example function will compile and deploy the `Incrementer.sol` smart contract you created in the previous section.
The `Incrementer.sol` smart contract should be in the root directory. In the `main.rs` file, you can take the following
steps:

1. Create a new asynchronous function named `compile_deploy_contract` that takes a client object's reference as input,
   and returns an address in the form of `H160`
2. Define a variable named `source` as the path for the directory that hosts all of the smart contracts that should be
   compiled, which is the root directory
3. Use the `Solc` crate to compile all of the smart contracts in the root directory
4. Get the ABI and bytecode from the compiled result, searching for the `Incrementer.sol` contract
5. Create a contract factory for the smart contract using the ABI, bytecode, and client. The client must be wrapped into
   an `Arc` type for thread safety
6. Use the factory to deploy. For this example, the value `5` is used as the initial value in the constructor
7. Print out the address after the deployment
8. Return the address
9. Call the `compile_deploy_contract` function in `main`

```rust
// ...

// 1. Define an asynchronous function that takes a client provider as input and returns H160
async fn compile_deploy_contract(client: &Client) -> Result<H160, Box<dyn std::error::Error>> {
    // 2. Define a path as the directory that hosts the smart contracts in the project
    let source = Path::new(&env!("CARGO_MANIFEST_DIR"));

    // 3. Compile all of the smart contracts
    let compiled = Solc::default()
        .compile_source(source)
        .expect("Could not compile contracts");

    // 4. Get ABI & Bytecode for Incrementer.sol
    let (abi, bytecode, _runtime_bytecode) = compiled
        .find("Incrementer")
        .expect("could not find contract")
        .into_parts_or_default();

    // 5. Create a contract factory which will be used to deploy instances of the contract
    let factory = ContractFactory::new(abi, bytecode, Arc::new(client.clone()));

    // 6. Deploy
    let contract = factory.deploy(U256::from(5))?.send().await?;
    
    // 7. Print out the address
    let addr = contract.address();
    println!("Incrementer.sol has been deployed to {:?}", addr);

    // 8. Return the address
    Ok(addr)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 9. Call compile_deploy_contract function in main
    let addr = compile_deploy_contract(&client).await?;

    Ok(())
}
```

### Read Contract Data (Call Methods)

Call methods are the type of interaction that don't modify the contract's storage (change variables), meaning no
transaction needs to be sent. They simply read various storage variables of the deployed contract.

Rust is typesafe, which is why the ABI for the `Incrementer.sol` contract is required to generate a typesafe Rust
struct. For this example, you should create a new file in the root of the Cargo project called `Incrementer_ABI.json`:

```
touch Incrementer_ABI.json
```

The ABI for `Incrementer.sol` is below, which should be copied and pasted into the `Incrementer_ABI.json` file:

```json
[
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "number",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```

Then you can take the following steps to create a function that reads and returns the `number` method of
the `Incrementer.sol` contract:

1. Generate a type-safe interface for the `Incrementer` smart contract with the `abigen` macro
2. Create a new asynchronous function named `read_number` that takes a client object's reference and a contract address
   reference as input, and returns a U256
3. Create a new instance of the `Incrementer` object generated by the abigen macro with the client and contract address
   values
4. Call the `number` function in the new `Incrementer` object
5. Print out the resultant value
6. Return the resultant value
7. Call the `read_number` function in `main`

```rust
// ...

// 1. Generate a type-safe interface for the Incrementer smart contract
abigen!(
    Incrementer,
    "./Incrementer_ABI.json",
    event_derives(serde::Deserialize, serde::Serialize)
);

// 2. Define an asynchronous function that takes a client provider and address as input and returns a U256
async fn read_number(client: &Client, contract_addr: &H160) -> Result<U256, Box<dyn std::error::Error>> {
    // 3. Create contract instance
    let contract = Incrementer::new(contract_addr.clone(), Arc::new(client.clone()));

    // 4. Call contract's number function
    let value = contract.number().call().await?;

    // 5. Print out number
    println!("Incrementer's number is {}", value);

    // 6. Return the number
    Ok(value)
}

// ...

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 7. Call read_number function in main
    read_number(&client, &addr).await?;

    Ok(())
}
```

To run the script, which will deploy the contract and return the current value stored in the `Incrementer` contract, you
can enter the following command into your terminal:

```
cargo run
```

If successful, you'll see the deployed contract's address and initial value set, which should be `5`, displayed in the
terminal.

### Interact with Contract (Send Methods)

Send methods are the type of interaction that modify the contract's storage (change variables), meaning a transaction
needs to be signed and sent. In this section, you'll create two functions: one to increment and one to reset the
incrementer. This section will also require the `Incrementer_ABI.json` file initialized.

Take the following steps to create the function to increment:

1. Ensure that the abigen macro is called for the `Incrementer_ABI.json` somewhere in the `main.rs` file (if it is
   already in the `main.rs` file, you do not have to have a second one)
2. Create a new asynchronous function named `increment_number` that takes a client object's reference and an address as
   input
3. Create a new instance of the `Incrementer` object generated by the abigen macro with the client and contract address
   values
4. Call the `increment` function in the new `Incrementer` object by including a `U256` object as input. In this
   instance, the value provided is `5`
5. Call the `read_number` function in `main`

```rust
// ...

// 1. Generate a type-safe interface for the Incrementer smart contract
abigen!(
    Incrementer,
    "./Incrementer_ABI.json",
    event_derives(serde::Deserialize, serde::Serialize)
);

// 2. Define an asynchronous function that takes a client provider and address as input
async fn increment_number(client: &Client, contract_addr: &H160) -> Result<(), Box<dyn std::error::Error>> {
    println!("Incrementing number...");

    // 3. Create contract instance
    let contract = Incrementer::new(contract_addr.clone(), Arc::new(client.clone()));

    // 4. Send contract transaction
    let tx = contract.increment(U256::from(5)).send().await?.await?;
    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);
    
    Ok(())
}

// ...

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 5. Call increment_number function in main
    increment_number(&client, &addr).await?;

    Ok(())
}
```

To run the script, you can enter the following command into your terminal:

```
cargo run
```

If successful, the transaction receipt will be displayed in the terminal. You can use the `read_number` function in
the `main` function to make sure that value is changing as expected. If you're using the `read_number` function after
incrementing, you'll also see the incremented number, which should be `10`.

Next you can interact with the `reset` function:

1. Ensure that the abigen macro is called for the `Incrementer_ABI.json` somewhere in the `main.rs` file (if it is
   already in the `main.rs` file, you do not have to have a second one)
2. Create a new asynchronous function named `reset` that takes a client object's reference and an address as input
3. Create a new instance of the `Incrementer` object generated by the abigen macro with the client and contract address
   values
4. Call the `reset` function in the new `Incrementer` object
5. Call the `reset` function in `main`

```rust
// ...

// 1. Generate a type-safe interface for the Incrementer smart contract
abigen!(
    Incrementer,
    "./Incrementer_ABI.json",
    event_derives(serde::Deserialize, serde::Serialize)
);

// 2. Define an asynchronous function that takes a client provider and address as input
async fn reset(client: &Client, contract_addr: &H160) -> Result<(), Box<dyn std::error::Error>> {
    println!("Resetting number...");

    // 3. Create contract instance
    let contract = Incrementer::new(contract_addr.clone(), Arc::new(client.clone()));

    // 4. Send contract transaction
    let tx = contract.reset().send().await?.await?;
    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);
    
    Ok(())
}

// ...

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...

    // 5. Call reset function in main
    reset(&client, &addr).await?;

    Ok(())
}
```

If successful, the transaction receipt will be displayed in the terminal. You can use the `read_number` function in
the `main` function to make sure that value is changing as expected. If you're using the `read_number` function after
resetting the number, you should see `0` printed to the terminal.
