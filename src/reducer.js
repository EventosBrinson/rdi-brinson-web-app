import Immutable from 'immutable'
import * as core from './core'

export default function reducer(state = Immutable.Map(), action) {
  switch (action.type) {
  case 'CHANGE_FORM':
    return core.changeForm(state, action.form, action.field, action.value)
  case 'SUBMIT_REQUEST':
    return core.submitRequest(state, action.request, action.data)
  case 'REQUEST_SUCCEEDED':
    return core.requestSucceeded(state, action.request, action.data)
  case 'REQUEST_FAILED':
    return core.requestFailed(state, action.request, action.data)
  default:
    return state
  }
}
