const packageName = 'smite'

const initialState {
	loading: false,
	error: false,
}

const ADD_ROLE = `@@${packageName}/ADD_ROLE`
const ADD_ROLE_SUCCESS = `@@${packageName}/ADD_ROLE_SUCCESS`
const ADD_ROLE_FAIL = `@@${packageName}/ADD_ROLE_FAIL`

function addRole(web3, operator, role) {
	return { type: ADD_ROLE, web3, operator, role }
}

function addRoleSuccess(operator, role) {
	return { type: ADD_ROLE_SUCCESS, operator, role }
}

function addRoleFail(error) {
	return { type: ADD_ROLE_FAIL, error }
}

function RoleReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ROLE: {
    	return {
    		...state,
			loading: true,
			error: false,
    	}
    }

    case ADD_ROLE_SUCCESS: {
    	return {
    		...state,
    		loading: false,
    		error: false,
    	}
    }

    case ADD_ROLE_FAIL: {
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

export actions = [
	addRole,
	addRoleSuccess,
	addRoleFail,
]

export actionTypes = [
	ADD_ROLE,
	ADD_ROLE_SUCCESS,
	ADD_ROLE_FAIL,
]