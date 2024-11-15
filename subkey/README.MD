The `subkey` program is a key generation and management utility that is included in the Substrate repository.
You can use the `subkey` program to perform the following tasks:

- Generate and inspect cryptographically-secure public and private key pairs.
- Restore keys from secret phrases and raw seeds.
- Sign and verify signatures on messages.
- Sign and verify signatures for encoded transactions.
- Derive hierarchical deterministic child key pairs.

## Generate a new account key

To generate a new key pair that uses the sr25519 signature scheme, run the following command:

```bash
subkey generate
```

The command displays output similar to the following with a 12-word secret phrase:

```text
Secret phrase:       bread tongue spell stadium clean grief coin rent spend total practice document
  Secret seed:       0xd5836897dc77e6c87e5cc268abaaa9c661bcf19aea9f0f50a1e149d21ce31eb7
  Public key (hex):  0xb6a8b4b6bf796991065035093d3265e314c3fe89e75ccb623985e57b0c2e0c30
  Account ID:        0xb6a8b4b6bf796991065035093d3265e314c3fe89e75ccb623985e57b0c2e0c30
  Public key (SS58): 5GCCgshTQCfGkXy6kAkFDW1TZXAdsbCNZJ9Uz2c7ViBnwcVg
  SS58 Address:      5GCCgshTQCfGkXy6kAkFDW1TZXAdsbCNZJ9Uz2c7ViBnwcVg
```
To generate a more secure key pair that uses the `ed25519` signature scheme and an 24-word secret phrase for the `moonriver` network, you would run the following command:

```bash
subkey generate --scheme ed25519 --words 24 --network moonriver
```

The command displays the same fields as output, but uses the Ed25519 signature scheme, a 24-word secret phrase, and the address format for the `moonriver` network.

```text
Secret phrase:       cloth elevator sadness twice arctic adjust axis vendor grant angle face section key safe under fee fine garage pupil hotel museum valve popular motor
  Secret seed:       0x5fa5923c1d6753fa30f268ffd363efb730ca0db906f55bc17efe65cd24f92097
  Public key (hex):  0x3f1da4d35489e3d84739de1490f51b567ad2a62793cca1357e624fbfa534fc85
  Account ID:        0x3f1da4d35489e3d84739de1490f51b567ad2a62793cca1357e624fbfa534fc85
  Public key (SS58): VkFLVqcighJnssSbL4LDSGy5ShJQZvYhm7G8K8W1ZXt96Z5VG
  SS58 Address:      VkFLVqcighJnssSbL4LDSGy5ShJQZvYhm7G8K8W1ZXt96Z5VG
```

To generate a key that is password-protected, run the `subkey generate` command using the `--password <password>` option.
For example:

```bash
subkey generate --password "pencil laptop kitchen cutter"
```

After you generate a key that requires a password, you can retrieve it by including the `--password` option and password string in the command line or by adding three slashes (`///`) at the end of the secret phrase.
Remember that it is important to keep passwords, secret phrases, and secret seeds secure and to back them up in a secure location.

## Generate node key for elysium

Use the `subkey generate-node-key` command to generate random public and private keys for peer-to-peer (`libp2p`) communication between Elysium nodes.
The public key is the peer identifier that is used in chain specification files or as a command-line argument to identify a node participating in the blockchain network.
In most cases, you run this command with a command-line option to save the private key to a file.
#### Examples
To generate a random key pair for peer-to-peer communication run a command similar to the following:

```bash
subkey generate-node-key 
```
The command displays output similar to the following:

```text
12D3KooWGdw55Xcg5N2jcFzA5eAscjKmpopyntsk8MdgiGCXpodK
d1f036e7b462067f87f39342f4e3cfa5dbea4eac1fe5cbad269aa14abaf418c4
```
