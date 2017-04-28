import Immutable from 'immutable'
import * as core from './core'

export default function reducer(state = Immutable.Map(), action) {
  switch (action.type) {
  case 'CHANGE_FORM':
    return core.changeForm(state, action.form, action.field, action.value)
  default:
    return state
  }
}
