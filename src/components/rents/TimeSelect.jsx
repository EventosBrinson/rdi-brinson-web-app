import React from 'react'
import moment from 'moment'
import { Select } from 'antd'


export default class TimeSelect extends React.Component {

  constructor(props) {
    super(props)

    this.handleHourChange = this.handleHourChange.bind(this)
    this.handleMinutesChange = this.handleMinutesChange.bind(this)

    let current = props.value || moment()

    this.state = { hour: String(current.get('hour')), minutes: String(Math.floor(current.get('minutes') / 10) * 10)  }
  }

  componentWillReceiveProps(nextProps) {
    let current = nextProps.value || moment()

    this.setState({ hour: String(current.get('hour')), minutes: String(Math.floor(current.get('minutes') / 10) * 10)  })
  }

  handleHourChange(value) {
    this.setState({ hour: value })
    if(this.props.onChange) {
      this.props.onChange(moment(value + this.state.minutes, "hmm"))
    }
  }

  handleMinutesChange(value) {
    this.setState({ minutes: value })
    if(this.props.onChange) {
      this.props.onChange(moment(this.state.hour + value, "hmm"))
    }
  }

  render() {
    return (
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td>
              <Select value={ this.state.hour } onChange={ this.handleHourChange }>
                <Select.Option value='0'>00</Select.Option>
                <Select.Option value='1'>01</Select.Option>
                <Select.Option value='2'>02</Select.Option>
                <Select.Option value='3'>03</Select.Option>
                <Select.Option value='4'>04</Select.Option>
                <Select.Option value='5'>05</Select.Option>
                <Select.Option value='6'>06</Select.Option>
                <Select.Option value='7'>07</Select.Option>
                <Select.Option value='8'>08</Select.Option>
                <Select.Option value='9'>09</Select.Option>
                <Select.Option value='10'>10</Select.Option>
                <Select.Option value='11'>11</Select.Option>
                <Select.Option value='12'>12</Select.Option>
                <Select.Option value='13'>13</Select.Option>
                <Select.Option value='14'>14</Select.Option>
                <Select.Option value='15'>15</Select.Option>
                <Select.Option value='16'>16</Select.Option>
                <Select.Option value='17'>17</Select.Option>
                <Select.Option value='18'>18</Select.Option>
                <Select.Option value='19'>19</Select.Option>
                <Select.Option value='20'>20</Select.Option>
                <Select.Option value='21'>21</Select.Option>
                <Select.Option value='22'>22</Select.Option>
                <Select.Option value='23'>23</Select.Option>
              </Select>
            </td>
            <td>
              <Select value={ this.state.minutes } onChange={ this.handleMinutesChange }>
                <Select.Option value='00'>00</Select.Option>
                <Select.Option value='10'>10</Select.Option>
                <Select.Option value='20'>20</Select.Option>
                <Select.Option value='30'>30</Select.Option>
                <Select.Option value='40'>40</Select.Option>
                <Select.Option value='50'>50</Select.Option>
              </Select>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}
