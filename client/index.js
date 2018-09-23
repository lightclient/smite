#!/usr/bin/env node
// let program = require('commander');

// program
// 	.arguments('<file>')
// 	.option('-p, --password <password>', 'The user\'s password')
// 	.action(function(file) {
// 	console.log('user: %s pass: %s file: %s',
// 	    program.username, program.password, file);
// 	})
// 	.parse(process.argv);

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const secrets = require( '../secrets.json');

const bouncer_proxy_abi = [{"constant":true,"inputs":[{"name":"_operator","type":"address"},{"name":"_role","type":"string"}],"name":"checkRole","outputs":[],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_bouncer","type":"address"}],"name":"removeBouncer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_operator","type":"address"},{"name":"_role","type":"string"}],"name":"hasRole","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"nonce","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_bouncer","type":"address"}],"name":"addBouncer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ROLE_BOUNCER","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Received","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"signature","type":"bytes"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Forwarded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"operator","type":"address"},{"indexed":false,"name":"role","type":"string"}],"name":"RoleAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"operator","type":"address"},{"indexed":false,"name":"role","type":"string"}],"name":"RoleRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_signature","type":"bytes"},{"name":"_sender","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"forward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const counter_abi = [{"constant":true,"inputs":[],"name":"count","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Received","type":"event"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"increment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const provider = new HDWalletProvider(secrets.mnemonic, 'https://rinkeby.infura.io', 0, 10);
const web3 = new Web3(provider);

async function handler() {
	const userAddress = (await web3.eth.getAccounts())[9];
	const wallet = provider.wallets[userAddress.toLowerCase()]
	const private_key = '0x' + wallet._privKey.toString('hex');

	web3.eth.accounts.wallet.add(private_key);

	bouncer_proxy = new web3.eth.Contract(bouncer_proxy_abi, '0x211e2bee48ff7a8c71d3913df8699930f42a21c5')
	counter = new web3.eth.Contract(counter_abi, '0x5268AC2AfBFfA41c01DFD6111F47089179C1bd73');

	const nonce = await bouncer_proxy.methods.nonce(userAddress).call();

	const txData = counter.methods.increment(1).encodeABI();

	const parts = {
          proxy: '0x211e2bee48ff7a8c71d3913df8699930f42a21c5',
          from: userAddress,
          to: counter._address,
          value: web3.utils.toTwosComplement(0),
          rawTransaction: txData,
          rewardAddress: '0x0000000000000000000000000000000000000000',
          /*web3.utils.toTwosComplement(rewardAmount),*/
          rewardAmount: web3.utils.toTwosComplement(0),
          nonce: web3.utils.toTwosComplement(nonce),
    }

    const messageHash = web3.utils.keccak256(Object.values(parts));

    let signature = await web3.eth.sign(String(messageHash), userAddress);

    let params = {
      gas: 120000,
      messageHash,
      parts,
      signature,
    }

  console.log('Account balance:', web3.utils.fromWei(await web3.eth.getBalance(userAddress), 'ether'), 'ETH\n')

	console.log(params)

	process.exit()
}

handler();






