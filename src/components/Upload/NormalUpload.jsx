import { Upload, Button, Icon, notification } from 'antd';
import React from 'react';

export default class NormalUpload extends React.Component {
  defaultProps = {
    cancleModal: () => { },
    updateData: () => { },
  }
  handleChange = (info) => {
    let { fileList } = info
    let result = fileList[0].response
    this.props.handleLoading(true)

    // if (result && result.message) {
    //   this.props.handleLoading(false)
    //   notification.error({ message: result.message, duration: 3 });
    //   return
    // }
    if (result && result.status !== 'success') {
      this.props.updateData()
      this.props.handleLoading(false)
      notification.error({ message: result.message, duration: 3 });
    } else if (result && result.status == 'success') {
      this.props.handleLoading(false)
      notification.success({ message: result.message, duration: 3 });
      this.props.cancleModal() //关闭modal框
      this.props.updateData()  //更新数据
    }
  };
  render() {
    // let { importModelCode } = JSON.parse(this.props.importButton.JAVA_SCRIPT_CONTENT)
    let { objectType, importModelCode } = JSON.parse(
      this.props.importButton.JAVA_SCRIPT_CONTENT
    ).batchImport;
    const { apiUrl: _apiUrl } = window.config;
    const origin = localStorage.getItem('origin') || '';
    const apiUrl = process.env.NODE_ENV === 'development' ? _apiUrl : origin;
    const props = {
      action: `${apiUrl}/batchImport/uploadModel?current=${encodeURIComponent(
        this.props.params.current
      )}&ImportType=${encodeURIComponent(
        this.props.params.ImportType
      )}&importModelCode=${encodeURIComponent(importModelCode)}&objectType=${encodeURIComponent(
        objectType
      )}`,
      headers: { sessionId: localStorage.getItem('sessionId') },
      listType: 'picture',
      showUploadList: false,

      // previewFile(file) {
      //   return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
      //     method: 'POST',
      //     body: file,
      //   })
      //     .then(res => res.json())
      //     .then(({ thumbnail }) => thumbnail);
      // },
    };
    return (
      <div>
        <Upload {...props} onChange={this.handleChange} disabled={this.props.disabled}>
          <Button disabled={this.props.disabled}>
            <Icon type="upload" /> 上传文件
          </Button>
        </Upload>
      </div>
    );
  }
}
