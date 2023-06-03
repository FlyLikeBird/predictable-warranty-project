import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  DatePicker,
  Upload,
  Switch,
  Modal,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const phoneReg =
  /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const passwordReg =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";\'<>?,.\/]).{8,20}$/;
let msg = '密码需是包含字母/数字/特殊字符且长度8-15位的字符串';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function OrderForm({ machList, onDispatch, onClose }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [equipmentCode, setEquipmentCode] = useState('');
  const [warningList, setWarningList] = useState([]);

  useEffect(() => {
    if (equipmentCode) {
      new Promise((resolve, reject) => {
        onDispatch({
          type: 'order/fetchRelatedAlarm',
          payload: { resolve, reject, equipmentCode },
        });
      })
        .then((data) => {
          console.log(data);
          setWarningList(data);
        })
        .catch((msg) => message.error(msg));
    }
    form.setFieldValue('equipmentWarningId', null);
  }, [equipmentCode]);
  return (
    <Form
      {...layout}
      form={form}
      onFinish={(values) => {
        let machInfo = machList.filter(
          (i) => i.equipmentCode === values.equipmentCode,
        )[0];

        values.equipmentName = machInfo.equipmentName;
        values.workTicketsStatus = '0';
        values.workTicketsSource = '2';
        if (values.equipmentWarningId) {
          let warningInfo = warningList.filter(
            (i) => i.equipmentWarningId === values.equipmentWarningId,
          )[0];
          values.warningDetail = warningInfo.warningDetail;
        }
        new Promise((resolve, reject) => {
          onDispatch({
            type: 'order/addOrderAsync',
            payload: { values, resolve, reject, forEdit: false },
          });
        })
          .then(() => {
            message.success('新建工单成功');
            form.resetFields();
            onClose();
          })
          .catch((msg) => {
            message.error(msg);
          });
      }}
    >
      <Form.Item
        name="workTicketsType"
        label="工单类型"
        rules={[{ required: true, message: '请选择工单类型' }]}
      >
        <Select>
          <Option value="0">保养工单</Option>
          <Option value="1">维修工单</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="equipmentCode"
        label="关联设备"
        rules={[{ required: true, message: '关联设备不能为空' }]}
      >
        {machList && machList.length ? (
          <Select
            style={{ width: '100%' }}
            onChange={(value) => setEquipmentCode(value)}
          >
            {machList.map((item) => (
              <Option value={item.equipmentCode} key={item.equipmentCode}>
                {item.equipmentName}
              </Option>
            ))}
          </Select>
        ) : (
          <Button
            type="primary"
            onClick={() => history.push('/mach_manage/mach_manage_archive')}
          >
            请先添加设备
          </Button>
        )}
      </Form.Item>
      <Form.Item name="equipmentWarningId" label="关联告警">
        {
          <Select style={{ width: '100%' }}>
            {warningList.map((item) => (
              <Option
                value={item.equipmentWarningId}
                key={item.equipmentWarningId}
              >
                {item.warningDetail}
              </Option>
            ))}
          </Select>
        }
      </Form.Item>

      <Form.Item name="workTicketsContent" label="任务描述">
        <TextArea placeholder="请添加一些描述信息" />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
        <Button
          style={{ marginRight: '1rem' }}
          onClick={() => {
            onClose();
            form.resetFields();
          }}
        >
          取消
        </Button>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  );
}

export default React.memo(OrderForm);
