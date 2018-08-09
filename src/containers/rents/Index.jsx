import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'
import RentList from '../../components/rents/RentList'
import * as abilitiesHelper from '../../modules/abilities-helpers'

import { Button, Tabs, DatePicker } from 'antd'

class Index extends React.Component {
  static defaultProps = {
    order: Immutable.List()
  }

  componentDidMount() {
    this.checkRents(this.props)
  }

  checkRents(props) {
    if (props.session_status === 'SIGNED_IN' && props.rents.get('get_rents_status') === undefined) {
      this.getRents({ paginated: { offset: 0, limit: 10 } })
    }
  }

  getRents(params = {}) {
    if (abilitiesHelper.isAdmin()) {
      params['all'] = true
    }

    this.props.submitRequest('GET_RENTS', params)
  }

  deleteRent(rent, event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.submitRequest('DELETE_RENT', {}, { id: rent.get('id') })
  }

  handleLoadMore() {
    this.getRents({ paginated: { offset: this.props.order.size, limit: 10 }, ...this.dateParams })
  }

  handleLoadAll() {
    this.getRents({ paginated: { offset: this.props.order.size, limit: this.props.total }, ...this.dateParams })
  }

  handleTimeChanged(date) {
    if (date) {
      this.dateParams = {
        'filter_by_time[beginning_time]': date.startOf('day').format(),
        'filter_by_time[end_time]': date.endOf('day').format(),
        'filter_by_time[columns][]': ['delivery_time', 'pick_up_time']
      }

      this.props.clearStatus(['rents', 'order'])
      this.getRents({ paginated: { offset: 0, limit: 10 }, ...this.dateParams })
    } else {
      this.dateParams = undefined
      this.props.clearStatus(['rents', 'order'])
      this.getRents({ paginated: { offset: 0, limit: 10 } })
    }
  }

  render() {
    let rents_order = this.props.order

    let datePickerLocale = {
      lang: {
        placeholder: 'Fecha y hora',
        now: 'Ahora',
        ok: 'Ok',
        timeSelect: 'Hora',
        dateSelect: 'Fecha'
      }
    }
    return (
      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
        <table>
          <tbody>
            <tr>
              <td>
                <h2>Rentas</h2>
              </td>
              <td style={{ width: '1%', whiteSpace: 'nowrap' }}>
                <Button type="primary">
                  <Link to="/rents/new">Rentar</Link>
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <DatePicker
            locale={datePickerLocale}
            format="dddd, DD [de] MMMM [de] YYYY"
            style={{ width: '100%' }}
            onChange={this.handleTimeChanged.bind(this)}
            placeholder="Fecha"
            allowClear
          />
        </div>
        <Tabs>
          <Tabs.TabPane tab="Todas" key="1">
            <RentList
              order={rents_order}
              hashed={this.props.hashed || Immutable.Map()}
              submitRequest={this.props.submitRequest}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Reservadas" key="2">
            <RentList
              status="reserved"
              order={rents_order}
              hashed={this.props.hashed || Immutable.Map()}
              submitRequest={this.props.submitRequest}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="En ruta" key="3">
            <RentList
              status="on_route"
              order={rents_order}
              hashed={this.props.hashed || Immutable.Map()}
              submitRequest={this.props.submitRequest}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Entregadas" key="4">
            <RentList
              status="delivered"
              order={rents_order}
              hashed={this.props.hashed || Immutable.Map()}
              submitRequest={this.props.submitRequest}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="En recolección" key="5">
            <RentList
              status="on_pick_up"
              order={rents_order}
              hashed={this.props.hashed || Immutable.Map()}
              submitRequest={this.props.submitRequest}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Pendientes" key="6">
            <RentList
              status="pending"
              order={rents_order}
              hashed={this.props.hashed || Immutable.Map()}
              submitRequest={this.props.submitRequest}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Finalizadas" key="7">
            <RentList
              status="finalized"
              order={rents_order}
              hashed={this.props.hashed || Immutable.Map()}
              submitRequest={this.props.submitRequest}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Canceladas" key="8">
            <RentList
              status="canceled"
              order={rents_order}
              hashed={this.props.hashed || Immutable.Map()}
              submitRequest={this.props.submitRequest}
            />
          </Tabs.TabPane>
        </Tabs>
        {this.props.total > this.props.order.size ? (
          <Button type="primary" style={{ marginTop: '20px', width: '100%' }} onClick={this.handleLoadMore.bind(this)}>
            Cargar mas
          </Button>
        ) : null}
        {this.props.total > this.props.order.size ? (
          <Button type="primary" style={{ marginTop: '20px', width: '100%' }} onClick={this.handleLoadAll.bind(this)}>
            Cargar todo
          </Button>
        ) : null}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    rents: state.get('rents') || Immutable.Map(),
    hashed: state.getIn(['rents', 'hashed']),
    order: state.getIn(['rents', 'order']),
    session_status: state.get('session_status'),
    total: state.getIn(['rents', 'total'])
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actionCreators
  )(Index)
)
