import React, { useEffect, useState } from 'react';
import { Button, Select, Tabs, Tag, Timeline } from 'antd';
import CustomTabs from './components/CustomTabs';
import style from '@/pages/IndexPage.css';
import SegmentLabel from './components/SegmentLabel';
import StepLineChart from './components/StepLineChart';
import AvatarImg from '../../../../public/avatar-bg.png';
import MachImg from '../../../../public/mach.png';
import BatteryLowImg from '../../../../public/battery-low.png';
import BatteryHighImg from '../../../../public/battery-normal.png';


function MachDetailManager({ list, statusList, currentMach, onDispatch, onSelect }){
    
    const infoList = [
        { label:'设备状态', value:'运行中' },
        { label:'电池状态', value:+currentMach.batteryStatus === 1 ? '电量低' : '正常', hasIcon:true },
        { label:'采用标准', value:currentMach.vibrationStandard },
        { label:'标准评价', value:'', isSegment:true },
        { label:'RSSI', value:currentMach.RSSI || '--', unit:'dbm'},
        { label:'负荷', value:currentMach.load, unit:'kw'},
        { label:'电流', value:currentMach.electricity, unit:'A'},
        { label:'电压', value:currentMach.voltage, unit:'V'},
        { label:'最后一次上传时间', value:currentMach.lastUploadTime },
        { label:'开机时长', value:currentMach.workTime, unit:'h'},
        { label:'建议保养时间', value:currentMach.adviceUpkeepTime},
        { label:'必须保养时间', value:currentMach.mustUpkeepTime }
    ];
  
    return (
        <>
            <div style={{ height:'40px' }}>
                <Button type='primary' onClick={()=>onSelect({})}>返回</Button>
                <Select style={{ width:'180px', marginLeft:'1rem' }} value={currentMach.equipmentCode} onChange={value=>{
                    let obj1 = list.filter(i=>i.equipmentCode === value )[0];
                    let obj2 = statusList.filter(i=>i.equipmentCode === value )[0];
                    onSelect({ ...obj1, ...obj2});
                }}>
                    {
                        list.map((item, index)=>(
                            <Option key={item.equipmentCode} value={item.equipmentCode}>{ item.equipmentName }</Option>
                        ))
                    }
                </Select>
            </div>
            <div style={{ height:'calc( 100% - 40px)' }}>
                {/* 左侧信息栏 */}
                <div className={style['card-container-wrapper']} style={{ width:'24%', paddingBottom:'0' }}>
                    <div className={style['card-container']} style={{ padding:'1rem', overflow:'hidden', boxShadow:'none' }}>
                        <div style={{ height:'33.3%' }}>
                            <Tabs 
                                size='small'
                                type='card'
                                className={style['flex-tabs']}
                                items={[
                                    { label:'图片', key:'img', children:(<div><img src={MachImg} /></div>)},
                                    // { label:'视频    A', key:'video' }
                                ]}
                            />
                        </div>
                        <div style={{ height:'38%' }}>
                            <CustomTabs currentMach={currentMach} />
                        </div>
                        <div style={{ height:'28%' }}>
                            <div className={style['card-container']} style={{ boxShadow:'none' }}>
                                <div className={style['card-title']}>
                                    <span className={style['symbol']}></span>
                                    <span>维保人员信息</span>
                                </div>
                                <div className={style['card-content']} style={{ display:'flex', justifyContent:'space-around', alignItems:'center',  background:'#f7f8fa' }}>
                                    <div style={{ height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', textAlign:'center' }}>
                                        <div style={{ 
                                            width:'70px', 
                                            height:'70px', 
                                            marginBottom:'0.5rem',
                                            borderRadius:'50%', 
                                            border:'1px solid #e9e9e9',
                                            backgroundImage:`url(${AvatarImg})`,
                                            backgroundRepeat:'no-repeat',
                                            backgroundSize:'cover',
                                            backgroundPosition:'50% 50%'
                                        }}>
                                        </div>
                                        <div>{ currentMach.equipmentHeadName || '--' }</div>
                                    </div>
                                    <div style={{ height:'100%', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                                        <div style={{ margin:'1rem 0'}}>
                                            <div>电话</div>
                                            <div>{ currentMach.equipmentHeadPhone || '--' }</div>
                                        </div>
                                        <div style={{ margin:'1rem 0'}}>
                                            <div>邮箱</div>
                                            <div>{ currentMach.equipmentHeadEmail || '--' }</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className={style['card-container-wrapper']} style={{ width:'76%', padding:'0' }}>
                    <div style={{ height:'36%' }}>
                        <div className={style['card-container-wrapper']} style={{ width:'74%' }}>
                            <div className={style['card-container']} style={{ boxShadow:'none' }}>
                                <div className={style['card-title']}>
                                    <span>运行状态</span>
                                    <span className={style['symbol']}></span>
                                </div>
                                <div className={style['card-content']}>
                                    <div style={{ display:'flex', height:'100%', flexWrap:'wrap', alignItems:'center' }}>
                                        {
                                            infoList.map((item,index)=>(
                                                <div key={item.label} style={{ width:'25%' }}>
                                                    <div>{ item.label }</div>
                                                    {
                                                        item.isSegment 
                                                        ?
                                                        <SegmentLabel />
                                                        :
                                                        <div style={{ fontWeight:'bold' }}>
                                                            { 
                                                                item.hasIcon 
                                                                ?
                                                                <img style={{ width:'26px', marginRight:'4px' }} src={item.value === '正常' ? BatteryHighImg : BatteryLowImg } />
                                                                :
                                                                null
                                                            }
                                                            <span style={{ marginRight:'4px' }}>{ item.value }</span>
                                                            <span>{ item.unit || '' }</span>
                                                        </div>
                                                    }                                              
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style['card-container-wrapper']} style={{ width:'26%', paddingRight:'0' }}>
                            <div className={style['card-container']} style={{ boxShadow:'none' }}>
                                <div className={style['card-title']}>
                                    <span>事件记录</span>
                                    <span className={style['symbol']}></span>
                                </div>
                                <div className={style['card-content']}>
                                    <Timeline>
                                        <Timeline.Item>
                                            <div>
                                                <div><Tag color='green'>保养</Tag>进行常规保养操作，设备正常运行</div>
                                                <div style={{ fontSize:'0.8', color:'rgba(0, 0, 0, 0.45)' }}>2023-02-24 18:00</div>
                                            </div>
                                        </Timeline.Item>
                                        <Timeline.Item>
                                            <div>
                                                <div><Tag color='blue'>检修</Tag>进行常规检修操作，设备正常运行</div>
                                                <div style={{ fontSize:'0.8', color:'rgba(0, 0, 0, 0.45)' }}>2023-02-24 18:00</div>
                                            </div>
                                        </Timeline.Item>
                                        <Timeline.Item>
                                            <div>
                                                <div><Tag color='red'>维修</Tag>进行常规检修操作，设备正常运行</div>
                                                <div style={{ fontSize:'0.8', color:'rgba(0, 0, 0, 0.45)' }}>2023-02-24 18:00</div>
                                            </div>
                                        </Timeline.Item>
                                    </Timeline>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style['card-container']} style={{ height:'64%', boxShadow:'none' }}>
                        <div className={style['card-title']}>
                            <span>运行趋势</span>
                            <span className={style['symbol']}></span>
                        </div>
                        <div className={style['card-content']}>
                            <StepLineChart onDispatch={onDispatch} currentMach={currentMach} />
                        </div>
                    </div>
                </div>
                {/* 右侧图表区 */}
            </div>
        </>
    )
}

export default React.memo(MachDetailManager);

// packages/react-reconciler/src/ReactFiberScheduler.js
function workLoop() {
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
// packages/react-reconciler/src/ReactFiberScheduler.js
function performUnitOfWork(unitOfWork){
  const current = unitOfWork.alternate;
  let next;
  next = beginWork(current, unitOfWork, renderExpirationTime);
  if (next === null) {
    next = completeUnitOfWork(unitOfWork);
  }
  return next;
}

// packages/react-reconciler/src/ReactFiberBeginWork.js
function beginWork( current = Fiber, workInProgress = Fiber, renderExpirationTime = ExpirationTime){
  switch (workInProgress.tag) {
    case ClassComponent: {
      return updateClassComponent(current, workInProgress, Component, resolvedProps);
    }
    case HostComponent:{
        return updateHostComponent(current, workInProgress)
    }
  }
}
// 元素组件类型时转换Fiber节点的流程
function updateHostComponent(current, workInProgress){
    reconcileChildren(current, workInProgress, workInProgress.pendingProps.children );
    return workInProgress.child;
}
// 生成Fiber节点和diffing Fiber节点
function reconcileChildren(current, workInProgress, nextChildren){
    if ( current === null ){
        // 构建Fiber节点和链表结构
        workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
    } else {
        // diffing 算法
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren);
    }
}

function reconcileChildFibers(returnFiber, currentFirstChild, newChild  ){
    const isObject = typeof newChild === 'object' && newChild !== null;
    if (isObject) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild));
      }
    }
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
    }
}

// packages/react-reconciler/src/ReactFiberBeginWork.js
function updateClassComponent(current = Fiber , workInProgress = Fiber, Component = any, nextProps) {
    const nextUnitOfWork = finishClassComponent(current, workInProgress, Component, shouldUpdate);
    return nextUnitOfWork;
}
function finishClassComponent( current = Fiber, workInProgress = Fiber, Component = any, shouldUpdate = boolean, hasContext = boolean ) {
      return workInProgress.child; 
}
function completeUnitOfWork(unitOfWork = Fiber){
    workInProgress = unitOfWork;
    do {
      const siblingFiber = workInProgress.sibling;
      if (siblingFiber !== null) {
        return siblingFiber;
      }
      const returnFiber = workInProgress.return;
      workInProgress = returnFiber;
    } while (workInProgress !== null);
    return null;
  }
//   Fiber 树是边创建边遍历的，每个节点都经历了「创建、Diffing、收集副作用（要改哪些节点）」的过程。
//   其中，创建、Diffing要自上而下，因为有父才有子；收集副作用要自下而上最终收集到根节点。