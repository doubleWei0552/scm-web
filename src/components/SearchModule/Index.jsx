import React from 'react'
import { Breadcrumb,Button,DatePicker, Select,Input,Row,InputNumber, Col,Table,Dropdown,Icon,Menu,Popconfirm, message } from 'antd'
import style from './Index.less'

export default class SearchModule extends React.Component{
    static defaultProps = {
        title:'',
        Breadcrumb:[],
        ButtonGroup:[],
        InputGroup:[],
        onCancel:()=>{},
        onEdit:()=>{}
    }
    state={
        disabled:true, //input输入框是否可编辑，默认true（不可编辑）
        isSave:false  //顶部是否是保存按钮，默认为false
    }
    handleMenuClick=(e)=> {
        console.log('click', e);
    }
    onDateChange=(date, dateString)=> {
        console.log(date, dateString);
    }
    // 往state里面添加添加改变的值
    onChange=(title,e)=>{
        console.log(title,e)
        if(typeof(e) === 'object'){
            this.setState({[title]:e.target.value})
        } else {
            this.setState({[title]:e})
        }
    }
    confirm=(e)=> {
        console.log(e);
        message.success('Click on Yes');
    }
    
    cancel=(e)=> {
        console.log(e);
        message.error('Click on No');
    }

    onCancled=()=>{
        // this.showModal('test')
        let newState={}
        for(let i in this.state){
            if(i === 'visible'){
                newState[i] = this.state[i]
            }else{
                newState[i] = undefined
            }
        }
        this.setState({...newState})
        this.props.onCancled()
    }
    // onButtonTest = (value)=>{
    //     console.log(value)
    //     this.props.dispatch({type:'table/getTransactionProcess',payload:{ButtonName:value}})
    // }
    render(){
        console.log(this.props)
        const Breadcrumbchild = this.props.Breadcrumb.map((value,index)=>{
            return <Breadcrumb.Item key={index}>{value.title}</Breadcrumb.Item>
        })
        // const testButton = this.props.table.Detail.data.buttons.map((value,index)=>{
        //     return <Button onClick={()=>this.onButtonTest(value)} key={index}>{value.label}</Button>
        // })
        //顶部按钮
        const ButtonGroup = this.props.ButtonGroup.map((value,index)=>{
            if(value.style === 'Input'){
                if(value.isPopconfirm){
                    return <Popconfirm title="确定要执行本次操作?" onConfirm={this.confirm} onCancel={this.cancel} okText="确定" cancelText="取消">
                            <Button onClick={value.onClick} key={index} disabled={value.disabled} type={value.type}>{value.title}</Button>
                        </Popconfirm>
                }else {
                    return <Button onClick={value.onClick} key={index} disabled={value.disabled} type={value.type}>{value.title}</Button>
                }
            } else if(value.style === 'DropdownInput'){
                let menu = (
                    <Menu onClick={this.handleMenuClick}>
                      <Menu.Item key="1">取消结案</Menu.Item>
                    </Menu>
                  );
                return <Dropdown key={index} overlay={menu}>
                            <Button>
                            {value.title}<Icon type="down" />
                            </Button>
                        </Dropdown>
            }
        })
        const InputGroup = this.props.InputGroup.map((value,index)=>{
            if(value.type === 'Select'){
                console.log(value)
                const optionChild = value.options.map((v,i)=>{
                    return <Select.Option value={v.title} key={i}>{v.title}</Select.Option>
                })
                return <Col span={8} key={index}>
                <div className={style.SelectInput}>
                    <span className={style.span}>{value.value}</span>
                    <Select disabled={this.state.disabled} key={index} className={style.select}>
                        {optionChild}
                    </Select>
                </div>
                </Col>
            } else if(value.type === 'Text'){
                return <Col span={8} key={index}>
                    <div className={style.NormalInput}>
                        <span className={style.span}>{value.value}</span>
                        <Input value={this.state[value.value] === undefined ? this.props.table.selectDate[value.text] : this.state[value.value]} onChange={this.onChange.bind(this,value.value)} disabled={this.state.disabled} placeholder={value.placeholder} className={style.input}/>
                    </div>
                </Col>
            } else if (value.type === 'Number'){
                return <Col span={8} key={index}>
                <div className={style.NormalInput}>
                    <span className={style.span}>{value.value}</span>
                    <InputNumber value={this.state[value.value] === undefined ? this.props.table.selectDate[value.text] : this.state[value.value]} onChange={this.onChange.bind(this,value.value)} disabled={this.state.disabled} placeholder={value.placeholder} className={style.input}/>
                </div>
            </Col>
            } else if (value.type === 'datetime'){
                return <Col span={16} key={index}>
                <div className={style.NormalInput}>
                    <span className={style.span}>{value.value}</span>
                    <DatePicker onChange={this.onDateChange} /> 
                </div>
            </Col>
            }
        })
        return(
            <div className={style.SearchModuleMain}>
                <header className={style.header}>
                    <span className={style.span}>{this.props.title}</span>
                    <Breadcrumb className={style.Breadcrumb}>
                        {Breadcrumbchild}
                    </Breadcrumb>
                </header>
                <hr className={style.hr}/>
                <div style={{display:this.props.table.buttonType ? 'none' : 'block'}} className={style.ButtonGroup}>
                    {/* {testButton} */}
                    {ButtonGroup}
                </div>
                <div style={{display:this.props.table.buttonType ? 'block' : 'none'}} className={style.SaveButton}>
                    <Button onClick={()=>this.props.onSave()} type='primary'>保存</Button>
                    <Button onClick={()=>this.props.onCanceled()}>取消</Button>
                </div>
                <hr className={style.hr}/>
                <div className={style.InputGroup}>
                    <Row>
                        {InputGroup}
                    </Row>
                </div>
            </div>
        )
    }
}