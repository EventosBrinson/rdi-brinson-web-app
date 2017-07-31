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

export function submitRequest(request, data, payload, callback) {
  return {
    type: 'SUBMIT_REQUEST',
    request: request,
    data: data,
    payload: payload,
    callback: callback
  }
}

export function requestSucceeded(request, result, payload, callback) {
  return {
    type: 'REQUEST_SUCCEEDED',
    request: request,
    result: result,
    payload: payload,
    callback: callback
  }
}

export function requestFailed(request, result, payload, callback) {
  return {
    type: 'REQUEST_FAILED',
    request: request,
    result: result,
    payload: payload,
    callback: callback
  }
}

export function cleanRouter() {
  return {
    type: 'CLEAN_ROUTER'
  }
}

export function clearStatus(statusPath) {
  return {
    type: 'CLEAR_STATUS',
    statusPath: statusPath
  }
}
