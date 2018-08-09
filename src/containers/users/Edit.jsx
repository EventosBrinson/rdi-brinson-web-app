import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actionCreators from '../../action-creators'
import * as abilitiesHelper from '../../modules/abilities-helpers'
import Immutable from 'immutable'

import { Form, Input, Radio, Button } from 'antd'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
}

class Edit extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleRoleChange = this.handleRoleChange.bind(this)
    this.checkEmail = this.checkEmail.bind(this)
    this.checkUsername = this.checkUsername.bind(this)
    this.processSubmit = this.processSubmit.bind(this)
    this.setUpUser = this.setUpUser.bind(this)

    this.user = Immutable.Map()
    this.submited = false
  }

  componentWillMount() {
    this.user_id = this.props.match.params.id

    this.props.cleanForm('edit_user_form')
    this.setUpUser(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.user.get('id') === undefined) {
      this.setUpUser(nextProps)
    }

    let update_errors = nextProps.users.get('update_errors')

    if (update_errors && this.submited) {
      var errors = {}
      if (update_errors.get('email')) {
        errors['email'] = { errors: [new Error('Este correo electronico ya esta en uso')] }
      }
      if (update_errors.get('username')) {
        errors['username'] = { errors: [new Error('Este nombre de usuario ya esta en uso')] }
      }

      nextProps.form.setFields(errors)

      delete this.submited
    }
  }

  setUpUser(props) {
    if (props.session_status === 'SIGNED_IN') {
      if (props.get_users_status === 'READY') {
        this.user = props.users.getIn(['hashed', this.user_id])
      } else if (String(props.user.get('id')) === this.user_id) {
        this.user = props.user
      } else if (abilitiesHelper.isAdmin()) {
        this.props.submitRequest('GET_USERS')
      }
    }
  }

  handleChange(event) {
    this.props.changeForm('edit_user_form', event.target.name, event.target.value)
  }

  handleRoleChange(object) {
    this.props.changeForm('edit_user_form', 'role', object.target.value)
  }

  processSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = (this.props.edit_user_form || Immutable.Map()).toJS()

        this.props.submitRequest('UPDATE_USER', { user: data }, { id: this.user_id })

        this.submited = true
      }
    })
  }

  checkEmail(rule, value, callback) {
    const users = this.props.users.get('hashed') || Immutable.Map()

    var found = users.find((user, key) => {
      return user.get('email') === value && String(user.get('id')) !== this.user_id
    })

    if (found) {
      callback('Este correo electronico ya esta en uso')
    } else {
      callback()
    }
  }

  checkUsername(rule, value, callback) {
    const users = this.props.users.get('hashed') || Immutable.Map()

    var found = users.find((user, key) => {
      return user.get('username') === value && String(user.get('id')) !== this.user_id
    })

    if (found) {
      callback('Este nombre de usuario ya esta en uso')
    } else {
      callback()
    }
  }

  render() {
    let form = this.props.edit_user_form || Immutable.Map()
    const { getFieldDecorator, isFieldsTouched } = this.props.form

    var passwordField = ''

    if (
      this.props.session_status === 'SIGNED_IN' &&
      (abilitiesHelper.itsMe(this.user) ||
        abilitiesHelper.isMain() ||
        (abilitiesHelper.isAdmin() && !abilitiesHelper.isAdmin(this.user)))
    ) {
      passwordField = (
        <div>
          <Form.Item {...tailFormItemLayout}>
            <h4>Cambiar contraseña</h4>
          </Form.Item>
          <Form.Item {...formItemLayout} label="Contraseña" hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  whitespace: true
                }
              ],
              initialValue: form.get('password') || this.user.get('password')
            })(<Input name="password" type="password" placeholder="Nueva contraseña" onChange={this.handleChange} />)}
          </Form.Item>
        </div>
      )
    }

    var roleInput = ''

    if (abilitiesHelper.isMain()) {
      roleInput = (
        <Form.Item {...formItemLayout} label="Tipo">
          {getFieldDecorator('role', {
            initialValue: form.get('role') || this.user.get('role')
          })(
            <Radio.Group onChange={this.handleRoleChange}>
              <Radio.Button value="user">Usuario</Radio.Button>
              <Radio.Button value="admin">Administrador</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>
      )
    }

    return (
      <Form onSubmit={this.processSubmit}>
        <Form.Item {...tailFormItemLayout}>
          <h2>Editar Usuario</h2>
        </Form.Item>

        <Form.Item {...formItemLayout} label="Email" hasFeedback>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'El email tiene un formato inválido'
              },
              {
                required: true,
                message: 'Introduce el correo electrónico del usuario'
              },
              {
                validator: this.checkEmail
              }
            ],
            initialValue: form.get('email') || this.user.get('email')
          })(<Input name="email" placeholder="Email" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Nombre de usuario" hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              {
                pattern: /^[a-zA-Z0-9\-._&]+$/,
                message: 'El nombre de usuario no debe de contener espacios ni caracteres especiales.'
              },
              {
                required: true,
                message: 'Introduce el nombre de usuario'
              },
              {
                validator: this.checkUsername
              }
            ],
            initialValue: form.get('username') || this.user.get('username')
          })(<Input name="username" placeholder="Nombre de usuario" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Nombre" hasFeedback>
          {getFieldDecorator('firstname', {
            rules: [
              {
                required: true,
                message: 'Introduce el o los nombres del usuario',
                whitespace: true
              }
            ],
            initialValue: form.get('firstname') || this.user.get('firstname')
          })(<Input name="firstname" placeholder="Nombre" onChange={this.handleChange} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Apellido" hasFeedback>
          {getFieldDecorator('lastname', {
            rules: [
              {
                required: true,
                message: 'Introduce el o los apellidos del usuario',
                whitespace: true
              }
            ],
            initialValue: form.get('lastname') || this.user.get('lastname')
          })(<Input name="lastname" placeholder="Apellido" onChange={this.handleChange} />)}
        </Form.Item>

        {roleInput}

        {passwordField}

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" disabled={!isFieldsTouched()}>
            Actializar
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

function mapStateToProps(state) {
  return {
    edit_user_form: state.getIn(['forms', 'edit_user_form']),
    users: state.get('users') || Immutable.Map(),
    get_users_status: state.getIn(['users', 'get_users_status']),
    user: state.get('user'),
    session_status: state.get('session_status')
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actionCreators
  )(Form.create()(Edit))
)
