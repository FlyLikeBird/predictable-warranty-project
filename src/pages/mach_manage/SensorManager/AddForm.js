import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Input, Select, DatePicker, Upload, InputNumber, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
function AddForm({ userList, info, onClose, onDispatch }){
    const [form] = Form.useForm();
    useEffect(()=>{
        if ( info.forEdit ) {
            form.setFieldsValue(info.current);
        } else {
            form.resetFields();
        }
    },[info])
    return (
        
        <Form form={form} { ...layout }>
                
            <Form.Item label='传感器编码' name='sensorCode' rules={[{ required: true, message:'该字段不能为空' }]}>
                <Input />
            </Form.Item>
        
        
            <Form.Item label='传感器名称' name='sensorName' rules={[{ required: true, message:'该字段不能为空' }]}>
                <Input />                               
            </Form.Item>
        
        
            <Form.Item label='传感器型号' name='sensorModel' rules={[{ required: true, message:'该字段不能为空' }]}>
                <Select>
                    <Option value='A'>A型</Option>
                    <Option value='B'>B型</Option>
                </Select>                               
            </Form.Item>
        
        
            <Form.Item label='传感器类型' name='sensorType' rules={[{ required: true, message:'该字段不能为空' }]}>
                <Select>
                    <Option value={0}>电表</Option>
                    <Option value={1}>震动</Option>
                    <Option value={2}>温度</Option>
                </Select>                               
            </Form.Item>
        
        
            <Form.Item label='采用标准' name='sensorCriteria' rules={[{ required: true, message:'该字段不能为空' }]}>
                <Select>
                    <Option value='typeA'>A协议</Option>
                    <Option value='typeB'>B协议</Option>
                </Select>
            </Form.Item>
                
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                <Button onClick={onClose} style={{ marginRight:'1rem' }}>取消</Button>
                <Button type='primary' onClick={()=>{
                    form.validateFields()
                    .then(values=>{
                        new Promise((resolve, reject)=>{
                            onDispatch({ type:'mach/addSensorAsync', payload:{ values, resolve, reject, forEdit:info.forEdit }})
                        })
                        .then(()=>{
                            message.success(`${ info.forEdit ? '更新' : '添加'}传感器成功`);
                            onClose();
                            form.resetFields();
                        })
                        .catch(msg=>message.error(msg))
                    })
                }}>{ info.forEdit ? '更新传感器' : '添加传感器' }</Button>
            </Form.Item>
                
        </Form>
        
    )
}

export default AddForm;