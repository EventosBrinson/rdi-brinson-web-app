import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

class Index extends React.Component {

  componentDidMount() {
    this.getPlaces(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getPlaces(nextProps)
  }

  getPlaces(props) {
    if(props.session_status === 'SIGNED_IN' && props.clients.get('get_places_status') !== 'READY') {
      props.submitRequest('GET_PLACES') 
    }
  }

  render() {
    let places_order = this.props.order || Immutable.List()
    let places = this.props.hashed || Immutable.Map()
    let rendered_places = []

    places_order.forEach( place_id => {
      let place = places.get(place_id)

      rendered_places.push(
        <tr key={ place.get('id') }>
          <td>{ place.get('name') }</td>
          <td>{ place.get('street') }</td>
          <td>{ place.get('inner_number') }</td>
          <td>{ place.get('outer_number') }</td>
          <td>{ place.get('neighborhood') }</td>
          <td>{ place.get('postal_code') }</td>
          <td>{ place.get('active') ? 'Si' : 'No' }</td>
          <td><Link to={ '/places/' + place.get('id') + '/edit'}>Edit</Link></td>
        </tr>
      )
    })

    return (
      <div>
        <h3>Places</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Calle</th>
              <th>Numero interior</th>
              <th>Numero exterior</th>
              <th>Fraccionamiento</th>
              <th>CP</th>
              <th>Activo</th>
              <th />
            </tr>
          </thead>
          <tbody>
            { rendered_places }
          </tbody>
        </table>
        <br />
        <Link to="/places/new">Crear nuevo</Link>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    places: state.get('places') || Immutable.Map(),
    hashed: state.getIn(['places', 'hashed']),
    order: state.getIn(['places', 'order'])
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Index))
