---
title: Hardhat
description: Learn how to use Hardhat, an Ethereum development environment, to compile, deploy, and debug Solidity smart contracts on Elysium.
---
# Using Hardhat to Deploy to Elysium

[Hardhat](https://hardhat.org/) is an Ethereum development environment that helps developers manage and
automate the recurring tasks inherent to building smart contracts and DApps. Hardhat can directly interact with
Elysium Ethereum API, so it can also be used to deploy smart contracts into Elysium.

This guide will cover how to use Hardhat to compile, deploy, and debug Ethereum smart contracts on the Atlantis Testnet.
This guide can also be adapted for Elysium Mainnet.

## Checking Prerequisites

To get started, you will need the following:

- Have MetaMask installed.
- An account with funds. You can get LAVA for testing on once every 24 hours
  from [Elysium Faucet](https://faucet.atlantischain.network/ )
- To test out the examples in this guide on Elysium, you will need to have your own endpoint and API key,
  which you can get from one of the supported [Endpoint Providers](/docs/network-endpoints).

## Creating a Hardhat Project

You will need to create a Hardhat project if you don't already have one. You can create one by completing the following
steps:

1. Create a directory for your project
    ```
    mkdir hardhat && cd hardhat
    ```
2. Initialize the project which will create a `package.json` file
    ```
    npm init -y
    ```
3. Install Hardhat
    ```
    npm install hardhat
    ```
4. Create a project
    ```
    npx hardhat
    ```

> **_NOTE:_**
> `npx` is used to run executables installed locally in your project. Although Hardhat can be installed globally, it is
> recommended to install it locally in each project so that you can control the version on a project by project basis.

5. A menu will appear which will allow you to create a new project or use a sample project. For this example, you can
   choose **Create an empty hardhat.config.js**

This will create a Hardhat config file (`hardhat.config.js`) in your project directory.

Once you have your Hardhat project, you can also install
the [Ethers plugin](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html). This provides a
convenient way to use the [Ethers.js](/docs/build/ethereum-api/libraries/EthersJs) library to interact
with the network. To install it, run the following command:

```
npm install @nomiclabs/hardhat-ethers ethers
```

## The Contract File

With your empty project created, next you are going to create a `contracts` directory. You can do so by running the
following command:

```
mkdir contracts && cd contracts
```

The smart contract that you'll deploy as an example will be called `Box`, it will let you store a value that can be
retrieved later. In the `contracts` directory, you can create the `Box.sol` file:

```
touch Box.sol
```

Open the file and add the following contract to it:

```solidity
// contracts/Box.sol
pragma solidity ^0.8.1;

contract Box {
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}
```

## Hardhat Configuration File

Before you can deploy the contract to Elysium, you'll need to modify the Hardhat configuration file and create a
secure file to store your private key in.

You can create a `secrets.json` file to store your private key by running:

```
touch secrets.json
```

Then add your private key to it:

```json
{
  "privateKey": "YOUR_PRIVATE_KEY_HERE"
}
```

Make sure to add the file to your project's `.gitignore`, and to never reveal your private key.

> **_Remember:_**
> Please always manage your private keys with a designated secret manager or similar service. Never save or commit your
> private keys inside your repositories.

Next you can take the following steps to modify the `hardhat.config.js` file and add Elysium as a network:

1. Import plugins. The Hardhat Ethers plugin comes out of the box with Hardhat, so you don't need to worry about
   installing it yourself
2. Import the secrets.json file
3. Inside the `module.exports`, you need to provide the Solidity version
4. Add the Elysium network configuration

```js
// 1. Import the Ethers plugin required to interact with the contract
require('@nomiclabs/hardhat-ethers');

// 2. Import your private key from your pre-funded Elysium testing account
const {privateKey} = require('./secrets.json');

module.exports = {
    // 3. Specify the Solidity version
    solidity: '0.8.1',

    networks: {
        // 4. Add the Elysium Alpha network specification
        elysium: {
            url: {{ networks.elysium.rpc_url }},
            chainId: {{ networks.elysium.chain_id }}, // 0x507 in hex,
            accounts: [privateKey]
        }
    }
};
```

You can modify the `hardhat.config.js` file to use any of the Elysium networks:


```js
elysium: {
   url: '{{ networks.elysium.rpc_url }}', // Insert your RPC URL here
   chainId: {{ networks.elysium.chain_id }}, // (hex: {{ networks.elysium.hex_chain_id }}),
   accounts: [privateKey]
},
```

Congratulations! You are now ready for deployment!

## Compiling Solidity

To compile the contract you can simply run:

```
npx hardhat compile
```

![Hardhat Contract Compile](img/dev-env/hardhat/hardhat-2.png)

After compilation, an `artifacts` directory is created: it holds the bytecode and metadata of the contract, which
are `.json` files. It’s a good idea to add this directory to your `.gitignore`.

## Deploying the Contract

In order to deploy the `Box.sol` smart contract, you will need to write a simple deployment script. You can create a new
directory for the script and name it `scripts` and add a new file to it called `deploy.js`:

```
mkdir scripts && cd scripts
touch deploy.js
```

Next, you need to write your deployment script which can be done using `ethers`. Because you'll be running it with
Hardhat, you don't need to import any libraries.

To get started, take the following steps:

1. Create a local instance of the contract with the `getContractFactory` method
2. Use the `deploy` method that exists within this instance to instantiate the smart contract
3. Wait for the deployment by using `deployed`
4. Once deployed, you can fetch the address of the contract using the contract instance.

```js
// scripts/deploy.js
async function main() {
    // 1. Get the contract to deploy
    const Box = await ethers.getContractFactory('Box');
    console.log('Deploying Box...');

    // 2. Instantiating a new Box smart contract
    const box = await Box.deploy();

    // 3. Waiting for the deployment to resolve
    await box.deployed();

    // 4. Use the contract instance to get the contract address
    console.log('Box deployed to:', box.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

You can now deploy the `Box.sol` contract using the `run` command and specifying `elysium` as the network:

```
npx hardhat run --network elysium scripts/deploy.js
```

If you're using another Elysium network, make sure that you specify the correct network. The network name needs to
match how it's defined in the `hardhat.config.js`.

After a few seconds, the contract is deployed, and you should see the address in the terminal.


Congratulations, your contract is live! Save the address, as you will use it to interact with this contract instance in
the next step.

## Interacting with the Contract

To interact with your newly deployed contract on Elysium, you can launch the Hardhat `console` by running:

```
npx hardhat console --network elysium
```

Next you can take the following steps, entering in one line at a time:

1. Create a local instance of the `Box.sol` contract
    ```js
    const Box = await ethers.getContractFactory('Box');
    ```
2. Connect the local instance to the deployed contract, using the address of the contract
    ```js
    const box = await Box.attach('0x425668350bD782D80D457d5F9bc7782A24B8c2ef');
    ```
3. Interact with the attached contract. For this example, you can call the `store` method and store a simple value
    ```js
    await box.store(5)
    ```

The transaction will be signed by your Elysium account and be broadcasted to the network.

Notice your address labeled `from`, the address of the contract, and the `data` that is being passed. Now, you can
retrieve the value by running:

```js
(await box.retrieve()).toNumber()
```

You should see `5` or the value you have stored initially.

Congratulations, you have successfully deployed and interacted with a contract using Hardhat!