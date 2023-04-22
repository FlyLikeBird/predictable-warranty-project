import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Pagination } from 'antd';
import { FileImageFilled } from '@ant-design/icons';
import TableSelector from '../MachArchiveManager/components/TableSelector';
import MachImg from '../../../../public/mach.png';
import MachDetail from './MachDetailManager';

function MachRunningManager({ dispatch, user, mach }){
    const { authorized } = user;
    const { list, statusList, currentPage, total } = mach;
    const [currentMach, setCurrentMach] = useState({});
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'mach/fetchMachList', payload:{ pageSize:8 }});
            dispatch({ type:'mach/fetchMachRunningStatus' });
        }
    },[authorized])
    return (
        Object.keys(currentMach).length
        ?
        <MachDetail list={list} statusList={statusList} currentMach={currentMach} onDispatch={action=>dispatch(action)} onSelect={obj=>setCurrentMach(obj)} />
        :
        <>
            <div style={{ height:'90px' }}>
                <TableSelector />
            </div>  
            <div style={{ height:'calc( 100% - 90px)', paddingTop:'1rem' }}>
                <div style={{ height:'calc( 100% - 30px)' }}>
                    {
                        list.map((item, index)=>{
                            let runningInfo = statusList.filter(i=>i.equipmentCode === item.equipmentCode )[0] || {};
                            let config = window.g;
                            let imgPath = item.equipmentPhotoPath ? `http://${config.apiHost}/upload/getFileByPath?filePath=${item.equipmentPhotoPath}` : '';
                            return (
                            <div key={item.equipmentCode} onClick={()=>setCurrentMach({ ...item, ...runningInfo })} style={{ width:'25%', height:'50%', display:'inline-block', padding:'0 1rem 1rem 0' }}>
                                <>
                                    {/* 产品区 */}
                                    <div style={{ height:'54%', position:'relative', background:'#fafafa', display:'flex', justifyContent:'center', alignItems:'center', overflow:'hidden' }}>
                                        {
                                            imgPath
                                            ?
                                            <img src={imgPath} style={{ height:'80%' }} />
                                            :
                                            <div style={{ textAlign:'center' }}>
                                                <FileImageFilled style={{ color:'#c9c9c9', fontSize:'4rem', margin:'0.5rem 0' }} />
                                                <div>还没有配置设备图</div>
                                            </div>
                                        }
                                        {/* 运行状态标签 */}
                                        <div style={{ width:'100px', left:'-10px', top:'1rem', color:'#fff', borderRadius:'20px', position:'absolute', padding:'4px 1.2rem', background:'#4cd263' }}>
                                            <span style={{ display:'inline-block', width:'6px', height:'6px', borderRadius:'50%', background:'#fff', verticalAlign:'middle', marginRight:'4px' }}></span>
                                            <span style={{ verticalAlign:'middle' }}>运行中</span>
                                        </div>
                                    </div>
                                    {/* 信息区 */}
                                    <div style={{ height:'46%', background:'#fff', padding:'1rem', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                                        <div style={{ fontSize:'1.2rem', margin:'0.5rem 0' }}>{ item.equipmentName }</div>
                                        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', whiteSpace:'nowrap' }}>
                                            <div style={{ width:'33%', padding:'4px' }}>
                                                <div style={{ color:'#aaaeb4', fontSize:'0.8rem' }}>型号</div>
                                                <div>{ item.equipmentModel }</div>
                                            </div>
                                            <div style={{ width:'42%', padding:'4px' }}>
                                                <div style={{ color:'#aaaeb4', fontSize:'0.8rem' }}>品牌</div>
                                                <div>{ item.equipmentBrand }</div>
                                            </div>
                                            <div style={{ width:'15%', padding:'4px' }}>
                                                <div style={{ color:'#aaaeb4', fontSize:'0.8rem' }}>功率</div>
                                                <div>{ ( runningInfo.load || '--' ) + 'kw' }</div>
                                            </div>
                                            <div style={{ width:'33%', padding:'4px' }}>
                                                <div style={{ color:'#aaaeb4', fontSize:'0.8rem' }}>健康评分</div>
                                                <div style={{ color:'#fea84c'}}>60分</div>
                                            </div>
                                            <div style={{ width:'42%', padding:'4px' }}>
                                                <div style={{ color:'#aaaeb4', fontSize:'0.8rem' }}>建议下次保养时间</div>
                                                <div>{ runningInfo.adviceUpkeepTime ? runningInfo.adviceUpkeepTime.split('T')[0] : '--' }</div>
                                            </div>
                                            <div style={{ width:'15%', padding:'4px' }}>
                                                <div style={{ color:'#aaaeb4', fontSize:'0.8rem' }}>标准评价</div>
                                                <div style={{ color:'#fea84c' }}>{ runningInfo.appraise || '--' }</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            </div>)  
                        })
                    }
                </div>
                <Pagination current={currentPage} total={total} onChange={page=>{
                    dispatch({ type:'mach/fetchMachList', payload:{ currentPage:page, pageSize:8 }});
                }}/>
            </div>
        </>
    )
}

export default connect(({ user, mach })=>({ user, mach }))(MachRunningManager);