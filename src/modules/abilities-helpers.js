var current_user = undefined

export function setUser(user) {
  current_user = user
}

export function isAdmin(other = undefined) {
  let toTest = other || current_user
  var role = toTest.get ? toTest.get('role') : toTest.role

  switch(role) {
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

export function isMain() {
  return current_user.main
}

export function itsMe(user) {
  var id = user.get ? user.get('id') : user.id

  return current_user.id === id
}
