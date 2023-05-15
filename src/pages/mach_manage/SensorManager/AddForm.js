import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Select,
  DatePicker,
  Upload,
  InputNumber,
  message,
} from 'antd';
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import SiderMenu from '@ant-design/pro-layout/lib/components/SiderMenu/SiderMenu';
const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
function AddForm({
  userList,
  info,
  onClose,
  onDispatch,
  sensorTypes,
  sensorModelMaps,
}) {
  const [form] = Form.useForm();
  const [sensorType, setSensorType] = useState(null);
  const [modelList, setModelList] = useState([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    let arr = sensorModelMaps[sensorType] || [];
    setModelList(arr);
    form.setFieldValue('sensorModel', null);
    setValue('');
  }, [sensorType]);
  useEffect(() => {
    if (info.forEdit) {
      let { sensorType } = info.current;
      let arr = sensorModelMaps[sensorType] || [];
      setModelList(arr);
      form.setFieldsValue(info.current);
    } else {
      form.resetFields();
    }
  }, [info]);
  return (
    <Form form={form} {...layout}>
      <Form.Item label="网关码" name="gateWayCode">
        <Input />
      </Form.Item>
      <Form.Item
        label="传感器类型"
        name="sensorType"
        rules={[{ required: true, message: '传感器类型不能为空' }]}
      >
        <Select onChange={(value) => setSensorType(value)}>
          {sensorTypes.map((item) => (
            <Option key={item.key} value={item.key}>
              {item.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="传感器型号"
        name="sensorModel"
        rules={[{ required: true, message: '传感器型号不能为空' }]}
      >
        <Select
          dropdownRender={(menu) => (
            <>
              {menu}
              <div
                style={{
                  display: 'flex',
                  margin: '8px 0',
                  padding: '0.5rem 1rem',
                }}
              >
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  allowClear={{
                    clearIcon: (
                      <CloseCircleOutlined
                        onClick={() => {
                          let arr = sensorModelMaps[sensorType] || [];
                          setModelList(arr);
                          setValue('');
                        }}
                      />
                    ),
                  }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    let arr = modelList.filter((i) =>
                      i.modelDesc.includes(value),
                    );
                    setModelList(arr);
                  }}
                >
                  搜索
                </Button>
              </div>
            </>
          )}
        >
          {modelList.map((item) => (
            <Option key={item.modelName} value={item.modelName}>
              {item.modelDesc}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="传感器编码"
        name="sensorCode"
        rules={[{ required: true, message: '传感器编码不能为空' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="传感器名称"
        name="sensorName"
        rules={[{ required: true, message: '传感器名称不能为空' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="采用标准" name="sensorCriteria">
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
        <Button onClick={onClose} style={{ marginRight: '1rem' }}>
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            form.validateFields().then((values) => {
              // console.log(values);
              new Promise((resolve, reject) => {
                onDispatch({
                  type: 'mach/addSensorAsync',
                  payload: { values, resolve, reject, forEdit: info.forEdit },
                });
              })
                .then(() => {
                  message.success(
                    `${info.forEdit ? '更新' : '添加'}传感器成功`,
                  );
                  onClose();
                  form.resetFields();
                })
                .catch((msg) => message.error(msg));
            });
          }}
        >
          {info.forEdit ? '更新传感器' : '添加传感器'}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AddForm;
