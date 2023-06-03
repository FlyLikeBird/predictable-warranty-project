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
import Icons from '../../../../public/order-icons.png';
import stepDoneIcon from '../../../../public/progress-done.png';
import stepUndoneIcon from '../../../../public/progress-undone.png';
import AvatarIcon from '../../../../public/avatar-bg.png';
import TestImg from '../../../../public/test.png';
import style from './OrderDetailInfo.css';
import IndexStyle from '@/pages/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
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
  { label: '创建时间', dataIndex: 'createTime' },
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
  const [info, setInfo] = useState({ visible: false, changedStatus: 0 });
  const [recordList, setRecordList] = useState([]);
  const [fittingList, setFittingList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const statusText =
    currentOrder.workTicketsStatus === 0
      ? '分配'
      : currentOrder.workTicketsStatus === 2
      ? '验收'
      : currentOrder.workTicketsStatus === 4
      ? '挂起'
      : '';
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
            {currentOrder.workTicketsStatus !== 4 &&
            currentOrder.workTicketsStatus !== 3 ? (
              <Button
                type="primary"
                style={{
                  border: 'none',
                  marginRight: '1rem',
                  background: '#f77234',
                }}
                onClick={() => setInfo({ visible: true, changedStatus: 4 })}
              >
                挂起
              </Button>
            ) : null}
            {currentOrder.workTicketsStatus === 2 ? (
              <Button
                onClick={() => setInfo({ visible: true, changedStatus: 1 })}
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
                onClick={() => setInfo({ visible: true, changedStatus: 1 })}
              >
                分配工单
              </Button>
            ) : currentOrder.workTicketsStatus === 2 ? (
              <Button
                type="primary"
                style={{ border: 'none', background: '#165dff' }}
                onClick={() => setInfo({ visible: true, changedStatus: 3 })}
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
          <div
            className={`${style['step-item']} ${
              currentOrder.workTicketsStatus > 1 &&
              currentOrder.workTicketsStatus !== 4
                ? style['selected']
                : ''
            }`}
            style={{
              backgroundImage: `url(${
                currentOrder.workTicketsStatus > 1 &&
                currentOrder.workTicketsStatus !== 4
                  ? stepDoneIcon
                  : stepUndoneIcon
              })`,
            }}
          >
            03 工单已完成
          </div>
          <div
            className={`${style['step-item']} ${
              currentOrder.workTicketsStatus > 2 &&
              currentOrder.workTicketsStatus !== 4
                ? style['selected']
                : ''
            }`}
            style={{
              backgroundImage: `url(${
                currentOrder.workTicketsStatus > 2 &&
                currentOrder.workTicketsStatus !== 4
                  ? stepDoneIcon
                  : stepUndoneIcon
              })`,
            }}
          >
            04 完成验收
          </div>
        </div>
        {/* 发布人和执行人 人员信息 */}
        <div style={{ height: '100px', display: 'flex' }}>
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
        </div>
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
                    style={{ width: '50%', marginBottom: '0.5rem' }}
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
                          ? currentOrder[item.dataIndex].split('T')[0]
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
                  { title: '工单编号', dataIndex: 'workTicketsId' },
                  { title: '创建时间', dataIndex: 'createTime' },
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
                            onChange(row);
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
                .sort((a, b) => b.recordId - a.recordId)
                .map((item, index) => (
                  <Timeline.Item key={item.recordId}>
                    <div className={style['timeline-item']}>
                      <div className={style['timeline-item-head']}>
                        <div>
                          {item.workTicketsStatus === 4
                            ? '挂起中'
                            : item.recordContent}
                        </div>
                        <div>{item.createTime}</div>
                      </div>
                      <div className={style['timeline-item-content']}>
                        <div style={{ color: '#000' }}>
                          {item.workTicketsContent}
                        </div>
                        <div>
                          {item.photos && item.photos.length
                            ? item.photos.map((item) => (
                                <div className={style['img-wrapper']}>
                                  <img src={TestImg} />
                                  <div className={style['img-wrapper-mask']}>
                                    <EyeOutlined
                                      onClick={() => setImg('test')}
                                    />
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
        onCancel={() => setInfo({ visible: false })}
        title={statusText + '工单'}
        footer={null}
      >
        <Form
          form={form}
          {...layout}
          onFinish={(values) => {
            // console.log(values);
            let userInfo = userList.filter(
              (i) => i.userId === values.equipmentHeadId,
            )[0];
            let obj;
            if (currentOrder.workTicketsStatus === 0) {
              obj = {
                workTicketsId: currentOrder.workTicketsId,
                workTicketsStatus: 1,
                workTicketsContent: values.workTicketsContent,
                equipmentHeadId: values.equipmentHeadId,
                equipmentHeadName: userInfo.userName,
                predictedFinishTime: values.predictedFinishTime.format(
                  'YYYY-MM-DD 00:00:00',
                ),
              };
            } else {
              obj = {
                workTicketsId: currentOrder.workTicketsId,
                workTicketsStatus: info.changedStatus,
                workTicketsContent: values.workTicketsContent,
              };
              if (info.changedStatus === 3) {
                obj.assessment = values.assessment;
              }
            }
            new Promise((resolve, reject) => {
              onDispatch({
                type: 'order/addOrderAsync',
                payload: { values: obj, resolve, reject, forEdit: true },
              });
            })
              .then(() => {
                message.success(statusText + '工单成功');
                setInfo({ visible: false });
                form.resetFields();
                onClose();
              })
              .catch((msg) => message.error(msg));
          }}
        >
          {currentOrder.workTicketsStatus === 0 ? (
            <Form.Item
              name="equipmentHeadId"
              label="指定对象"
              rules={[{ required: true, message: '请指定要分配的对象' }]}
            >
              <Select style={{ width: '100%' }}>
                {userList
                  .filter((i) => i.userId != userId)
                  .map((item) => (
                    <Option value={item.userId} key={item.userId}>
                      {item.userName}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          ) : null}
          {currentOrder.workTicketsStatus === 0 ? (
            <Form.Item
              name="predictedFinishTime"
              label="建议完成时间"
              rules={[{ required: true, message: '时间不能为空' }]}
            >
              <DatePicker locale={zhCN} style={{ width: '100%' }} />
            </Form.Item>
          ) : null}
          {info.changedStatus === 3 ? (
            <Form.Item
              name="assessment"
              label="评分"
              rules={[{ required: true, message: '请给工单一个评分' }]}
            >
              <Rate />
            </Form.Item>
          ) : null}
          <Form.Item name="workTicketsContent" label="备注">
            <TextArea placeholder="请添加一些描述信息" />
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
            <Button
              style={{ marginRight: '1rem' }}
              onClick={() => setInfo({ visible: false })}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              {statusText}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* 预览图片 */}
      <Modal
        open={img ? true : false}
        footer={null}
        bodyStyle={{ padding: '0' }}
        onCancel={() => setImg('')}
      >
        <div style={{ position: 'relative' }}>
          <img src={TestImg} />
        </div>
      </Modal>
    </>
  );
}

export default OrderDetailInfo;
