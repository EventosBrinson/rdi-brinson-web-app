import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

class Index extends React.Component {

  componentDidMount() {
    this.getClients(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getClients(nextProps)
  }

  getClients(props) {
    if(props.session_status === 'SIGNED_IN' && props.clients.get('get_clients_status') !== 'READY') {
      props.submitRequest('GET_CLIENTS') 
    }
  }

  render() {
    let clients_order = this.props.order || Immutable.List()
    let clients = this.props.hashed || Immutable.Map()
    let rendered_clients = []

    clients_order.forEach( client_id => {
      let client = clients.get(client_id)

      rendered_clients.push(
        <tr key={ client.get('id') }>
          <td>{ client.get('firstname') }</td>
          <td>{ client.get('lastname') }</td>
          <td>{ client.get('street') }</td>
          <td>{ client.get('inner_number') }</td>
          <td>{ client.get('outer_number') }</td>
          <td>{ client.get('neighborhood') }</td>
          <td>{ client.get('postal_code') }</td>
          <td>{ client.get('telephone_1') }</td>
          <td>{ client.get('telephone_2') }</td>
          <td>{ client.get('email') }</td>
          <td>{ client.get('id_name') }</td>
          <td>{ client.get('trust_level') }</td>
          <td>{ client.get('active') ? 'Si' : 'No' }</td>
          <td><Link to={ '/clients/' + client.get('id') }>Ver</Link></td>
          <td><Link to={ '/clients/' + client.get('id') + '/edit'}>Edit</Link></td>
        </tr>
      )
    })

    return (
      <div>
        <h3>Clientes</h3>
        <table>
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Calle</th>
              <th>Numero interior</th>
              <th>Numero exterior</th>
              <th>Fraccionamiento</th>
              <th>CP</th>
              <th>Teléfono 1</th>
              <th>Teléfono 2</th>
              <th>Email</th>
              <th>Identificación</th>
              <th>Nivel de confianza</th>
              <th>Activo</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            { rendered_clients }
          </tbody>
        </table>
        <br />
        <Link to="/clients/new">Crear nuevo</Link>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    clients: state.get('clients') || Immutable.Map(),
    hashed: state.getIn(['clients', 'hashed']),
    order: state.getIn(['clients', 'order']),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Index))
