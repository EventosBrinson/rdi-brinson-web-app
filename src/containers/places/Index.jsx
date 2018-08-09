import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import PlaceList from '../../components/places/PlaceList'

import { Tabs, Button } from 'antd'

class Index extends React.Component {
  componentDidMount() {
    this.getPlaces(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getPlaces(nextProps)
  }

  getPlaces(props) {
    if (props.session_status === 'SIGNED_IN' && props.places.get('get_places_status') === undefined) {
      props.submitRequest('GET_PLACES')
    }
  }

  render() {
    return (
      <div style={{ marginTop: '20px' }}>
        <table>
          <tbody>
            <tr>
              <td>
                <h2>Lugares</h2>
              </td>
              <td style={{ width: '1%', whiteSpace: 'nowrap' }}>
                <Button type="primary">
                  <Link to="/places/new">Crear nuevo</Link>
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
        <Tabs>
          <Tabs.TabPane tab="Activos" key="1">
            <PlaceList
              active={true}
              order={this.props.order || Immutable.List()}
              hashed={this.props.hashed || Immutable.Map()}
              submitRequest={this.props.submitRequest}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Inactivos" key="2">
            <PlaceList
              active={false}
              order={this.props.order || Immutable.List()}
              hashed={this.props.hashed || Immutable.Map()}
              submitRequest={this.props.submitRequest}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    places: state.get('places') || Immutable.Map(),
    hashed: state.getIn(['places', 'hashed']),
    order: state.getIn(['places', 'order']),
    session_status: state.get('session_status')
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actionCreators
  )(Index)
)
