import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import PropTypes from 'prop-types'

import { deletePicture } from '../../api/manage'

import { BASE_IMG, UPLOAD_IMG } from '../../utils/contants'

function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default class PicturesWall extends Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: []
  }
  UNSAFE_componentWillMount () {
    const imgs = this.props.imgs
    if (imgs && imgs.length) {
      const fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG + img
      }))
      this.setState({ fileList })
    }
  }
  getImgs = () => this.state.fileList.map(file => file.name)
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    })
  }
  handleChange = ({ file, fileList }) => {
    if (file.status === 'done') {
      file = fileList[fileList.length - 1]
      const { name, url } = file.response.data
      file.name = name
      file.url = url
    }
    this.setState({ fileList })
  }
  handleDelete = async (file) => {
    const { name } = file
    let params = {
      name
    }
    const { status } = await deletePicture(params)
    if (status === this.CONFIG.CODE_SUCCESS) {
      message.success('删除成功')
    }
  }
  render () {
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div>
        <Upload
          action={UPLOAD_IMG}
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleDelete}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}