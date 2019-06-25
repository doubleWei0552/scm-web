import React from 'react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

//富文本编辑器
export default class Editor extends React.Component {

  state = {
      editorState: null
  }

  componentDidMount= () =>{
  //   // 假设此处从服务端获取html格式的编辑器内容
  //   const htmlContent = await fetchEditorContent()
  //   // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorState数据
    this.setState({
      editorState: BraftEditor.createEditorState(this.props.defaultData)
    })
  }

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML()
    // const result = await saveEditorContent(htmlContent)
    console.log(htmlContent)
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState })
    // this.props.onRichText(editorState.toHTML())
  }

  onSaveData = (editorState) =>{
    console.log('失去焦点',editorState)
    this.props.onRichText(editorState.toHTML())
  }

  render () {

    const { editorState } = this.state

    return (
      <div className="my-component" style={{border:'1px solid lightgray'}}>
        <BraftEditor
          onBlur={this.onSaveData}
          value={editorState}
          onChange={this.handleEditorChange}
          onSave={this.submitContent}
          readOnly={this.props.disabled}
          style={{cursor:this.props.disabled ? 'not-allowed' : 'pointer'}}
        />
      </div>
    )

  }

}