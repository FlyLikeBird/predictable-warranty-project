import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, InputNumber, Radio, message } from 'antd';
import style from '@/pages/IndexPage.css';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
};

function FeeRateManager({ dispatch, user, billing }){
    const { authorized, userInfo, currentCompany } = user;
    const { rateInfo } = billing;
    const [form] = Form.useForm();
    
    useEffect(()=>{
        if ( authorized ) {
            dispatch({ type:'billing/fetchRateInfo'});
        }
    },[authorized])
    useEffect(()=>{
        if ( rateInfo ){
            form.setFieldsValue({ ...rateInfo });
        }
    },[rateInfo])
    return (
            <div className={style['card-container']}>
                <div className={style['card-title']}>费率设置</div>
                <div className={style['card-content']}>
                    {/* <Form
                        { ...layout }
                        style={{ width:'600px', position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}
                        form={form}
                        onFinish={values=>{
                            new Promise((resolve, reject)=>{
                                dispatch({type:'billing/editRateAsync', payload:{ resolve, reject, values }})
                            })
                            .then(()=>{
                                message.success('设置费率成功');
                            })
                            .catch(msg=>{
                                message.error(msg);
                            })
                        }}
                    >
                        <Form.Item label='计费类型' name='calcType' >
                            <Radio.Group>
                                <Radio value={1} key={1}>按需量计算</Radio>
                                <Radio value={2} key={2}>按容量计算</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='总变压器容量' name='totalKva' >
                            <InputNumber style={{ width:'300px' }} addonAfter="Kva"/>
                        </Form.Item>
                        <Form.Item label='容量基本电费单价' name='kvaPrice' >
                            <InputNumber style={{ width:'300px' }} addonAfter="元/Kva" />
                        </Form.Item>
                        <Form.Item label='需量基本电费单价' name='demandPrice' >
                            <InputNumber style={{ width:'300px' }} addonAfter="元/Kw" />
                        </Form.Item>                       
                        <Form.Item { ...tailLayout}>
                            <Button style={{ marginRight:'0.5rem' }} onClick={()=>form.resetFields()}>重置</Button>
                            <Button type='primary' htmlType='submit'>设置</Button>
                            
                        </Form.Item>
                    </Form> */}
                    <Form
                        { ...layout }
                        style={{ width:'600px', position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}
                        form={form}
                        onFinish={values=>{
                            new Promise((resolve, reject)=>{
                                dispatch({type:'billing/editRateAsync', payload:{ resolve, reject, values }})
                            })
                            .then(()=>{
                                message.success('设置电价成功');
                            })
                            .catch(msg=>{
                                message.error(msg);
                            })
                        }}
                    >
                        <Form.Item label='公司' >
                            <Input value={userInfo.companyName || '--'} disabled />
                        </Form.Item>
                        <Form.Item label='尖时段电价' name='tip' rules={[{ required: true, message:'尖时段电价不能为空' }]} >
                            <InputNumber style={{ width:'100%' }} />
                        </Form.Item>
                        <Form.Item label='峰时段电价' name='peak' rules={[{ required: true, message:'峰时段电价不能为空' }]} >
                            <InputNumber style={{ width:'100%' }} />
                        </Form.Item>
                        <Form.Item label='平时段电价' name='flat' rules={[{ required: true, message:'平时段电价不能为空' }]} >
                            <InputNumber style={{ width:'100%' }} />
                        </Form.Item>
                        <Form.Item label='谷时段电价' name='valley' rules={[{ required: true, message:'谷时段电价不能为空' }]} >
                            <InputNumber style={{ width:'100%' }} />
                        </Form.Item>
                        <Form.Item { ...tailLayout}>
                            <Button style={{ marginRight:'0.5rem' }} onClick={()=>form.resetFields()}>重置</Button>
                            <Button type='primary' htmlType='submit'>设置</Button>
                            
                        </Form.Item>
                    </Form>
                </div>
                
            </div>

    )
}

export default connect(({ user, billing })=>({ user, billing }))(FeeRateManager);