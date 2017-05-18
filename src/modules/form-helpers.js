export function priorityValues(values) {
  for(var i = 0; i < values.length; i++) {
    if(values[i] === '' || values[i] !== undefined) {
      return values[i]
    }
  }
  return ''
}
