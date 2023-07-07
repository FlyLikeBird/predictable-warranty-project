import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Table,
  Input,
  Rate,
  Select,
  Form,
  DatePicker,
  Timeline,
  Tag,
  message,
} from 'antd';
import { EyeOutlined, createFromIconfontCN } from '@ant-design/icons';
import DispatchOrderForm from './DispatchOrderForm';
import stepDoneIcon from '../../../../public/progress-done.png';
import stepUndoneIcon from '../../../../public/progress-undone.png';
import stepRejectIcon from '../../../../public/progress-reject.png';
import AvatarIcon from '../../../../public/avatar-bg.png';
import style from './OrderDetailInfo.css';
import IndexStyle from '@/pages/IndexPage.css';

const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
let timer = null;
const roleMaps = {
  0: '发布人',
  1: '派发人',
  2: '执行人',
  3: '验收人',
};
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_2314993_uvvxb10za8l.js',
});

let fieldList = [
  { label: '设备名称', dataIndex: 'equipmentName' },
  { label: '创建时间', dataIndex: 'createTime', isTime: true },
  { label: '预计完成时间', dataIndex: 'predictedFinishTime', isTime: true },
  { label: '实际完成时间', dataIndex: 'actualFinishTime', isTime: true },
  { label: '工单来源', dataIndex: 'workTicketsSource', isSource: true },
  { label: '关联告警', dataIndex: 'equipmentWarningId' },
  { label: '执行时长', dataIndex: '' },
  { label: '人员工时', dataIndex: '' },
  { label: '工时成本', dataIndex: '' },
  { label: '备件成本', dataIndex: '' },
  { label: '工单评价', dataIndex: 'assessment', isSymbol: true },
];
function OrderDetailInfo({
  currentOrder,
  orderTypeMaps,
  orderStatusMaps,
  orderSourceMaps,
  userList,
  userId,
  onDispatch,
  onChange,
  onClose,
}) {
  const [form] = Form.useForm();
  const [img, setImg] = useState('');
  const [info, setInfo] = useState({ visible: false, status: 0 });
  const [recordList, setRecordList] = useState([]);
  const [fittingList, setFittingList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const statusText =
    info.status === 0
      ? '分配'
      : info.status === 2
      ? '验收'
      : info.status === 4
      ? '挂起'
      : info.status === 5
      ? '驳回'
      : '';
  let config = window.g;
  useEffect(() => {
    return () => {
      clearTimeout(timer);
      timer = null;
    };
  }, []);
  useEffect(() => {
    // 获取工单的备件记录和历史记录
    if (currentOrder.workTicketsId) {
      new Promise((resolve, reject) => {
        onDispatch({
          type: 'order/fetchOrderRecords',
          payload: {
            resolve,
            reject,
            workTicketsId: currentOrder.workTicketsId,
          },
        });
      })
        .then((data) => {
          setRecordList(data);
        })
        .catch((msg) => message.error(msg));
      new Promise((resolve, reject) => {
        onDispatch({
          type: 'order/fetchOrderFitting',
          payload: {
            resolve,
            reject,
            workTicketsId: currentOrder.workTicketsId,
          },
        });
      })
        .then((data) => {
          setFittingList(data);
        })
        .catch((msg) => message.error(msg));
      new Promise((resolve, reject) => {
        onDispatch({
          type: 'order/fetchOrderHistoryList',
          payload: {
            resolve,
            reject,
            equipmentCode: currentOrder.equipmentCode,
          },
        });
      })
        .then((data) => {
          setHistoryList(data);
        })
        .catch((msg) => message.error(msg));
    }
  }, [currentOrder]);
  return (
    <>
      <div style={{ height: '100%', padding: '2rem' }}>
        {/* 工单标题 */}
        <div
          style={{
            height: '60px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                lineHeight: '50px',
                textAlign: 'center',
                borderRadius: '4px',
                marginRight: '1rem',
                backgroundColor:
                  orderTypeMaps[currentOrder.workTicketsType] &&
                  orderTypeMaps[currentOrder.workTicketsType].color,
              }}
            >
              <IconFont
                type={
                  currentOrder.workTicketsType === 1
                    ? 'iconfix'
                    : 'iconmaintain'
                }
                style={{ lineHeight: '54px', fontSize: '2rem', color: '#fff' }}
              />
            </div>
            <div>
              <div>
                <span style={{ fontWeight: 'bold', marginRight: '4px' }}>
                  {(orderTypeMaps[currentOrder.workTicketsType] &&
                    orderTypeMaps[currentOrder.workTicketsType].text) + '工单'}
                </span>
                <Tag
                  color={
                    orderStatusMaps[currentOrder.workTicketsStatus] &&
                    orderStatusMaps[currentOrder.workTicketsStatus].color
                  }
                >
                  {orderStatusMaps[currentOrder.workTicketsStatus] &&
                    orderStatusMaps[currentOrder.workTicketsStatus].text}
                </Tag>
              </div>
              <div>工单编号: {currentOrder.workTicketsId}</div>
            </div>
          </div>
          <div>
            {currentOrder.workTicketsStatus === 1 ||
            currentOrder.workTicketsStatus === 2 ||
            currentOrder.workTicketsStatus === 5 ? (
              <Button
                type="primary"
                style={{
                  border: 'none',
                  marginRight: '1rem',
                  background: '#f77234',
                }}
                onClick={() => setInfo({ visible: true, status: 4 })}
              >
                挂起
              </Button>
            ) : null}
            {currentOrder.workTicketsStatus === 2 ? (
              <Button
                onClick={() => setInfo({ visible: true, status: 5 })}
                style={{ marginRight: '0.5rem' }}
              >
                驳回
              </Button>
            ) : null}
            {currentOrder.workTicketsStatus === 0 ? (
              <Button
                type="primary"
                style={{
                  border: 'none',
                  background: '#165dff',
                  marginRight: '0.5rem',
                }}
                onClick={() => setInfo({ visible: true, status: 0 })}
              >
                分配工单
              </Button>
            ) : currentOrder.workTicketsStatus === 2 ? (
              <Button
                type="primary"
                style={{ border: 'none', background: '#165dff' }}
                onClick={() => setInfo({ visible: true, status: 2 })}
              >
                验收通过
              </Button>
            ) : null}
          </div>
        </div>
        {/* 工单进度条 */}
        <div className={style['step-container']}>
          <div
            className={style['step-item'] + ' ' + style['selected']}
            style={{ backgroundImage: `url(${stepDoneIcon})` }}
          >
            01 创建工单
          </div>
          {/* 驳回工单回退到上一步，显示驳回状态 */}
          {currentOrder.workTicketsStatus === 5 ? (
            <div
              className={`${style['step-item']} ${style['selected']}`}
              style={{
                backgroundImage: `url(${stepRejectIcon})`,
              }}
            >
              02 验收未通过
            </div>
          ) : (
            <div
              className={`${style['step-item']} ${
                currentOrder.workTicketsStatus > 0 ? style['selected'] : ''
              }`}
              style={{
                backgroundImage: `url(${
                  currentOrder.workTicketsStatus > 0
                    ? stepDoneIcon
                    : stepUndoneIcon
                })`,
              }}
            >
              02 工单执行
            </div>
          )}

          <div
            className={`${style['step-item']} ${
              currentOrder.workTicketsStatus === 2 ||
              currentOrder.workTicketsStatus === 3
                ? style['selected']
                : ''
            }`}
            style={{
              backgroundImage: `url(${
                currentOrder.workTicketsStatus === 2 ||
                currentOrder.workTicketsStatus === 3
                  ? stepDoneIcon
                  : stepUndoneIcon
              })`,
            }}
          >
            03 提交验收
          </div>
          <div
            className={`${style['step-item']} ${
              currentOrder.workTicketsStatus === 3 ? style['selected'] : ''
            }`}
            style={{
              backgroundImage: `url(${
                currentOrder.workTicketsStatus === 3
                  ? stepDoneIcon
                  : stepUndoneIcon
              })`,
            }}
          >
            04 完成验收
          </div>
        </div>
        {/* 发布人和执行人 人员信息 */}
        {/* <div style={{ height: '100px', display: 'flex' }}>
                    {recordList.map((item) => (
                        <div style={{ width: '25%' }} key={item.recordId}>
                            <div style={{ margin: '0.5rem 0' }}>
                                {roleMaps[item.workTicketsStatus] || '执行人'}
                            </div>
                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <div style={{ marginRight: '1rem' }}>
                                    <img src={AvatarIcon} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{item.operatorName}</div>
                                    <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>厂务部主管</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}
        {/* 工单详细信息和历史记录 */}
        <div
          style={{
            height: 'calc( 100% - 190px)',
            borderTop: '1px solid #e9eaee',
          }}
        >
          {/* 左边栏 */}
          <div
            style={{
              display: 'inline-block',
              verticalAlign: 'top',
              width: '60%',
              height: '100%',
              borderRight: '1px solid #e9eaee',
              paddingTop: '1rem',
            }}
          >
            {/* 工单信息 */}
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                工单信息
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {fieldList.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      width: '50%',
                      marginBottom: '0.5rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(0, 0, 0, 0.45)',
                        marginRight: '0.5rem',
                      }}
                    >
                      {item.label}
                    </span>
                    {item.isSymbol ? (
                      <Rate
                        disabled
                        value={currentOrder[item.dataIndex] || 0}
                      />
                    ) : (
                      <span style={{ color: '#000' }}>
                        {item.isSource
                          ? orderSourceMaps[currentOrder[item.dataIndex]]
                          : item.isTime && currentOrder[item.dataIndex]
                          ? currentOrder[item.dataIndex].replace('T', ' ')
                          : currentOrder[item.dataIndex] || '--'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* 备件记录 */}
            <div>
              <div style={{ fontWeight: 'bold', margin: '1rem 0' }}>
                备件记录
              </div>
              <Table
                className={IndexStyle['self-table-container']}
                style={{ padding: '0' }}
                columns={[
                  { title: '配件编号' },
                  { title: '配件类型' },
                  { title: '数量' },
                  { title: '操作' },
                ]}
                dataSource={fittingList}
                pagination={{
                  position: ['none', 'bottomLeft'],
                  size: 'small',
                  pageSize: 12,
                  showSizeChanger: false,
                }}
                // onChange={(pagination) => {
                //     new Promise((resolve, reject)=>{
                //         onDispatch({ type:'order/fetchOrderHistoryList', payload:{ resolve, reject, equipmentCode:currentOrder.equipmentCode, currentPage:pagination.current }})
                //     })
                //     .then((data)=>{
                //         setHistoryList(data);
                //     })
                //     .catch(msg=>message.error(msg));
                // }}
              />
            </div>
            {/* 工单记录 */}
            <div>
              <div style={{ fontWeight: 'bold', margin: '1rem 0' }}>
                设备历史工单记录
              </div>
              <Table
                className={IndexStyle['self-table-container']}
                style={{ padding: '0' }}
                columns={[
                  {
                    title: '工单编号',
                    dataIndex: 'workTicketsId',
                    render: (value) => (
                      <span>
                        {value}
                        {currentOrder.workTicketsId === value ? (
                          <Tag color="blue">当前</Tag>
                        ) : null}
                      </span>
                    ),
                  },
                  {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    render: (value) => <span>{value.replace('T', ' ')}</span>,
                  },
                  {
                    title: '执行人',
                    dataIndex: 'equipmentHeadName',
                    render: (value) => <span>{value || '--'}</span>,
                  },
                  {
                    title: '操作',
                    render: (row) => (
                      <a
                        onClick={() => {
                          if (
                            row.workTicketsId !== currentOrder.workTicketsId
                          ) {
                            onChange({});
                            timer = setTimeout(() => {
                              // console.log(row);
                              onChange(row);
                            }, 500);
                          }
                        }}
                      >
                        详情
                      </a>
                    ),
                  },
                ]}
                dataSource={historyList}
                pagination={{
                  position: ['none', 'bottomLeft'],
                  size: 'small',
                  pageSize: 12,
                  showSizeChanger: false,
                }}
                onChange={(pagination) => {
                  new Promise((resolve, reject) => {
                    onDispatch({
                      type: 'order/fetchOrderHistoryList',
                      payload: {
                        resolve,
                        reject,
                        equipmentCode: currentOrder.equipmentCode,
                        currentPage: pagination.current,
                      },
                    });
                  })
                    .then((data) => {
                      setHistoryList(data);
                    })
                    .catch((msg) => message.error(msg));
                }}
              />
            </div>
          </div>
          {/* 右边栏 */}
          <div
            style={{
              display: 'inline-block',
              verticalAlign: 'top',
              width: '40%',
              height: '100%',
              padding: '1rem',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
              流程记录
            </div>
            <Timeline className={style['custom-timeline']}>
              {recordList
                .concat()
                .sort((a, b) => b.recordId - a.recordId)
                .map((item, index) => (
                  <Timeline.Item
                    key={item.recordId}
                    color={
                      item.workTicketsStatus === 4
                        ? 'gray'
                        : item.workTicketsStatus === 3
                        ? 'green'
                        : item.workTicketsStatus === 5
                        ? 'red'
                        : 'blue'
                    }
                  >
                    <div className={style['timeline-item']}>
                      <div className={style['timeline-item-head']}>
                        <div>
                          {item.workTicketsStatus === 4
                            ? '挂起中'
                            : item.recordContent}
                        </div>
                        <div>{item.createTime.replace('T', ' ')}</div>
                      </div>
                      <div className={style['timeline-item-content']}>
                        <div style={{ color: '#000' }}>
                          {item.workTicketsContent}
                        </div>
                        <div>
                          {item.fileList && item.fileList.length
                            ? item.fileList.map((item) => (
                                <div
                                  className={style['img-wrapper']}
                                  // style={{ backgroundImage:`url(https://${config.apiHost}/upload/getFileByPath?filePath=${item})` }}
                                >
                                  <img
                                    src={`https://${config.apiHost}/upload/getFileByPath?filePath=${item}`}
                                  />
                                  <div className={style['img-wrapper-mask']}>
                                    <EyeOutlined onClick={() => setImg(item)} />
                                  </div>
                                </div>
                              ))
                            : null}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            marginRight: '0.5rem',
                            backgroundImage: `url(${AvatarIcon})`,
                            backgroundSize: 'cover',
                          }}
                        ></div>
                        <div
                          style={{
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        >
                          {item.operatorName}
                        </div>
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
            </Timeline>
          </div>
        </div>
      </div>
      {/* 分配订单 */}
      <Modal
        open={info.visible}
        width={580}
        onCancel={() => setInfo({ visible: false })}
        title={statusText + '工单'}
        footer={null}
      >
        <DispatchOrderForm
          info={info}
          statusText={statusText}
          currentOrder={currentOrder}
          userList={userList}
          userId={userId}
          onDispatch={onDispatch}
          onClose={onClose}
          onReset={() => setInfo({ visible: false })}
        />
      </Modal>
      {/* 预览图片 */}
      <Modal
        open={img ? true : false}
        footer={null}
        bodyStyle={{ padding: '0' }}
        onCancel={() => setImg('')}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={`https://${config.apiHost}/upload/getFileByPath?filePath=${img}`}
          />
        </div>
      </Modal>
    </>
  );
}

export default OrderDetailInfo;
