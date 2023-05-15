import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { connect } from 'dva';
import { Button, Table, Drawer, Popconfirm, message } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import TableSelector from './components/TableSelector';
import AddDrawer from './components/AddDrawer';
import html2canvas from 'html2canvas';
import { downloadExcel } from '@/utils/array';
import XLSX from 'xlsx';
import style from '@/pages/IndexPage.css';

function MachArchiveManager({ dispatch, user, mach, userList }) {
  const { authorized } = user;
  const {
    list,
    currentPage,
    bindSensors,
    unbindSensors,
    sensorTypes,
    tplList,
    total,
  } = mach;
  const [info, setInfo] = useState({});
  const columns = [
    {
      title: '序号',
      render: (text, record, index) => {
        return (currentPage - 1) * 12 + index + 1;
      },
    },
    { title: '设备名称', dataIndex: 'equipmentName' },
    {
      title: '设备类型',
      dataIndex: 'equipmentType',
      render: (value) => <span>{value === 1 ? '电机' : '其他'}</span>,
    },
    { title: '注册码', dataIndex: 'equipmentCode' },
    { title: '品牌', dataIndex: 'equipmentBrand' },
    { title: '型号', dataIndex: 'equipmentModel' },
    { title: '功率', dataIndex: 'equipmentPower' },
    {
      title: '安装位置',
      dataIndex: 'equipmentSetupLocationId',
      render: (value) => <span>{value || '--'}</span>,
    },
    { title: '投产日期', dataIndex: 'equipmentProductionDate' },
    { title: '维保截止日期', dataIndex: 'equipmentMaintenanceEndDate' },
    {
      title: '设备状态',
      dataIndex: 'equipmentStatus',
      render: () => <span style={{ color: 'green' }}>正常</span>,
    },
    {
      title: '操作',
      render: (row) => (
        <div>
          <a
            style={{ marginRight: '1rem' }}
            onClick={() => {
              dispatch({
                type: 'mach/fetchBindSensors',
                payload: { equipmentCode: row.equipmentCode },
              });
              setInfo({ visible: true, current: row, forEdit: true });
            }}
          >
            更新
          </a>
          <Popconfirm
            title="确定删除此设备吗"
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              new Promise((resolve, reject) => {
                dispatch({
                  type: 'mach/delMachAsync',
                  payload: {
                    resolve,
                    reject,
                    equipmentCode: row.equipmentCode,
                  },
                });
              })
                .then(() => {
                  message.success(`删除${row.equipmentName}成功`);
                })
                .catch((msg) => message.error(msg));
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const handleSearch = useCallback((values) => {
    console.log('search');
    console.log(values);
  }, []);
  useEffect(() => {
    if (authorized) {
      dispatch({ type: 'mach/initMachList' });
    }
  }, [authorized]);

  return (
    <>
      <div style={{ height: '90px' }}>
        <TableSelector onSearch={handleSearch} />
      </div>
      <div style={{ height: 'calc( 100% - 90px)', paddingTop: '1rem' }}>
        <div
          className={style['card-container']}
          style={{ padding: '1rem 0', boxShadow: 'none' }}
        >
          <div className={style['card-title']}>
            <div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginRight: '0.5rem' }}
                onClick={() => setInfo({ visible: true })}
              >
                新建
              </Button>
              <Button>批量导入</Button>
            </div>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                let aoa = [],
                  thead = [];
                let fileTitle = '设备档案表';
                columns.forEach((column) => {
                  if (column.dataIndex) {
                    thead.push(column.title);
                  }
                });
                aoa.push(thead);
                list.forEach((item, index) => {
                  let temp = [];
                  columns.forEach((column) => {
                    if (column.dataIndex) {
                      temp.push(item[column.dataIndex] || '--');
                    }
                  });
                  aoa.push(temp);
                });
                var sheet = XLSX.utils.aoa_to_sheet(aoa);

                sheet['!cols'] = thead.map((i) => ({ wch: 16 }));
                downloadExcel(sheet, fileTitle + '.xlsx');
              }}
            >
              下载
            </Button>
          </div>
          <div className={style['card-content']} style={{ padding: '0' }}>
            <Table
              className={style['self-table-container']}
              columns={columns}
              dataSource={list}
              rowKey="equipmentCode"
              pagination={{
                current: currentPage,
                total,
                pageSize: 12,
                showSizeChanger: false,
              }}
              onChange={(pagination) => {
                dispatch({
                  type: 'mach/fetchMachList',
                  payload: { currentPage: pagination.current },
                });
              }}
            />
          </div>
        </div>
        <Drawer
          width="46%"
          open={info.visible ? true : false}
          className={style['custom-drawer']}
          onClose={() => setInfo({})}
          maskClosable={false}
          title={info.forEdit ? '更新设备档案' : '新建设备档案'}
        >
          <AddDrawer
            info={info}
            onDispatch={(action) => dispatch(action)}
            userList={userList.list}
            onClose={() => setInfo({})}
            bindSensors={bindSensors}
            unbindSensors={unbindSensors}
            sensorTypes={sensorTypes}
            tplList={tplList}
          />
        </Drawer>
      </div>
    </>
  );
}

export default connect(({ user, mach, userList }) => ({
  user,
  mach,
  userList,
}))(MachArchiveManager);
// React16 Fiber和HOOKs源码
// 空闲调度执行reconcile
function performNextWork(fiber) {
  reconcile(fiber);
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}
// reconcile
function reconcile(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

// 生成HOOK对象
function mountWorkInProgressHook() {
  var hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    currentlyRenderingFiber$1.memoizedState = workInProgressHook = hook;
  } else {
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
// 重点！！！
// 递归过程中 归 的收集逻辑，通过这个过程收集有变动的fiber节点
//                 A1
//          B1              B2
//     C1      C2      C3       C4

// 收集顺序是 C1-C2-B1-C3-C4-B2-A1，收集顺序和completeUnitOfWork归档的顺序一致
function completeUnitOfWork(currentFiber) {
  let returnFiber = currentFiber.return;
  if (returnFiber) {
    // ------- 将收集到子Fiber的父Fiber的effectList链表继续挂载在祖先Fiber上
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = currentFiber.firstEffect;
    }
    if (currentFiber.lastEffect) {
      // 先将父fiber收集到的子Fiber指向到更上一级Fiber节点，
      if (returnFiber.lastEffect) {
        // 如果更上一级节点已经有EffectList， 则将当前Fiber的firstEffect拼接到已有的EffectList；
        returnFiber.lastEffect.nextEffect = currentFiber.firstEffect;
      }
      // 将父Fiber节点收集到的子Fiber节点指向祖先Fiber节点
      returnFiber.lastEffect = currentFiber.lastEffect;
    }
    // --------
    const effectTag = currentFiber.effectTag;
    // 子Fiber节点上传之后，再将当前自身Fiber节点挂载在lastEffect上
    if (effectTag) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber;
      } else {
        returnFiber.firstEffect = currentFiber;
      }
      returnFiber.lastEffect = currentFiber;
    }
  }
}
