import * as Api from './web-api'
import { Cookies } from 'react-cookie'
import Immutable from 'immutable'
import * as abilitiesHelper from './modules/abilities-helpers'

const cookies = new Cookies()
var sessionToken = undefined

export function initApp(state) {
  sessionToken = cookies.get('ssid')
  Api.post('SIGN_IN', '/sign_in', {}, {}, undefined, sessionToken)

  return state.set('session_status', 'FIRST_SIGNING_IN')
}

export function changeForm(state, form, field, value) {
  return state.setIn(['forms', form , field], Immutable.fromJS(value))
}

export function cleanForm(state, form) {
  return state.deleteIn(['forms', form])
}

export function mergeForm(state, form, values) {
  return state.mergeIn(['forms', form], values)
}

export function submitRequest(state, request, data, payload, callback) {
  switch (request) {
    case 'SIGN_IN':
      Api.post(request, '/sign_in', data, payload, callback)
      return state.deleteIn(['forms', 'sign_in_form']).set('session_status', 'SIGNING_IN')

    case 'SIGN_OUT':
      Api.del(request, '/sign_out', data, payload, callback, sessionToken)
      return state.set('session_status', 'SIGNING_OUT')

    case 'REQUEST_RESET_PASSWORD':
      Api.post(request, '/reset_password', data, payload, callback)
      return state.deleteIn(['forms', 'recover_password_form']).set('recover_password_status', 'SENDING')
    
    case 'RESET_PASSWORD':
      Api.patch(request, '/reset_password', data, payload, callback)
      return state.deleteIn(['forms', 'reset_password_form']).set('reset_password_status', 'RESETING')

    case 'CONFIRM_ACCOUNT':
      Api.patch(request, '/confirm', data, payload, callback)
      return state.deleteIn(['forms', 'accept_invitation_form']).set('confirmation_status', 'CONFIRMING')

    case 'GET_USERS':
      Api.get(request, '/users', data, payload, callback, sessionToken)
      return state.setIn(['users', 'get_users_status'], 'GETTING')

    case 'CREATE_USER':
      Api.post(request, '/users', data, payload, callback, sessionToken)
      return state.deleteIn(['forms', 'user_form']).setIn(['users', 'create_user_status' ], 'CREATING')

    case 'GET_USER':
      Api.get(request, `/users/${ payload.id }`, data, payload, callback, sessionToken)
      return state.setIn(['users', 'get_user_statuses', payload.id ], 'GETTING')

    case 'UPDATE_USER':
      Api.patch(request, `/users/${ payload.id }`, data, payload, callback, sessionToken)
      return state.deleteIn(['forms', 'user_form'])
                  .setIn(['users', 'update_user_statuses', payload.id ], 'UPDATING')

    case 'GET_CLIENTS':
      Api.get(request, '/clients', data, payload, callback, sessionToken)
      return state.setIn(['clients', 'get_clients_status'], 'GETTING')

    case 'CREATE_CLIENT':
      Api.post(request, '/clients', data, payload, callback, sessionToken)
      return state.deleteIn(['forms', 'client_form'])
                  .setIn(['clients', 'create_client_status' ], 'CREATING')

    case 'GET_CLIENT':
      Api.get(request, `/clients/${ payload.id }`, data, payload, callback, sessionToken)
      return state.setIn(['clients', 'get_client_statuses', payload.id ], 'GETTING')

    case 'UPDATE_CLIENT':
      Api.patch(request, `/clients/${ payload.id }`, data, payload, callback, sessionToken)
      return state.deleteIn(['forms', 'edit_client_form'])
                  .setIn(['clients', 'update_client_statuses', payload.id ], 'UPDATING')

    case 'CREATE_DOCUMENT':
      Api.post(request, '/documents',data, payload, callback, sessionToken)
      return state.setIn(['documents', 'create_document_status' ], 'CREATING')

    case 'DELETE_DOCUMENT':
      Api.del(request, `/documents/${ payload.id }`, data, payload, callback, sessionToken)
      return state.setIn(['documents', 'delete_document_status', payload.id], 'DELETING')

    case 'UPDATE_DOCUMENT':
      Api.patch(request, `/clients/${ payload.id }`, data, payload, callback, sessionToken)
      return state.deleteIn(['forms', 'edit_document_form', payload.id])
                  .setIn(['documents', 'update_document_status', payload.id], 'UPDATING')

    case 'GET_PLACES':
      Api.get(request, '/places', data, payload, callback, sessionToken)
      return state.setIn(['places', 'get_places_status'], 'GETTING')

    case 'CREATE_PLACE':
      Api.post(request, '/places', data, payload, callback, sessionToken)
      return state.deleteIn(['forms', 'place_form'])
                  .setIn(['places', 'create_place_status' ], 'CREATING')

    case 'GET_PLACE':
      Api.get(request, `/places/${ payload.id }`, data, payload, callback, sessionToken)
      return state.setIn(['places', 'get_place_statuses', payload.id ], 'GETTING')

    case 'UPDATE_PLACE':
      Api.patch(request, `/places/${ payload.id }`, data, payload, callback, sessionToken)
      return state.deleteIn(['forms', 'edit_place_form'])
                  .setIn(['places', 'update_place_statuses', payload.id ], 'UPDATING')

    case 'GET_RENTS':
      Api.get(request, '/rents', data, payload, callback, sessionToken)
      return state.setIn(['rents', 'get_rents_status'], 'GETTING')

    case 'GET_RENT':
      Api.get(request, `/rents/${ payload.id }`, data, payload, callback, sessionToken)
      return state.setIn(['rents', 'get_rent_statuses', payload.id ], 'GETTING')

    case 'CREATE_RENT':
      Api.post(request, '/rents', data, payload, callback, sessionToken)
      return state.deleteIn(['forms', 'rent_form'])
                  .setIn(['rents', 'create_rent_status' ], 'CREATING')

    case 'UPDATE_RENT':
      Api.patch(request, `/rents/${ payload.id }`, data.rent, payload, callback, sessionToken)
      return state.deleteIn(['forms', 'edit_rent_form'])
                  .setIn(['rents', 'update_rent_statuses', payload.id ], 'UPDATING')

    case 'DELETE_RENT':
      Api.del(request, `/rents/${ payload.id }`, data, payload, callback, sessionToken)
      return state.setIn(['rents', 'delete_rent_statuses', payload.id], 'DELETING')

    default:
      return state
  }
}

