import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Table,
  Button,
  Card,
  Modal,
  Select,
  Spin,
  Switch,
  message,
  Popconfirm,
  Drawer,
  Form,
  Input,
} from 'antd';
import {
  FireOutlined,
  DownloadOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import TableSelector from './components/TableSelector';
import OrderDetailInfo from '../operation_manage/components/OrderDetailInfo';
import style from '../IndexPage.css';

const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function AlarmList({ dispatch, user, alarm, order, mach }) {
  let { companyList, currentCompany, userInfo, authorized } = user;
  let { alarmList, sensorTypes, statusMaps, currentPage, total } = alarm;
  const { orderTypeMaps, orderStatusMaps, orderSourceMaps } = order;
  let [info, setInfo] = useState({});
  let [currentOrder, setCurrentOrder] = useState({});
  let [form] = Form.useForm();
  useEffect(() => {
    if (authorized) {
      dispatch({ type: 'user/toggleTimeType', payload: '2' });
      dispatch({ type: 'alarm/fetchAlarmList' });
      dispatch({ type: 'mach/fetchMachList' });
    }
  }, [authorized]);
  useEffect(() => {
    return () => {
      dispatch({ type: 'alarm/reset' });
    };
  }, []);
  const columns = [
    {
      title: '序号',
      width: '60px',
      fixed: 'left',
      render: (text, record, index) => {
        return `${(currentPage - 1) * 12 + index + 1}`;
      },
    },
    { title: '设备名称', dataIndex: 'equipmentName' },
    // { title:'告警等级(1级为最高)', dataIndex:'level' },
    {
      title: '告警等级',
      dataIndex: 'warningType',
      render: (value) => <span>{value === 1 ? '告警' : '预警'}</span>,
    },
    {
      title: '告警类型',
      dataIndex: 'equipmentWarningRuleInfo',
      render: (obj) => {
        let info = sensorTypes.filter((i) => i.key === obj.warningRuleType)[0];
        return <span>{info.title}</span>;
      },
    },
    { title: '告警详情', dataIndex: 'warningDetail' },
    {
      title: '处理状态',
      dataIndex: 'status',
      render: (value) => (
        <span style={{ color: '#1890ff' }}>{statusMaps[value] || ''}</span>
      ),
    },
    { title: '告警时间', dataIndex: 'createTime' },
    {
      title: '操作',
      render: (row) => {
        return (
          <>
            {row.status === 1 ? (
              <a
                onClick={() => {
                  // 获取跟当前告警关联的工单信息
                  new Promise((resolve, reject) => {
                    dispatch({
                      type: 'order/fetchOrderDetail',
                      payload: { resolve, reject, id: row.workTicketsId },
                    });
                  })
                    .then((data) => {
                      console.log(data);
                      setCurrentOrder(data);
                    })
                    .catch((msg) => message.error(msg));
                }}
              >
                查看工单
              </a>
            ) : (
              <a onClick={() => setInfo(row)}>
                {row.status === 0 ? '操作' : '查看告警'}
              </a>
            )}
          </>
        );
      },
    },
  ];
  const handleSearch = useCallback((obj) => {
    dispatch({ type: 'alarm/setOptional', payload: obj });
    dispatch({ type: 'alarm/fetchAlarmList' });
  }, []);
  useEffect(() => {
    if (info.equipmentWarningId) {
      if (info.status === 3) {
        form.setFieldValue('workTicketsContent', info.cancellationDescription);
      }
    }
  }, [info]);
  return (
    <>
      <div style={{ height: '90px' }}>
        <TableSelector machList={mach.list} onSearch={handleSearch} />
      </div>
      <div style={{ height: 'calc( 100% - 90px)', paddingTop: '1rem' }}>
        <div className={style['card-container']}>
          <Table
            className={style['self-table-container']}
            columns={columns}
            dataSource={alarmList}
            locale={{
              emptyText: <div style={{ margin: '1rem 0' }}>还没有告警记录</div>,
            }}
            bordered={true}
            rowKey="equipmentWarningId"
            pagination={{
              current: currentPage,
              total,
              pageSize: 12,
              showSizeChanger: false,
            }}
            onChange={(pagination) => {
              dispatch({
                type: 'alarm/fetchAlarmList',
                payload: { currentPage: pagination.current },
              });
            }}
          />
          <Modal
            title={info.status === 0 ? '处理告警' : '查看告警'}
            open={Object.keys(info).length ? true : false}
            footer={null}
            width="40%"
            bodyStyle={{ padding: '40px' }}
            closable={false}
            className={style['modal-container']}
            onCancel={() => setInfo({})}
          >
            <Form {...layout} form={form}>
              <Form.Item
                name="workTicketsContent"
                label="备注"
                rules={[{ required: true, message: '请添加一些描述' }]}
              >
                <TextArea
                  placeholder="请添加一些描述信息"
                  disabled={info.status === 0 ? false : true}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                <Button
                  style={{ marginRight: '1rem' }}
                  onClick={() => {
                    setInfo({});
                    form.resetFields();
                  }}
                >
                  取消
                </Button>
                {info.status === 0 ? (
                  <Button
                    type="primary"
                    style={{ marginRight: '1rem' }}
                    onClick={() => {
                      form.validateFields().then((values) => {
                        new Promise((resolve, reject) => {
                          dispatch({
                            type: 'alarm/updateAlarmAsync',
                            payload: {
                              values: {
                                equipmentWarningId: info.equipmentWarningId,
                                status: 3,
                                cancellationDescription:
                                  values.workTicketsContent,
                              },
                              resolve,
                              reject,
                            },
                          });
                        })
                          .then(() => {
                            message.success('告警消警成功');
                            setInfo({});
                          })
                          .catch((msg) => message.error(msg));
                      });
                    }}
                  >
                    消警
                  </Button>
                ) : null}
                {info.status === 0 ? (
                  <Button
                    type="primary"
                    onClick={() => {
                      form.validateFields().then((values) => {
                        values.workTicketsType = '1';
                        values.workTicketsStatus = '0';
                        values.workTicketsSource = '1';
                        values.equipmentName = info.equipmentName;
                        values.equipmentCode = info.equipmentCode;
                        values.warningDetail = info.warningDetail;
                        values.equipmentWarningId = info.equipmentWarningId;

                        new Promise((resolve, reject) => {
                          dispatch({
                            type: 'order/addOrderAsync',
                            payload: {
                              values,
                              resolve,
                              reject,
                              forEdit: false,
                            },
                          });
                        })
                          .then(() => {
                            message.success('告警转工单成功');
                            form.resetFields();
                            setInfo({});
                            dispatch({ type: 'alarm/fetchAlarmList' });
                          })
                          .catch((msg) => {
                            message.error(msg);
                          });
                      });
                    }}
                  >
                    转工单
                  </Button>
                ) : null}
              </Form.Item>
            </Form>
          </Modal>
          <Drawer
            width="50%"
            open={Object.keys(currentOrder).length ? true : false}
            onClose={() => setCurrentOrder({})}
            closable={false}
            headerStyle={{ display: 'none' }}
            bodyStyle={{ padding: '0' }}
          >
            <OrderDetailInfo
              onDispatch={(action) => dispatch(action)}
              currentOrder={currentOrder}
              orderTypeMaps={orderTypeMaps}
              orderStatusMaps={orderStatusMaps}
              orderSourceMaps={orderSourceMaps}
              userList={[]}
              userId={userInfo.userId}
              onClose={() => setCurrentOrder({})}
              onChange={(obj) => setCurrentOrder(obj)}
            />
          </Drawer>
        </div>
      </div>
    </>
  );
}

export default connect(({ user, alarm, order, mach }) => ({
  user,
  alarm,
  order,
  mach,
}))(AlarmList);
