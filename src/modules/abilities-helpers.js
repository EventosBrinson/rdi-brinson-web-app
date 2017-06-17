var current_user = undefined

export function setUser(user) {
  current_user = user
}

export function isAdmin() {
  switch(current_user.role) {
    case 'admin':
    case 'staff':
      return true
    default:
      return false
  }
}

export function isStaff() {
  if(current_user) {
    switch(current_user.role) {
      case 'staff':
        return true
      default:
        return false
    }
  }
}