export function requestSucceeded(state, request, result, payload, callback) {
  let data = result.response.body

  console.log(result, payload, callback)

  switch (request) {
    case 'SIGN_IN':
    case 'RESET_PASSWORD':
    case 'CONFIRM_ACCOUNT':
      if(data) {
        cookies.set('ssid', data.token)
        sessionToken = data.token

        var newState = Immutable.Map({ 'session_status': 'SIGNED_IN', 'user': Immutable.fromJS(data.user) })

        abilitiesHelper.setUser(data.user)

        if(state.get('session_status') === 'SIGNING_IN') {
          return newState.setIn(['router', 'action'], 'REDIRECT_TO')
                         .setIn(['router', 'pathname'], '/')
        } else {
          return newState
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
      if(!data.id) {
        return state.setIn(['users', 'update_errors'], Immutable.fromJS(data))
      } else {
        return state.setIn(['users', 'update_user_statuses', String(data.id)], 'UPDATED')
                    .setIn(['users', 'hashed', String(data.id)], Immutable.fromJS(data))
                    .setIn(['router', 'action'], 'REDIRECT_TO')
                    .setIn(['router', 'pathname'], '/users')
                    .deleteIn(['users', 'update_errors'])
      }


    case 'GET_CLIENTS':
      var get_clients_hash = {}
      var get_clients_order = []
      var get_clients_documents_hash = {}
      var get_clients_places_hash = {}

      data.forEach(client => {
        var get_clients_documents_order = []
        var get_clients_places_order = []

        get_clients_hash[client.id] = client
        get_clients_order.push(String(client.id))

        client.documents.forEach(document => {
          get_clients_documents_hash[document.id] = document
          get_clients_documents_order.push(String(document.id))
        })

        delete client.documents
        client.documents_order = get_clients_documents_order

        client.places.forEach(place => {
          get_clients_places_hash[place.id] = place
          get_clients_places_order.push(String(place.id))
        })

        delete client.places
        client.places_order = get_clients_places_order
      })

      return state.setIn(['clients', 'get_clients_status'], 'READY')
                  .setIn(['clients', 'hashed'], Immutable.fromJS(get_clients_hash))
                  .setIn(['clients', 'order'], Immutable.fromJS(get_clients_order))
                  .mergeIn(['documents', 'hashed'], get_clients_documents_hash)
                  .mergeIn(['places', 'hashed'], get_clients_places_hash)

    case 'CREATE_CLIENT':
      return state.setIn(['clients', 'create_client_status'], 'CREATED')
                  .setIn(['clients', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .updateIn(['clients', 'order'], order => (order || Immutable.List()).unshift(Immutable.fromJS(String(data.id))))
                  .setIn(['router', 'action'], 'REDIRECT_TO')
                  .setIn(['router', 'pathname'], '/clients')

    case 'GET_CLIENT':
      var get_client_documents_hash = {}
      var get_client_documents_order = []
      var get_client_places_hash = {}
      var get_client_places_order = []

      data.documents.forEach(document => {
        get_client_documents_hash[document.id] = document
        get_client_documents_order.push(String(document.id))
      })

      delete data.documents
      data.documents_order = get_client_documents_order

      data.places.forEach(place => {
        get_client_places_hash[place.id] = place
        get_client_places_order.push(String(place.id))
      })

      delete data.places
      data.places_order = get_client_places_order

      return state.setIn(['clients', 'get_client_statuses', String(data.id)], 'READY')
                  .setIn(['clients', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .mergeIn(['documents', 'hashed'], get_client_documents_hash)
                  .mergeIn(['places', 'hashed'], get_client_places_hash)

    case 'UPDATE_CLIENT':
      var update_client_documents_hash = {}
      var update_client_documents_order = []
      var update_client_places_hash = {}
      var update_client_places_order = []

      data.documents.forEach(document => {
        update_client_documents_hash[document.id] = document
        update_client_documents_order.push(String(document.id))
      })

      delete data.documents
      data.documents_order = update_client_documents_order

      data.places.forEach(place => {
        update_client_places_hash[place.id] = place
        update_client_places_order.push(String(place.id))
      })

      delete data.places
      data.places_order = update_client_places_order

      return state.setIn(['clients', 'update_client_statuses', String(data.id)], 'UPDATED')
                  .setIn(['clients', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .mergeIn(['documents', 'hashed'], update_client_documents_hash)
                  .mergeIn(['places', 'hashed'], update_client_places_hash)
                  .setIn(['router', 'action'], 'REDIRECT_TO')
                  .setIn(['router', 'pathname'], '/clients')

    case 'CREATE_DOCUMENT':
      return state.setIn(['documents', 'create_document_status'], 'CREATED')
                  .setIn(['documents', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .updateIn(['documents', 'order'], order => (order || Immutable.List()).push(String(data.id)))
                  .updateIn(['clients', 'hashed', String(data.client_id), 'documents_order'], order => (order || Immutable.List()).push(String(data.id)))

    case 'DELETE_DOCUMENT':
      return state.setIn(['documents', 'delete_document_status', result.request_data.id], 'DELETED')
                  .deleteIn(['documents', 'hashed', String(result.request_data.id)])
                  .updateIn(['documents', 'order'], order => (order || Immutable.List()).filterNot(value => value === String(result.request_data.id)))
                  .updateIn(['clients', 'hashed', String(result.request_data.client_id), 'documents_order'], order => (order || Immutable.List()).filterNot(value => value === String(result.request_data.id)))

    case 'UPDATE_DOCUMENT':
      return state.setIn(['documents', 'update_document_status', String(data.id)], 'UPDATED')
                  .setIn(['documents', 'hashed', String(data.id)], Immutable.fromJS(data))

    case 'GET_PLACES':
      var get_places_hash = {}
      var get_places_order = []

      data.forEach(place => {
        get_places_hash[place.id] = place
        get_places_order.push(String(place.id))
      })

      return state.setIn(['places', 'get_places_status'], 'READY')
                  .setIn(['places', 'hashed'], Immutable.fromJS(get_places_hash))
                  .setIn(['places', 'order'], Immutable.fromJS(get_places_order))

    case 'CREATE_PLACE':
      return state.setIn(['places', 'create_place_status'], 'CREATED')
                  .setIn(['places', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .updateIn(['places', 'order'], order => (order || Immutable.List()).push(String(data.id)))
                  .updateIn(['clients', 'hashed', String(data.client_id), 'places_order'], order => (order || Immutable.List()).push(String(data.id)))
                  .setIn(['router', 'action'], 'REDIRECT_TO')
                  .setIn(['router', 'pathname'], '/clients/' + data.client_id)

    case 'GET_PLACE':
      return state.setIn(['places', 'get_place_statuses', String(data.id)], 'READY')
                  .setIn(['places', 'hashed', String(data.id)], Immutable.fromJS(data))

    case 'UPDATE_PLACE':
      return state.setIn(['places', 'update_place_statuses', String(data.id)], 'UPDATED')
                  .setIn(['places', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .setIn(['router', 'action'], 'REDIRECT_TO')
                  .setIn(['router', 'pathname'], '/clients/' + data.client_id)

    case 'GET_RENTS':
      var get_rents_hash = {}
      var get_rents_order = []

      data.forEach(rent => {
        get_rents_hash[rent.id] = rent
        get_rents_order.push(String(rent.id))
      })

      return state.setIn(['rents', 'get_rents_status'], 'READY')
                  .setIn(['rents', 'hashed'], Immutable.fromJS(get_rents_hash))
                  .setIn(['rents', 'order'], Immutable.fromJS(get_rents_order))

    case 'GET_RENT':
      return state.setIn(['rents', 'get_rent_statuses', String(data.id)], 'READY')
                  .setIn(['rents', 'hashed', String(data.id)], Immutable.fromJS(data))

    case 'CREATE_RENT':
      return state.setIn(['rents', 'create_rent_status'], 'CREATED')
                  .setIn(['rents', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .updateIn(['rents', 'order'], order => (order || Immutable.List()).push(String(data.id)))
                  .setIn(['router', 'action'], 'REDIRECT_TO')
                  .setIn(['router', 'pathname'], '/rents')

    case 'UPDATE_RENT':
      return state.setIn(['rents', 'update_rent_statuses', String(data.id)], 'UPDATED')
                  .setIn(['rents', 'hashed', String(data.id)], Immutable.fromJS(data))
                  .setIn(['router', 'action'], 'REDIRECT_TO')
                  .setIn(['router', 'pathname'], '/rents')

    case 'DELETE_RENT':
      return state.setIn(['rents', 'delete_rent_statuses', result.request_data.id], 'DELETED')
                  .deleteIn(['rents', 'hashed', String(result.request_data.id)])
                  .updateIn(['rents', 'order'], order => (order || Immutable.List()).filterNot(value => value === String(result.request_data.id)))

    default:
      return state
  }
}

export function requestFailed(state, request, result, payload, callback) {
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
      return state.setIn(['users', 'get_user_statuses', payload.id], 'ERROR')

    case 'UPDATE_USER':
      return state.setIn(['users', 'update_user_statuses', payload.id], 'ERROR')

    case 'GET_CLIENTS':
      return state.setIn(['clients', 'get_clients_status'], 'ERROR')

    case 'CREATE_CLIENT':
      return state.setIn(['clients', 'create_client_status'], 'ERROR')

    case 'GET_CLIENT':
      return state.setIn(['clients', 'get_client_statuses', payload.id], 'ERROR')

    case 'UPDATE_CLIENT':
      return state.setIn(['clients', 'update_client_statuses', payload.id], 'ERROR')

    case 'CREATE_DOCUMENT':
      return state.setIn(['documents', 'create_document_status'], 'ERROR')

    case 'DELETE_DOCUMENT':
      return state.setIn(['documents', 'delete_document_status', payload.id], 'ERROR')

    case 'UPDATE_DOCUMENT':
      return state.setIn(['documents', 'update_document_status', payload.id], 'ERROR')

    case 'GET_PLACES':
      return state.setIn(['places', 'get_places_status'], 'ERROR')

    case 'GET_PLACE':
      return state.setIn(['places', 'get_place_statuses', payload.id], 'ERROR')

    case 'CREATE_PLACE':
      return state.setIn(['places', 'create_place_status'], 'ERROR')

    case 'UPDATE_PLACE':
      return state.setIn(['places', 'update_place_statuses', payload.id], 'ERROR')

    case 'GET_RENTS':
      return state.setIn(['rents', 'get_rents_status'], 'ERROR')

    case 'GET_RENT':
      return state.setIn(['rents', 'get_rent_statuses', payload.id], 'ERROR')

    case 'CREATE_RENT':
      return state.setIn(['rents', 'create_rent_status'], 'ERROR')

    case 'UPDATE_RENT':
      return state.setIn(['rents', 'update_rent_statuses', payload.id], 'ERROR')

    default:
      return state
  }
}

export function cleanRouter(state) {
  return state.delete('router')
}
