export function changeForm(form, field, value) {
  return {
    type: 'CHANGE_FORM',
    form: form,
    field: field,
    value: value
  }
}
