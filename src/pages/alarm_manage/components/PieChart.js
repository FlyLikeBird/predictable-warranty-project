import React, { useRef, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Link, Route, Switch } from 'dva/router';
import { Radio, Card, Button, Tag } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';

function WarningTypePieChart({ data, title, statusMaps, theme }) {
  let textColor = 'rgba(0, 0, 0, 0.85)';
  let seriesData = [],
    seriesData2 = [];
  let textToKey = {};
  Object.keys(statusMaps).forEach((key) => {
    textToKey[statusMaps[key]] = key;
  });
  if (data.warningGroupByRuleMap) {
    Object.keys(data.warningGroupByRuleMap).forEach((key) => {
      seriesData.push({
        name: key,
        value: data.warningGroupByRuleMap[key],
      });
    });
  }
  if (data.warningGroupByStatusMap) {
    Object.keys(data.warningGroupByStatusMap).forEach((key) => {
      seriesData2.push({
        name: statusMaps[key],
        value: data.warningGroupByStatusMap[key],
      });
    });
  }

  return (
    <ReactEcharts
      notMerge={true}
      style={{ height: '100%' }}
      option={{
        title: {
          text: title,
          textStyle: {
            fontSize: 14,
          },
          left: 20,
          top: 10,
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
              // let temp = findData(name, seriesData);

              return `${name}\xa0\xa0\xa0\xa0{value|${
                data.warningGroupByRuleMap
                  ? data.warningGroupByRuleMap[name]
                  : 0
              }}{title|件}`;
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
              // let temp = findData(name, seriesData);
              return `${name}\xa0\xa0\xa0\xa0{value|${
                data.warningGroupByStatusMap
                  ? data.warningGroupByStatusMap[textToKey[name]]
                  : 0
              }}{title|件}`;
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
                return `{a|${data.warningTotal || 0}}{b|件}\n{b|总告警}`;
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
  );
}

function areEqual(prevProps, nextProps) {
  if (
    prevProps.data !== nextProps.data ||
    prevProps.theme !== nextProps.theme
  ) {
    return false;
  } else {
    return true;
  }
}

export default React.memo(WarningTypePieChart, areEqual);
