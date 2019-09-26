import { Upload, Icon, message } from 'antd';

const Dragger = Upload.Dragger;

//文件上传组件
export default class FileUpload extends React.Component{
  state={
    previewImage:'',
    fileList:[]
  }
  preview = (file) => {
    this.setState({
        previewImage: file.url || file.thumbUrl
    });
  }
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功！`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败！`);
    }
    if(info.file.type.split('/')[0] == 'image'){
    }
  }
  render(){
    const props = {
      name: 'file',
      multiple: true,
      action: window.config.apiUrl + '/rs/uploadImage?sessionId=' + localStorage.getItem('sessionId'),
      listType: 'picture',
      defaultFileList: [...this.state.fileList]
    }
    return(
      <div>
        <Dragger {...props}
        onChange={this.onChange}
        onPreview={this.preview.bind(this)}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或者拖动文件到这个区域实现上传</p>
          <p className="ant-upload-hint">支持单个或批量上传。严禁上传公司数据或其他波段文件</p>
        </Dragger>
      </div>
      
    )
  }
}

  