import React, { Component } from 'react'
import { Card, Icon, Form, Input, Select, Button, message } from 'antd'

import LinkButton from '../../components/link-button'
import PictureWall from './picture-wall'
import RichTextEditor from './rich-text-editor'
import { getCategoryList, addProduct, updateProduct } from '../../api/manage'
import memoryUtils from '../../utils/memoryUtils'

const Item = Form.Item
const Option = Select.Option

class ProductAddUpdate extends Component {
  picWall = React.createRef()
  editorRef = React.createRef()
  state = {
    categoryList: [],
    defaultCategoryValue: ''
  }
  UNSAFE_componentWillMount () {
    this.checkProduct()
    this.getCategoryList()
  }
  checkProduct = () => {
    this.product = memoryUtils.product
    this.isUpdate = !!this.product._id
  }
  getCategoryList = async () => {
    const { status, data } = await getCategoryList()
    if (status === this.CONFIG.CODE_SUCCESS) {
      const categoryList = [...data]
      this.setState({ categoryList })
    }
  }
  validatorPrice = (rule, value, callback) => {
    if (value === '') {
      callback()
    } else if (value <= 0) {
      callback('价格必须为正数')
    } else {
      callback()
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { name, desc, price, categoryId } = values
        const imgs = this.picWall.current.getImgs()
        const detail = this.editorRef.current.getDetail()
        let params = {
          name,
          desc,
          price,
          categoryId,
          imgs,
          detail
        }
        let methods = addProduct
        if (this.isUpdate) {
          methods = updateProduct
          params._id = this.product._id
        }
        const { status } = await methods(params)
        if (status === this.CONFIG.CODE_SUCCESS) {
          let msg = this.isUpdate ? '更新成功' : '新增成功'
          message.success(msg)
          this.props.history.replace('/product')
        }
      }
    })
  }
  render () {
    const { validatorPrice, handleSubmit, product, isUpdate, picWall, editorRef } = this
    const { getFieldDecorator } = this.props.form
    const { categoryList, defaultCategoryValue } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    }
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left"></Icon>
        </LinkButton>
        <span>{isUpdate ? '更新商品' : '添加商品'}</span>
      </span>
    )
    return (
      <Card title={title}>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Item label="商品名称">
            {getFieldDecorator('name', {
              initialValue: product.name || '',
              rules: [{ required: true, message: '必须输入商品名称' }]
            })(<Input type="text" placeholder="请输入商品名称" />)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator('desc', {
              initialValue: product.desc || '',
              rules: [{ required: true, message: '必须输入商品描述' }]
            })(<Input type="text" placeholder="请输入商品描述" />)}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator('price', {
              initialValue: product.price || '',
              rules: [
                { required: true, message: '必须输入价格' },
                { validator: validatorPrice }]
            })(<Input type="number" addonAfter="元" placeholder="请输入商品价格" />)}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator('categoryId', {
              initialValue: product.categoryId || '',
              rules: [{ required: true, message: '必须选择商品分类' }]
            })(
              <Select>
                <Option value={defaultCategoryValue}>未选择</Option>
                {
                  categoryList.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                }
              </Select>
            )}
          </Item>
          <Item label="商品图片">
            <PictureWall ref={picWall} imgs={product.imgs} />
          </Item>
          <Item label="商品詳情" wrapperCol={{ span: 20 }}>
            <RichTextEditor ref={editorRef} detail={product.detail} />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">提交</Button>
          </Item>
        </Form>
      </Card >
    )
  }
}

export default Form.create()(ProductAddUpdate)