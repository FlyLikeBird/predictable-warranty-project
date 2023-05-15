import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import { Radio, Card, Button, DatePicker, message, Modal } from 'antd';
import {
  FileExcelOutlined,
  FileImageOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';
import { downloadExcel } from '@/utils/array';
import XLSX from 'xlsx';
import style from '@/pages/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import RuleForm from './RuleForm';

const optionMaps = {
  0: ['acceleroXPeakmg', 'acceleroYPeakmg', 'acceleroZPeakmg'],
  1: ['acceleroXRmsmg', 'acceleroYRmsmg', 'acceleroZRmsmg'],
  2: ['temphumiSenval'],
  3: ['uavg'],
  4: ['acceleroXKurtosis', 'acceleroYKurtosis', 'acceleroZKurtosis'],
  5: ['acceleroXSkewness', 'acceleroYSkewness', 'acceleroZSkewness'],
  6: ['acceleroXDeviation', 'acceleroYDeviation', 'acceleroZDeviation'],
  7: ['acceleroXCrestfactor', 'acceleroYCrestfactor', 'acceleroZCrestfactor'],
  8: ['iavb'],
};

function initSeriesData(data, optionList) {
  let result = {},
    categoryData = [];
  if (data.length) {
    data.forEach((item, index) => {
      categoryData.push(item.recordTime);
      if (index === 0) {
        // 初始化各个选项的数据结构
        optionList.forEach((option) => {
          result[option.metricsCode] = [];
          if (optionMaps[option.metricsCode]) {
            optionMaps[option.metricsCode].forEach((dataIndex) => {
              // let temp = [item[dataIndex] === -1 ? null : item[dataIndex]];
              let temp = [item[dataIndex]];
              result[option.metricsCode].push(temp);
            });
          }
        });
      } else {
        optionList.forEach((option) => {
          if (optionMaps[option.metricsCode]) {
            optionMaps[option.metricsCode].forEach((dataIndex, j) => {
              result[option.metricsCode][j].push(item[dataIndex]);
            });
          }
        });
      }
    });
  }
  return { result, categoryData };
}

function StepLineChart({ onDispatch, ruleParams, currentMach }) {
  const [optionType, setOptionType] = useState('');
  const [ruleInfo, setRuleInfo] = useState('');
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState([]);
  const [mapChart, setMapChart] = useState({});
  const [currentDate, setCurrentDate] = useState(moment('2023-04-06'));
  let echartsRef = useRef();
  let ruleParamsRef = useRef([]);
  let seriesData = [];
  useEffect(() => {
    if (ruleParams.length) {
      setOptionType(ruleParams[0]);
      ruleParamsRef.current = ruleParams;
    }
  }, [ruleParams]);
  useEffect(() => {
    onDispatch({
      type: 'mach/fetchRuleParams',
      payload: { equipmentCode: currentMach.equipmentCode },
    });
    new Promise((resolve, reject) => {
      onDispatch({
        type: 'mach/fetchMachRunningChart',
        payload: {
          resolve,
          reject,
          currentDate,
          equipmentCode: currentMach.equipmentCode,
        },
      });
    })
      .then((data) => {
        let { result, categoryData } = initSeriesData(
          data,
          ruleParamsRef.current,
        );
        setMapChart(result);
        setCategory(categoryData);
      })
      .catch((msg) => message.error(msg));
  }, [currentMach]);
  useEffect(() => {
    new Promise((resolve, reject) => {
      onDispatch({
        type: 'mach/fetchMachRunningChart',
        payload: {
          resolve,
          reject,
          currentDate,
          equipmentCode: currentMach.equipmentCode,
        },
      });
    })
      .then((data) => {
        let { result, categoryData } = initSeriesData(
          data,
          ruleParamsRef.current,
        );
        setMapChart(result);
        setCategory(categoryData);
      })
      .catch((msg) => message.error(msg));
  }, [currentDate]);

  useEffect(() => {
    if (optionType.metricsName) {
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
      })
        .then((data) => {
          // 更新当前指标的告警规则阈值线
          setRuleInfo(data);
        })
        .catch((msg) => message.error(msg));
    }
  }, [optionType]);
  if (mapChart[optionType.metricsCode]) {
    mapChart[optionType.metricsCode].forEach((item, index) => {
      let color = index === 0 ? '#21ccff' : index === 1 ? '#313ca9' : '#ff7d00';
      let text = index === 0 ? 'X轴' : index === 1 ? 'Y轴' : 'Z轴';
      seriesData.push({
        name:
          mapChart[optionType.metricsCode].length > 1
            ? text + optionType.metricsName
            : optionType.metricsName,
        type: 'line',
        step: 'middle',
        symbol: 'none',
        itemStyle: { color },
        areaStyle: {
          color,
          opacity: 0.05,
        },
        data: item,
      });
    });
  }
  // 添加指标的告警线
  if (ruleInfo) {
    let minValue = ruleInfo.warningMin;
    let maxValue = ruleInfo.warningMax;
    let ruleName = ruleInfo.warningRuleName;
    if (minValue) {
      seriesData.push({
        type: 'line',
        symbol: 'none',
        itemStyle: {
          color: '#6ec71e',
        },
        data: category.map((i) => minValue),
        markPoint: {
          symbol: 'rect',
          symbolSize: [ruleName.length * 16, 20],
          data: [
            {
              value: ruleName + minValue,
              xAxis: category.length - 2,
              yAxis: minValue,
            },
          ],
        },
        lineStyle: {
          type: 'dashed',
        },
        tooltip: { show: false },
      });
    }
    if (maxValue) {
      seriesData.push({
        type: 'line',
        symbol: 'none',
        itemStyle: {
          color: '#ff2d2e',
        },
        data: category.map((i) => maxValue),
        markPoint: {
          symbol: 'rect',
          symbolSize: [ruleName.length * 16, 20],
          data: [
            {
              value: ruleName + maxValue,
              xAxis: category.length - 2,
              yAxis: maxValue,
            },
          ],
        },
        lineStyle: {
          type: 'dashed',
        },
        tooltip: { show: false },
      });
    }
  }
  return (
    <div className={style['card-container']} style={{ boxShadow: 'none' }}>
      <div className={style['card-title']}>
        <span>运行趋势</span>
        <span className={style['symbol']}></span>
      </div>
      <div className={style['card-content']}>
        <Radio.Group
          className={style['custom-radio']}
          value={optionType.metricsCode}
          style={{
            display: 'flex',
            zIndex: '10',
            position: 'absolute',
            top: '0',
            display: 'flex',
            justifyContent: 'space-between',
          }}
          onChange={(e) => {
            let obj = ruleParams.filter(
              (i) => i.metricsCode === e.target.value,
            )[0];
            setOptionType(obj);
          }}
        >
          {ruleParams.map((item) => (
            <Radio.Button key={item.metricsCode} value={item.metricsCode}>
              {item.metricsName}
            </Radio.Button>
          ))}
        </Radio.Group>
        <div
          style={{ zIndex: '10', position: 'absolute', top: '0', right: '0' }}
        >
          <DatePicker
            locale={zhCN}
            value={currentDate}
            allowClear={false}
            onChange={(value) => setCurrentDate(value)}
          />
        </div>
        <div
          style={{
            zIndex: '10',
            position: 'absolute',
            top: '50px',
            right: '0',
          }}
        >
          <Radio.Group
            size="small"
            value="test"
            onChange={(e) => {
              let value = e.target.value;
              let fileTitle = '运行监控';
              if (value === 'warning') {
                setVisible(true);
                return;
              }
              if (value === 'download' && echartsRef.current) {
                html2canvas(echartsRef.current.ele, {
                  allowTaint: false,
                  useCORS: false,
                  backgroundColor: '#fff',
                }).then((canvas) => {
                  let MIME_TYPE = 'image/png';
                  let url = canvas.toDataURL(MIME_TYPE);
                  let linkBtn = document.createElement('a');
                  linkBtn.download = fileTitle;
                  linkBtn.href = url;
                  let event;
                  if (window.MouseEvent) {
                    event = new MouseEvent('click');
                  } else {
                    event = document.createEvent('MouseEvents');
                    event.initMouseEvent(
                      'click',
                      true,
                      false,
                      window,
                      0,
                      0,
                      0,
                      0,
                      0,
                      false,
                      false,
                      false,
                      false,
                      0,
                      null,
                    );
                  }
                  linkBtn.dispatchEvent(event);
                });
              }
              if (value === 'excel') {
                var aoa = [],
                  thead = ['指标', '单位'];
                category.forEach((i) => thead.push(i));
                aoa.push(thead);
                Object.keys(mapChart).forEach((key) => {
                  let temp = [];
                  let info = ruleParams.filter((i) => i.metricsCode === key)[0];
                  temp.push(info.metricsName);
                  temp.push(info.unitName || '--');
                  if (mapChart[key].length > 1) {
                    let tempArr = [];
                    mapChart[key].forEach((arr, index) => {
                      if (index === 0) {
                        tempArr.push(...arr);
                      } else {
                        tempArr = tempArr.map(
                          (value, j) => value + '/' + arr[j],
                        );
                      }
                    });
                    temp.push(...tempArr);
                  } else if (mapChart[key].length === 1) {
                    temp.push(...mapChart[key][0]);
                  }
                  aoa.push(temp);
                });

                var sheet = XLSX.utils.aoa_to_sheet(aoa);
                sheet['!cols'] = thead.map((i) => ({ wch: 16 }));
                downloadExcel(sheet, fileTitle + '.xlsx');
              }
            }}
          >
            <Radio.Button value="download">
              <FileImageOutlined />
            </Radio.Button>
            <Radio.Button value="excel">
              <FileExcelOutlined />
            </Radio.Button>
            <Radio.Button value="warning">
              <AlertOutlined />
            </Radio.Button>
          </Radio.Group>
        </div>
        <Modal
          title={ruleInfo ? '更新规则' : '添加规则'}
          open={visible ? true : false}
          footer={null}
          width="40%"
          bodyStyle={{ padding: '40px' }}
          className={style['modal-container']}
          onCancel={() => setVisible(false)}
        >
          <RuleForm
            info={ruleInfo || {}}
            optionType={optionType}
            currentMach={currentMach}
            onUpdateRule={(value) => setRuleInfo(value)}
            onClose={() => setVisible(false)}
            onDispatch={onDispatch}
          />
        </Modal>
        <ReactEcharts
          ref={echartsRef}
          style={{ height: '100%' }}
          notMerge={true}
          option={{
            tooltip: {
              trigger: 'axis',
            },
            grid: {
              top: 90,
              left: 20,
              right: 40,
              bottom: 40,
              containLabel: true,
            },
            legend: {
              data: seriesData.map((i) => i.name),
              top: 50,
              left: 'center',
            },
            dataZoom: [
              {
                type: 'slider',
                show: true,
                bottom: 10,
                xAxisIndex: [0],
              },
            ],
            xAxis: {
              type: 'category',
              data: category,
              silent: false,

              splitLine: {
                show: false,
              },
              splitArea: {
                show: false,
              },
              axisLabel: {
                show: true,
                color: 'rgba(0, 0, 0, 0.65)',
                formatter: (params) => {
                  let strArr = params.split('T');
                  return strArr[1];
                },
              },
              axisTick: { show: false },
              axisLine: { show: true, lineStyle: { color: '#f0f0f0' } },
            },
            yAxis: {
              type: 'value',
              name: optionType.unitName || '',
              splitArea: {
                show: false,
              },
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#f0f0f0',
                },
              },
              axisLabel: {
                show: true,
                color: 'rgba(0, 0, 0, 0.65)',
              },
            },
            series: seriesData,
          }}
        />
      </div>
    </div>
  );
}

export default React.memo(StepLineChart);
