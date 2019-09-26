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
  } from 'antd';
import moment from 'moment';

const { TabPane } = Tabs;
const { TextArea } = Input

function callback(key) {
    console.log(key);
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

    render(){
        let { defaultActiveKey,ChildData } = this.props.detailPage
        let ChildTabPane = ChildData.map(item=>{  //多个子表的循环
            let dataSource = item.Data.records 
            let columns = item.Columns.fields.map((aa,index) =>{
                switch(aa.type){
                    case "Text":
                    case "Number":
                    case 'MultiObjectSelector':
                        let columnsText = {
                            title: (
                            <Tooltip title={aa.value + '[' + aa.text + ']'}>
                                <span>{aa.value}</span>
                            </Tooltip>
                            ),
                            dataIndex: aa.text,
                            key: aa.text,
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
                        return columnsText
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
                            key: aa.text,
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
                                    <Select disabled={true} defaultValue={text*1}>
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
                                key: aa.text,
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
                                            {text ? (aa.type == 'Date' ? moment(text).format('YYYY/MM/DD') : moment(text).format('YYYY/MM/DD HH:mm:ss')) : null}
                                        </span>
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
                                key: aa.text,
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
                                            <TextArea disabled style={{minWidth:'150px'}} rows={3} defaultValue={text}/>
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
                                key: aa.text,
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
                </TabPane>
            )
        })
        return (
            <div>
                <Tabs defaultActiveKey={defaultActiveKey} onChange={callback}>
                    {ChildTabPane}
                </Tabs>
            </div>
        )
    }
}