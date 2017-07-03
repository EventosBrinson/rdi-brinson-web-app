export function address(place) {
  return `${place.get('street')} #${ place.get('outer_number') }${ place.get('inner_number') ? (' Int. ' + place.get('inner_number')) : '' }, ${ place.get('neighborhood') } CP ${ place.get('postal_code') }`
}

export function fullname(object) {
  return `${ object.get('firstname') } ${ object.get('lastname') }`
}

export function priceFormater(value) {
  var splited = String(value).split('.')
  var first = '', last = undefined

  if(splited[0]) {
    first = splited[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  if(splited[1] !== undefined) {
    last = splited[1]
  }

  return `$${first}${last !== undefined ? '.' + (last.length === 1 ? last + '0' : last.slice(-2) ) : '.00' }`
}
