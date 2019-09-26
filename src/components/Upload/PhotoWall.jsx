import { Upload, Icon, Modal } from 'antd';

export default class PhotoWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList:[{
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.response.data.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) =>{
      this.setState({ fileList })
    //   this.props.onGetImage(fileList,this.props.field)
  } 

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
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
          disabled={this.props.disabled}
          action={window.config.apiUrl + '/rs/uploadImage'}
          name='file'
          headers={{sessionId :localStorage.getItem('sessionId')||''}}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}