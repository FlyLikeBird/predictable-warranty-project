import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, message } from 'antd';
import style from '../IndexPage.css';

const passwordReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";\'<>?,.\/]).{6,20}$/ ;
let msg = '密码必须包含字母、数字、特殊字符且长度为6-20位';


function UpdatePassword({ dispatch, user }){
    const { userInfo, currentCompany } = user;
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const tailLayout = {
      wrapperCol: { offset: 6, span: 18 },
    };
    useEffect(()=>{
        form.setFieldsValue({
            username:userInfo.userName,
            company:currentCompany.companyName
        })
    },[])
    
    return (
        <div className={style['card-container']} style={{ boxShadow:'none' }}>
            <Form
                { ...layout }
                style={{ width:'600px', position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', color:'red' }}
                form={form}
                onFinish={values=>{
                    let { oldPassword, newPassword, confirmPassword } = values;
                    if ( newPassword !== confirmPassword ){
                        message.info('两次新密码输入不一致');
                        return ;
                    } else {
                        new Promise((resolve, reject)=>{
                            dispatch({type:'userList/updatePwdAsync', payload:{ values, resolve, reject }})
                        })
                        .then(()=>{
                            message.info('修改密码成功!');
                            form.resetFields();
                        })
                        .catch(msg=>{
                            message.error(msg);
                        })
                    }
                }}
            >
                <Form.Item label='用户名' name='username'>
                    <Input style={{ width:'300px' }} disabled />
                </Form.Item>
                <Form.Item label='所属公司' name='company'>
                    <Input style={{ width:'300px' }} disabled />
                </Form.Item>
                <Form.Item label='原密码' name='oldPassword' rules={[{ required:true, message:'原密码不能为空' }]}>
                    <Input.Password style={{ width:'300px' }}  type='password' placeholder='输入原密码' />
                </Form.Item>
                <Form.Item label='密码' name='newPassword' rules={[{ required:true, message:'新密码不能为空' }]}>
                    <Input.Password style={{ width:'300px' }}  type='password' placeholder='输入新密码' />
                </Form.Item>
                <Form.Item label='确认密码' name='confirmPassword' rules={[{ required:true, message:'新密码不能为空'}]}>
                    <Input.Password style={{ width:'300px' }}  type='password' placeholder='再次输入新密码' />
                </Form.Item> 
                <Form.Item { ...tailLayout}>
                    <Button type='primary' htmlType='submit'>修改密码</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default connect(({ user })=>({ user }))(UpdatePassword);