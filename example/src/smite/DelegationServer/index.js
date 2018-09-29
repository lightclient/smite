const packageName = 'smite'

const initialState = {
	loading: false,
	error: false,
}

const SEND_META_TRANSACTION = `@@${packageName}/SEND_META_TRANSACTION`
const SEND_META_TRANSACTION_SUCCESS = `@@${packageName}/SEND_META_TRANSACTION_SUCCESS`
const SEND_META_TRANSACTION_FAIL = `@@${packageName}/SEND_META_TRANSACTION_FAIL`

function sendMetaTransaction(transactionAbi) {
    return { type: SEND_META_TRANSACTION, transactionAbi }
}

function sendMetaTransactionSuccess(transactionHash) {
    return { type: SEND_META_TRANSACTION_SUCCESS, transactionHash }
}

function sendMetaTransactionFail(error) {
    return { type: SEND_META_TRANSACTION_FAIL, error }
}

function DelegationServerReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_META_TRANSACTION: {
    	return {
    		...state,
			loading: true,
			error: false,
    	}
    }

    case SEND_META_TRANSACTION_SUCCESS: {
        const { transactionHash } = action;
    	return {
    		...state,
    		loading: false,
    		error: false,
            transactionHash
    	}
    }

    case SEND_META_TRANSACTION_FAIL: {
    	return {
    		...state,
    		loading: false,
    		error: true
    	}
    }

    default:
      return state;
  }
}

export const actions = {
    sendMetaTransaction,
    sendMetaTransactionSuccess,
    sendMetaTransactionFail,
}

export const actionTypes = {
    SEND_META_TRANSACTION,
    SEND_META_TRANSACTION_SUCCESS,
    SEND_META_TRANSACTION_FAIL,
}