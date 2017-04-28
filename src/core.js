import Immutable from 'immutable'

export function changeForm(state, form, field, value) {
  return state.setIn(['forms', form , field], Immutable.fromJS(value))
}
