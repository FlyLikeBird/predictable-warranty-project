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
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import style from './AddDrawer.css';

const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
function AddDrawer({
  userList,
  info,
  unbindSensors,
  bindSensors,
  sensorTypes,
  tplList,
  onClose,
  onDispatch,
}) {
  const [fileList, setFileList] = useState([]);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const finalSensors = info.forEdit
    ? unbindSensors.concat(bindSensors)
    : unbindSensors;
  // 根据传感器类型分类管理
  let sensorMaps = finalSensors.reduce((sum, cur) => {
    if (!sum[cur.sensorType]) {
      sum[cur.sensorType] = [cur];
    } else {
      sum[cur.sensorType].push(cur);
    }
    return sum;
  }, {});
  const handleChange = ({ fileList }) => setFileList(fileList);
  useEffect(() => {
    // 设置已绑定的传感器
    let bindSensorMaps = bindSensors.reduce((sum, cur) => {
      if (!sum[cur.sensorType]) {
        sum[cur.sensorType] = [cur.sensorCode];
      } else {
        sum[cur.sensorType].push(cur.sensorCode);
      }
      return sum;
    }, {});
    Object.keys(bindSensorMaps).forEach((key) => {
      form2.setFieldValue('sensor' + key, bindSensorMaps[key]);
    });
  }, [bindSensors]);
  const handlePreview = (file) => {
    // file.thumbUrl 默认编译成200*200像素的64位字符串, 用FileReader重新解析
    if (!file.preview) {
      getBase64(file.originFileObj).then((data) => {
        file.preview = data;
        setPreviewInfo({
          visible: true,
          img: data,
          title: file.name,
        });
      });
    } else {
      setPreviewInfo({
        visible: true,
        img: file.preview,
        title: file.name,
      });
    }
  };
  const handleBeforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    const isJPEG = file.type === 'image/jpeg';
    const isGIF = file.type === 'image/gif';
    const isPNG = file.type === 'image/png';
    if (!(isJPG || isJPEG || isGIF || isPNG)) {
      message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('产品图不能超过2M');
    }
    return false;
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">上传产品图</div>
    </div>
  );

  useEffect(() => {
    if (info.forEdit) {
      let { equipmentPhotoPath } = info.current;
      form1.setFieldsValue({
        ...info.current,
        equipmentProductionDate: moment(info.current.equipmentProductionDate),
        equipmentMaintenanceEndDate: moment(
          info.current.equipmentMaintenanceEndDate,
        ),
      });
      form2.setFieldValue('equipmentHeadId', +info.current.equipmentHeadId);
      // 显示产品图的缩略图
      if (equipmentPhotoPath) {
        let config = window.g;
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            prevPath: equipmentPhotoPath,
            url: `https://${config.apiHost}/upload/getFileByPath?filePath=${equipmentPhotoPath}`,
          },
        ]);
      } else {
        setFileList([]);
      }
    } else {
      form1.resetFields();
      form2.resetFields();
      setFileList([]);
    }
  }, [info]);
  return (
    <div>
      {/* 基础信息 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '1rem',
          paddingBottom: '0.5rem',
        }}
      >
        <div>基础信息</div>
        {tplList.length ? (
          <div>
            <span>模板选择 : </span>
            <Select
              size="small"
              style={{ width: '180px' }}
              onChange={(value) => {
                let data =
                  tplList.filter((i) => i.equipmentTemplateId === value)[0] ||
                  {};
                form1.setFieldsValue({
                  ...data,
                  equipmentProductionDate: moment(data.equipmentProductionDate),
                  equipmentMaintenanceEndDate: moment(
                    data.equipmentMaintenanceEndDate,
                  ),
                });
              }}
            >
              {tplList.map((item) => (
                <Option
                  key={item.equipmentTemplateId}
                  value={item.equipmentTemplateId}
                >
                  {item.equipmentTemplateName}
                </Option>
              ))}
            </Select>
          </div>
        ) : null}
      </div>
      {/* <div><Button onClick={()=>form1.setFieldsValue(fieldData)}>填充</Button></div> */}
      <div>
        <Form className={style['form-container']} form={form1} {...layout}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="设备注册码"
                name="equipmentCode"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <Input disabled={info.forEdit ? true : false} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="设备类型"
                name="equipmentType"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <Select>
                  <Option value={1}>电机</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="设备名称"
                name="equipmentName"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="型号"
                name="equipmentModel"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="品牌"
                name="equipmentBrand"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <Select>
                  <Option value="三菱">三菱</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="功率"
                name="equipmentPower"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <InputNumber style={{ width: '100%' }} addonAfter="Kw" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="转速"
                name="equipmentRpm"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <InputNumber style={{ width: '100%' }} addonAfter="r/min" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="额定电流"
                name="equipmentElectricity"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <InputNumber style={{ width: '100%' }} addonAfter="A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="额定电压"
                name="equipmentVoltage"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <InputNumber style={{ width: '100%' }} addonAfter="V" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="底座类型"
                name="equipmentPedestal"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <Select>
                  <Option value={0}>柔性</Option>
                  <Option value={1}>刚性</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="转轴高度"
                name="equipmentPivoting"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <InputNumber style={{ width: '100%' }} addonAfter="mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="安装位置" name="equipmentSetupLocationId">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="投产日期"
                name="equipmentProductionDate"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <DatePicker style={{ width: '100%' }} locale={zhCN} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="维保截止日期"
                name="equipmentMaintenanceEndDate"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <DatePicker style={{ width: '100%' }} locale={zhCN} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="购入成本"
                name="equipmentPrice"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <InputNumber style={{ width: '100%' }} addonAfter="元" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="保修年限"
                name="equipmentWarrantyPeriod"
                rules={[{ required: true, message: '该字段不能为空' }]}
              >
                <InputNumber style={{ width: '100%' }} addonAfter="月" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="保养周期"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <div style={{ display: 'flex' }}>
                  <Form.Item
                    name="equipmentUpkeepWorkCycle"
                    rules={[{ required: true, message: '该字段不能为空' }]}
                  >
                    <InputNumber addonAfter="运行时间/h" />
                  </Form.Item>
                  <span style={{ margin: '4px 1rem' }}>或</span>
                  <Form.Item
                    name="equipmentUpkeepCycle"
                    rules={[{ required: true, message: '该字段不能为空' }]}
                  >
                    <InputNumber addonAfter="自然时间/h" />
                  </Form.Item>
                </div>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="设备图片"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
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
            </Col>
          </Row>
        </Form>
      </div>
      {/* 绑定传感器信息 */}
      <div>
        <div
          style={{
            borderBottom: '1px solid #f0f0f0',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
          }}
        >
          运维信息
        </div>
        <div>
          <Form form={form2} className={style['form-container']} {...layout}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="管理人员"
                  name="equipmentHeadId"
                  rules={[{ required: true, message: '该字段不能为空' }]}
                >
                  <Select>
                    {userList && userList.length
                      ? userList.map((item) => (
                          <Option key={item.userId} value={item.userId}>
                            {item.realName}
                          </Option>
                        ))
                      : null}
                  </Select>
                </Form.Item>
              </Col>
              {sensorTypes.map((item) => (
                <Col span={12} key={item.key}>
                  <Form.Item
                    label={'绑定' + item.title}
                    name={'sensor' + item.key}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: '100%' }}
                      placeholder={'选择要绑定的' + item.title}
                      options={
                        sensorMaps[item.key] && sensorMaps[item.key].length
                          ? sensorMaps[item.key].map((i) => ({
                              value: i.sensorCode,
                              label: i.sensorName,
                            }))
                          : [
                              {
                                value: 'null',
                                disabled: true,
                                label: '没有可绑定的' + item.title,
                              },
                            ]
                      }
                    />
                  </Form.Item>
                </Col>
              ))}
              {/* <Col span={12}>
                                <Form.Item label='绑定传感器' name='sensorList'>
                                    {
                                        finalSensors && finalSensors.length 
                                        ?
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{ width:'100%' }}
                                            placeholder="选择要关联的传感器"
                                            options={                                              
                                                finalSensors.map(i=>({ value:i.sensorCode, label:`${i.sensorName} ${typeMaps[i.sensorType]}`}))                                             
                                            }
                                        />
                                        :
                                        <Button type='primary' onClick={()=>history.push('/mach_manage/mach_manage_sensor')}>请先添加传感器设备</Button>
                                    }                                       
                                </Form.Item>
                            </Col> */}
              <Col span={24}>
                <Form.Item
                  wrapperCol={{ ...layout.wrapperCol, offset: 4 }}
                  style={{ margin: '1rem 0' }}
                >
                  <Button onClick={onClose} style={{ marginRight: '0.5rem' }}>
                    取消
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      form1.validateFields().then((value1) => {
                        form2.validateFields().then((value2) => {
                          console.log(value2);
                          let userInfo = userList.filter(
                            (i) => i.userId === value2.equipmentHeadId,
                          )[0];
                          let values = {
                            ...value1,
                            equipmentHeadId: value2.equipmentHeadId,
                          };
                          // 判断日期字段的合理性
                          if (
                            values.equipmentMaintenanceEndDate.diff(
                              values.equipmentProductionDate,
                              'days',
                            ) <= 0
                          ) {
                            message.info('维保截止日期不能小于投产日期');
                            return;
                          }
                          values.equipmentHeadName = userInfo.userName;
                          values.equipmentHeadPhone = userInfo.phone;
                          values.equipmentHeadEmail = userInfo.email;
                          values.equipmentProductionDate =
                            values.equipmentProductionDate.format(
                              'YYYY-MM-DD',
                            ) + ' 00:00:00';
                          values.equipmentMaintenanceEndDate =
                            values.equipmentMaintenanceEndDate.format(
                              'YYYY-MM-DD',
                            ) + ' 00:00:00';

                          if (fileList.length) {
                            if (info.forEdit) {
                              if (
                                info.current.equipmentPhotoPath !==
                                fileList[0].prevPath
                              ) {
                                // 上传文件变化时才更新产品图
                                values.fileList = fileList.map((i) =>
                                  i.size ? i.originFileObj : i,
                                );
                              }
                            } else {
                              values.fileList = fileList.map((i) =>
                                i.size ? i.originFileObj : i,
                              );
                            }
                          }
                          let newSensors = [];
                          Object.keys(value2).forEach((key) => {
                            if (
                              key.includes('sensor') &&
                              value2[key] &&
                              value2[key].length
                            ) {
                              value2[key].forEach((code) =>
                                newSensors.push(code),
                              );
                            }
                          });
                          // 筛选出要解绑的传感器
                          let result = [];
                          let bindSensorIds = bindSensors.map(
                            (i) => i.sensorCode,
                          );
                          bindSensors.forEach((i) => {
                            if (!newSensors.includes(i.sensorCode)) {
                              result.push({
                                action: 'unbind',
                                payload: i.equipmentSensorId,
                              });
                            }
                          });
                          // 添加新的传感器
                          newSensors.forEach((i) => {
                            if (!bindSensorIds.includes(i)) {
                              result.push({ action: 'bind', payload: i });
                            }
                          });
                          if (result.length) {
                            values.sensorList = result;
                          }
                          new Promise((resolve, reject) => {
                            onDispatch({
                              type: 'mach/addMachAsync',
                              payload: {
                                values,
                                resolve,
                                reject,
                                forEdit: info.forEdit,
                              },
                            });
                          })
                            .then(() => {
                              message.success(
                                `${info.forEdit ? '更新' : '添加'}设备成功`,
                              );
                              onClose();
                              setFileList([]);
                            })
                            .catch((msg) => message.error(msg));
                        });
                      });
                    }}
                  >
                    {info.forEdit ? '更新' : '添加'}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddDrawer;
