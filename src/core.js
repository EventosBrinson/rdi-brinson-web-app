import * as Api from './web-api'
import { Cookies } from 'react-cookie';
import Immutable from 'immutable'

const cookies = new Cookies()
var sessionToken = undefined
var routerHistory = undefined

export function setRouterHistory(history) {
  routerHistory = history
}

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

    case 'CONFIRM_ACCOUNT':
      Api.patch(request, '/confirm', data)
      return state.deleteIn(['forms', 'accept_invitation_form']).set('confirmation_status', 'CONFIRMING')

    case 'GET_USERS':
      if(state.getIn(['users', 'get_users_status']) === 'READY') {
        return state
      } else {
        Api.get(request, '/users', data, sessionToken)
        return state.setIn(['users', 'get_users_status'], 'GETTING')
      }

    case 'CREATE_USER':
      Api.post(request, '/users', { user: data }, sessionToken)
      return state.deleteIn(['forms', 'user_form']).setIn(['users', 'create_user_status' ], 'CREATING')

    default:
      return state
  }
}

export function requestSucceeded(state, request, data) {
  switch (request) {
    case 'SIGN_IN':
    case 'RESET_PASSWORD':
    case 'CONFIRM_ACCOUNT':
      if(data) {
        cookies.set('ssid', data.token)
        sessionToken = data.token

        if(routerHistory && state.get('session_status') !== 'FIRST_SIGNING_IN') {
          routerHistory.replace('/')
        }
 
        return Immutable.Map({ 'session_status': 'SIGNED_IN', 'user': data.user })
      } else {
        return Immutable.Map({ 'session_status': 'NOT_SIGNED_IN' })
      }

    case 'SIGN_OUT':
      cookies.remove('ssid')
      sessionToken = undefined

      if(routerHistory) {
        routerHistory.push('/')
      }

      return Immutable.Map({ 'session_status': 'NOT_SIGNED_IN' })

    case 'REQUEST_RESET_PASSWORD':
      return state.set('recover_password_status', 'SENT')

    case 'GET_USERS':
      var users_hash = {}
      data.forEach( user => {
        users_hash[user.id] = user
      })
      return state.setIn(['users', 'get_users_status'], 'READY').
                   setIn(['users', 'hashed'], Immutable.fromJS(users_hash)).
                   setIn(['users', 'ordered'], Immutable.fromJS(data))

    case 'CREATE_USER':
      if(routerHistory) {
        setTimeout(() => {
          routerHistory.push('/users')
        }, 100) 
      }

      return state.setIn(['users', 'create_user_status'], 'CREATED').
                   setIn(['users', 'hashed', data.id], Immutable.fromJS(data)).
                   updateIn(['users', 'ordered'], ordered => (ordered || Immutable.List()).unshift(Immutable.fromJS(data)))

    default:
      return state
  }
}

export function requestFailed(state, request, data) {
  switch (request) {
    case 'SIGN_IN':
      return Immutable.Map({ 'session_status': 'SIGNING_IN_ERROR' })

    case 'SIGN_OUT':
      return state.set('session_status', 'SIGN_OUT_ERROR')

    case 'REQUEST_RESET_PASSWORD':
      return state.set('recover_password_status', 'RECOVER_ERROR')

    case 'RESET_PASSWORD':
      return Immutable.Map({ 'reset_password_status': 'RESET_ERROR' })

    case 'CONFIRM_ACCOUNT':
      return Immutable.Map({ 'confirmation_status': 'CONFIRMATION_ERROR' })

    case 'GET_USERS':
      return state.setIn(['users', 'get_users_status'], 'ERROR')

    case 'CREATE_USER':
      return state.setIn(['users', 'create_user_status'], 'ERROR')

    default:
      return state
  }
}
