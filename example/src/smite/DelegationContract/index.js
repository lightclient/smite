// deploy delegation contract
// load an existing delegation contract
// add whitelisted users to delegation contract
// send transaction to delegation server, get back a transaction hash

const packageName = 'smite'

const initialState = {
	address: null,
	loading: false,
	loaded: false,
	error: false,
}

const DEPLOY_CONTRACT = `@@${packageName}/DEPLOY_CONTRACT`
const DEPLOY_CONTRACT_SUCCESS = `@@${packageName}/DEPLOY_CONTRACT_SUCCESS`
const DEPLOY_CONTRACT_FAIL = `@@${packageName}/DEPLOY_CONTRACT_FAIL`

function deployContract(web3) {
	return { type: DEPLOY_CONTRACT, web3 }
}

function deployContractSuccess(address) {
	return { type: DEPLOY_CONTRACT_SUCCESS, address }
}

function deployContractFail(error) {
	return { type: DEPLOY_CONTRACT_FAIL, error }
}

const LOAD_CONTRACT = `@@${packageName}/LOAD_CONTRACT`
const LOAD_CONTRACT_SUCCESS = `@@${packageName}/LOAD_CONTRACT_SUCCESS`
const LOAD_CONTRACT_FAIL = `@@${packageName}/LOAD_CONTRACT_FAIL`

function loadContract(web3, address) {
	return { type: LOAD_CONTRACT, web3, address }
}

function loadContractSuccess(address) {
	return { type: LOAD_CONTRACT_SUCCESS, address }
}

function loadContractFail(error) {
	return { type: LOAD_CONTRACT_FAIL, error }
}

function DelegationContractReducer(state = initialState, action) {
  switch (action.type) {
	case DEPLOY_CONTRACT: {
    	return {
    		...state,
    		delegationContract: {
    			...initialState.delegationContract,
    			loading: true,
    		}
    	}
    }

	case DEPLOY_CONTRACT_SUCCESS: {
		const { address } = action;

    	return {
    		...state,
    		delegationContract: {
    			...state.delegationContract,
    			loading: false,
    			loaded: true,
    			address,
    		}
    	}
    }

    case DEPLOY_CONTRACT_FAIL: {
    	return {
    		...state,
    		delegationContract: {
    			...initialState.delegationContract,
    			loading: true,
    		}
    	}
    }

    case LOAD_CONTRACT: {
      const { address } = action;

      return {
        ...state,
        delegationContract: {
        	...initialState.delegationContract,
        	loading: true,
        	address,
        }
      }
    }

    case LOAD_CONTRACT_SUCCESS: {
    	return {
    		...state,
    		delegationContract: {
    			...state.delegationContract,
    			loading: false,
    			loaded: true,
    		}
    	}
    }

    case LOAD_CONTRACT_FAIL: {
    	return {
    		...state,
    		delegationContract: {
    			...state.delegationContract,
    			loading: false,
    			loaded: true,
    			error: true,
    		}
    	}
    }

    default:
      return state;
  }
}

export default DelegationContractReducer;

export const actions = {
	deployContract,
	deployContractSuccess,
	deployContractFail,
	loadContract,
	loadContractSuccess,
	loadContractFail,
}

export const actionTypes = {
	DEPLOY_CONTRACT,
	DEPLOY_CONTRACT_SUCCESS,
	DEPLOY_CONTRACT_FAIL,
	LOAD_CONTRACT,
	LOAD_CONTRACT_SUCCESS,
	LOAD_CONTRACT_FAIL,
}