import React, { Component } from 'react'
import { Card, Icon, List } from 'antd'

import LinkButton from '../../components/link-button'

import { getCategory, getProductById } from '../../api/manage'
import memoryUtils from '../../utils/memoryUtils'
import { BASE_IMG } from '../../utils/contants'

const Item = List.Item

export default class ProductDetail extends Component {
  state = {
    product: {},
    category: {}
  }
  UNSAFE_componentWillMount () {
    this.getProduct()
  }
  getProduct = async () => {
    let product = memoryUtils.product
    if (!product._id) {
      const { id } = this.props.match.params
      let params = {
        productId: id
      }
      const { status, data } = await getProductById(params)
      if (status === this.CONFIG.CODE_SUCCESS) {
        product = { ...data }
        this.setState({
          product
        })
      } else {
        return this.props.history.push('/product')
      }
    }
    const _id = product.categoryId
    this.getCategory(_id)
    this.setState({ product })
  }
  getCategory = async (categoryId) => {
    let params = {
      categoryId
    }
    const { status, data } = await getCategory(params)
    if (status === this.CONFIG.CODE_SUCCESS) {
      const category = { ...data }
      this.setState({ category })
    }
  }
  render () {
    const { product, category } = this.state
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left"></Icon>
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className="detail">
        <List className="detail_list">
          <Item className="detail_item">
            <span className="detail_left">商品名称: </span>
            <span className="detail_right">{product.name}</span>
          </Item>
          <Item className="detail_item">
            <span className="detail_left">商品描述: </span>
            <span className="detail_right">{product.desc}</span>
          </Item>
          <Item className="detail_item">
            <span className="detail_left">商品价格: </span>
            <span className="detail_right">{product.price}元</span>
          </Item>
          <Item className="detail_item">
            <span className="detail_left">所属分类: </span>
            <span className="detail_right">{category.name}</span>
          </Item>
          <Item className="detail_item">
            <span className="detail_left">商品图片: </span>
            <div className="detail_right">
              {
                product.imgs && product.imgs.map((img, index) => (
                  <img className="detail_img" key={img} src={BASE_IMG + img} alt="" />
                ))
              }
            </div>
          </Item>
          <Item className="detail_item">
            <span className="detail_left">商品详情: </span>
            <div dangerouslySetInnerHTML={{ __html: product.detail }} className="detail_right"></div>
          </Item>
        </List>
      </Card>
    )
  }
}
