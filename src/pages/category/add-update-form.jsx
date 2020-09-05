import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
const Item = Form.Item

class AddUpdateForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired
  }
  UNSAFE_componentWillMount () {
    const { setForm, form } = this.props
    setForm(form)
  }
  render () {
    const { categoryName } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: categoryName || '',
              rules: [
                { required: true, message: '分类名称必须输入' }
              ]
            })(
              <Input type="text" placeholder="请输入分类名称"></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddUpdateForm)