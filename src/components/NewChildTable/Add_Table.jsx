import React from 'react'
import {
    Button,
    DatePicker,
    Select,
    Input,
    Row,
    Col,
    Table,
    Tooltip,
    Spin,
    Form,
    Icon,
} from 'antd';

const SearchOptions = {}
@Form.create()
export default class Add_Table extends React.Component{
    state={
        selectedRowKeys:[],
        selectedRows:[], 
        expand: false,
    }

    componentDidMount=()=>{
        this.getData(this.props.childColumnsData)
    }

    componentDidUpdate =()=>{
        let props = _.get(this.props.detailPage,'newChildColumns.columns',[])
        const searchItems = _.filter(props, item => item.filterable == true);
        const { currentKey } = this.props.listPage
        if(searchItems.length > 0){
            searchItems.map((value, index) => {
                if (
                value.widgetType === 'Select' ||
                value.widgetType === 'Reference' ||
                value.widgetType === 'ObjectSelector'
                ){
                this.getSearchBarOptions({ key: value.unique, text: value.dataIndex });
                }
            })
        }
    }

    getSearchBarOptions = e => {
        let options = [];
        this.props.dispatch({
          type: 'detailPage/getChildSearchAutocomplate',
          payload: { value:e },
          callback: response => {
            if (response.status === 'success') {
              options = response.data.options;
              SearchOptions[response.data.field] = response.data.options;
            }
          },
        });
        return options;
    };

    getData = (value,newData=[])=> {
        this.props.dispatch({type:'detailPage/getDetailListConfig',  //获取新增的表头数据
        payload:{
            multiGroupName:value.multiGroupName, 
            multiObjectType:value.multiObjectType}})
        this.props.dispatch({type:'detailPage/getDetailList',  //获取新增的数据
        payload:{
            multiGroupName:value.multiGroupName,
            multiObjectType:value.multiObjectType,
            pageSize: 10,
            pageNum: 1,
            MasterTableID: this.props.detailPage.detailData.thisComponentUid,
            ChildTableEditData:this.props.detailPage.editChildData,
            ChildTableSaveData:newData,
            ChildObject:value.objectType}})
    }

    handleSubmit=()=>{
        this.props.handleTableSubmit(this.props.objectType,this.state.selectedRows)
        this.setState({
            selectedRowKeys:[],
            selectedRows:[], 
        })
    }

    handleCancle=()=>{
        this.props.handleCancel(this.props.objectType)
        this.setState({
            selectedRowKeys:[],
            selectedRows:[], 
        })
    }

