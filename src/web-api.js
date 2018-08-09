import superagent from 'superagent'
import store from './store'
import * as actionCreators from './action-creators'

export const API_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://rdi.eventosbrinson.com:3000'

export function get(request, path, data, payload, callback, auth_token = undefined) {
  superagent
    .get(API_URL + path)
    .query(data)
    .set('Auth-Token', auth_token)
    .set('Accept', 'application/json')
    .end(function(error, response) {
      if (error || !response.ok) {
        store.dispatch(
          actionCreators.requestFailed(request, { request_data: data, response: response }, payload, callback)
        )
      } else {
        store.dispatch(
          actionCreators.requestSucceeded(request, { request_data: data, response: response }, payload, callback)
        )
      }
    })
}

export function post(request, path, data, payload, callback, auth_token = undefined) {
  superagent
    .post(API_URL + path)
    .send(data)
    .set('Auth-Token', auth_token)
    .set('Accept', 'application/json')
    .end(function(error, response) {
      if (error || !response.ok) {
        store.dispatch(
          actionCreators.requestFailed(request, { request_data: data, response: response }, payload, callback)
        )
      } else {
        store.dispatch(
          actionCreators.requestSucceeded(request, { request_data: data, response: response }, payload, callback)
        )
      }
    })
}

export function del(request, path, data, payload, callback, auth_token = undefined) {
  superagent
    .delete(API_URL + path)
    .send(data)
    .set('Auth-Token', auth_token)
    .set('Accept', 'application/json')
    .end(function(error, response) {
      if (error || !response.ok) {
        store.dispatch(
          actionCreators.requestFailed(request, { request_data: data, response: response }, payload, callback)
        )
      } else {
        store.dispatch(
          actionCreators.requestSucceeded(request, { request_data: data, response: response }, payload, callback)
        )
      }
    })
}

export function patch(request, path, data, payload, callback, auth_token = undefined) {
  superagent
    .patch(API_URL + path)
    .send(data)
    .set('Auth-Token', auth_token)
    .set('Accept', 'application/json')
    .end(function(error, response) {
      if (error || !response.ok) {
        store.dispatch(
          actionCreators.requestFailed(request, { request_data: data, response: response }, payload, callback)
        )
      } else {
        store.dispatch(
          actionCreators.requestSucceeded(request, { request_data: data, response: response }, payload, callback)
        )
      }
    })
}
