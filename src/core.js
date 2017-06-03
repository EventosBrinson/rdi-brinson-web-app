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

export function cleanForm(state, form) {
  return state.deleteIn(['forms', form])
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
      return state.deleteIn(['forms', 'user_form'])
                  .setIn(['users', 'update_user_statuses', data.id ], 'UPDATING')

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
      return state.deleteIn(['forms', 'client_form'])
                  .setIn(['users', 'update_user_statuses', data.id ], 'UPDATING')

    case 'CREATE_DOCUMENT':
      Api.post(request, '/documents', { document: data }, sessionToken)
      return state.setIn(['documents', 'create_document_status' ], 'CREATING')

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
      var users_order = []
      data.forEach( user => {
        users_hash[user.id] = user
        users_order.push(String(user.id))
      })
      return state.setIn(['users', 'get_users_status'], 'READY')
                  .setIn(['users', 'hashed'], Immutable.fromJS(users_hash))
                  .setIn(['users', 'order'], Immutable.fromJS(users_order))

    case 'CREATE_USER':
      return state.setIn(['users', 'create_user_status'], 'CREATED')
                  .setIn(['users', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .updateIn(['users', 'order'], order => (order || Immutable.List()).unshift(Immutable.fromJS(String(data.id))))
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
      var clients_order = []
      var documents_hash = {}
      var documents_order = []
      data.forEach(client => {
        clients_hash[client.id] = client
        clients_order.push(String(client.id))
        client.documents.forEach(document => {
          documents_hash[document.id] = document
          documents_order.push(String(document.id))
        })
        client.documents = documents_hash
        client.documents_order = documents_order
      })

      return state.setIn(['clients', 'get_clients_status'], 'READY')
                  .setIn(['clients', 'hashed'], Immutable.fromJS(clients_hash))
                  .setIn(['clients', 'order'], Immutable.fromJS(clients_order))

    case 'CREATE_CLIENT':
      return state.setIn(['clients', 'create_client_status'], 'CREATED')
                  .setIn(['clients', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .updateIn(['clients', 'order'], order => (order || Immutable.List()).unshift(Immutable.fromJS(String(data.id))))
                  .setIn(['router', 'action'], 'REDIRECT_TO')
                  .setIn(['router', 'pathname'], '/clients')

    case 'GET_CLIENT':
      var client_documents_hash = {}
      var client_documents_order = []
      data.documents.forEach(document => {
        client_documents_hash[document.id] = document
        client_documents_order.push(String(document.id))
      })
      data.documents = client_documents_hash
      data.documents_order = client_documents_order

      return state.setIn(['clients', 'get_client_statuses', String(data.id)], 'READY')
                  .setIn(['clients', 'hashed', String(data.id)], Immutable.fromJS(data))

    case 'UPDATE_CLIENT':
      return state.setIn(['clients', 'update_client_statuses', String(data.id)], 'UPDATED')
                  .setIn(['clients', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .setIn(['router', 'action'], 'REDIRECT_TO')
                  .setIn(['router', 'pathname'], '/clients')

    case 'CREATE_DOCUMENT':
      return state.setIn(['documents', 'create_document_status'], 'CREATED')
                  .setIn(['clients', 'hashed', String(data.client_id), 'documents', String(data.id)], Immutable.fromJS(data))
                  .updateIn(['clients', 'hashed', String(data.client_id), 'documents_order'], order => (order || Immutable.List()).unshift(Immutable.fromJS(String(data.id))))

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

    case 'CREATE_DOCUMENT':
      return state.setIn(['documents', 'create_document_status'], 'ERROR')

    default:
      return state
  }
}

export function cleanRouter(state) {
  return state.delete('router')
}
