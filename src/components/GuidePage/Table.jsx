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

@connect(({ guidePage,loading }) => ({
    guidePage,
    loadingG:
        loading.effects['guidePage/getButtonGuideConfig'] ||
        loading.effects['guidePage/getButtonGuideData']
  }))
@Form.create()

export default class TableModulars extends React.Component{
    state={
        expand: false,
        selectedRowKeys: [], //选择的那个表格行数据id
        selectedRow:[], //选择的那个表格行数据
        page:1, //表格所在的第几页
        pageSize: 10, //表格每页展示多少行
        FieldsValue:{}, //记录搜索条件
        autoCheck:false, //是否增加修改数据默认选择
        data:_.get(this.props.guidePage.guidePageData,'list',[]), //表格数据
    }
    UNSAFE_componentWillMount=()=>{
        let sendGuideData = _.get(this.props.guidePage,'sendGuideData')
        let isHaveData = sendGuideData[this.props.tableButton.BUTTON_GUIDE[this.props.current].RELATED_FIELD_GROUP]
        if(isHaveData){
            let selectedRowKeys = []
            isHaveData.map(item=>{
                selectedRowKeys.push(item.ID)
            })
            this.setState({
                selectedRowKeys, 
                selectedRow:isHaveData, 
            })
        }
        setTimeout(()=>{
            let { sendGuideData } = this.props.guidePage
            let params = this.props.tableButton.BUTTON_GUIDE[this.props.current]
            this.props.dispatch({
                type: 'guidePage/getGuideBean', payload: {
                  params,
                  pageNum: 1,
                  pageSize: 10,
                  METHOD_BODY: params.METHOD_BODY,
                  AllData:sendGuideData,
                  id:this.props.tableTemplate.isEdit ? this.props.tableTemplate.detailData.thisComponentUid : null
                }, callback: res => {
                  if (res.status == 'success') {
                    this.props.dispatch({ type: 'guidePage/getButtonGuideConfig', payload: { 
                        params,
                        id:this.props.tableTemplate.isEdit ? this.props.tableTemplate.detailData.thisComponentUid : null },
                    callback:Response=>{
                        this.setState({
                            autoCheck:Response.data.autoCheck
                        })
                    } });
                    this.props.dispatch({
                      type: 'guidePage/getButtonGuideData',
                      payload: {
                        params,
                        pageNum: 1,
                        pageSize: 10,
                        METHOD_BODY: params.METHOD_BODY,
                        formData: this.props.guidePage.sendGuideData,
                        id:this.props.tableTemplate.isEdit ? this.props.tableTemplate.detailData.thisComponentUid : null
                      },
                      callback:res=>{
                        this.props.closeSpin()
                      }
                    });
                  }
                }
            });
        },1000)
    }

    componentDidMount =()=>{
        this.props.onRef(this)
        this.props.closeSpin()
    }

    componentWillReceiveProps=(nextProps)=>{
        if(_.get(nextProps.guidePage.guidePageData,'list',[])  != this.state.data){
            this.setState({
                data:_.get(nextProps.guidePage.guidePageData,'list',[])
            })
        }
    }

    onShowSizeChange = (current, pageSize) => {
        let params = this.props.tableButton.BUTTON_GUIDE[this.props.current]
        this.props.dispatch({
          type: 'guidePage/getButtonGuideData',
          payload: {  pageNum:current, pageSize,params,id:this.props.tableTemplate.isEdit ? this.props.tableTemplate.detailData.thisComponentUid : null },
        });
        this.setState({
            page:current,
            pageSize
        })
      };

    onPageChange = (page, pageSize) => {
        let current = page;
        let params = this.props.tableButton.BUTTON_GUIDE[this.props.current]
        this.props.dispatch({
          type: 'guidePage/getButtonGuideData',
          payload: { pageNum:current, pageSize,params,id:this.props.tableTemplate.isEdit ? this.props.tableTemplate.detailData.thisComponentUid : null },
        });
        this.setState({
            page,
            pageSize
        })
      };
    onSelectChange = (selectedRowKeys,selectedRow) => {
        this.setState({ selectedRowKeys,selectedRow })
    }
    disabledStartDate = (e, value) => {
        const endValue = this.state[`${value.FIELD_NAME}-end`];
        if (!e || !endValue) {
          return false;
        }
        return e.valueOf() > endValue.valueOf();
      };
    
