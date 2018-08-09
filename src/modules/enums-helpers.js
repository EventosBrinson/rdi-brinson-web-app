export function rentType(value) {
  switch (value) {
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
  switch (value) {
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
  switch (value) {
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

export function rentStatus(value) {
  switch (value) {
    case 'reserved':
      return 'Reservada'
    case 'on_route':
      return 'En ruta'
    case 'delivered':
      return 'Entregada'
    case 'on_pick_up':
      return 'En recolección'
    case 'pending':
      return 'Pendiente'
    case 'finalized':
      return 'Finalizada'
    case 'canceled':
      return 'Cancelada'
    default:
      return ''
  }
}
