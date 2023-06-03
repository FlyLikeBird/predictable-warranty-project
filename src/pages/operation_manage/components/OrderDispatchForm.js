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

function OrderForm({ machList, info, onDispatch, onClose }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    if (info.forEdit && info.current) {
      let { user_name, phone, email, role_id, is_actived } = info.current;
      form.setFieldsValue({
        user_name,
        phone,
        email,
        role_id,
        is_actived: is_actived ? true : false,
      });
    }
  }, []);
  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };
  const handleBeforeUpload = (file) => {
    // const isJPG = file.type === 'image/jpeg';
    // const isJPEG = file.type === 'image/jpeg';
    // const isGIF = file.type === 'image/gif';
    // const isPNG = file.type === 'image/png';
    // if (!(isJPG || isJPEG || isGIF || isPNG)) {
    //     message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片')
    // }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('附件不能超过5M');
    }
    return false;
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">上传附件</div>
    </div>
  );
  const disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };
  return (
    <Form
      {...layout}
      form={form}
      onFinish={(values) => {
        let machInfo = machList.filter(
          (i) => i.equipmentCode === values.equipmentCode,
        )[0];
        let userInfo = userList.filter((i) => i.userId === values.userId)[0];
        values.equipmentHeadName = userInfo.userName;
        values.equipmentName = machInfo.equipmentName;
        values.predictedFinishTime =
          values.predictedFinishTime.format('YYYY-MM-DD');
        if (fileList.length) {
          values.fileList = fileList.map((i) => (i.size ? i.originFileObj : i));
        }
        new Promise((resolve, reject) => {
          onDispatch({
            type: 'order/addOrderAsync',
            payload: { values, resolve, reject, forEdit: info.forEdit },
          });
        })
          .then(() => {
            message.success(forEdit ? '编辑用户成功' : '添加用户成功');
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
          <Select style={{ width: '100%' }}>
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
      {/* <Form.Item name='real_name' label="关联告警" rules={[{ required: true, message:'请填入您的真实姓名' }]}>
                  <Input />
                </Form.Item> */}

      <Form.Item
        name="predictedFinishTime"
        label="预计完成时间"
        rules={[{ required: true, message: '请选择完成日期' }]}
      >
        <DatePicker
          style={{ width: '100%' }}
          locale={zhCN}
          disabledDate={disabledDate}
          allowClear={false}
        />
      </Form.Item>

      <Form.Item
        name="equipmentHeadId"
        label="指派人员"
        rules={[{ required: true, message: '请指派人员' }]}
      >
        <Select style={{ width: '100%' }}>
          {userList.map((item) => (
            <Option key={item.userId} value={item.userId}>
              {item.realName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="workTicketsContent"
        label="任务描述"
        rules={[{ required: true, message: '请添加一些描述' }]}
      >
        <TextArea placeholder="请添加一些描述信息" />
      </Form.Item>
      <Form.Item label="附件" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          onPreview={() => {}}
          beforeUpload={handleBeforeUpload}
        >
          {fileList.length === 1 ? null : uploadButton}
        </Upload>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
        <Button style={{ marginRight: '1rem' }} onClick={onClose}>
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
