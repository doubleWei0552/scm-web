import React from 'react'
import { Breadcrumb,Button,DatePicker, Select,Input,Row, Col,Table,Modal } from 'antd';
import router from 'umi/router';

export default class BasicEdit extends React.Component{
    static defaultProps = {
        title:'',
        Breadcrumb:[],
        subtitle:'',
        Search: [],
        warning:'',
        onBack:(e)=>{},
        onCancel:(e)=>{}
    }
    //模态框状态
    state={
        visible: false, //用于记录modal框是否显示
        Editable:false, //输入框是否可编辑，默认可编辑
        saveData:[], //即将要保存的数据
        isOperation:false, //用于记录是否对数据进行操作
        operationType:'', //用于记录是什么操作下的弹出的modal框
        warning:'', //浮框显示的提示信息

        // -----------------
        defaultState:false, //默认进来是不可操作
        DISPLAY_CONDITION:true, //详情页组件的显示控制，默认显示（true）
        READONLY_CONDITION: false,  //详情页组件管控，只读状态，默认不可操作（false）
        READ_ONLY_CONDITION: false,  //详情页组件管控， 
        REQUIRED_CONDITION: false,  //详情页组件管控，必填，默认
    }
    componentDidMount=()=>{
        if(this.props.table.PageStatus == ''){
            this.setState({Editable:true})
        }
    }

    handleOk = (e) => {
        this.setState({visible: false});
        if(this.state.operationType == 'delete'){
            this.props.dispatch({type:'table/getRemoveBusiness',payload:{selectDate:this.props.table.selectDate}})
            router.goBack()
        }else if(this.state.operationType == 'edit'){
            this.props.dispatch({type:'table/save',payload:{buttonType:true}})
            let newState={}
            for(let i in this.state){
                if(i === 'visible'){
                    newState[i] = this.state[i]
                }else{
                    newState[i] = undefined
                }
            }
            this.setState({...newState,Editable:true,buttonType:true,visible: false})
            this.props.onCancled()
        } else if(this.state.operationType == 'create'){
            this.props.dispatch({type:'table/save',payload:{selectDate:{},buttonType:true}})
        }
    }

