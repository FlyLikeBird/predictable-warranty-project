import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import { downloadExcel } from '@/utils/array';
import XLSX from 'xlsx';
import TableSelector from './TableSelector';
import style from '@/pages/IndexPage.css';

let tableData = [];
let date = [];
const category = [{ title:'a', text:'加速度', unit:'g', multi:true }, { title:'b', text:'平均速度', multi:true, unit:'mm/s' }, { title:'c', text:'温度', color:'#ff992d', unit:'℃'}];
for ( let i =0; i < 24 ; i++ ){
    date.push( (i < 10 ? '0' + i : i) + ':00' );
}
for(let i = 0 ; i < 20 ; i++ ){
    let dateList = date.map(time=>({
        date:time,
            a:{ x:0.5, y:0.9, z:1.6 },
            b:{ x:6.4, y:6.7, z:3.0 },
            c:30
    }))
    tableData.push({
        title:'A区生产车间电机' + i,
        dateList
    })
}
const dotStyle = {
    width:'10px',
    height:'10px',
    display:'inline-block',
    borderRadius:'50%'
}
function TableContainer({ }){
  
    const columns = [
        { title:'设备名称', dataIndex:'title', width:140, fixed:'left', ellipsis:true  },
        ...date.map((time, index)=>({
            title:time,
            children:category.map((item)=>({
                title:item.text + '(' + item.unit + ')',
                dataIndex:'dateList',
                width: item.multi ? '120px' : '90px',
                render:(arr)=>{
                    let value = arr[index][item.title];
                    if ( value instanceof Object ){
                        let childs = Object.keys(value).map(key=>(
                            <span key={key} style={{ marginRight:'1rem', color:key === 'x' ? '#4080ff' : key === 'y' ? '#23c343' : '#ff992d'}}>{ value[key] }</span>
                        ));
                        return <div>{ childs }</div>
                    }
                    return value;
                }
            }))
        }))
    ];
    return (
        <>
            <div style={{ height:'90px' }}>
                <TableSelector />
            </div>  
            <div style={{ height:'calc( 100% - 90px)', paddingTop:'1rem' }}>
                <div className={style['card-container']} style={{ boxShadow:'none' }}>
                    <div className={style['card-title']} style={{ height:'4rem', fontWeight:'normal' }}>
                        <div>
                            <span style={{ ...dotStyle, background:'#4080ff' }}></span>
                            <span style={{ marginRight:'1rem'}}>X轴</span>
                            <span style={{ ...dotStyle, background:'#23c343' }}></span>
                            <span style={{ marginRight:'1rem'}}>Y轴</span>
                            <span style={{ ...dotStyle, background:'#ff992d' }}></span>
                            <span style={{ marginRight:'1rem'}}>Z轴</span>
                        </div>
                        <Button type='primary' size='small' ghost icon={<FileExcelOutlined />} onClick={()=>{
                            let fileTitle = '运行报表';
                            var aoa = [], thead1 = [], thead2 = [];
                            
                            columns.forEach((col,index)=>{
                                if ( col.children && col.children.length ){
                                    thead1.push(col.title);
                                    category.forEach((type,index)=>{
                                        thead2.push(type.text + '(' + type.unit + ')');
                                        if ( index === 0 ) return;                                     
                                        thead1.push(null);
                                    })  
                                } else {
                                    thead1.push(col.title);
                                    thead2.push(null);
                                }
                            });
                            aoa.push(thead1);
                            aoa.push(thead2);
                            
                            tableData.forEach(row=>{
                                let temp = [];
                                temp.push(row.title);
                                row.dateList.forEach(date=>{
                                    category.forEach(type=>{
                                        let value = date[type.title]; 
                                        
                                        temp.push(type.multi ? value.x + '/' + value.y + '/' + value.z : value );
                                    })
                                })
                                aoa.push(temp);
                            })
                         
                            var sheet = XLSX.utils.aoa_to_sheet(aoa);
                            // 合并表格表头的格式
                            let merges = [];
                            merges.push({
                                s:{ r:0, c:0 },
                                e:{ r:1, c:0 }
                            });
                            thead1.forEach((item,index)=>{
                                if ( item && item.includes(':')) {
                                    merges.push({
                                        s:{ r:0, c:index },
                                        e:{ r:0, c:index + category.length - 1}
                                    })
                                }
                            });
                           
                            sheet['!cols'] = thead2.map(i=>({ wch:16 }));
                            sheet['!merges'] = merges;
                            downloadExcel(sheet, fileTitle + '.xlsx');
                        }}>导出</Button>
                    </div>
                    <div className={style['card-content']} style={{ height:'calc( 100% - 4rem)' }}>
                        <Table
                            columns={columns}
                            style={{ padding:'0' }}
                            className={style['self-table-container']}
                            dataSource={tableData}
                            scroll={{ x:'1000px' }}
                        />
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default TableContainer;