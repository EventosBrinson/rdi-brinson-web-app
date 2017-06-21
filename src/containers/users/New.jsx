import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import Immutable from 'immutable'

import { Form, Input, Radio, Button } from 'antd'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
}

class New extends React.Component {

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleRoleChange = this.handleRoleChange.bind(this)
    this.checkEmail = this.checkEmail.bind(this)
    this.checkUsername = this.checkUsername.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.session_status === 'SIGNED_IN') {
      if(nextProps.get_users_status === undefined) {
        nextProps.submitRequest('GET_USERS') 
      }

      let form = nextProps.user_form || Immutable.Map()

      if(form.get('role') === undefined) {
        nextProps.mergeForm('user_form', {
          role: form.get('role') || 'user'
        })
      }
    }
  }

  handleChange(event) {
    this.props.changeForm('user_form', event.target.name, event.target.value)
  }


  handleRoleChange(object) {
    this.props.changeForm('user_form', 'role', object.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = (this.props.user_form || Immutable.Map()).toJS()

        this.props.submitRequest('CREATE_USER', { user: data })
      }
    })
  }

  checkEmail(rule, value, callback) {
    const users = this.props.users.get('hashed')

    var found = users.find((user, key) => {
      return user.get('email') === value
    })

    if(found) {
      callback('Este correo electronico ya esta en uso')
    } else {
      callback()
    }
  }

  checkUsername(rule, value, callback) {
    const users = this.props.users.get('hashed')

    var found = users.find((user, key) => {
      return user.get('username') === value
    })

    if(found) {
      callback('Este nombre de usuario ya esta en uso')
    } else {
      callback()
    }
  }

  render() {
    let form = this.props.user_form || Immutable.Map()
    const { getFieldDecorator } = this.props.form

    return (
      <Form onSubmit={ this.processSubmit }>
        <Form.Item {...tailFormItemLayout}>
          <h2>
            Nuevo Usuario
          </h2>
        </Form.Item>

        <Form.Item {...formItemLayout} label="Email" hasFeedback>
          { getFieldDecorator('email', {
            rules: [{
              type: 'email',
              message: 'El email tiene un formato inválido'}, {
              required: true,
              message: 'Introduce el correo electrónico del usuario'}, {
              validator: this.checkEmail
            }],
            initialValue: form.get('email')
          })(
            <Input name='email' placeholder="Email" onChange={ this.handleChange } />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Nombre de usuario" hasFeedback>
          { getFieldDecorator('username', {
            rules: [{
              pattern: /^[a-zA-Z0-9\-._&]+$/,
              message: 'El nombre de usuario no debe de contener espacios ni caracteres especiales.'}, {
              required: true,
              message: 'Introduce el nombre de usuario'}, {
              validator: this.checkUsername
            }],
            initialValue: form.get('username')
          })(
            <Input name='username' placeholder="Nombre de usuario" onChange={ this.handleChange } />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Nombre" hasFeedback>
          { getFieldDecorator('firstname', {
            rules: [{
              required: true, message: 'Introduce el o los nombres del usuario',
              whitespace: true
            }],
            initialValue: form.get('firstname')
          })(
            <Input name='firstname' placeholder="Nombre" onChange={ this.handleChange }/>
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Apellido" hasFeedback>
          { getFieldDecorator('lastname', {
            rules: [{
              required: true, message: 'Introduce el o los apellidos del usuario',
              whitespace: true
            }],
            initialValue: form.get('lastname')
          })(
            <Input name='lastname' placeholder="Apellido" onChange={ this.handleChange } />
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Tipo">
          { getFieldDecorator('role', {
            initialValue: form.get('role')
          })(
            <Radio.Group onChange={this.handleRentTypeChange}>
              <Radio.Button value="user">Usuario</Radio.Button>
              <Radio.Button value="admin">Administrador</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">Crear</Button>
        </Form.Item>
      </Form>
    )
  }
}

function mapStateToProps(state) {
  return {
    users: state.get('users'),
    get_users_status: state.getIn(['users', 'get_users_status']),
    user_form: state.getIn(['forms', 'user_form']),
    session_status: state.get('session_status')
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(Form.create()(New)))
