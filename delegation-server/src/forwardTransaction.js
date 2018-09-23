'use strict'
import Web3 from 'web3'
import secrets from '../../secrets.json'

const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io'))
const bouncerProxyABI = [{"constant":true,"inputs":[{"name":"_operator","type":"address"},{"name":"_role","type":"string"}],"name":"checkRole","outputs":[],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_bouncer","type":"address"}],"name":"removeBouncer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_operator","type":"address"},{"name":"_role","type":"string"}],"name":"hasRole","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"nonce","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_bouncer","type":"address"}],"name":"addBouncer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ROLE_BOUNCER","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Received","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"signature","type":"bytes"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Forwarded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"operator","type":"address"},{"indexed":false,"name":"role","type":"string"}],"name":"RoleAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"operator","type":"address"},{"indexed":false,"name":"role","type":"string"}],"name":"RoleRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_signature","type":"bytes"},{"name":"_sender","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"forward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const miner = web3.eth.accounts.wallet.add('0x' + secrets.private_key)

module.exports.main = async (event, context) => {
	const body = JSON.parse(event.body)

	const { gas, messageHash, parts, signature } = body
	const { proxy, from, to, value, rawTransaction } = parts

	const account = web3.eth.accounts.recover(messageHash, signature)

	if(account.toLowerCase() === from.toLowerCase()) {
		const bouncerProxy = new web3.eth.Contract(bouncerProxyABI, proxy).methods

		const transactionOptions = {
		  from: miner.address,
		  gasPrice: Math.round(8 * 1000000000),
		  gas
		}

		const transactionPromise = bouncerProxy.forward(
			signature,
			from,
			to,
			value,
			rawTransaction
		).send(transactionOptions)

		const transactionHash = await new Promise(resolve => {
			transactionPromise.once('transactionHash', txHash => resolve(txHash))
		})

		return {
			statusCode: 200,
			body: JSON.stringify({ transaction_hash: transactionHash }),
		}
	}
}
