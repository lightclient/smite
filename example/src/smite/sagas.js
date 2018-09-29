import delegationContractSagas from './DelegationContract/sagas'
import delegationServerSagas from './DelegationServer/sagas'
import rolesSagas from './Roles/sagas'

export const sagaWatchers = [
  ...delegationContractSagas,
  ...delegationServerSagas,
  ...rolesSagas,
]