import delegationContractReducer from './DelegationContract';
import delegationServerReducer from './DelegationServer';
import rolesReducer from './Roles';

export const reducers = {
  delegationContract: delegationServerReducer,
  delegationServer: delegationServerReducer,
  roles: rolesReducer,
};