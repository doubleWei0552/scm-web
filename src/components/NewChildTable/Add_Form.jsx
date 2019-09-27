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
} from 'antd';
import moment from 'moment';
import _ from 'lodash'

const { TextArea } = Input;
@Form.create()
export default class Add_Form extends React.Component{
    handleResetClick = e => {  // 点击取消按钮
        this.props.form.resetFields()
        if (e) {
          this.props.handleCancel(this.props.objectType)
        }
    };
    handleSubmit = e => {  // 点击确定按钮
        e.preventDefault();
        let { ChildData } = this.props.detailPage
        let { objectType } = this.props
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                for(let i in values){
                    if(typeof(values[i]) == 'object' && values[i] != null){
                        values[i] = moment(values[i]).valueOf()
                    }
                }
                values.key = _.now()
                ChildData.map(item => {
                    if(item.objectType == objectType){
                        item.Data.records.push(values)
                    }
                })
                console.log(this.props)
                console.log('获取的值',values)
            }
        });
        this.props.handleCancel(this.props.objectType)
    }
    childSelectClick = e => {  // renference类型获取options
        console.log('renference类型获取options',e)
    }
    onSelectSearch = e => {  // renference类型的数据搜索时调用的方法
        console.log('renference类型的数据搜索时调用的方法',e)
    }
    render(){
        let { columns_Form } = this.props
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <Row>
                    <Form onSubmit={this.handleSubmit}>
                        {columns_Form.map((values, index) => {
                        switch (values.type) {
                            case 'Text':
                            if (values.readOnlyCondition) return null; // 如果是只读，就不显示
                            return (
                                <Col span={12} key={index + values.text}>
                                <span
                                    style={{
                                    width: '30%',
                                    height: '40px',
                                    lineHeight: '40px',
                                    display: 'block',
                                    float: 'left',
                                    textAlign: 'right',
                                    paddingRight: '10px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    }}
                                >
                                    {values.value}
                                </span>
                                <Form.Item style={{ width: '70%', float: 'left' }}>
                                    {getFieldDecorator(values.text, {
                                    initialValue: values.defaultValue,
                                    rules: [
                                        {
                                        required: values.requiredCondition,
                                        message: `请录入正确格式的${values.value}`,
                                        pattern:values.pattern,
                                        },
                                    ],
                                    })(<Input placeholder={`请录入${values.value}`} />)}
                                </Form.Item>
                                </Col>
                            );
                            break;
                            case 'Date':
                            case 'DateTime':
                            if (values.readOnlyCondition) return null; // 如果是只读，就不显示
                            return (
                                <Col span={12} key={index + values.text}>
                                <span
                                    style={{
                                    width: '30%',
                                    height: '40px',
                                    lineHeight: '40px',
                                    display: 'block',
                                    float: 'left',
                                    textAlign: 'right',
                                    paddingRight: '10px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    }}
                                >
                                    {values.value}
                                </span>
                                <Form.Item style={{ width: '70%', float: 'left' }}>
                                    {getFieldDecorator(values.text, {
                                    initialValue: values.defaultValue,
                                    rules: [
                                        {
                                        required: values.requiredCondition,
                                        message: `这是必填项,请选择${values.value}`,
                                        },
                                    ],
                                    })(
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        format={values.type == 'Date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'}
                                    />
                                    )}
                                </Form.Item>
                                </Col>
                            );
                            break;
                            case 'Textarea':
                            if (values.readOnlyCondition) return null; // 如果是只读，就不显示
                            return (
                                <Col span={12} key={index + values.text}>
                                <span
                                    style={{
                                    width: '30%',
                                    height: '40px',
                                    lineHeight: '40px',
                                    display: 'block',
                                    float: 'left',
                                    textAlign: 'right',
                                    paddingRight: '10px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    }}
                                >
                                    {values.value}
                                </span>
                                <Form.Item style={{ width: '70%', float: 'left' }}>
                                    {getFieldDecorator(values.text, {
                                    initialValue: values.defaultValue,
                                    rules: [
                                        {
                                        required: values.requiredCondition,
                                        message: `这是必填项,请录入${values.value}`,
                                        },
                                    ],
                                    })(<TextArea rows={2} placeholder={`请录入${values.value}`} />)}
                                </Form.Item>
                                </Col>
                            );
                            break;
                            case 'Number':
                            if (values.readOnlyCondition) return null;
                            return (
                                <Col span={12} key={index + values.text}>
                                <span
                                    style={{
                                    width: '30%',
                                    height: '40px',
                                    lineHeight: '40px',
                                    display: 'block',
                                    float: 'left',
                                    textAlign: 'right',
                                    paddingRight: '10px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    }}
                                >
                                    {values.value}
                                </span>
                                <Form.Item style={{ width: '70%', float: 'left' }}>
                                    {getFieldDecorator(values.text, {
                                    initialValue: values.defaultValue,
                                    rules: [
                                        {
                                        required: values.requiredCondition,
                                        message: `这是必填项,请录入${values.value}`,
                                        },
                                    ],
                                    })(
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder={`请录入${values.value}`}
                                    />
                                    )}
                                </Form.Item>
                                </Col>
                            );
                            break;
                            case 'Select':
                            case 'Reference':
                            case 'ObjectType':
                            if (values.readOnlyCondition) return null;
                            let optionChild;
                                optionChild = values.options.map((v, s) => {
                                return (
                                    <Select.Option value={v.value} key={v.text + s}>
                                    {v.text}
                                    </Select.Option>
                                );
                            });

                            return (
                                <Col span={12} key={index + values.text}>
                                <span
                                    style={{
                                    width: '30%',
                                    height: '40px',
                                    lineHeight: '40px',
                                    display: 'block',
                                    float: 'left',
                                    textAlign: 'right',
                                    paddingRight: '10px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    }}
                                >
                                    {values.value}
                                </span>
                                <Form.Item style={{ width: '70%', float: 'left' }}>
                                    {getFieldDecorator(values.text, {
                                    initialValue: values.defaultValue,
                                    rules: [
                                        {
                                        required: values.requiredCondition,
                                        message: `这是必填项,请选择${values.value}`,
                                        },
                                    ],
                                    })(
                                    <Select
                                        onFocus={() => {
                                            if (values.type == 'Reference') {
                                                this.childSelectClick(values);
                                            }
                                        }}
                                        showSearch
                                        onSearch={e => this.onSelectSearch(e, values)}
                                        placeholder={`请选择${values.value}`}
                                        onChange={this.handleSelectChange}
                                    >
                                        {optionChild}
                                    </Select>
                                    )}
                                </Form.Item>
                                </Col>
                            );
                            break;
                        }
                        })}
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }}>
                                确定
                            </Button>
                            <Button onClick={e => this.handleResetClick(e)} style={{ margin: '0 5px' }}>
                                取消
                            </Button>
                        </Col>
                    </Form>
                </Row>
            </div>
        )
    }
}