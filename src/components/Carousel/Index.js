import React from 'react'
import { Carousel,Icon } from 'antd';
import a from './image/a.jpg'
import b from './image/b.jpg'
import c from './image/c.jpg'
import d from './image/d.jpg'
import e from './image/e.jpg'
import { relative } from 'path';

export default class RotationChart extends React.Component{
    render(){
        return (
            <div style={{position:'relative'}}>
                <div style={{width:'50px',height:'50px',background:'lightgray',top: 'calc(50% - 25px)',
                position:'absolute',zIndex:'1000',opacity:'0.5',borderTopRightRadius:'8px',borderBottomRightRadius:'8px',
                cursor:'pointer',textAlign:'center'}}
                onClick={()=>this.carousel.prev()}
                >
                    <span><Icon style={{fontSize:'2.5rem',marginTop:'0.2rem'}} type="left" /></span>
                </div>
                <div style={{width:'50px',height:'50px',background:'lightgray',top: 'calc(50% - 25px)',
                position:'absolute',zIndex:'1000',right:'0',opacity:'0.5',cursor:'pointer',
                borderTopLeftRadius:'8px',borderBottomLeftRadius:'8px',textAlign:'center'}}
                onClick={()=>this.carousel.next()}
                >
                    <span><Icon style={{fontSize:'2.5rem',marginTop:'0.2rem'}} type="right" /></span>
                </div>
                <Carousel autoplay ref={dom=>(this.carousel = dom)}>
                    <div>
                        <img style={{width:'100%',height:'70vh'}} src={a} />
                    </div>
                    <div>
                        <img style={{width:'100%',height:'70vh'}} src={b} />
                    </div>
                    <div>
                        <img style={{width:'100%',height:'70vh'}} src={c} />
                    </div>
                    <div>
                        <img style={{width:'100%',height:'70vh'}} src={d} />
                    </div>
                    <div>
                        <img style={{width:'100%',height:'70vh'}} src={e} />
                    </div>
                </Carousel>
            </div>
        )
    }
}