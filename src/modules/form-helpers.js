export function priorityValues(values) {
  for(var i = 0; i < values.length; i++) {
    if(values[i] === '' || (values[i] !== undefined && values[i] !== null)) {
      return values[i]
    }
  }
  return ''
}
