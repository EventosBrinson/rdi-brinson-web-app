import * as Api from './web-api'
import { Cookies } from 'react-cookie';
import Immutable from 'immutable'

const cookies = new Cookies()
var sessionToken = undefined

export function initApp(state) {
  sessionToken = cookies.get('ssid')
  Api.post('SIGN_IN', '/sign_in', {}, sessionToken)

  return state.set('session_status', 'FIRST_SIGNING_IN')
}

export function changeForm(state, form, field, value) {
  return state.setIn(['forms', form , field], Immutable.fromJS(value))
}

export function submitRequest(state, request, data) {
  switch (request) {
    case 'SIGN_IN':
      Api.post(request, '/sign_in', data)
      return state.deleteIn(['forms', 'sign_in_form']).set('session_status', 'SIGNING_IN')

    case 'SIGN_OUT':
      Api.del(request, '/sign_out', data, sessionToken)
      return state.set('session_status', 'SIGNING_OUT')

    case 'REQUEST_RESET_PASSWORD':
      Api.post(request, '/reset_password', data)
      return state.deleteIn(['forms', 'recover_password_form']).set('recover_password_status', 'SENDING')
    
    case 'RESET_PASSWORD':
      Api.patch(request, '/reset_password', data)
      return state.deleteIn(['forms', 'reset_password_form']).set('reset_password_status', 'RESETING')

    default:
      return state
  }
}

export function requestSucceeded(state, request, data) {
  switch (request) {
    case 'SIGN_IN':
    case 'RESET_PASSWORD':
      if(data) {
        cookies.set('ssid', data.token)
        sessionToken = data.token

        return state.merge({ 'session_status': 'SIGNED_IN', 'user': data.user }).delete('reset_password_status')
      } else {
        return Immutable.Map({ 'session_status': 'NOT_SIGNED_IN' })
      }

    case 'SIGN_OUT':
      cookies.remove('ssid')
      sessionToken = undefined

      return Immutable.Map({ 'session_status': 'NOT_SIGNED_IN' })

    case 'REQUEST_RESET_PASSWORD':
      return state.set('recover_password_status', 'SENT')

    default:
      return state
  }
}

export function requestFailed(state, request, data) {
  switch (request) {
    case 'SIGN_IN':
      return Immutable.Map({ 'session_status': 'SIGNING_IN_ERROR' })

    case 'SIGN_OUT':
      return state.set('session_status', 'SIGNED_IN')

    case 'REQUEST_RESET_PASSWORD':
      return state.set('recover_password_status', 'RECOVER_ERROR')

    case 'RESET_PASSWORD':
      return Immutable.Map({ 'reset_password_status': 'RESET_ERROR' })

    default:
      return state
  }
}
