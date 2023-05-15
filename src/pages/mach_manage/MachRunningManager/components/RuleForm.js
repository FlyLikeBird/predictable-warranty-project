import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Input,
  Button,
  message,
  Space,
  Slider,
  Divider,
  InputNumber,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';

const { Option } = Select;
function validator(a, value) {
  if (
    !value ||
    (typeof +value === 'number' && +value === +value && +value >= 0)
  ) {
    return Promise.resolve();
  } else {
    return Promise.reject('请填入合适的阈值');
  }
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
function RuleForm({
  info,
  optionType,
  currentMach,
  onUpdateRule,
  onClose,
  onDispatch,
}) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (info.warningRuleId) {
      form.setFieldsValue(info);
    } else {
      form.resetFields();
    }
  }, [info]);
  return (
    <Form
      {...layout}
      name="rule-form"
      form={form}
      onFinish={(values) => {
        new Promise((resolve, reject) => {
          if (info.warningRuleId) {
            values.warningRuleId = info.warningRuleId;
          }
          values.warningRuleType = optionType.sensorType;
          values.unitName = optionType.unitName;
          values.runtimeMetricsId = optionType.runtimeMetricsId;
          values.equipmentCode = currentMach.equipmentCode;
          onDispatch({
            type: 'alarm/addRuleAsync',
            payload: {
              values,
              resolve,
              reject,
              forEdit: info.warningRuleId ? true : false,
            },
          });
        })
          .then(() => {
            message.success(
              `${info.warningRuleId ? '更新' : '添加'}告警规则成功`,
            );
            onClose();
            new Promise((resolve, reject) => {
              onDispatch({
                type: 'mach/fetchParamRuleInfo',
                payload: {
                  resolve,
                  reject,
                  runtimeMetricsId: optionType.runtimeMetricsId,
                  equipmentCode: currentMach.equipmentCode,
                },
              });
            }).then((data) => {
              // 更新当前指标的告警规则阈值线
              onUpdateRule(data);
            });
          })
          .catch((msg) => {
            message.error(msg);
          });
      }}
    >
      <Form.Item
        name="warningRuleName"
        label="规则名称"
        rules={[{ required: true, message: '规则名称不能为空' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="warningMin"
        label="最小阈值"
        rules={[{ required: true, message: '小于设定值则触发告警' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          addonAfter={optionType.unitName || ''}
        />
      </Form.Item>
      <Form.Item
        name="warningMax"
        label="最大阈值"
        rules={[{ required: true, message: '大于设定值则触发告警' }]}
      >
        <Input
          style={{ width: '100%' }}
          addonAfter={optionType.unitName || ''}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
        <Button style={{ marginRight: '1rem' }} onClick={onClose}>
          {' '}
          取消{' '}
        </Button>
        <Button type="primary" htmlType="submit">
          {info.warningRuleId ? '更新' : '添加'}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default React.memo(RuleForm);
