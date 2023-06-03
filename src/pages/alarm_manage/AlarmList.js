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
import style from '../IndexPage.css';

const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function AlarmList({ dispatch, user, alarm, mach }) {
  let { companyList, currentCompany, authorized } = user;
  let { alarmList, currentPage, total } = alarm;
  let [info, setInfo] = useState({});
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
      title: '告警类型',
      dataIndex: 'warningRuleType',
      render: (value) => <span>{value === 1 ? '告警' : '预警'}</span>,
    },
    { title: '告警详情', dataIndex: 'warningDetail' },
    {
      title: '处理状态',
      dataIndex: 'status',
      render: (value) => (
        <span style={{ color: '#1890ff' }}>
          {value ? '已转维修工单' : '未处理'}
        </span>
      ),
    },
    { title: '告警时间', dataIndex: 'createTime' },
    {
      title: '操作',
      render: (row) => {
        return (
          <>
            {row.status === 1 ? (
              <a>查看</a>
            ) : (
              <a onClick={() => setInfo(row)}>操作</a>
            )}
            {/* <Popconfirm 
                            title="确定删除此条告警吗?" 
                            onText="确定" 
                            cancelText="取消" 
                            onConfirm={()=>{
                                new Promise((resolve, reject)=>{
                                    dispatch({ type:'alarm/delRulesAsync', payload:{ ruleId:row.warningRuleId }})
                                })
                                .then(()=>{
                                    message.success(`删除${row.warningRuleName}规则成功`)
                                })
                                .catch(msg=>message.error(msg));
                            }}
                        >
                            <a>删除</a>
                        </Popconfirm> */}
          </>
        );
      },
    },
  ];
  const handleSearch = useCallback((obj) => {
    dispatch({ type: 'alarm/setOptional', payload: obj });
    dispatch({ type: 'alarm/fetchAlarmList' });
  }, []);

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
            title="处理告警"
            open={Object.keys(info).length ? true : false}
            footer={null}
            width="40%"
            bodyStyle={{ padding: '40px' }}
            closable={false}
            className={style['modal-container']}
            onCancel={() => setInfo({})}
          >
            <Form
              {...layout}
              form={form}
              onFinish={(values) => {
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
                    payload: { values, resolve, reject, forEdit: false },
                  });
                })
                  .then(() => {
                    message.success('新建工单成功');
                    form.resetFields();
                    setInfo({});
                    dispatch({ type: 'alarm/fetchAlarmList' });
                  })
                  .catch((msg) => {
                    message.error(msg);
                  });
              }}
            >
              <Form.Item name="workTicketsContent" label="备注">
                <TextArea placeholder="请添加一些描述信息" />
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
                <Button type="primary" htmlType="submit">
                  转工单
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default connect(({ user, alarm, mach }) => ({ user, alarm, mach }))(
  AlarmList,
);
