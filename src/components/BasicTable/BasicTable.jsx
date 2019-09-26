import React from 'react';
import { Breadcrumb, Button, DatePicker, Select, Input, Row, Col, Table, Modal } from 'antd';

export default class BasicData extends React.Component {
  static defaultProps = {
    title: '',
    Breadcrumb: [],
    Search: [],
    columns: [],
    data: [],
    scroll: {}, //滑动的范围eg：{ x: 1355 , y:500}
    create: e => {},
    delete: e => {},
    export: e => {},
    onJump: e => {},
  };
  state = {
    selectedRowKeys: [],
    visible: false,
  };
  showModal = text => {
    this.setState({ visible: true, warning: text });
  };

  handleOk = e => {
    this.setState({ visible: false });
    this.props.dispatch({ type: 'dataBase/getRemoveBusiness' });
  };

  handleCancel = e => {
    this.setState({ visible: false });
  };

  onChange = (date, dateString) => {
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // this.props.dispatch({type:'dataBase/save',payload:{selectDataDelete:selectedRows}})
    this.props.dispatch({ type: 'table/save', payload: { selectDataDelete: selectedRows } });
    this.setState({ selectedRowKeys });
  };
  onButtonTest = value => {
    this.props.dispatch({ type: 'table/getTransactionProcess', payload: { ButtonName: value } });
  };

  render() {
    const { RangePicker } = DatePicker;
    const { selectedRowKeys } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    const Breadcrumbchild = this.props.Breadcrumb.map((value, index) => {
      return <Breadcrumb.Item key={index}>{value.title}</Breadcrumb.Item>;
    });
    const BasicDataSearch = this.props.Search.map((value, index) => {
      if (value.type === 'Select') {
        const optionChild = value.option.map((v, i) => {
          return (
            <Select.Option value={v.title} key={i}>
              {v.title}
            </Select.Option>
          );
        });
        return (
          <Col key={index} span={4} style={{ marginRight: '15px' }}>
            <Select style={{ width: '100%' }}>{optionChild}</Select>
          </Col>
        );
      } else if (value.type === 'Input') {
        return (
          <Col key={index} span={4} style={{ marginRight: '15px' }}>
            <Input placeholder={value.placeholder} style={{ width: '100%' }} />
          </Col>
        );
      } else if (value.type === 'DatePicker') {
        return (
          <Col key={index} span={8} style={{ marginRight: '15px' }}>
            <RangePicker onChange={this.onChange} style={{ width: '100%' }} />
          </Col>
        );
      }
    });
    const ButtonChild = this.props.table.Buttons.map((value, index) => {
      return (
        <Button onClick={() => this.onButtonTest(value)} key={index}>
          {value.label}
        </Button>
      );
    });
    return (
      <div
        className="BasicDataMain"
        style={{
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 1px 10px #dee1e4',
        }}
      >
        <header style={{ height: '35px' }}>
          <span style={{ fontSize: '1.5rem', float: 'left', marginRight: '1rem' }}>
            {this.props.title}
          </span>
          <Breadcrumb style={{ float: 'left', height: '36px', lineHeight: '36px' }}>
            {Breadcrumbchild}
          </Breadcrumb>
        </header>
        <hr style={{ backgroundColor: 'lightgray', height: '1px', border: 'none' }} />
        <div className="BasicDataBody" style={{ height: '35px' }}>
          <div className="BasicDataButton" style={{ float: 'left', width: '30%' }}>
            {ButtonChild}
            <Button onClick={this.props.create} style={{ marginRight: '5px' }} type="primary">
              新增
            </Button>
            <Button
              onClick={this.props.delete}
              style={{ marginRight: '5px' }}
              disabled={!hasSelected}
            >
              删除
            </Button>
            <Button onClick={this.props.export} style={{ marginRight: '5px' }}>
              导出
            </Button>
          </div>
          <div className="BasicDataSearch" style={{ float: 'left', width: '70%' }}>
            <Row>{BasicDataSearch}</Row>
          </div>
        </div>
        <hr style={{ backgroundColor: 'lightgray', height: '1px', border: 'none' }} />
        <div>
          <Table
            rowSelection={rowSelection}
            bordered
            // scroll={this.props.scroll}
            scroll={{ x: true }}
            onRow={(e, record) => {
              return {
                onDoubleClick: () => {
                  this.props.onJump(e, record);
                },
              };
            }}
            columns={this.props.columns}
            dataSource={this.props.data}
            pagination={{ showSizeChanger: true, showTotal: total => `共${total}条数据` }}
          />
        </div>
        <div>
          <Modal
            title="提示！"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>确定要永久删除这些数据么</p>
          </Modal>
        </div>
      </div>
    );
  }
}
