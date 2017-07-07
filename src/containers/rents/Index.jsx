import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import RentList from '../../components/rents/RentList'

import { Button, Tabs } from 'antd'

class Index extends React.Component {

  componentDidMount() {
    this.getRents(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getRents(nextProps)
  }

  getRents(props) {
    if(props.session_status === 'SIGNED_IN' && props.rents.get('get_rents_status') === undefined) {
      props.submitRequest('GET_RENTS') 
    }
  }

  deleteRent(rent, event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('DELETE_RENT', {}, { id: rent.get('id') })
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
          <td><button onClick={ this.deleteRent.bind(this, rent) }>Eliminar</button></td>
        </tr>
      )
    })

    return (
      <div style={ { marginTop: '20px'} }>
        <h2>
          Rentas
        </h2>
        <Button type="primary">
          <Link to="/rents/new">
            Rentar
          </Link>
        </Button>
        <Tabs>
          <Tabs.TabPane tab="Todas" key="1">
            <RentList order={ this.props.order || Immutable.List() }
                      hashed={ this.props.hashed || Immutable.Map() }
                      submitRequest={ this.props.submitRequest }/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Reservadas" key="2">
            <RentList status="reserved" order={ this.props.order || Immutable.List() }
                      hashed={ this.props.hashed || Immutable.Map() }
                      submitRequest={ this.props.submitRequest }/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="En ruta" key="3">
            <RentList status="on_route" order={ this.props.order || Immutable.List() }
                      hashed={ this.props.hashed || Immutable.Map() }
                      submitRequest={ this.props.submitRequest }/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Entregadas" key="4">
            <RentList status="delivered" order={ this.props.order || Immutable.List() }
                      hashed={ this.props.hashed || Immutable.Map() }
                      submitRequest={ this.props.submitRequest }/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="En recolección" key="5">
            <RentList status="on_pick_up" order={ this.props.order || Immutable.List() }
                      hashed={ this.props.hashed || Immutable.Map() }
                      submitRequest={ this.props.submitRequest }/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Pendientes" key="6">
            <RentList status="pending" order={ this.props.order || Immutable.List() }
                      hashed={ this.props.hashed || Immutable.Map() }
                      submitRequest={ this.props.submitRequest }/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Finalizadas" key="7">
            <RentList status="finalized" order={ this.props.order || Immutable.List() }
                      hashed={ this.props.hashed || Immutable.Map() }
                      submitRequest={ this.props.submitRequest }/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Canceladas" key="8">
            <RentList status="canceled" order={ this.props.order || Immutable.List() }
                      hashed={ this.props.hashed || Immutable.Map() }
                      submitRequest={ this.props.submitRequest }/>
          </Tabs.TabPane>
        </Tabs>
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
