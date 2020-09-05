import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import PropTypes from 'prop-types'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { UPLOAD_IMG } from '../../utils/contants'

export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTypes.string
  }
  state = {
    editorState: EditorState.createEmpty()
  }
  UNSAFE_componentWillMount () {
    const { detail } = this.props
    if (detail) {
      const contentBlock = htmlToDraft(detail)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.setState({
        editorState
      })
    }
  }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState
    })
  }
  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', UPLOAD_IMG)
        const data = new FormData()
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          resolve(response)
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    )
  }
  getDetail = () => draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  render () {
    const { editorState } = this.state
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{ height: 200, border: '1px solid black', paddingLeft: 20 }}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    )
  }
}