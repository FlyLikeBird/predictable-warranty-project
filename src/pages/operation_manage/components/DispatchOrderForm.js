import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import {
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  Rate,
  DatePicker,
  Space,
  message,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
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

function checkEmpty(arr) {
  let result = false;
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      result = true;
      break;
    }
  }
  return result;
}

function DispatchOrderForm({
  info,
  statusText,
  userList,
  userId,
  currentOrder,
  onDispatch,
  onClose,
  onReset,
}) {
  const [form] = Form.useForm();
  const [mainUser, setMainUser] = useState('');
  useEffect(() => {
    form.setFieldValue('users', []);
  }, [mainUser]);
  return (
    <Form
      form={form}
      {...layout}
      onFinish={(values) => {
        console.log(values);
        let obj,
          hasEmpty = false;
        if (currentOrder.workTicketsStatus === 0) {
          let userInfo = userList.filter(
            (i) => i.userId == values.equipmentHeadId,
          )[0];
          obj = {
            workTicketsId: currentOrder.workTicketsId,
            workTicketsStatus: 1,
            workTicketsContent: values.workTicketsContent,
            equipmentHeadId: userInfo.userId,
            equipmentHeadName: userInfo.userName,
            predictedFinishTime:
              values.predictedFinishTime.format('YYYY-MM-DD HH:mm') + ':00',
          };
          if (values.users && values.users.length) {
            let arr = values.users.map((item) => {
              let temp = userList.filter((i) => i.userId === item)[0];
              return {
                userId: temp.userId,
                userName: temp.userName,
                userPhone: temp.phone,
              };
            });
            obj.memberList = arr;
          }
        } else {
          obj = {
            workTicketsId: currentOrder.workTicketsId,
            workTicketsStatus:
              info.status === 1
                ? 1
                : info.status === 2
                ? 3
                : info.status === 4
                ? 4
                : info.status === 5
                ? 5
                : 3,
            workTicketsContent: values.workTicketsContent,
            hoursPrice: currentOrder.hoursPrice,
          };
          if (info.status === 2) {
            obj.assessment = values.assessment;
          }
        }
        // console.log(obj);
        new Promise((resolve, reject) => {
          onDispatch({
            type: 'order/addOrderAsync',
            payload: { values: obj, resolve, reject, forEdit: true },
          });
        })
          .then(() => {
            message.success(statusText + '工单成功');
            onReset();
            form.resetFields();
            onClose();
          })
          .catch((msg) => message.error(msg));
      }}
    >
      {/* {info.status === 0 ? (
                        <Form.Item
                            name="equipmentHeadId"
                            label="指定对象"
                            rules={[{ required: true, message: '请指定要分配的对象' }]}
                        >
                            <Select style={{ width: '100%' }}>
                                {userList
                                    .filter((i) => i.userId != userId)
                                    .map((item) => (
                                        <Option value={item.userId} key={item.userId}>
                                            {item.userName}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    ) : null} */}
      {info.status === 0 ? (
        <Form.Item
          name="equipmentHeadId"
          label="指定负责人"
          rules={[{ required: true, message: '负责人不能为空' }]}
        >
          <Select onChange={(value) => setMainUser(value)}>
            {userList
              .filter((i) => i.userId != userId)
              .map((item) => (
                <Option key={item.userId} value={item.userId}>
                  {item.userName}
                </Option>
              ))}
          </Select>
        </Form.Item>
      ) : null}
      {info.status === 0 ? (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, nextValues) => {
            if (prevValues.equipmentHeadId !== nextValues.equipmentHeadId) {
              return true;
            } else {
              return false;
            }
          }}
        >
          {() => {
            let list = userList.filter(
              (i) => i.userId != userId && i.userId !== mainUser,
            );
            return (
              <Form.Item name="users" label="参与人员">
                <Select style={{ flex: '1' }} mode="multiple">
                  {list.map((item) => (
                    <Option key={item.userId} value={item.userId}>
                      {item.userName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          }}
        </Form.Item>
      ) : null}
      {info.status === 0 ? (
        <Form.Item
          label="工时单价"
          name="hours_price"
          rules={[{ required: true, message: '工时单价不能为空' }]}
        >
          <InputNumber style={{ flex: '1' }} addonAfter="元/小时" />
        </Form.Item>
      ) : null}

      {/* 多个负责人的场景 */}
      {/* <Form.Item noStyle shouldUpdate={(prevValues, nextValues)=>{
                        if ( prevValues.users !== nextValues.users ) {                            
                            return true;
                        } else {
                            return false;
                        }
                    }}>
                        {
                            ()=>{
                                let list = form.getFieldValue('users');
                                return (
                                    list && list.length 
                                    ?
                                    list.map((item, index)=>(
                                        <div key={index} style={{ display:'flex', alignItems:'center', paddingLeft:'148px', marginBottom:'1rem' }}>
                                            <Form.Item noStyle>
                                                <Input value={userList.filter(i=>i.userId == item)[0].userName } style={{ flex:'1' }} />
                                            </Form.Item>
                                            <Form.Item name={[item, 'hour']} noStyle>
                                                <InputNumber style={{ flex:'2', margin:'0 6px' }} placeholder='输入工时' addonAfter='h' />
                                            </Form.Item>
                                            <Form.Item name={[item, 'price']} noStyle>
                                                <InputNumber style={{ flex:'1' }} placeholder='输入工时单价' addonAfter='元/h' />
                                            </Form.Item>
                                        </div>
                                    ))
                                    :
                                    null 
                                )
                            }
                        }
                    </Form.Item> */}
      {info.status === 0 ? (
        <Form.Item
          name="predictedFinishTime"
          label="计划完成时间"
          rules={[{ required: true, message: '时间不能为空' }]}
        >
          <DatePicker
            locale={zhCN}
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm"
            showTime={{ format: 'YYYY-MM-DD HH:mm' }}
          />
        </Form.Item>
      ) : null}
      {info.status === 2 ? (
        <Form.Item
          name="assessment"
          label="评分"
          rules={[{ required: true, message: '请给工单一个评分' }]}
        >
          <Rate />
        </Form.Item>
      ) : null}
      <Form.Item name="workTicketsContent" label="备注">
        <TextArea placeholder="请添加一些描述信息" />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
        <Button style={{ marginRight: '1rem' }} onClick={onReset}>
          取消
        </Button>
        <Button type="primary" htmlType="submit">
          {statusText}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default React.memo(DispatchOrderForm);
