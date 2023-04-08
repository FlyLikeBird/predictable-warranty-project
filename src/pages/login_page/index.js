import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'dva/router';
import { Table, Button, Tree, Card, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import style from './LoginPage.css';
import loginBg from '../../../public/loginBg.png';
import LogoBg from '../../../public/loginLogo.png';

const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
};
const tailLayout = {
    wrapperCol: { offset: 0, span: 24 },
};

function LoginPage({ dispatch, location }) {  
    const [form] = Form.useForm();
   
    return (
        localStorage.getItem('userId') && location.pathname === '/login'
        ?
        <Redirect to='/' />
        :
        <div className={style.container}>
            
            <div className={style['login-container']}>
                <div className={style['logo-container']}>
                    <img src={LogoBg} />
                </div>
                <div className={style['form-container']}>
                    <Form
                        {...layout}
                        className={style['form']}
                        form={form}
                    >
                        <Form.Item                            
                            name="userName"
                            rules={[{required:true, message:'账号不能为空!'}]}
                        >
                            <Input addonBefore={<UserOutlined />} bordered='false' />
                        </Form.Item>
                        <Form.Item                           
                            name="password"
                            rules={[{required:true, message:'密码不能为空!'}]}
                        >
                            <Input.Password addonBefore={<LockOutlined />} bordered='false' />
                        </Form.Item>
                        <Form.Item>
                            {/* <div style={{ display:'flex', justifyContent:'space-between', margin:'6px 0' }}>
                                <Link target="_blank" to='/privacy'>隐私政策</Link>
                                <Link target="_blank" to='/safety'>许可协议</Link>
                            </div>  */}
                            <Button type="primary" style={{width:'100%'}}  onClick={()=>{
                                form.validateFields()
                                .then(values=>{
                                    new Promise((resolve,reject)=>{
                                        dispatch({type:'user/login', payload:{ values, resolve, reject }})
                                    }).then()
                                    .catch(msg=>{
                                        message.error(msg);
                                    })
                                })
                            }}>登录</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>      
            <div className={style['bg-container']} style={{ backgroundImage:`url(${loginBg})` }}></div>    
            <div style={{ position:'absolute', right:'calc( 16% + 140px)', bottom:'20px', fontSize:'0.8rem' }}>@粤ICP备20066003号</div>
        </div>
    )
}

export default connect()(LoginPage);
