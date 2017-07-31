import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import ClientList from '../../components/clients/ClientList'

import { Tabs, Button } from 'antd'

class Index extends React.Component {

  componentDidMount() {
    this.getClients(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getClients(nextProps)
  }

  getClients(props) {
    if(props.session_status === 'SIGNED_IN' && props.clients.get('get_clients_status') === undefined) {
      var params = {}

      if(abilitiesHelper.isAdmin()) {
        params['all'] = true
      }

      props.submitRequest('GET_CLIENTS', params) 
    }
  }

  render() {
    return (
      <div style={{ marginTop: '20px'}}>
        <table>
          <tbody>
            <tr>
              <td>
                <h2>
                  Clientes
                </h2>
              </td>
              <td style={{ width: '1%', whiteSpace: 'nowrap' } }>
                <Button type="primary">
                  <Link to="/clients/new">
                    Crear nuevo
                  </Link>
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
        <Tabs>
          <Tabs.TabPane tab="Activos" key="1">
            <ClientList active={ true } 
                        order={ this.props.order || Immutable.List() }
                        hashed={ this.props.hashed || Immutable.Map() }
                        submitRequest={ this.props.submitRequest }/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Inactivos" key="2">
            <ClientList active={ false } 
                        order={ this.props.order || Immutable.List() }
                        hashed={ this.props.hashed || Immutable.Map()}
                        submitRequest={ this.props.submitRequest }/>
          </Tabs.TabPane>
        </Tabs>
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
