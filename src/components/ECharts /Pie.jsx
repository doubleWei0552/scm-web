import React from 'react'
import echarts from 'echarts';

// 饼图组件
export default class Compie extends React.Component{
    static defaultProps = {
        Id:'pie', //实例化dom，每个图表必须唯一
        pieTitle:'某站点用户访问来源2258', //示例的标题
        subtext:'介绍文字', //标题下面的介绍文字
        titleAlign:'center', //标题的位置
        legendOrient:'vertical', //类型介绍的排列方式
        legendLeft:'left', //类型介绍的位置
        legendData:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'], //类型介绍的数据
    }
    componentDidMount(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(this.props.Id));
        // 绘制图表
        myChart.setOption({
            title : {
                text: this.props.pieTitle,
                subtext: this.props.subtext,
                x:this.props.titleAlign,
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: this.props.legendOrient,
                left: this.props.legendLeft,
                data: this.props.legendData,
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'直接访问'},
                        {value:310, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:1548, name:'搜索引擎'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });
    }

    render(){
        return (
            <div id={this.props.Id} style={{ width: '100%', height: '100%' }}></div>            
        )
    }
}