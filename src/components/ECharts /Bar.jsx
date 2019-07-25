import React from 'react'
import echarts from 'echarts';

// 柱状图组件
export default class ComBar extends React.Component{
    static defaultProps = {
        Id:'bar', //实例化dom，每个图表必须唯一
        lineTitle:'柱状图实例', //示例的标题
        xAxisData:["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],  //示例的x轴数据
        seriesName:'test', //数据的所有的标题
        seriesType:'bar', //示例的类型
        seriesData:[  //展示的数据
            {value:25, name:'衬衫2',itemStyle: {
                color: '#041527'
            }},
            {value:35, name:'羊毛衫21',itemStyle: {
                color: 'pink'
            }},
            {value:23, name:'雪纺衫2',itemStyle: {
                color: 'cyan'
            }},
            {value:5, name:'裤子22'},
            {value:15, name:'高跟鞋2'},
            {value:26, name:'袜子3'}
        ],
    }
    componentDidMount(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(this.props.Id));
        // 绘制图表
        myChart.setOption({
            title: { text: this.props.lineTitle },
            tooltip: {},
            xAxis: {
                data: this.props.xAxisData
            },
            yAxis: {},
            series: [{
                name: this.props.seriesName,
                type: this.props.seriesType,
                data: this.props.seriesData,
            }]
        });
    }

    render(){
        return (
            <div id={this.props.Id} style={{ width: '100%', height: '100%' }}></div>            
        )
    }
}