import delegationContractReducer from './DelegationContract';
import delegationServerReducer from './DelegationServer';
import rolesReducer from './Roles';

const reducers = {
  delegationContract: delegationServerReducer,
  delegationServer: delegationServerReducer,
  roles: rolesReducer,
};

export default reducers