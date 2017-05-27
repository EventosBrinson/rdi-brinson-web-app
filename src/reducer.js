import Immutable from 'immutable'
import * as core from './core'

export default function reducer(state = Immutable.Map(), action) {
  switch (action.type) {
  case '@@redux/INIT':
    return core.initApp(state)
  case 'CHANGE_FORM':
    return core.changeForm(state, action.form, action.field, action.value)
  case 'CLEAN_FORM':
    return core.cleanForm(state, action.form)
  case 'SUBMIT_REQUEST':
    return core.submitRequest(state, action.request, action.data)
  case 'REQUEST_SUCCEEDED':
    return core.requestSucceeded(state, action.request, action.data)
  case 'REQUEST_FAILED':
    return core.requestFailed(state, action.request, action.data)
  case 'CLEAN_ROUTER':
    return core.cleanRouter(state)
  default:
    return state
  }
}
