import React, { useState, useEffect, useRef  } from 'react';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';

function DataCardList({ data }){
    const containerRef = useRef();
    const [visible, setVisible] = useState(false);
    
    useEffect(()=>{
        let container = containerRef.current;
        function handleScroll(event){
            event.preventDefault();
            container.scrollLeft += event.deltaY
        }
        if ( container ){
            container.addEventListener('wheel', handleScroll);
        }
    },[])
    return (
        // 高度高于外部容器，确认横向滚动条被外部容器隐藏掉
        <div ref={containerRef} style={{ position:'relative', height:'160px', whiteSpace:'nowrap', overflow:'auto hidden' }}>
            {/* 横向滚动条的样式重置 */}
            {
                data && data.length 
                ?
                data.map((item,index)=>(
                    <div className={style['card-container-wrapper']} key={item.title} style={{ width:'16.6%' }}>
                        <div className={style['card-container']} style={{ padding:'1rem', boxShadow:'none', display:'flex', flexDirection:'column', justifyContent:'space-around' }}>
                            <div style={{ fontWeight:'bold' }}>{ item.title }</div>
                            <div>
                                <span style={{ fontSize:'1.6rem', fontWeight:'bold' }}>{ item.value }</span>
                                <span style={{ fontSize:'0.8rem' }}>{ item.unit }</span>
                            </div>
                            <div style={{ fontSize:'0.8rem'}}>
                                {
                                    item.params && item.params.length 
                                    ?
                                    item.params.map((item)=>(
                                        <span key={item.text} style={{ marginRight:'1rem' }}>
                                            <span style={{ marginRight:'4px'}}>{ item.text }</span>
                                            <span style={{ color:item.color ? item.color : '#ed5a5a'}}>{ item.value }</span>
                                            <span>{ item.unit }</span>
                                        </span>
                                    ))
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                ))
                :
                null
            }
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(DataCardList, areEqual);