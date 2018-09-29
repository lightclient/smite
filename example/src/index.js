import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'
import counter from './reducer'
import { reducers as smiteReducers } from './smite'
import { actions as contractActions } from './smite/DelegationContract'
import Web3 from 'web3';

const { deployContract } = contractActions

class Counter extends React.Component {
  constructor(props) {
    super(props)

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const counterAbi = [{"constant":true,"inputs":[],"name":"count","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Received","type":"event"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"increment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
    const counterContract = new web3.eth.Contract(
      counterAbi,
      '0x5268AC2AfBFfA41c01DFD6111F47089179C1bd73'
    );

    this.state = { web3, counterContract, count: 0 }
    this.loadCount()
  }

  loadCount = async () => {
    this.setState({ count: await this.state.counterContract.methods.count().call()})
  }

  onIncrement = async () => {
    const { web3, counterContract } = this.state;

    await counterContract.methods.increment(1).send({
      from: (await web3.eth.getAccounts())[0]
    })

    this.loadCount()
  }

  render() {
    const { store, onIncrement, onDecrement, deployContractAction } = this.props
    const { count } = this.state

    return (
      <p>
        Clicked: {count} times
        {' '}
        <button onClick={this.onIncrement}>
          Increment (pay gas)
        </button>
        {' '}
        <button onClick={onDecrement}>
          Increment (don't pay gas)
        </button>
        {' '}
        <button onClick={deployContractAction}>
          Deploy a contract
        </button>
      </p>
    )
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    combineReducers({
      counter: counter,
      ...smiteReducers,
    }),
  composeEnhancers(applyMiddleware(middleware, sagaMiddleware))
)

const render = () => ReactDOM.render(
  <Counter
    store={store.getState()}
    onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
    onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
    deployContractAction={() => store.dispatch(deployContract(null))}
  />,
  document.getElementById('app')
)

render()

store.subscribe(render)

module.hot.accept();