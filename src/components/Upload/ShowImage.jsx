import { Upload, Icon, Modal } from 'antd';

//临时作废，出现bug
export default class ImageUpdate extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList:this.props.field.FIELD_VALUE,
    // fileList:[{
    //   path: "http://192.168.4.128:9099/temp/null",
    //   uid: "1703c5faf2cd6b03e20b2b0746a90f1f.png",
    //   url: "http://192.168.4.128:9099/temp/1703c5faf2cd6b03e20b2b0746a90f1f.png"
    // }],
  }

  // componentWillReceiveProps=(newProps) => {
  //   this.setState({
  //     fileList : newProps.field.FIELD_VALUE
  //   })
  // }

  handleCancel = () => {
    this.setState({ previewVisible: false })
  }

  handlePreview = (file) => {
    if(this.props.disabled) return
    this.setState({
      previewImage: file.url || file.response.data.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = (info) =>{
      const {fileList} = info
      fileList = fileList.slice(-1); //限制只保留一张图片
      console.log(info)
      // this.props.handleImageChange(fileList)
      // this.setState({ fileList })
      this.props.dispatch({type:'tableTemplate/save',payload:{fileList,fileKey:this.props.field.FIELD_NAME}})
    //   this.props.onGetImage(fileList,this.props.field)
  } 

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    // const fileList = this.props.field.FIELD_VALUE
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">选择图片</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload 
          style={{cursor:this.props.disabled ? 'not-allowed' : ''}}
          // disabled={this.props.disabled}
          action={window.config.apiUrl + '/rs/uploadImage'}
          name='file'
          headers={{sessionId :localStorage.getItem('sessionId')||''}}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {this.props.disabled ? '' : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}