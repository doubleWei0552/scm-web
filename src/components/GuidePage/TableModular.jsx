import React from 'react'
import {
    Breadcrumb,
    Button,
    DatePicker,
    Select,
    Input,
    Row,
    Col,
    Table,
    Modal,
    Tooltip,
    Form,
    Icon,
    InputNumber,
    Card,
    Popconfirm,
    message,
    Spin,
    Tabs,
    ConfigProvider
  } from 'antd';
  import {connect} from 'dva'
  import CurrencySearchBar from '@/components/SearchBar/CurrencySearchBar'
  import zhCN from 'antd/es/locale/zh_CN';
  import moment from 'moment';
  const { TextArea } = Input;

  @connect(({ guidePage,loading }) => ({
    guidePage,
    loadingG:
        loading.effects['guidePage/getButtonGuideConfig'] ||
        loading.effects['guidePage/getButtonGuideData']
  }))

export default class TableModular extends React.Component{
    state={
        expand: false,
        selectedRowKeys: [], //选择的那个表格行数据id
        selectedRow:[], //选择的那个表格行数据
        page:1, //表格所在的第几页
        pageSize: 10, //表格每页展示多少行
        FieldsValue:{}, //记录搜索条件
    }
    onShowSizeChange = (current, pageSize) => {
        let params = this.props.CurrentData
        this.props.dispatch({
          type: 'guidePage/getButtonGuideData',
          payload: {  pageNum:current, pageSize,params },
        });
        this.setState({
            page:current,
            pageSize
        })
      };

