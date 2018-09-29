'use strict'
import Web3 from 'web3'
import secrets from '../secrets.json'
import bouncerProxyAbi from './bouncerProxyAbi.json'

const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io'))
const miner = web3.eth.accounts.wallet.add('0x' + secrets.private_key)

module.exports.main = async (event, context) => {
	const body = JSON.parse(event.body)

	const { gas, messageHash, parts, signature } = body
	const { proxy, from, to, value, rawTransaction } = parts

	const account = web3.eth.accounts.recover(messageHash, signature)

	if(account.toLowerCase() === from.toLowerCase()) {
		const bouncerProxy = new web3.eth.Contract(bouncerProxyAbi, proxy).methods

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
