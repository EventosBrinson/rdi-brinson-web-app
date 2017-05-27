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

    case 'CONFIRM_ACCOUNT':
      Api.patch(request, '/confirm', data)
      return state.deleteIn(['forms', 'accept_invitation_form']).set('confirmation_status', 'CONFIRMING')

    case 'GET_USERS':
      Api.get(request, '/users', data, sessionToken)
      return state.setIn(['users', 'get_users_status'], 'GETTING')

    case 'CREATE_USER':
      Api.post(request, '/users', { user: data }, sessionToken)
      return state.deleteIn(['forms', 'user_form']).setIn(['users', 'create_user_status' ], 'CREATING')

    case 'GET_USER':
      Api.get(request, `/users/${ data.id }`, undefined, sessionToken)
      return state.setIn(['users', 'get_user_statuses', data.id ], 'GETTING')

    case 'UPDATE_USER':
      Api.patch(request, `/users/${ data.id }`, { user: data.user }, sessionToken)
      return state.setIn(['users', 'update_user_statuses', data.id ], 'UPDATING')

    case 'GET_CLIENTS':
      Api.get(request, '/clients', data, sessionToken)
      return state.setIn(['clients', 'get_clients_status'], 'GETTING')

    case 'CREATE_CLIENT':
      Api.post(request, '/clients', { client: data }, sessionToken)
      return state.deleteIn(['forms', 'client_form']).setIn(['users', 'create_client_status' ], 'CREATING')

    case 'GET_CLIENT':
      Api.get(request, `/clients/${ data.id }`, undefined, sessionToken)
      return state.setIn(['clients', 'get_client_statuses', data.id ], 'GETTING')

    case 'UPDATE_CLIENT':
      Api.patch(request, `/clients/${ data.id }`, { client: data.client }, sessionToken)
      return state.setIn(['users', 'update_user_statuses', data.id ], 'UPDATING')

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

        var newState = Immutable.Map({ 'session_status': 'SIGNED_IN', 'user': Immutable.fromJS(data.user) })

        if(state.get('session_status') === 'SIGNING_IN') {
          return newState.setIn(['router', 'action'], 'REDIRECT_TO')
                         .setIn(['router', 'pathname'], '/')
        } else {
          return newState;
        }
      } else {
        return Immutable.Map({ 'session_status': 'NOT_SIGNED_IN' })
      }

    case 'SIGN_OUT':
      cookies.remove('ssid')
      sessionToken = undefined

      return Immutable.Map({ 'session_status': 'NOT_SIGNED_IN' })

    case 'REQUEST_RESET_PASSWORD':
      return state.set('recover_password_status', 'SENT')

    case 'GET_USERS':
      var users_hash = {}
      data.forEach( user => {
        users_hash[user.id] = user
      })
      return state.setIn(['users', 'get_users_status'], 'READY')
                  .setIn(['users', 'hashed'], Immutable.fromJS(users_hash))
                  .setIn(['users', 'ordered'], Immutable.fromJS(data))

    case 'CREATE_USER':
      return state.setIn(['users', 'create_user_status'], 'CREATED')
                  .setIn(['users', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .updateIn(['users', 'ordered'], ordered => (ordered || Immutable.List()).unshift(Immutable.fromJS(data)))
                  .setIn(['router', 'action'], 'REDIRECT_TO')
                  .setIn(['router', 'pathname'], '/users')

    case 'GET_USER':
      return state.setIn(['users', 'get_user_statuses', String(data.id)], 'READY')
                  .setIn(['users', 'hashed', String(data.id)], Immutable.fromJS(data))

    case 'UPDATE_USER':
      return state.setIn(['users', 'update_user_statuses', String(data.id)], 'UPDATED')
                  .setIn(['users', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .setIn(['router', 'action'], 'REDIRECT_TO')
                  .setIn(['router', 'pathname'], '/users')

    case 'GET_CLIENTS':
      var clients_hash = {}
      data.forEach( client => {
        clients_hash[client.id] = client
      })
      return state.setIn(['clients', 'get_clients_status'], 'READY')
                  .setIn(['clients', 'hashed'], Immutable.fromJS(clients_hash))
                  .setIn(['clients', 'ordered'], Immutable.fromJS(data))

    case 'CREATE_CLIENT':
      return state.setIn(['clients', 'create_client_status'], 'CREATED')
                  .setIn(['clients', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .updateIn(['clients', 'ordered'], ordered => (ordered || Immutable.List()).unshift(Immutable.fromJS(data)))
                  .setIn(['router', 'action'], 'REDIRECT_TO')
                  .setIn(['router', 'pathname'], '/clients')

    case 'GET_CLIENT':
      return state.setIn(['clients', 'get_client_statuses', String(data.id)], 'READY')
                  .setIn(['clients', 'hashed', String(data.id)], Immutable.fromJS(data))

    case 'UPDATE_CLIENT':
      return state.setIn(['clients', 'update_client_statuses', String(data.id)], 'UPDATED')
                  .setIn(['clients', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .setIn(['router', 'action'], 'REDIRECT_TO')
                  .setIn(['router', 'pathname'], '/clients')

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

    case 'GET_USER':
      return state.setIn(['users', 'get_user_statuses', data.request_data], 'ERROR')

    case 'UPDATE_USER':
      return state.setIn(['users', 'update_user_statuses', data.request_data.user.id], 'ERROR')

    case 'GET_CLIENTS':
      return state.setIn(['users', 'get_clients_status'], 'ERROR')

    case 'CREATE_CLIENT':
      return state.setIn(['users', 'create_client_status'], 'ERROR')

    case 'GET_CLIENT':
      return state.setIn(['users', 'get_client_statuses', data.request_data], 'ERROR')

    case 'UPDATE_CLIENT':
      return state.setIn(['users', 'update_client_statuses', data.request_data.user.id], 'ERROR')

    default:
      return state
  }
}

export function cleanRouter(state) {
  return state.delete('router')
}
