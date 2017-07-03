import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../action-creators'
import Immutable from 'immutable'

class ReduxRouter extends React.Component {

  constructor(props) {
    super(props)

    this.last_redirection = ""
  }
 
  componentWillReceiveProps(nextProps) {
    let action = nextProps.router.get('action')
    let pathname = nextProps.router.get('pathname')

    if(action && pathname) {
      this.props.cleanRouter()

      switch(action) {
        case 'REDIRECT_TO':
          nextProps.history.push(pathname)
          break
        case 'GO_BACK':
          nextProps.history.goBack()
          break
        default:
         break
      }
    }
  }

  render() {
    return this.props.children
  }
}

function mapStateToProps(state) {
  return {
    router: state.get('router') || Immutable.Map()
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(ReduxRouter))
