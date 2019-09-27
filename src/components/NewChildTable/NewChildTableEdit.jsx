import React from 'react'
import { connect } from 'dva'
import {
    Button,
    Table,
    Tooltip,
    Icon,
    Card,
    Spin,
    Tabs,
    Divider,
    Select,
    Input,
    DatePicker,
    Popconfirm,
    Modal,
  } from 'antd';
import moment from 'moment';
import _ from 'lodash'
import Add_Form from '@/components/NewChildTable/Add_Form'
import Add_Table from '@/components/NewChildTable/Add_Table'
import styles from './style.less'

const { TabPane } = Tabs;
const { TextArea } = Input

function onChange(date, dateString) {
    console.log(date, dateString);
  }

@connect(({detailPage,loading})=>({
    detailPage,
    loading
}))

export default class NewChildTableSee extends React.Component{
    state={
        ChildData:{}, //子表的数据
    }

    static getDerivedStateFromProps(nextProps, prevState){
        let { ChildData } = nextProps.detailPage
        if (ChildData !== prevState.ChildData) {
            return {
                ChildData,
            };
        }
        return null;
    }

    callback=(key)=> { //子表的tab切换的回调事件
        console.log(key);
        this.props.dispatch({
            type:'detailPage/save',
            payload:{defaultActiveKey:key}
        })
    }

    popconfirmCancel = e => { //删除确定框的取消事件
    };

    popconfirmConfirm = (record, index, childIndex) => { //删除确定框的确定事件
        console.log('算你狠！',record, index, childIndex)
    };

    onChildTableDataChange = (value, dataIndex,index, childIndex,record) => {  //index代表哪个子表，childIndex代表子表的哪一行数据
        this.props.detailPage.ChildData[index].Data.records[childIndex][dataIndex] = value
        record[dataIndex] = value
        if(record.ID){  //编辑表中已有的数据
            let idx = _.findIndex(this.props.detailPage.editChildData,item => item.ID == record.ID)
            if(idx < 0){
                this.props.detailPage.editChildData.push(record)
            }
        }
    }

    openModal=(value)=>{ //新增时的莫态框
        this.setState({
            [value]: true,
        });
    }
    
    handleOk = (value) => {
        this.setState({
            [value]: false,
        });
    };

    handleCancel = (value) => {
        this.setState({
            [value]: false,
        });
    };    

