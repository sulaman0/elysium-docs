---
sidebar_position: 1
---

# Accounts

While Elysium strives to be compatible with Ethereum’s Web3 API and EVM, there are some important Elysium differences
that developers should know and understand in terms of account balances.

One of the design goals of Elysium is to create an environment that is as close as possible to Ethereum and to offer a
set of Web3 RPC endpoints that are compatible with Ethereum. However, Elysium is also a Substrate-based chain, which
means that it exposes Substrate RPCs

Elysium uses the SS58 address format for account creation. The SS58 address format is an enhanced version of base-58 encoding. The important characteristics of the SS58 address format include:

- Encoded addresses consist of 58 alphanumeric characters, resulting in a shorter and more identifiable address than a hex-encoded address.
- Addresses don't use characters that can be difficult to distinguish from each other in a string.
  For example, the characters `0`, `O`, `I`, and `l` aren't used in SS58 addresses.
- Addresses can use derivation paths to create multiple addresses from the same public key so you can use different addresses for different purposes.
  For example, you can create sub-accounts for separating funds or executing specific types of transactions.
- Addresses can be verified using a checksum to prevent input errors.

on the other hand, Etherum has H160 or 20 byte addresses starting with 0x. so the first 160 LE bytes of an Elysium address are used to form the H160 address. and both addresses have 1 to 1 mapping. Users can use the tools provided in Explorer to generate Elysium native addresses from EVM addresses. 
