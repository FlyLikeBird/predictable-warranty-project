import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import { downloadExcel } from '@/utils/array';
import XLSX from 'xlsx';
import TableSelector from './TableSelector';
import style from '@/pages/IndexPage.css';

const dotStyle = {
    width:'10px',
    height:'10px',
    display:'inline-block',
    borderRadius:'50%'
}

function TableContainer({ list, category, dateColumn }){
   
    const columns = [
        { title:'设备名称', dataIndex:'title', width:140, fixed:'left', ellipsis:true  },
        ...dateColumn.map((time, index)=>({
            title:time,
            children:category.map((item)=>({
                title:`${item.title} ${item.unit ? '( ' + item.unit + ')' : ''}`,
                dataIndex:'dateList',
                width: item.multi ? '140px' : '90px',
                render:(arr)=>{
                    let obj = arr[index];
                    if ( item.multi ){
                        // x/y/z轴分量字段
                        let childs = ['X', 'Y', 'Z'].map(key=>(
                            <span 
                                key={key} 
                                style={{ marginRight:'1rem', color:key === 'X' ? '#4080ff' : key === 'Y' ? '#23c343' : '#ff992d'}}
                            >
                                { obj[item.dataIndex.replace('/', key)] }
                            </span>
                        ))
                        return <div>{ childs }</div>
                    } else {
                        return <span>{ obj[item.dataIndex] }</span>
                    }
                   
                }
            }))
        }))
    ];
    return (
        
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
                            col.children.forEach(( item, index)=>{
                                thead2.push(item.title);
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
                    list.forEach(row=>{
                        let temp = [];
                        temp.push(row.title);
                        row.dateList.forEach(obj=>{
                            category.forEach(item=>{
                                let valueStr = '';
                                if ( item.multi ) {
                                    ['X', 'Y', 'Z'].forEach((key, index)=>{
                                        valueStr += obj[item.dataIndex.replace('/', key)] + ( key === 'Z' ? '' : ' / ' );
                                    })
                                } else {
                                    valueStr = obj[item.dataIndex];
                                }
                                
                                temp.push(valueStr);
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
                    rowKey='title'
                    className={style['self-table-container']}
                    dataSource={list}
                    scroll={{ x:'1000px' }}
                />
            </div>
        </div>           
    )
}

export default TableContainer;