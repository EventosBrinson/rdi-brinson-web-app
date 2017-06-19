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
