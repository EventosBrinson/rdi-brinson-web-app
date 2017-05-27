import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

class Index extends React.Component {

  componentDidMount() {
    if(this.props.clients.get('get_clients_status') === undefined) {
      this.props.submitRequest('GET_CLIENTS') 
    }
  }

  render() {
    let clients = this.props.ordered || Immutable.List()
    let rendered_clients = []

    clients.forEach( client => {
      rendered_clients.push(
        <tr key={ client.get('id') }>
          <td>{ client.get('firstname') }</td>
          <td>{ client.get('lastname') }</td>
          <td>{ client.get('address_line_1') }</td>
          <td>{ client.get('address_line_2') }</td>
          <td>{ client.get('telephone_1') }</td>
          <td>{ client.get('telephone_2') }</td>
          <td>{ client.get('id_name') }</td>
          <td>{ client.get('trust_level') }</td>
          <td>{ client.get('active') ? 'Si' : 'No' }</td>
          <td><Link to={'/clients/' + client.get('id')+ '/edit'}>Edit</Link></td>
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
              <th>Dirección Linea 1</th>
              <th>Dirección Linea 2</th>
              <th>Teléfono 1</th>
              <th>Teléfono 2</th>
              <th>Identificación</th>
              <th>Nivel de confianza</th>
              <th>Activo</th>
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
    ordered: state.getIn(['clients', 'ordered'])
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Index))
