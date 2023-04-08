import React from 'react';

const labelList = [
    { label:'优秀', color:'#009a29' },
    { label:'良好', color:'#6eda7e'},
    { label:'合格', color:'#ff992d'},
    { label:'一般', color:'#cb2634'}
];
function SegmentLabel(){
    // 获取当前评价的索引值
    let label = '良好', labelIndex = 0, labelColor = '';
    labelList.forEach((item,index)=>{
        if ( item.label === label ){
            labelIndex = index;
            labelColor = item.color;
        }
    })
    return (
        <div style={{ display:'flex', position:'relative', marginTop:'4px' }}>
            {/* 悬浮Label标签 */}
            <div style={{ 
                boxShadow:'0 4px 6px -4px #0000001f, 0 6px 10px #00000014', 
                position:'absolute', 
                top:'5px', 
                left:( labelIndex * 40 + 2 ) + 'px', 
                width:'40px', 
                transform:'translateY(-50%)', 
                background:labelColor, 
                border:'1px solid #fff', 
                fontSize:'0.8rem', 
                color:'#fff', 
                padding:'0 4px', 
                textAlign:'center'
            }}>{ label }</div>
            {
                labelList.map((item,index)=>(
                    <div style={{ 
                        width:'40px', 
                        height:'10px', 
                        marginRight:'1px',
                        background:item.color,
                        borderTopLeftRadius:index === 0 ? '6px' : '0',
                        borderBottomLeftRadius:index === 0 ? '6px' : '0',
                        borderTopRightRadius:index === labelList.length - 1 ? '6px' : '0',
                        borderBottomRightRadius:index === labelList.length - 1 ? '6px' : '0'
                    }}>

                    </div>
                ))
            }
        </div>
    )
}

export default SegmentLabel;