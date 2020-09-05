import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table, message } from 'antd'

import throttle from 'lodash.throttle'

import LinkButton from '../../components/link-button'

import { getProductList, getSearchProductList, updateProductStatus } from '../../api/manage'

import { PAGE_SIZE, PRODUCT_NAME, PRODUCT_DESC } from '../../utils/contants'
import memoryUtils from '../../utils/memoryUtils'

const Option = Select.Option
/**
 * 商品管理
 */
export default class Product extends Component {
  search = React.createRef()
  state = {
    tableLoading: false,
    productList: [],
    pageSize: PAGE_SIZE,
    pageNum: 1,
    total: 0,
    searchType: PRODUCT_NAME
  }
  UNSAFE_componentWillMount () {
    this.initColumns()
    this.getProductList()
  }
  initColumns = () => {
    const { statusChange } = this
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        width: 100,
        dataIndex: 'price',
        render: (price) => '￥' + price
      },
      {
        title: '状态',
        width: 80,
        dataIndex: 'status',
        render: (status, item) => {
          let btnText = '下架'
          let text = '在售'
          if (status === 2) {
            btnText = '上架'
            text = '已下架'
          }
          return (
            <span>
              <Button type="primary" onClick={() => statusChange(item)}>{btnText}</Button>
              <span>{text}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 80,
        render: (product) => (
          <span>
            <LinkButton onClick={() => {
              memoryUtils.product = product
              this.props.history.push('/product/detail/' + product._id)
            }}>詳情</LinkButton>
            <LinkButton onClick={() => {
              memoryUtils.product = product
              this.props.history.push('/product/addupdate')
            }}>修改</LinkButton>
          </span>
        )
      }
    ]
  }
  getProductList = async () => {
    const { pageSize, pageNum } = this.state
    let params = {
      pageSize,
      pageNum
    }
    const { status, data } = await getProductList(params)
    if (status === this.CONFIG.CODE_SUCCESS) {
      const productList = [...data.list]
      const total = data.total
      this.setState({
        productList,
        total
      })
    }
  }
  getSearchProductList = async (pageNum = 1) => {
    let { value } = this.search.current.input
    value = value.trim()
    if (!value) return this.getProductList()
    const { searchType, pageSize } = this.state
    // const pageNum = 1
    let params = {
      pageSize,
      pageNum
    }
    if (searchType === PRODUCT_NAME) params.productName = value
    else params.productDesc = value
    const { status, data } = await getSearchProductList(params)
    if (status === this.CONFIG.CODE_SUCCESS) {
      const productList = [...data.list]
      const total = data.total
      this.setState({
        pageNum,
        productList,
        total
      })
    }
  }
  statusChange = throttle(async (item) => {
    const { _id } = item
    const preStatus = item.status
    let params = {
      productId: _id,
      status: preStatus === 1 ? 2 : 1
    }
    const { status } = await updateProductStatus(params)
    if (status === this.CONFIG.CODE_SUCCESS) {
      message.success('更新成功')
      this.getProductList()
    }
  }, 2000)
  pageChange = async (pageNum) => {
    const { value } = this.search.current.input
    await this.setState({ pageNum })
    if (!value.trim()) this.getProductList()
    else this.getSearchProductList(pageNum)
  }
  searchChange = (searchType) => {
    this.setState({ searchType })
  }
  searchClick = () => {
    this.getSearchProductList()
  }
  render () {
    const { columns, pageChange, search, searchChange, searchClick } = this
    const { tableLoading, productList, pageSize, total, searchType, pageNum } = this.state
    const title = (
      <span>
        <Select style={{ width: 130 }} defaultValue={searchType} onChange={searchChange}>
          <Option value={PRODUCT_NAME}>按名称搜索</Option>
          <Option value={PRODUCT_DESC}>按描述搜索</Option>
        </Select>
        <Input ref={search} style={{ width: 130, margin: '0 10px' }} placeholder="关键字" />
        <Button type="primary" onClick={searchClick}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type="primary" onClick={() => {
        memoryUtils.product = {}
        this.props.history.push('/product/addupdate')
      }}>
        <Icon type="plus"></Icon>
        <span>添加商品</span>
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          columns={columns}
          dataSource={productList}
          loading={tableLoading}
          pagination={{ current: pageNum, defaultPageSize: pageSize, showQuickJumper: true, onChange: pageChange, total }}
          rowKey="_id"
          bordered
        />
      </Card>
    )
  }
}
