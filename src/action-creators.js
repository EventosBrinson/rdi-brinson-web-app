export function changeForm(form, field, value) {
  return {
    type: 'CHANGE_FORM',
    form: form,
    field: field,
    value: value
  }
}

export function cleanForm(form) {
  return {
    type: 'CLEAN_FORM',
    form: form
  }
}

export function mergeForm(form, values) {
  return {
    type: 'MERGE_FORM',
    form: form,
    values: values
  }
}

export function submitRequest(request, data) {
  return {
    type: 'SUBMIT_REQUEST',
    request: request,
    data: data
  }
}

export function requestSucceeded(request, data) {
  return {
    type: 'REQUEST_SUCCEEDED',
    request: request,
    data: data
  }
}

export function requestFailed(request, data) {
  return {
    type: 'REQUEST_FAILED',
    request: request,
    data: data
  }
}

export function cleanRouter() {
  return {
    type: 'CLEAN_ROUTER'
  }
}