    onPageChange = (page, pageSize) => {
        let current = page;
        let params = this.props.CurrentData
        this.props.dispatch({
          type: 'guidePage/getButtonGuideData',
          payload: { pageNum:current, pageSize,params },
        });
        this.setState({
            page,
            pageSize
        })
      };
    onSelectChange = (selectedRowKeys,selectedRow) => {
        this.setState({ selectedRowKeys,selectedRow });
        this.props.dispatch({type:'guidePage/save',payload:{cacheSelectData:selectedRow}})
    }
    //table数据改变
    onTableChange=(e,FIELD_NAME,tableIndex,index)=>{
        console.log('数据',e,FIELD_NAME,tableIndex,index)
        let tableData
        if(this.props.guidePage.cacheTableData.length){
            tableData = this.props.guidePage.cacheTableData
        } else {
            tableData = this.props.guidePage.guidePageData
        }
        tableData.list[tableIndex][FIELD_NAME] = e
        this.props.dispatch({type:'guidePage/save',payload:{cacheTableData:tableData}})
    }
    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
      };
    onSearchData = (e,FIELD_NAME) => {
        let FieldsValue = this.state.FieldsValue
        FieldsValue[FIELD_NAME] = e
        this.setState({
            FieldsValue
        })
    }
    handleSearch = e => {
        let params = this.props.CurrentData
        let {page,pageSize} = this.state
        this.props.dispatch({
            type: 'guidePage/getButtonGuideData',
            payload: { pageNum:this.state.page, pageSize:this.state.pageSize,searchData:this.state.FieldsValue,params },
        });
      };
    //搜索功能
    renderSearchForm = (props = []) => {
    const searchItems = _.filter(props, item => item.FILTERABLE == true);
    const count = this.state.expand
        ? searchItems.length
        : searchItems.length > 2
            ? 2
            : searchItems.length;
    const { getFieldDecorator } = this.props.form;
    return (
        <ConfigProvider locale={zhCN}>
            <Row>
            <Form
                // style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
                onSubmit={this.handleSearch}
                layout="inline"
                className="login-form"
            >
                {searchItems.length > 0 &&
                searchItems.map((value, index) => {
                    if (index >= count) return;
                    if (
                        value.WIDGET_TYPE === 'Select' ||
                        value.WIDGET_TYPE === 'Reference' ||
                        value.WIDGET_TYPE === 'ObjectSelector'
                    ) {
                    return (
                        <Col span={this.state.expand ? 24 : 10} key={value.SEQUENCE + index} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label={value.LABEL}
                            style={{ display: index < count ? '' : 'none',marginRight:'0' }}
                            key={value.SEQUENCE + index}
                        >
                            {/* {getFieldDecorator(`${value.FIELD_NAME}`, {
                            initialValue: '',
                            })( */}
                                <div key={value.FIELD_NAME}>
                                    <Select
                                        placeholder={`请选择${value.LABEL}`}
                                        style={{ width: '165px', textOverflow: 'ellipsis',width:'195px' }}
                                        onChange={(e)=>this.onSearchData(e,value.FIELD_NAME)}
                                    >
                                        {value.options.length && value.options.length > 0
                                        ? _.map(value.options, (item, index) => {
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
                                </div>
                            {/* )} */}
                        </Form.Item>
                        </Col>
                    );
                    } else 
                    if (value.WIDGET_TYPE === 'DateTime') {
                    return (
                        <Col span={this.state.expand ? 24 : 10} style={{ textAlign: 'right' }} key={value.SEQUENCE + index}>
                        <Form.Item
                            label={value.LABEL}
                            key={value.SEQUENCE + index}
                            // {...formItemLayout}
                            style={{ marginRight: 0 }}
                        >
                            {/* {getFieldDecorator(`${value.FIELD_NAME}`, {
                            initialValue: '',
                            })( */}
                                <div>
                                    <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm"
                                    style={{width:'195px'}}
                                    onChange={(e)=>this.onSearchData(moment(e).valueOf(),value.FIELD_NAME)} />
                                </div>
                            {/* )} */}
                        </Form.Item>
                        </Col>
                    );
                    } else 
                    if (value.WIDGET_TYPE === 'Date') {
                    return (
                        <Col span={this.state.expand ? 24 : 10} style={{ textAlign: 'right' }} key={value.SEQUENCE + index}>
                        <Form.Item
                            label={value.LABEL}
                            key={value.SEQUENCE + index}
                            // {...formItemLayout}
                            style={{ marginRight: 0 }}
                        >
                            {/* {getFieldDecorator(`${value.FIELD_NAME}`, {
                            initialValue: '',
                            })( */}
                                <div>
                                    <DatePicker placeholder={`请选择${value.LABEL}`} 
                                    style={{width:'195px'}}
                                    format="YYYY-MM-DD" showTime={{ format: 'YYYY/MM/DD' }} 
                                    onChange={(e)=>this.onSearchData(moment(e).valueOf(),value.FIELD_NAME)}/>
                                </div>
                            {/* )} */}
                        </Form.Item>
                        </Col>
                    );
                    } else 
                    if (value.WIDGET_TYPE === 'Text') {
                    return (
                        <Col span={this.state.expand ? 24 : 10} style={{ textAlign: 'right' }} key={value.SEQUENCE + index} >
                        <Form.Item
                            label={value.LABEL}
                            key={value.SEQUENCE + index}
                            // {...formItemLayout}
                            style={{ marginRight: 0}}
                        >
                            {/* {getFieldDecorator(`${value.FIELD_NAME}`, {
                            initialValue: '',
                            })( */}
                                <div>
                                    <Input
                                        placeholder={`请输入${value.LABEL}`}
                                        style={{ width: '165px', textOverflow: 'ellipsis',width:'195px' }}
                                        onChange={(e)=>this.onSearchData(e.target.value,value.FIELD_NAME)}
                                    />
                                </div>
                            {/* )} */}
                        </Form.Item>
                        </Col>
                    );
                    } else if (value.WIDGET_TYPE === 'Number') {
                    return (
                        <Col span={this.state.expand ? 24 : 10} style={{ textAlign: 'right' }} key={value.SEQUENCE + index} style={{ textAlign: 'left' }}>
                        <Form.Item
                            label={value.LABEL}
                            key={value.SEQUENCE + index}
                            // {...formItemLayout}
                            style={{ marginRight: 0 }}
                        >
                            {/* {getFieldDecorator(`${value.FIELD_NAME}`, {
                            initialValue: '',
                            })( */}
                                <div>
                                    <Input
                                        type="number"
                                        placeholder={`请输入${value.LABEL}`}
                                        style={{ width: '165px', textOverflow: 'ellipsis',width:'195px' }}
                                        onChange={(e)=>this.onSearchData(e.target.value,value.FIELD_NAME)}
                                    />
                                </div>
                            {/* )} */}
                        </Form.Item>
                        </Col>
                    );
                    }
                })}
                {searchItems.length > 0 && (
                <Col span={this.state.expand ? 24 : 3} style={{ textAlign: 'right' }}>
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
        </ConfigProvider>
    );
    };
    render(){
        let columns = [] 
        const { getFieldDecorator } = this.props.form;
        // let data = this.props.guidePage.cacheTableData.length ? this.props.guidePage.cacheTableData.list :
        let data =  _.get(this.props.guidePage.guidePageData,'list',[]) 
        let guidePageColumns = _.get(this.props.guidePage.guidePageColumns,'policyFormFields',[]).map((item,index)=>{
            if(item.READ_ONLY_CONDITION){
                let obj 
                obj = {
                    title:<Tooltip title={item.LABEL + '[' + item.FIELD_NAME + ']'}>
                            <span>{item.LABEL}</span>
                        </Tooltip>,
                    dataIndex:item.FIELD_NAME,
                    key:item.FIELD_NAME + item.SEQUENCE
                }
                if(item.WIDGET_TYPE == 'Date' || item.WIDGET_TYPE == 'DateTime'){
                    obj = {
                        title:<Tooltip title={item.LABEL + '[' + item.FIELD_NAME + ']'}>
                        <span>{item.LABEL}</span>
                    </Tooltip>,
                        dataIndex:item.FIELD_NAME,
                        key:item.FIELD_NAME + item.SEQUENCE,
                        render:(text)=>{
                            return (
                                <div>{item.WIDGET_TYPE == 'Date'
                                    ? moment(text * 1).format('YYYY/MM/DD')
                                    : moment(text * 1).format('YYYY/MM/DD  HH:mm:ss')}</div>
                            )
                        }
                    }
                } else if(item.WIDGET_TYPE == 'Select' || item.WIDGET_TYPE == 'Reference' || item.WIDGET_TYPE =='ObjectType'){
                    obj = {
                        title:<Tooltip title={item.LABEL + '[' + item.FIELD_NAME + ']'}>
                        <span>{item.LABEL}</span>
                    </Tooltip>,
                        dataIndex:item.FIELD_NAME,
                        key:item.FIELD_NAME + item.SEQUENCE,
                        render:(text)=>{
                            return (
                                <span>{item.options.map((gg,mm)=>{
                                    if(gg.value == text){
                                        return gg.text
                                    }
                                })
                              }</span>
                            )
                        }
                    }
                }
                columns.push(obj)
            } else {
                switch (item.WIDGET_TYPE){
                    case 'Number':
                    let NumberObj = {
                        title:<Tooltip title={item.LABEL + '[' + item.FIELD_NAME + ']'}>
                        <span>{item.LABEL}</span>
                    </Tooltip>,
                        dataIndex:item.FIELD_NAME,
                        key:item.FIELD_NAME + item.SEQUENCE,
                        render:(text, record, tableIndex)=>{
                            return <Input
                            type="number"
                            max={text}
                            style={{ minWidth: '150px',textAlign:'right' }}
                            onChange={(e)=>this.onTableChange(
                                e.target.value,
                                item.FIELD_NAME,
                                tableIndex,
                                index)}
                            defaultValue={text} />
                        }
                    }
                    columns.push(NumberObj)
                        break
                    case 'Text':
                    let TextObj = {
                        title:<Tooltip title={item.LABEL + '[' + item.FIELD_NAME + ']'}>
                        <span>{item.LABEL}</span>
                    </Tooltip>,
                        dataIndex:item.FIELD_NAME,
                        key:item.FIELD_NAME + item.SEQUENCE,
                        render:(text, record, tableIndex)=>{
                            return <Input style={{ minWidth: '150px' }}
                                onChange={(e)=>this.onTableChange(
                                e.target.value,
                                item.FIELD_NAME,
                                tableIndex,
                                index)} defaultValue={text} />
                        }
                    }
                    columns.push(TextObj)
                        break
                    case 'Select':
                    case 'Reference':
                    case 'ObjectType':
                    let SelectObj = {
                        title:<Tooltip title={item.LABEL + '[' + item.FIELD_NAME + ']'}>
                        <span>{item.LABEL}</span>
                    </Tooltip>,
                        dataIndex:item.FIELD_NAME,
                        key:item.FIELD_NAME + item.SEQUENCE,
                        render:(text, record, tableIndex)=>{
                            return <Select style={{ minWidth: '150px' }} defaultValue={text} onChange={(e)=>this.onTableChange(
                                e,
                                item.FIELD_NAME,
                                tableIndex,
                                index)}>
                                {_.map(item.options, (v, i) => {
                                      return (
                                        <Select.Option value={v.value} key={v.value}>
                                          {v.text}
                                        </Select.Option>
                                      );
                                })}
                            </Select>
                        }
                    }
                    columns.push(SelectObj)
                        break
                    case "Date":
                    case 'DateTime':
                    let DateObj = {
                        title:<Tooltip title={item.LABEL + '[' + item.FIELD_NAME + ']'}>
                        <span>{item.LABEL}</span>
                    </Tooltip>,
                        dataIndex:item.FIELD_NAME,
                        key:item.FIELD_NAME + item.SEQUENCE,
                        render:(text, record, tableIndex)=>{
                            return <DatePicker
                            style={{ minWidth: '150px' }}
                            format={item.WIDGET_TYPE == 'Date' ? 'YYYY/MM/DD' : 'YYYY-MM-DD HH:mm:ss'}
                            onChange={(e)=>this.onTableChange(
                                e,
                                item.FIELD_NAME,
                                tableIndex,
                                index)}
                            defaultValue={text ? moment(text * 1) : null} />
                        }
                    }
                    columns.push(DateObj)
                        break
                    case 'Textarea':
                    let TextareaObj = {
                        title:<Tooltip title={item.LABEL + '[' + item.FIELD_NAME + ']'}>
                        <span>{item.LABEL}</span>
                    </Tooltip>,
                        dataIndex:item.FIELD_NAME,
                        key:item.FIELD_NAME + item.SEQUENCE,
                        render:(text, record, tableIndex)=>{
                            return <Textarea style={{ minWidth: '150px' }}
                            onChange={(e)=>this.onTableChange(
                                e.target.value,
                                item.FIELD_NAME,
                                tableIndex,
                                index)}
                            defaultValue={text} />
                        }
                    }
                    columns.push(TextareaObj)
                        break
                    case 'MultiObjectSelector':
                        break
                }
            }
            
        })
        const { selectedRowKeys,selectedRow } = this.state;
        const rowSelection = {
            selectedRowKeys,
            selectedRow,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User',
              name: record.name,
            }),
          };
        return(
            <div>
                <Spin spinning={this.props.loadingG || false}>
                {/* <CurrencySearchBar data={_.get(this.props.guidePage.guidePageColumns,'policyFormFields',[])} {...this.props}/> */}
                {<div style={{marginBottom:'5px'}}>{this.renderSearchForm(_.get(this.props.guidePage.guidePageColumns,'policyFormFields',[]))}</div>}
                <ConfigProvider locale={zhCN}>
                    <Table style={{ whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',}}
                    scroll={{ x: true }}
                    rowSelection={rowSelection}
                    bordered
                    dataSource={data} columns={columns} 
                    pagination={{
                        showSizeChanger: true,
                        total: _.get(this.props.guidePage,'guidePageData.totalRecord'),
                        current: _.get(this.props.guidePage,'guidePageData.currentPage'),
                        pageSize: _.get(this.props.guidePage,'guidePageData.pageSize'),
                        pageSizeOptions: ['10', '20', '30', '50', '100'],
                        onShowSizeChange: this.onShowSizeChange,
                        onChange: this.onPageChange,
                        showTotal: total => `共${this.props.guidePage.guidePageData.totalRecord}条数据`,
                    }}
                    />
                </ConfigProvider>
                </Spin>
            </div>
        )
    }
}