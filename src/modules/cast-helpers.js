export function address(place) {
  return `${place.get('street')} #${ place.get('outer_number') }${ place.get('inner_number') ? (' Int. ' + place.get('inner_number')) : '' }, ${ place.get('neighborhood') } CP ${ place.get('postal_code') }`
}
