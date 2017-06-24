export function rentType(value) {
  switch(value) {
    case 'first_rent':
      return 'Primera renta'
    case 'frecuent':
      return 'Frecuente'
    case 'business':
      return 'Empresa'
    default:
      return ''
  }
}

export function role(value) {
  switch(value) {
    case 'admin':
      return 'Administrador'
    case 'staff':
      return 'Staff'
    case 'user':
      return 'Usuario'
    default:
      return ''
  }
}

export function idName(value) {
  switch(value) {
    case 'ine':
      return 'INE'
    case 'licencia':
      return 'Licencia de conducir'
    case 'cartilla':
      return 'Cartilla militar'
    case 'pasaporte':
      return 'Pasaporte'
    case 'otra':
      return 'Otra'
    default:
      return ''
  }
}

