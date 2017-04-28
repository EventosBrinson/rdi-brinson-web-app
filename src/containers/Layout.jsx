import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../action-creators'

class Layout extends React.Component {

  render() {
    return (
      <div>
        { this.props.children }
        <pre>
          { JSON.stringify(this.props.state, null, 2) }
        </pre>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    state: state
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Layout))
