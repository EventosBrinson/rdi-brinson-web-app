import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

class Show extends React.Component {

  constructor(props) {
    super(props)

    this.setUpClient = this.setUpClient.bind(this)
    this.client = Immutable.Map()
  }

  componentWillMount() {
    this.client_id = this.props.match.params.id
    this.setUpClient(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if(this.client.get('id') === undefined) {
      this.setUpClient(nextProps)
    }
  }

  setUpClient(props) {
    if(props.session_status === 'SIGNED_IN') {
      if(props.clients && (props.clients.getIn(['get_client_statuses', this.client_id]) === 'READY' || props.clients.get('get_clients_status') === 'READY')) {
        this.client = props.clients.getIn(['hashed', this.client_id])
      } else if(!props.clients || props.clients.getIn(['get_client_statuses', this.client_id]) !== 'GETTING'){
        this.props.submitRequest('GET_CLIENT', { id: this.client_id })
      }
    }
  }

  render() {
    let client = this.client

    return (
      <div>
        <h3>{ client.get('firstname') + ' ' + client.get('lastname') } <small>{ client.get('trust_level') }</small></h3>
        <p>{ client.get('id_name') }</p>
        <p>{ client.get('address_line_1') } { client.get('address_line_2')  }</p>
        <p>{ client.get('telephone_1') } { client.get('telephone_1')  }</p>
        <Link to={'/clients/' + client.get('id') + '/edit'}>Editar</Link>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    clients: state.get('clients'),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Show))
