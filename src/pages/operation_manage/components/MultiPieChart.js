import React, { useRef, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Link, Route, Switch } from 'dva/router';
import { Radio, Card, Button, Tag } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DownloadOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';

function getTypeKey(orderTypeMaps, type) {
  let result = '';
  if (orderTypeMaps) {
    Object.keys(orderTypeMaps).forEach((key) => {
      if (orderTypeMaps[key].text === type) {
        result = key;
      }
    });
  }
  return result;
}

function MultiPieChart({ data, orderTypeMaps, orderStatusMaps }) {
  let textColor = 'rgba(0, 0, 0, 0.85)';
  let total = 0;
  let seriesData = [],
    seriesData2 = [];
  if (data.equipmentWorkTypeCount) {
    Object.keys(data.equipmentWorkTypeCount).forEach((type) => {
      total += data.equipmentWorkTypeCount[type];
      seriesData.push({
        name: orderTypeMaps[type].text + '工单',
        value: data.equipmentWorkTypeCount[type],
      });
    });
  }
  if (data.equipmentWorkStatusCount) {
    Object.keys(data.equipmentWorkStatusCount).forEach((status) => {
      seriesData2.push({
        name: orderStatusMaps[status].text,
        value: data.equipmentWorkStatusCount[status],
      });
    });
  }

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <Radio.Group
        size="small"
        style={{ position: 'absolute', top: '20px', right: '0', zIndex: '10' }}
        onChange={(e) => {
          let value = e.target.value;
          let fileTitle = '工单占比';
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
          }
        }}
      >
        <Radio.Button value="download">
          <FileImageOutlined />
        </Radio.Button>
      </Radio.Group>
      <ReactEcharts
        notMerge={true}
        style={{ height: '100%' }}
        option={{
          title: {
            text: '工单类型和状态分布',
            textStyle: {
              fontSize: 14,
            },
            left: 20,
            top: 20,
          },
          legend: [
            {
              data: seriesData.map((i) => i.name),
              left: '26%',
              top: 'middle',
              // top:'12%',
              // bottom:'10%',
              orient: 'vertical',
              type: 'scroll',
              itemWidth: 8,
              itemHeight: 8,
              icon: 'circle',
              formatter: (name) => {
                let temp = name.substr(0, name.length - 2);
                let key = getTypeKey(orderTypeMaps, temp);
                return `${name}\xa0\xa0\xa0\xa0{value|${
                  data.equipmentWorkTypeCount
                    ? data.equipmentWorkTypeCount[key]
                    : 0
                }}\xa0{title|件}`;
              },
              textStyle: {
                color: textColor,
                rich: {
                  title: {
                    fontSize: 12,
                    lineHeight: 12,

                    color: textColor,
                  },
                  value: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    lineHeight: 20,
                    color: textColor,
                  },
                },
              },
            },
            {
              data: seriesData2.map((i) => i.name),
              left: '74%',
              top: 'middle',
              // top:'12%',
              // bottom:'10%',
              orient: 'vertical',
              type: 'scroll',
              itemWidth: 8,
              itemHeight: 8,
              icon: 'circle',
              formatter: (name) => {
                let key = getTypeKey(orderStatusMaps, name);
                return `${name}\xa0\xa0\xa0\xa0{value|${
                  data.equipmentWorkStatusCount
                    ? data.equipmentWorkStatusCount[key]
                    : 0
                }}\xa0{title|件}`;
              },
              textStyle: {
                color: textColor,
                rich: {
                  title: {
                    fontSize: 12,
                    lineHeight: 12,

                    color: textColor,
                  },
                  value: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    lineHeight: 20,
                    color: textColor,
                  },
                },
              },
            },
          ],
          tooltip: {
            trigger: 'item',
          },
          color: ['#ff7d00', '#f53f3f', '#0fc6c2', '#fadc19', '#9fdb1d'],
          series: [
            {
              label: {
                show: true,
                position: 'center',
                formatter: (params) => {
                  return `{a|${total || 0}}{b|件}\n{b|总工单}`;
                },
                rich: {
                  a: {
                    color: textColor,
                    fontSize: 22,
                    padding: [0, 4, 0, 0],
                  },
                  b: {
                    color: '#8a8a8a',
                    fontSize: 12,
                    padding: [6, 0, 6, 0],
                  },
                },
              },
              itemStyle: {
                borderWidth: 2,
                borderColor: '#fff',
              },
              labelLine: {
                show: false,
              },
              type: 'pie',
              radius: ['38%', '46%'],
              center: ['14%', '50%'],
              data: seriesData,
            },
            {
              itemStyle: {
                borderWidth: 2,
                borderColor: '#fff',
              },
              label: { show: false },
              labelLine: {
                show: false,
              },
              type: 'pie',
              radius: ['38%', '46%'],
              center: ['60%', '50%'],
              data: seriesData2,
            },
          ],
        }}
      />
    </div>
  );
}

export default React.memo(MultiPieChart);