    handleCancel = (e) => {
        this.setState({visible:false})
        if(this.state.operationType == 'delete'){
            this.props.dispatch({type:'table/save',payload:{buttonType:true}})
        } else {
            this.props.dispatch({type:'table/save',payload:{buttonType:false}}) 
        }
    }
    create=()=>{
        this.setState({selectDate:null,Editable:false,operationType:'create'})
        this.props.dispatch({type:'table/save',payload:{selectDate:[],buttonType:false}})
    }
    Edit=()=>{
        this.setState({Editable:false,operationType:'edit'})
        this.props.dispatch({type:'table/save',payload:{buttonType:false}})
    }
    delete = () => {
        this.setState({visible: true,operationType:'delete',warning:'确定删除这条信息么？'});
    }
    // 往state里面添加添加改变的值
    onChange=(title,e)=>{
        this.setState({[title]:e.target.value,isOperation:true})
    }
    onSelectChange=(value,v)=>{
        let select = {}
        for(let i = 0;i<value.options.length;i++){
            if(value.options[i].text == v){
                select = value.options[i]
            }
        }
        this.setState({[value.value]:select.value})

    }
    onSave=()=>{
        this.props.dispatch({type:'table/getDetailSave',payload:{state:this.state}})
        router.goBack()
    }
    onCancled=()=>{
        if(this.state.isOperation && this.state.operationType == 'edit'){
            this.setState({visible: true,warning:'确定放弃本次操作？'});
        }else if(this.state.isOperation && this.state.operationType == 'create'){
            this.setState({visible: true,warning:'确定放弃新增数据？'});
        }else if(this.state.operationType == 'delete'){
            this.setState({visible: true,warning:'确定删除这条数据？'});
        }else{
            this.setState({Editable:true,buttonType:true})
            this.props.onCancled()
        }
        
        // let newState={}
        // for(let i in this.state){
        //     if(i === 'visible'){
        //         newState[i] = this.state[i]
        //     }else{
        //         newState[i] = undefined
        //     }
        // }
        // this.setState({...newState,Editable:true,buttonType:true})
        // this.props.onCancled()
    }
    render(){
        const Breadcrumbchild = this.props.Breadcrumb.map((value,index)=>{
            return <Breadcrumb.Item key={index}>{value.title}</Breadcrumb.Item>
        })
        const BasicDataEdit = this.props.Search.map((value,index)=>{
            if(JSON.stringify(this.props.table.DetailPage) != "{}"){ 
            if(value.type === 'Select'){
                let state  //组件的管控
                this.props.table.DetailPage.data.policyFormFields.map((j,k)=>{
                    if(value.text == j.FIELD_NAME){
                        state = j
                    }
                })
                const optionChild = value.options.map((v,i)=>{
                    return <Select.Option value={v.text} key={i}>{v.value} - {v.text}</Select.Option>
                })
                return <Col style={{display:state.DISPLAY_CONDITION ? 'block' : 'none'}} key={index} span={10} style={{marginRight:'15px'}}>
                <div style={{width:'70%',margin:'10px auto'}}>
                    <span style={{width:'30%',height:'32px',lineHeight:'32px',display:'block',float:'left',textAlign:'right',paddingRight:'10px',overflow:'hidden',textOverflow: 'ellipsis'}}>{value.value}</span>
                    <Select key={index} onChange={this.onSelectChange.bind(this,value)} defaultValue={state.FIELD_VALUE} disabled={state.DISPLAY_CONDITION} style={{width:'70%',float:'left'}}>
                    {optionChild}
                </Select></div></Col>
            } else if(value.type === 'Text'){
                let state  //组件的管控
                this.props.table.DetailPage.data.policyFormFields.map((j,k)=>{
                    if(value.text == j.FIELD_NAME){
                        state = j
                    }
                })
                return <Col span={10} key={index} style={{marginRight:'15px',display:state.DISPLAY_CONDITION ? 'block' : 'none'}}>
                    <div style={{width:'70%',margin:'10px auto'}}>
                        <span style={{width:'30%',height:'32px',lineHeight:'32px',display:'block',float:'left',textAlign:'right',paddingRight:'10px',overflow:'hidden',textOverflow: 'ellipsis'}}><span style={{color:'red',display:state.REQUIRED_CONDITION ? 'inline-block' : 'none'}}>*</span>{value.value}</span>
                        <Input disabled={this.state.Editable ? true : state.READ_ONLY_CONDITION} value={this.state[value.value] === undefined ? this.props.table.selectDate[value.text] : this.state[value.value]} placeholder={value.placeholder} onChange={this.onChange.bind(this,value.value)} style={{width:'70%',float:'left'}}/>
                    </div>
                </Col>
            } else if(value.type === 'ObjectSelector'){
                return <Col span={10} key={index} style={{marginRight:'15px'}}>
                    <div style={{width:'70%',margin:'10px auto'}}>
                        <Button disabled={this.state.Editable} type="primary" style={{width:'100%'}}>{value.value}</Button>
                    </div>
                </Col>
            }
        }
        })
        return(
            <div style={{background:'white',padding:'10px 10px 20px 10px',borderRadius:'5px',boxShadow:'0 1px 10px #dee1e4'}}>
                <header style={{height:'35px'}}>
                    <span style={{fontSize:'1.5rem',float:'left',marginRight:'1rem'}}>{this.props.title}</span>
                    <Breadcrumb style={{float:"left",height:'36px',lineHeight:'36px'}}>
                        {Breadcrumbchild}
                    </Breadcrumb>
                </header>
                <hr style={{backgroundColor:'lightgray',height:'1px',border:'none'}}/>
                <div className="BasicEditBody" style={{display:this.props.table.buttonType ? 'block' : 'none'}}>
                    <Button style={{marginRight:'10px'}} onClick={this.create} type='primary'>新增</Button>
                    <Button style={{marginRight:'10px'}} onClick={this.Edit}>编辑</Button>
                    <Button style={{marginRight:'10px'}} onClick={this.delete}>删除</Button>
                    <Button style={{marginRight:'10px'}} onClick={this.props.onBack}>返回</Button>
                </div>
                <div className="BasicEditBody" style={{display:this.props.table.buttonType ? 'none' : 'block'}}>
                    <Button onClick={()=>this.onSave()} style={{marginRight:'10px'}} type='primary'>保存</Button>
                    <Button style={{marginRight:'10px'}} onClick={()=>this.onCancled()}>取消</Button>
                </div>
                <hr style={{backgroundColor:'lightgray',height:'1px',border:'none'}}/>
                <div className="BasicEditSearch">
                    <span style={{fontSize:'1.2rem'}}>{this.props.subtitle}</span>
                    <Row>
                        {BasicDataEdit}
                    </Row>
                </div>
                <div>
                    <Modal
                    title="提示！"
                    closable={false}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                    <p>{this.state.warning}</p>
                    </Modal>
                </div>
            </div>
        )
    }
}