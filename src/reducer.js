import Immutable from 'immutable'
import * as core from './core'

export default function reducer(state = Immutable.Map(), action) {
  if (/@@.*INIT/.test(action.type)) {
    return core.initApp(state)
  }

  switch (action.type) {
    case 'CHANGE_FORM':
      return core.changeForm(state, action.form, action.field, action.value)
    case 'CLEAN_FORM':
      return core.cleanForm(state, action.form)
    case 'MERGE_FORM':
      return core.mergeForm(state, action.form, action.values)
    case 'SUBMIT_REQUEST':
      return core.submitRequest(state, action.request, action.data, action.payload, action.callback)
    case 'REQUEST_SUCCEEDED':
      return core.requestSucceeded(state, action.request, action.result, action.payload, action.callback)
    case 'REQUEST_FAILED':
      return core.requestFailed(state, action.request, action.result, action.payload, action.callback)
    case 'CLEAN_ROUTER':
      return core.cleanRouter(state)
    case 'CLEAR_STATUS':
      return core.clearStatus(state, action.statusPath)
    default:
      return state
  }
}
