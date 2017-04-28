import * as Api from './web-api'
import { Cookies } from 'react-cookie';
import Immutable from 'immutable'

const cookies = new Cookies()
var session_token = undefined

export function changeForm(state, form, field, value) {
  return state.setIn(['forms', form , field], Immutable.fromJS(value))
}

export function submitRequest(state, request, data) {
  switch (request) {
    case 'SIGN_IN':
      Api.post(request, '/sign_in', data, session_token)
      return state.deleteIn(['forms', 'sign_in_form']).set('session_status', 'SIGNING_IN')
    default:
      return state
  }
}

export function requestSucceeded(state, request, data) {
  switch (request) {
    case 'SIGN_IN':
      if(data) {
        cookies.set('ssid', data.token)
        session_token = data.token

        return state.merge({ 'session_status': 'SIGNED_IN', 'user': data.user })
      } else {
        return Immutable.Map({ 'session_status': 'NOT_SIGNED_IN' })
      }
    default:
      return state
  }
}

export function requestFailed(state, request, data) {
  switch (request) {
    case 'SIGN_IN':
      return Immutable.Map({ 'session_status': 'SIGNING_IN_ERROR' })
    default:
      return state
  }
}
