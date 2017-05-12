import superagent from 'superagent'
import store from './store'
import * as actionCreators from './action-creators'

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://api.eventosbrinson.com'

export function get(request, path, data, auth_token = undefined) {
  superagent
   .get(API_URL + path)
   .send(data)
   .set('Auth-Token', auth_token)
   .set('Accept', 'application/json')
   .end(function(error, response){
     if (error || !response.ok) {
       store.dispatch(actionCreators.requestFailed(request))
     } else {
       store.dispatch(actionCreators.requestSucceeded(request, response.body))
     }
   })
}

export function post(request, path, data, auth_token = undefined) {
  superagent
   .post(API_URL + path)
   .send(data)
   .set('Auth-Token', auth_token)
   .set('Accept', 'application/json')
   .end(function(error, response){
     if (error || !response.ok) {
       store.dispatch(actionCreators.requestFailed(request))
     } else {
       store.dispatch(actionCreators.requestSucceeded(request, response.body))
     }
   })
}

export function del(request, path, data, auth_token = undefined) {
  superagent
   .delete(API_URL + path)
   .send(data)
   .set('Auth-Token', auth_token)
   .set('Accept', 'application/json')
   .end(function(error, response){
     if (error || !response.ok) {
       store.dispatch(actionCreators.requestFailed(request))
     } else {
       store.dispatch(actionCreators.requestSucceeded(request, response.body))
     }
   })
}

export function patch(request, path, data, auth_token = undefined) {
  superagent
   .patch(API_URL + path)
   .send(data)
   .set('Auth-Token', auth_token)
   .set('Accept', 'application/json')
   .end(function(error, response){
     if (error || !response.ok) {
       store.dispatch(actionCreators.requestFailed(request))
     } else {
       store.dispatch(actionCreators.requestSucceeded(request, response.body))
     }
   })
}
