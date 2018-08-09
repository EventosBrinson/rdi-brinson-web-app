import React from 'react'

import { Form, Input, InputNumber, Button } from 'antd'

export default class AdditionalChargesFrom extends React.Component {
  constructor(props) {
    super(props)

    this.processSubmit = this.processSubmit.bind(this)
    this.handleAdditionalChargesChange = this.handleAdditionalChargesChange.bind(this)
    this.handleAdditionalChargesNotesChange = this.handleAdditionalChargesNotesChange.bind(this)
    this.state = {
      additional_charges_notes: props.additionalChargesNotes,
      additional_charges: props.additionalCharges || 0
    }
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    let data = this.state

    this.props.submitRequest('UPDATE_RENT', { rent: data }, { id: this.props.rentId })

    this.setState({ showUpdate: false })
  }

  handleAdditionalChargesNotesChange(event) {
    this.setState({ additional_charges_notes: event.target.value, showUpdate: true })
  }

  handleAdditionalChargesChange(value) {
    this.setState({ additional_charges: value, showUpdate: true })
  }

  render() {
    const priceFormater = value => {
      var splited = String(value).split('.')
      var first = '',
        last = undefined

      if (splited[0]) {
        first = splited[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      if (splited[1] !== undefined) {
        last = splited[1]
      }

      return `$${first}${last !== undefined ? '.' + last.slice(-2) : ''}`
    }

    var updateButton = undefined

    if (this.state.showUpdate) {
      updateButton = (
        <Form.Item style={{ marginBottom: '0px', textAlign: 'center' }}>
          <Button type="primary" htmlType="submit">
            Actualizar cargos
          </Button>
        </Form.Item>
      )
    }

    return (
      <Form onSubmit={this.processSubmit}>
        <h3>Cargos adicionales</h3>
        <Form.Item style={{ marginBottom: '0px' }}>
          <Input
            type="textarea"
            value={this.state.additional_charges_notes}
            name="additional_charges_notes"
            placeholder="Cargos adicionales"
            autosize
            onChange={this.handleAdditionalChargesNotesChange}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: '0px' }}>
          <InputNumber
            name="additional_charges"
            value={this.state.additional_charges}
            max={9999999}
            min={0}
            formatter={priceFormater}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            style={{ width: '100%' }}
            onChange={this.handleAdditionalChargesChange}
          />
        </Form.Item>

        {updateButton}
      </Form>
    )
  }
}
