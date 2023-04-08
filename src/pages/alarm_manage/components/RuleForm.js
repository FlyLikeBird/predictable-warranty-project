import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message, Slider, Divider, InputNumber } from 'antd';
import style from '@/pages/IndexPage.css';

const { Option } = Select;
const ruleTypes = [{ typeName:'电表', typeCode:0, typeUnit:'kwh' }, { typeName:'震动', typeCode:1, typeUnit:'mm/s' }, { typeName:'温度', typeCode:2, typeUnit:'℃' }];
function validator(a,value){
    if ( !value || (typeof +value === 'number' && +value === +value && +value >=0  )) {
        return Promise.resolve();
    } else {
        return Promise.reject('请填入合适的阈值');
    }
}
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
function RuleForm({ info, bindMachs, onClose, onDispatch }){
    
    const [form] = Form.useForm();
    const [currentType, setCurrentType] = useState({});
    // console.log(currentRule);
    useEffect(()=>{
        if ( info.forEdit ) {
            form.setFieldsValue(info.current);
            let obj = ruleTypes.filter(i=>i.typeCode === info.current.warningRuleType )[0];
            setCurrentType(obj);
        } else {
            setCurrentType({});
            form.resetFields();
        }
    },[info]);
    // console.log(currentType);
    return (
        <Form
            {...layout} 
            name="rule-form"
            form={form}
            onFinish={values=>{
                // console.log(values);
                new Promise((resolve,reject)=>{
                    // values.level = values.level == 1  ? 3 : values.level == 3 ? 1 : 2; 
                    values.unitName = currentType.typeUnit;
                    if ( info.forEdit ) {
                        values.warningRuleId = info.current.warningRuleId;
                    }
                    onDispatch({ type:'alarm/addRuleAsync', payload:{ values, resolve, reject, forEdit:info.forEdit }})
                })
                .then(()=>{
                    message.success(`${info.forEdit ? '更新' : '添加'}告警规则成功`);
                    onClose();
                })
                .catch(msg=>{
                    message.error(msg);
                })
            }}
        >
            <Form.Item name='warningRuleName' label='规则名称' rules={[{ required:true, message:'规则名称不能为空'}]}>
                <Input />
            </Form.Item>
            {/* <Form.Item name='level' label='告警等级'>
                <Slider min={1} max={3} marks={{ 1:'低',2:'中',3:'高'}}  tooltipVisible={false} />
            </Form.Item> */}
           
            <Form.Item name='warningRuleType' label='告警类型' rules={[{ required:true, message:'请指定一种告警类型'}]}>
                <Select disabled={info.forEdit ? true : false} onChange={value=>{
                    let temp = ruleTypes.filter(i=>i.typeCode === value)[0];
                    setCurrentType(temp);
                }}>
                    {                         
                        ruleTypes.map(item=>(
                            <Option key={item.typeCode} value={item.typeCode}>{ item.typeName }</Option>
                        ))                  
                    }
                </Select>
            </Form.Item>
            
            
            <Form.Item name='warningMin' label='最小阈值' rules={[{ required:true, message:'小于设定值则触发告警'}]} >
                <InputNumber style={{width:'100%'}}  addonAfter={currentType.typeUnit || ''} />
            </Form.Item>
            <Form.Item name='warningMax' label='最大阈值' rules={[{ required:true, message:'大于设定值则触发告警'}]}>
                <Input style={{ width:'100%'}} addonAfter={currentType.typeUnit}/>
            </Form.Item>        
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                <Button style={{ marginRight:'1rem' }} onClick={onClose}> 取消 </Button>
                <Button type="primary" htmlType="submit">{ info.forEdit ? '更新' : '添加' }</Button>
            </Form.Item>
        </Form>
    )
}

export default RuleForm;