      disabledEndDate = (e, value) => {
        const startValue = this.state[`${value.FIELD_NAME}-start`];
        if (!e || !startValue) {
          return false;
        }
        return e.valueOf() <= startValue.valueOf();
      };
    
      onDateChange = (field, value) => {
        this.setState({
          [field]: value,
        });
      };
    
      onStartChange = (e, value) => {
        this.onDateChange(`${value.FIELD_NAME}-start`, e);
      };
    
      onEndChange = (e, value) => {
        this.onDateChange(`${value.FIELD_NAME}-end`, e);
      };
    //table数据改变
    onTableChange=(e,FIELD_NAME,tableIndex,index,rowData)=>{
        let {rtLinks} = this.props.guidePage.guidePageColumns
        if(rtLinks.includes(FIELD_NAME)){
            rowData[FIELD_NAME] = e
            let guidePageData = _.get(this.props.guidePage,'guidePageData')
            let guidePageColumns = _.get(this.props.guidePage,'guidePageColumns')
            let list= [
                {
                  updatedField:FIELD_NAME,
                  objectType:guidePageData.objectType,
                  policyFormFields: rowData,
                  fieldGroupName: guidePageColumns.relatedFieldGroup,
                },
            ]
            this.props.dispatch({
                type:'guidePage/guideRtlink',
                payload:{
                    list
                },
                callback:res => {
                    let {data} = this.state
                    res.map(item => {
                        item.fieldChanges.map(ii => {
                            ii.changes.map(jj => {
                                if(jj.field == "FIELD_VALUE"){
                                    data[tableIndex][ii.field] = jj.value
                                }
                            })
                        })
                    })
                    this.setState({
                        data
                    })
                }
            })
        }
        let {selectedRowKeys,selectedRow,autoCheck} = this.state
        if(autoCheck){
            let idx = _.findIndex(selectedRowKeys,item => item == rowData.ID)
            if(idx < 0 || selectedRowKeys.length == 0){
                selectedRowKeys.push(rowData.ID)
                selectedRow.push(rowData)
                this.onSelectChange(selectedRowKeys,selectedRow)
            }
        }
        let tableData = this.props.guidePage.guidePageData
        tableData.list[tableIndex][FIELD_NAME] = e
        this.props.dispatch({type:'guidePage/save',payload:{guidePageData:tableData}})
    }
    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };

    handleSearch = e => {
        const event = e || window.event  //阻止事件冒泡
        event.stopPropagation()
        event.preventDefault()
        let newKey 
        let type
        let formData = _.cloneDeep(this.props.form.getFieldsValue())
        for(let i in formData){
            if(typeof(formData[i]) == 'object' && formData[i]){
                if(i.includes('-start') || i.includes('-end')){
                    newKey = i.split('-')[0]
                    formData[newKey] ={}
                }
            } 
        }
        for(let i in formData){
            if(typeof(formData[i]) == 'object' && formData[i] != null){
                formData[i] = formData[i].valueOf()
                if(i.includes('-start') || i.includes('-end')){
                    newKey = i.split('-')[0]
                    type = i.split('-')[1]
                    formData[newKey][type] = formData[i].valueOf()
                    delete formData[i]
                }
            } 
        }
        let params = this.props.tableButton.BUTTON_GUIDE[this.props.current]
        let {page,pageSize} = this.state
        this.props.dispatch({
            type: 'guidePage/getButtonGuideData',
            payload: { 
                pageNum:this.state.page, 
                pageSize:this.state.pageSize,
                searchData:formData,
                params,
                id:this.props.tableTemplate.isEdit ? this.props.tableTemplate.detailData.thisComponentUid : null 
            },
        });
    };

    componentWillUnmount=()=>{
        let {isEdit,selectDate} = this.props.tableTemplate
        let relatedFieldGroup = this.props.guidePage.guidePageColumns.relatedFieldGroup
        this.state.selectedRow.map(item=>{
            item.tablePageId = isEdit ? selectDate.ID : null
            for(let i in item){ //对时间格式进行转换
                if(typeof(item[i]) == 'string'){
                    if(isNaN(item[i])&&!isNaN(Date.parse(item[i]))){
                        item[i] = moment(item[i]).valueOf()
                    } 
                }
            }
        })
        this.props.dispatch({
            type:'guidePage/getSaveData',
            payload:{relatedFieldGroup:relatedFieldGroup,data:this.state.selectedRow}
        })
    }
    //搜索功能
    renderSearchForm = (props = []) => {
        let { expand} = this.state
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
                                    {getFieldDecorator(`${value.FIELD_NAME}`, {})(
                                        <Select
                                            allowClear
                                            showSearch
                                            filterOption={(inputValue, option) =>
                                                _.includes(option.props.children, inputValue)
                                            }
                                            placeholder={`请选择${value.LABEL}`}
                                            // disabled={value.READ_ONLY_CONDITION}
                                            style={{ width: '165px', textOverflow: 'ellipsis',width:'195px' }}
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
                                      )}
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
                                style={{ marginRight: 0 }}
                            >
                                {getFieldDecorator(`${value.FIELD_NAME}`, {})(
                                    <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm"
                                    style={{width:'195px'}}
                                    />
                                )}
                            </Form.Item>
                            </Col>
                        );
                        } else 
                        if (value.WIDGET_TYPE === 'Date2') {
                        return (
                            <Col span={this.state.expand ? 24 : 10} style={{ textAlign: 'right' }} key={value.SEQUENCE + index}>
                            <Form.Item
                                label={value.LABEL}
                                key={value.SEQUENCE + index}
                                style={{ marginRight: 0 }}
                            >
                                {getFieldDecorator(`${value.FIELD_NAME}`, {})(
                                    <DatePicker placeholder={`请选择${value.LABEL}`} 
                                    style={{width:'195px'}} 
                                    format="YYYY-MM-DD" showTime={{ format: 'YYYY/MM/DD' }} 
                                    />
                                )}
                            </Form.Item>
                            </Col>
                        )} else if (value.WIDGET_TYPE === 'Date') {
                            let Date = [
                                {
                                  ...value,
                                  title: `起始${value.LABEL}`,
                                  DateType: 'start',
                                },
                                {
                                  ...value,
                                  title: `结束${value.LABEL}`,
                                  FIELD_VALUE: null,
                                  DateType: 'end',
                                },
                              ];
                              return Date.map((kk, gg) => {
                                let type = kk.DateType;
                                switch (type) {
                                  case 'start':
                                    return (
                                      <Col span={this.state.expand ? 24 : 10} style={{ textAlign: 'right' }} key={value.SEQUENCE + gg}>
                                        <Form.Item
                                        style={{ marginRight: 0 }}
                                          label={kk.title}
                                        //   style={{ display: expand ? 'flex' : index + 1 < count ? '' : 'none' }}
                                        >
                                          {getFieldDecorator(`${value.FIELD_NAME}-${kk.DateType}`, {
                                            initialValue: null,
                                          })(
                                            <DatePicker
                                              allowClear={true}
                                              placeholder={`请选择${kk.LABEL}`}
                                              format="YYYY-MM-DD"
                                              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                              style={{ width: '195px' }}
                                              onChange={e => {
                                                this.onStartChange(e, kk);
                                              }}
                                              disabledDate={e => this.disabledStartDate(e, kk)}
                                            />
                                          )}
                                        </Form.Item>
                                      </Col>
                                    );
                                    break;
                                  case 'end':
                                    return (
                                      <Col span={this.state.expand ? 24 : 10} style={{ textAlign: 'right' }} key={value.SEQUENCE + gg}>
                                        <Form.Item
                                        style={{ marginRight: 0 }}
                                          label={kk.title}
                                        >
                                          {getFieldDecorator(`${value.FIELD_NAME}-${kk.DateType}`, {
                                            initialValue: null,
                                          })(
                                            <DatePicker
                                              placeholder={`请选择${kk.LABEL}`}
                                              format="YYYY-MM-DD"
                                              showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                                              style={{ width: '195px' }}
                                              allowClear={true}
                                              onChange={e => {
                                                this.onEndChange(e, kk);
                                              }}
                                              disabledDate={e => this.disabledEndDate(e, kk)}
                                            />
                                          )}
                                        </Form.Item>
                                      </Col>
                                    );
                                    break;
                                  default:
                                    break;
                                }
                              })
                        } else 
                        if (value.WIDGET_TYPE === 'Date') {
                        return (
                            <Col span={this.state.expand ? 24 : 10} style={{ textAlign: 'right' }} key={value.SEQUENCE + index}>
                            <Form.Item
                                label={value.LABEL}
                                key={value.SEQUENCE + index}
                                style={{ marginRight: 0 }}
                            >
                                {getFieldDecorator(`${value.FIELD_NAME}`, {})(
                                    <DatePicker placeholder={`请选择${value.LABEL}`} 
                                    style={{width:'195px'}} 
                                    format="YYYY-MM-DD" showTime={{ format: 'YYYY/MM/DD' }} 
                                    />
                                )}
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
                                style={{ marginRight: 0}}
                            >
                                {getFieldDecorator(`${value.FIELD_NAME}`, {
                                initialValue: '',
                                })(
                                    <Input
                                        placeholder={`请输入${value.LABEL}`}
                                        style={{ width: '165px', textOverflow: 'ellipsis',width:'195px' }}
                                    />
                                 )}
                            </Form.Item>
                            </Col>
                        );
                        } else if (value.WIDGET_TYPE === 'Number') {
                        return (
                            <Col span={this.state.expand ? 24 : 10} style={{ textAlign: 'right' }} key={value.SEQUENCE + index} style={{ textAlign: 'left' }}>
                            <Form.Item
                                label={value.LABEL}
                                key={value.SEQUENCE + index}
                                style={{ marginRight: 0 }}
                            >
                                {getFieldDecorator(`${value.FIELD_NAME}`, {})(
                                    <Input
                                        type="number"
                                        placeholder={`请输入${value.LABEL}`}
                                        style={{ width: '165px', textOverflow: 'ellipsis',width:'195px' }}
                                    />
                                )}
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
        const { TextArea } = Input;
        let columns = [] 
        const { selectedRowKeys,selectedRow,data } = this.state;
        const rowSelection = {
            selectedRowKeys,
            selectedRow,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User',
              name: record.name,
            }),
          };
        const { getFieldDecorator } = this.props.form;
        // let data =  _.get(this.props.guidePage.guidePageData,'list',[]) 
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
                                    ? (text ? moment(text).format('YYYY/MM/DD') : text)
                                    : (text ? moment(text).format('YYYY/MM/DD  HH:mm:ss') : text)}</div>
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
                //不是只读的数据部分
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
                                index,
                                record)}
                            disabled={item.READ_ONLY_CONDITION}
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
                                disabled={item.READ_ONLY_CONDITION}
                                onChange={(e)=>this.onTableChange(
                                e.target.value,
                                item.FIELD_NAME,
                                tableIndex,
                                index,
                                record)} defaultValue={text} />
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
                            return <Select style={{ minWidth: '150px' }} disabled={item.READ_ONLY_CONDITION} defaultValue={text} 
                            allowClear
                            showSearch
                            filterOption={(inputValue, option) =>
                                _.includes(option.props.children, inputValue)
                            }
                            onChange={(e)=>this.onTableChange(
                                e,
                                item.FIELD_NAME,
                                tableIndex,
                                index,
                                record)}>
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
                            disabled={item.READ_ONLY_CONDITION}
                            style={{ minWidth: '150px' }}
                            format={item.WIDGET_TYPE == 'Date' ? 'YYYY/MM/DD' : 'YYYY-MM-DD HH:mm:ss'}
                            onChange={(e)=>this.onTableChange(
                                e.valueOf(),
                                item.FIELD_NAME,
                                tableIndex,
                                index,
                                record)}
                            defaultValue={text ? moment(text) : null} />
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
                            return <TextArea style={{ minWidth: '150px' }}
                            disabled={item.READ_ONLY_CONDITION}
                            onChange={(e)=>this.onTableChange(
                                e.target.value,
                                item.FIELD_NAME,
                                tableIndex,
                                index,
                                record)}
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
        return(
            <div>
                {<div style={{marginBottom:'5px'}}>{this.renderSearchForm(_.get(this.props.guidePage.guidePageColumns,'policyFormFields',[]))}</div>}
                <ConfigProvider locale={zhCN}>
                    <Table style={{ whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',}}
                    scroll={{ x: true }}
                    rowSelection={rowSelection}
                    bordered
                    dataSource={data} 
                    columns={columns} 
                    pagination={{
                        showSizeChanger: true,
                        total: _.get(this.props.guidePage,'guidePageData.totalRecord'),
                        current: _.get(this.props.guidePage,'guidePageData.currentPage'),
                        pageSize: _.get(this.props.guidePage,'guidePageData.pageSize'),
                        pageSizeOptions: ['10', '20', '30', '50', '100'],
                        onShowSizeChange: (current, pageSize)=>this.onShowSizeChange(current, pageSize),
                        onChange: (page, pageSize)=>this.onPageChange(page, pageSize),
                        showTotal: total => `共${this.props.guidePage.guidePageData.totalRecord}条数据`,
                    }}
                    />
                </ConfigProvider>
            </div>
        )
    }
}