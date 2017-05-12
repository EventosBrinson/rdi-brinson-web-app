import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

class Index extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div></div>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Index))
