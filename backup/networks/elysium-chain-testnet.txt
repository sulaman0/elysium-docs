---
sidebar_position: 2
---

# Elysium Development Node

A Elysium development node is your own personal development environment for building and testing applications
on Elysium. For Ethereum developers, it is comparable to Hardhat Network or Ganache. It enables you to get started
quickly
and easily without the overhead of a relay chain. You can spin up your node with the --sealing option to author blocks
instantly, manually, or at a custom interval after transactions are received. By default, a block will be created when a
transaction is received, which is similar to the default behavior of Hardhat Network and Ganache’s instamine feature.

If you follow this guide to the end, you will have a Elysium development node running in your local environment with 10
pre-funded accounts.

> **_NOTE:_**
>
> This tutorial was created using the v0.31.1 tag of Elysium. The Elysium platform and the Frontier components
> it relies on for Substrate-based Ethereum compatibility are still under very active development. The examples in this
> guide assume you have a MacOS or Ubuntu 18.04-based environment and will need to be adapted accordingly for Windows.