import { Upload, Button, Icon } from 'antd';
import ReactDOM from 'react-dom'
import { notification,Modal } from 'antd'
import { onGetImageUrl } from "@/utils/FunctionSet";
import fileImg from '@/assets/file.png'
import styles from './Attachments.less'

export default class Attachments extends React.Component{
  state={
    previewImage:'',
    previewVisible:false,
  }

  handleChange = ({ fileList }) => {
    console.log('fileList',fileList)
    this.props.handleAttachmentsChange(fileList)
    this.props.dispatch({type:'tableTemplate/save',payload:{fileList,fileKey:this.props.field.FIELD_NAME}})
  }

  // 图片渲染的方法
  renderImg=(item)=>{
    let url = onGetImageUrl(item) || ''
    // let url = item.url ? item.url : item.response ? item.response.data.url : ''
    var pos=url.lastIndexOf(".");
    let Suffix = url.substring(pos+1); //获取文件后缀
    if(Suffix!="bmp"&&Suffix!="jpg"&&Suffix!="jpeg"&&Suffix!="png"&&Suffix!="gif"){
      return fileImg
    } else {
      return url
    }
  }

  // 图片预览
  previewImage=(item)=>{
    let url = item.url ? item.url : item.response ? item.response.data.url : ''
    var pos=url.lastIndexOf(".");
    let Suffix = url.substring(pos+1); //获取文件后缀
    if(Suffix!="bmp"&&Suffix!="jpg"&&Suffix!="jpeg"&&Suffix!="png"&&Suffix!="gif"){
      notification.error({ message: '抱歉，仅图片格式的文件支持预览！', duration: 3 })
    } else {
      this.setState({
        previewImage:url,
        previewVisible:true
      })
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  // 点击icon删除图片
  deleteImg=(index)=>{
    let data = this.props.value.splice(index,1)
    this.props.handleAttachmentsChange(this.props.value)
    this.props.dispatch({type:'tableTemplate/save',payload:{
      fileList:this.props.value,
      fileKey:this.props.field.FIELD_NAME
    }})
  }

  render(){
    const props = {
      action: `${window.config.apiUrl}/rs/uploadImage`,
      listType: 'picture',
      defaultFileList: this.props.value,
      className: this.props.disabled ? 'disUpload-list-inline' : 'upload-list-inline',
    };
    return (
      <div className={styles.AttachmentsMain}>
        <div style={{float:'left'}}>
          {this.props.value ? this.props.value.map((item,index)=>{
            return (
              <div key={index} className={this.props.disabled ? styles.disFileList : styles.fileList}>
                <div className={styles.fileIcon}>
                  <Icon onClick={()=>this.deleteImg(index)} style={{display:this.props.disabled ? 'none' : 'inline-block' }} type="close" />
                </div>                
                <img onClick={()=>this.previewImage(item)} className={styles.fileImg} src={this.renderImg(item)} alt='error'/>
                <p className={styles.fileName}>{item.name }</p>
              </div>
            )
          }) : null}
        </div>
        <Upload onChange={this.handleChange}
        listType="picture-card"
        showUploadList={false}
        {...props} style={{display:'block',float:'left'}}>
          <Button className={styles.fileButton} disabled={this.props.disabled} >
            <Icon type="upload" /> 
            <span>附件上传</span>
          </Button>
        </Upload>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="file" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    )
  }
}

