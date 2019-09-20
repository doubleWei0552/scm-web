import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { Table, Input, InputNumber, Popconfirm, Form, Tooltip, Icon, Button, Radio } from 'antd';
import Highlighter from 'react-highlight-words';
import { Resizable } from 'react-resizable';
import styles from './index.less';


class IframeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  render() {

    return (
      <div className={styles.iframe}>
        <iframe src="https://echarts.apache.org/examples/zh/index.html#chart-type-pie" frameborder="0" width="100%" height="100%" scrolling="yes">

        </iframe>
      </div>
    );
  }
}


export default IframeCard;
// ReactDOM.render(<EditableFormTable />, mountNode);