    render(){
        let { defaultActiveKey,ChildData } = this.props.detailPage
        let ChildTabPane = ChildData.map((item,index)=>{  //多个子表的循环
            let isHavaMultiObject = false  //判断新增类型
            let dataSource = item.Data.records 
            if(item.Columns.fields[0].dataIndex !='operation2258'){
                item.Columns.fields.unshift({
                    title: '操作',
                    dataIndex: 'operation2258',
                    key: 'operation2258',
                    type:'operation2258',
                })
            }  
            let columns = item.Columns.fields.map(aa =>{
                switch(aa.type){
                    case "operation2258" :
                        let columnsOperation = {
                            ...aa,
                            width: '30px',
                            render: (text, record, childIndex) => {
                            return (
                                <Popconfirm
                                    key={index + text}
                                    title="确定要删除该条数据吗?"
                                    onConfirm={() => this.popconfirmConfirm(record, index, childIndex)}
                                    onCancel={this.popconfirmCancel}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <span
                                    style={{
                                        width: '30px',
                                        textAlign: 'center',
                                        display: 'block',
                                        color: '#3e90f7',
                                    }}
                                    >
                                    <Icon type="close" />
                                    </span>
                                </Popconfirm>
                            );
                            },
                        };
                        return columnsOperation
                    break
                    case "Text":
                        let columnsText = {
                            title: (
                            <Tooltip title={aa.value + '[' + aa.text + ']'}>
                                <span>{aa.value}</span>
                            </Tooltip>
                            ),
                            dataIndex: aa.text,
                            key: (aa.text + index),
                            ...aa,
                            render: (text, record, childIndex) => {
                            return (
                                <div key={aa.text}>
                                    {
                                        aa.readOnlyCondition //readOnlyCondition管控子表数据是否是只读状态，true为只读状态
                                        ? <span
                                        key={aa.text}
                                        style={{
                                            marginTop: '8px',
                                            marginBottom: '16px',
                                            display: 'inline-block',
                                        }}
                                        >
                                        {text}
                                        </span> : 
                                        <Input onChange={(e)=>{this.onChildTableDataChange(e.target.value,aa.text,index, childIndex,record)}}
                                        style={{minWidth:'160px'}} defaultValue={text}/>
                                    }
                                </div>
                            );
                            },
                        };
                        return columnsText
                    break
                    case "Number":
                        let columnsNumber = {
                            title: (
                            <Tooltip title={aa.value + '[' + aa.text + ']'}>
                                <span>{aa.value}</span>
                            </Tooltip>
                            ),
                            dataIndex: aa.text,
                            key: (aa.text + index),
                            ...aa,
                            render: (text, record, childIndex) => {
                            return (
                                <div key={aa.text}>
                                    {
                                        aa.readOnlyCondition ? <span
                                    key={aa.text}
                                    style={{
                                        marginTop: '8px',
                                        marginBottom: '16px',
                                        display: 'inline-block',
                                    }}
                                    >
                                    {text}
                                    </span> : <Input onChange={(e)=>{this.onChildTableDataChange(e.target.value,aa.text,index, childIndex,record)}}
                                    style={{minWidth:'160px'}} type='number' defaultValue={text} />
                                    }
                                    
                                </div>
                            );
                            },
                        };
                        return columnsNumber
                    break
                    case 'MultiObjectSelector':
                        isHavaMultiObject = true
                        let columnsMultiObjectSelector = {
                            title: (
                            <Tooltip title={aa.value + '[' + aa.text + ']'}>
                                <span>{aa.value}</span>
                            </Tooltip>
                            ),
                            dataIndex: aa.text,
                            key: (aa.text + index),
                            ...aa,
                            render: (text, record, childIndex) => {
                            return (
                                <div key={aa.text}>
                                    <span
                                    key={aa.text}
                                    style={{
                                        marginTop: '8px',
                                        marginBottom: '16px',
                                        display: 'inline-block',
                                    }}
                                    >
                                    {text}
                                    </span>
                                </div>
                            );
                            },
                        };
                        return columnsMultiObjectSelector
                    break
                    case 'Select':
                    case 'Reference':
                    case 'ObjectType':
                        let columnsSelect = {
                            title: (
                            <Tooltip title={aa.value + '[' + aa.text + ']'}>
                                <span>{aa.value}</span>
                            </Tooltip>
                            ),
                            dataIndex: aa.text,
                            key: (aa.text + index),
                            ...aa,
                            render: (text, record, childIndex) => {
                            let optionChild = aa.options.map(bb => {
                                return <Select.Option
                                  value={bb.value}
                                  key={bb.text}
                                >
                                  {bb.text}
                                </Select.Option>
                            })
                            
                            return (
                                <div key={aa.text}>
                                    <Select onChange={(e)=>{this.onChildTableDataChange(e,aa.text,index, childIndex,record)}}
                                    className={styles.selectData} disabled={aa.readOnlyCondition} defaultValue={text ? text*1 : text}>
                                        {optionChild}
                                    </Select>
                                </div>
                            );
                            },
                        };
                        return columnsSelect
                    break
                    case 'Date':
                    case 'DateTime':
                            let columnsDate = {
                                title: (
                                <Tooltip title={aa.value + '[' + aa.text + ']'}>
                                    <span>{aa.value}</span>
                                </Tooltip>
                                ),
                                dataIndex: aa.text,
                                key: (aa.text + index),
                                ...aa,
                                render: (text, record, childIndex) => {
                                return (
                                    <div key={aa.text}>
                                        {
                                            aa.readOnlyCondition ? <span
                                            key={aa.text}
                                            style={{
                                                marginTop: '8px',
                                                marginBottom: '16px',
                                                display: 'inline-block',
                                            }}
                                            >
                                            {text ? (aa.type == 'Date' ? moment(text).format('YYYY/MM/DD') : moment(text).format('YYYY/MM/DD HH:mm:ss')) : null}
                                        </span> : <DatePicker style={{minWidth:'160px'}} onChange={(e)=>{this.onChildTableDataChange(moment(e).valueOf(),aa.text,index, childIndex,record)}} defaultValue={text ? moment(text) : null}/>
                                        }
                                        
                                    </div>
                                );
                                },
                            };
                            return columnsDate
                    break
                    case 'Textarea':
                            let columnsTextarea = {
                                title: (
                                <Tooltip title={aa.value + '[' + aa.text + ']'}>
                                    <span>{aa.value}</span>
                                </Tooltip>
                                ),
                                dataIndex: aa.text,
                                key: (aa.text + index),
                                ...aa,
                                render: (text, record, childIndex) => {
                                return (
                                    <div key={aa.text}>
                                        <span
                                            key={aa.text}
                                            style={{
                                                marginTop: '8px',
                                                marginBottom: '16px',
                                                display: 'inline-block',
                                            }}
                                            >
                                            <TextArea onChange={(e)=>{this.onChildTableDataChange(e.target.value,aa.text,index, childIndex,record)}} disabled={aa.readOnlyCondition} style={{minWidth:'160px'}} rows={2} defaultValue={text}/>
                                        </span>
                                    </div>
                                );
                                },
                            };
                            return columnsTextarea
                    break
                    default :
                        let columnsOther = {
                                title: (
                                <Tooltip title={aa.value + '[' + aa.text + ']'}>
                                    <span>{aa.value}</span>
                                </Tooltip>
                                ),
                                dataIndex: aa.text,
                                key: (aa.text + index),
                                ...aa,
                                render: (text, record, childIndex) => {
                                return (
                                    <div key={aa.text}>
                                        <span
                                        key={aa.text}
                                        style={{
                                            marginTop: '8px',
                                            marginBottom: '16px',
                                            display: 'inline-block',
                                        }}
                                        >
                                        {text}
                                        </span>
                                    </div>
                                );
                                },
                            };
                        return columnsOther
                    break
                }
            })
            return (
                <TabPane tab={item.Columns.title} key={item.Columns.sequence}>
                    <Table scroll={{ x: true }} bordered
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    dataSource={dataSource} 
                    columns={columns} />
                    <Button onClick={()=>this.openModal(item.Columns.objectType)}
                    type='primary' disabled={item.add_d} style={{width:'100%',marginTop:'10px'}}>新增数据</Button>
                    <Modal
                        ref="ListPage"
                        width="80%"
                        centered={true}
                        closable={false}
                        title="新增子表数据"
                        maskClosable={false}
                        visible={this.state[item.Columns.objectType]}
                        onOk={()=>this.handleOk(item.Columns.objectType)}
                        footer={null}
                        onCancel={()=>this.handleCancel(item.Columns.objectType)}
                        >
                        <div>
                            {
                                isHavaMultiObject ? 
                                <Add_Table detailPage={this.props.detailPage} objectType={item.Columns.objectType} handleCancel={(e)=>this.handleCancel(e)} /> : 
                                <Add_Form detailPage={this.props.detailPage} objectType={item.Columns.objectType} handleCancel={(e)=>this.handleCancel(e)} key={_.now()} columns_Form={item.Columns.fields}/> 
                            }
                        </div>
                    </Modal>
                </TabPane>
            )
        })
        return (
            <div className={styles.childTableMain}>
                <Tabs defaultActiveKey={defaultActiveKey} onChange={this.callback}>
                    {ChildTabPane}
                </Tabs>
            </div>
        )
    }
}