    onSelectChange = (selectedRowKeys,selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    };

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };

    selectClick = (e, value) => {
        if (!e) {
          value.FIELD_VALUE = '';
        }
        this.props.dispatch({ type: 'detailPage/getAutocomplate', payload: { value } });
    };

    //列表页顶部搜索部分
    renderSearchForm = (props = []) => {
        const searchItems = _.filter(props, item => item.filterable == true);
        const count = this.state.expand
        ? searchItems.length
        : searchItems.length > 2
            ? 2
            : searchItems.length;
        const { getFieldDecorator } = this.props.form;
        const { currentKey, selectOption = [] } = this.props;
        return (
        <Row>
            <Form
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}
            onSubmit={this.handleSearch}
            layout="inline"
            className="login-form"
            >
            {searchItems.length > 0 &&
                searchItems.map((value, index) => {
                if (index >= count) return;
                if (
                    value.widgetType === 'Select' ||
                    value.widgetType === 'Reference' ||
                    value.widgetType === 'ObjectSelector'
                ) {
                    return (
                    <Col span={8} key={value.dataIndex} style={{ textAlign: 'right' }}>
                        <Form.Item
                        label={value.title}
                        style={{ display: index < count ? '' : 'none', display: 'flex' }}
                        key={value.dataIndex}
                        >
                        {getFieldDecorator(`${value.dataIndex}`, {})(
                            <Select
                            placeholder={`请选择${value.title}`}
                            style={{ width: '165px', textOverflow: 'ellipsis' }}
                            onFocus={this.selectClick.bind(this, {
                                text: value.dataIndex,
                                key: currentKey,
                                value: null,
                            })}
                            allowClear
                            showSearch
                            filterOption={(inputValue, option) =>
                                _.includes(option.props.children, inputValue)
                            }
                            >
                            {SearchOptions[value.dataIndex] &&
                                SearchOptions[value.dataIndex].length > 0
                                ? _.map(SearchOptions[value.dataIndex], (item, index) => {
                                    return (
                                    <Select.Option
                                        title={item.text}
                                        key={item.value + item.text}
                                        value={item.value}
                                    >
                                        {item.text}
                                    </Select.Option>
                                    );
                                })
                                : null}
                            </Select>
                        )}
                        </Form.Item>
                    </Col>
                    );
                } else if (value.widgetType === 'DateTime') {
                    return (
                    <Col span={13} key={value.dataIndex}>
                        <Form.Item
                        label={value.title}
                        key={value.dataIndex}
                        // {...formItemLayout}
                        style={{ marginRight: 0, display: 'flex' }}
                        >
                        {getFieldDecorator(`${value.dataIndex}`, {})(
                            <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
                        )}
                        </Form.Item>
                    </Col>
                    );
                } else if (value.widgetType === 'Text') {
                    return (
                    <Col span={8} key={value.dataIndex} style={{ textAlign: 'right' }}>
                        <Form.Item
                        label={value.title}
                        key={value.dataIndex}
                        // {...formItemLayout}
                        style={{ marginRight: 0, display: 'flex' }}
                        >
                        {getFieldDecorator(`${value.dataIndex}`, {})(
                            <Input
                            placeholder={`请输入${value.title}`}
                            style={{ width: '165px', textOverflow: 'ellipsis' }}
                            />
                        )}
                        </Form.Item>
                    </Col>
                    );
                } else if (value.widgetType === 'Number') {
                    return (
                    <Col span={8} key={value.dataIndex} style={{ textAlign: 'right' }}>
                        <Form.Item
                        label={value.title}
                        key={value.dataIndex}
                        // {...formItemLayout}
                        style={{ marginRight: 0, display: 'flex' }}
                        >
                        {getFieldDecorator(`${value.dataIndex}`, {})(
                            <Input
                            type="number"
                            placeholder={`请输入${value.title}`}
                            style={{ width: '165px', textOverflow: 'ellipsis' }}
                            />
                        )}
                        </Form.Item>
                    </Col>
                    );
                }
                })}
            {searchItems.length > 0 && (
                <Col span={3} style={{ textAlign: 'left' }}>
                <Form.Item style={{ marginRight: 0 }}>
                    <Button type="default" htmlType="submit">
                    <Icon type="search" />
                    </Button>
                    <span style={{ display: 'inlineblock', padding: '8px' }}>
                    <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                        <Icon type={this.state.expand ? 'up' : 'down'} />
                    </a>
                    </span>
                </Form.Item>
                </Col>
            )}
            </Form>
        </Row>
        );
    };

    render(){
        const { selectedRows, selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys, 
            selectedRows,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }),
          };
        return(
            <div>
                <div className="BasicDataBody" style={{ minHeight: '35px', display: 'flex' }}>
                    <div className="BasicDataSearch" style={{ float: 'right', width: '100%' }}>
                    {<div>{this.renderSearchForm(_.get(this.props.detailPage,'newChildColumns.columns',[]))}</div>}
                    </div>
                </div>
                <Table scroll={{ x: true }} bordered rowSelection={rowSelection}
                dataSource={_.get(this.props.detailPage,'newChildData.list',[])} 
                columns={_.get(this.props.detailPage,'newChildColumns.columns',[])} />
                <Row>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={e => this.handleSubmit(e)} style={{ margin: '0 5px' }}>
                            确定
                        </Button>
                        <Button onClick={e => this.handleCancle(e)} style={{ margin: '0 5px' }}>
                            取消
                        </Button>
                    </Col>
                </Row>
            </div>
        )
    }
}