import { Upload, Button, Icon,notification } from 'antd';
import React from 'react';

export default class NormalUpload extends React.Component {
  handleChange = ({ fileList }) => {
    let result = fileList[0].response
    if(result && result !== 'success'){
      this.props.updateData()
      notification.error({ message: result.message, duration: 3 });
    } else if(result && result == 'success'){
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
    const props = {
      action: `${window.config.apiUrl}/batchImport/uploadModel?current=${encodeURIComponent(
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
