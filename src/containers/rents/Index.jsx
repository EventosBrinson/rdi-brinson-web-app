import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

class Index extends React.Component {

  componentDidMount() {
    this.getRents(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getRents(nextProps)
  }

  getRents(props) {
    if(props.session_status === 'SIGNED_IN' && props.rents.get('get_rents_status') !== 'READY') {
      props.submitRequest('GET_RENTS') 
    }
  }

  render() {
    let rents_order = this.props.order || Immutable.List()
    let rents = this.props.hashed || Immutable.Map()
    let rendered_rents = []

    rents_order.forEach( rent_id => {
      let rent = rents.get(rent_id)

      rendered_rents.push(
        <tr key={ rent.get('id') }>
          <td>{ rent.get('delivery_time') }</td>
          <td>{ rent.get('pick_up_time') }</td>
          <td>{ rent.get('product') }</td>
          <td>{ rent.get('price') }</td>
          <td>{ rent.get('discount') }</td>
          <td>{ rent.get('additional_charges') }</td>
          <td>{ rent.get('additional_charges_notes') }</td>
          <td>{ rent.get('rent_type') }</td>
          <td>{ rent.get('status') }</td>
          <td>{ rent.get('client_id') }</td>
          <td>{ rent.get('place_id') }</td>
          <td><Link to={ '/rents/' + rent.get('id') + '/edit'}>Edit</Link></td>
        </tr>
      )
    })

    return (
      <div>
        <h3>Rentas</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha de entrega</th>
              <th>Fecha de recolección</th>
              <th>Producto rentado</th>
              <th>Precio</th>
              <th>Descuento</th>
              <th>Cargo adicional</th>
              <th>Tipo de cargo adicional</th>
              <th>Tipo de renta</th>
              <th>Estado</th>
              <th>Cliente</th>
              <th>Lugar</th>
              <th />
            </tr>
          </thead>
          <tbody>
            { rendered_rents }
          </tbody>
        </table>
        <br />
        <Link to="/rents/new">Rentar</Link>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    rents: state.get('rents') || Immutable.Map(),
    hashed: state.getIn(['rents', 'hashed']),
    order: state.getIn(['rents', 'order']),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Index))
