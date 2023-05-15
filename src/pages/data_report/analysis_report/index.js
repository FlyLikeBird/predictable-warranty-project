import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import {
  Input,
  Skeleton,
  Spin,
  Radio,
  DatePicker,
  Button,
  message,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import style from './AnalysisReport.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

import reportBg from '../../../../public/report-bg.png';
import PageItem0 from './components/PageItem0';
import PageItem1 from './components/PageItem1';
let canDownload = false;
let timer;
function getBase64(dom) {
  return html2canvas(dom, { dpi: 96, scale: 1 }).then((canvas) => {
    let MIME_TYPE = 'image/png';
    return canvas.toDataURL(MIME_TYPE);
  });
}

function getPromise(dispatch, action) {
  return new Promise((resolve, reject) => {
    // forReport字段为了优化请求流程，不重复请求维度接口，共享维度属性树全局状态
    dispatch({ ...action, payload: { resolve, reject, forReport: true } });
  });
}

function AnalyzeReport({
  dispatch,
  user,
  energy,
  monitor,
  attrEnergy,
  fields,
  alarm,
  analyze,
}) {
  const containerRef = useRef(null);
  const [loading, toggleLoading] = useState(false);
  const { currentCompany, timeType, startDate, endDate } = user;
  canDownload = true;

  function updateData() {
    canDownload = false;
    Promise.all([
      // getPromise(dispatch, { type:'analyze/fetchReportInfo'}),
      // getPromise(dispatch, { type:'monitor/fetchSaveSpace'}),
      // getPromise(dispatch, { type:'energy/fetchCost'}),
      // getPromise(dispatch, { type:'energy/fetchCostByTime'}),
      // getPromise(dispatch, { type:'attrEnergy/fetchAttrQuota'}),
      // getPromise(dispatch, { type:'attrEnergy/fetchEnergyQuota'}),
      // getPromise(dispatch, { type:'alarm/fetchMonitorInfo'}),
      // getPromise(dispatch, { type:'alarm/fetchReportSumInfo'}),
      getPromise(dispatch, { type: 'alarm/fetchAlarmTrend' }),
      getPromise(dispatch, { type: 'alarm/fetchAlarmRank' }),
    ])
      .then(() => {
        // 如果数据还没加载完，则标记为开始下载状态，等数据加载完自动生成文件
        // 如果数据加载完，用户没有点击下载，则待定
        canDownload = true;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    new Promise((resolve, reject) => {
      dispatch({ type: 'user/toggleTimeType', payload: '2' });
      // dispatch({ type:'fields/toggleEnergyInfo', payload:{ type_name:'电', type_code:'ele', type_id:'1', unit:'kwh'}});
      // dispatch({ type:'fields/init', payload:{ resolve, reject }});
      resolve();
    }).then(() => {
      updateData();
    });

    return () => {
      canDownload = false;
      clearTimeout(timer);
    };
  }, []);

  const handleDownload = () => {
    let container = containerRef.current;
    if (container) {
      let pageDoms = container.getElementsByClassName(style['page-container']);
      Promise.all(Array.from(pageDoms).map((dom) => getBase64(dom))).then(
        (base64Imgs) => {
          // [241, 279]
          var pdf = new jsPDF('p', 'mm', 'a4');
          let containerWidth = containerRef.current.offsetWidth;
          let containerHeight = containerRef.current.offsetHeight;
          // 600 * 800 报告dom原尺寸:1152 1304
          let pageWidth = pdf.internal.pageSize.getWidth();
          let pageHeight = pdf.internal.pageSize.getHeight();
          base64Imgs.map((img, index) => {
            pdf.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight);
            if (index === base64Imgs.length - 1) return;
            pdf.addPage();
          });
          pdf.save('诊断报告.pdf');
          toggleLoading(false);
        },
      );
    }
  };
  return (
    <div className={style['report-container']}>
      {loading ? (
        <div
          style={{
            zIndex: '500',
            position: 'fixed',
            left: '0',
            right: '0',
            top: '0',
            bottom: '0',
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#fff',
            }}
          >
            <div>报告生成中，请稍后...</div>
            <Spin size="large" />
          </div>
        </div>
      ) : null}
      <div style={{ width: '100%' }} ref={containerRef}>
        <div
          style={{
            position: 'fixed',
            left: '14%',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <DatePicker
            className={style['custom-date-picker']}
            locale={zhCN}
            picker="month"
            allowClear={false}
            value={startDate}
            onChange={(value) => {
              dispatch({
                type: 'user/setDate',
                payload: { startDate: value, endDate: value.endOf('month') },
              });
              updateData();
            }}
          />
        </div>
        {/* 报告封面 */}
        <div className={style['page-container']}>
          <div
            style={{
              height: '100%',
              backgroundImage: `url(${reportBg})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          ></div>

          <div
            style={{
              position: 'absolute',
              left: '50%',
              fontSize: '2.4rem',
              transform: 'translateX(-50%)',
              color: '#155cff',
              whiteSpace: 'nowrap',
              top: '420px',
            }}
          >
            <div>{`${startDate.year()}年${
              startDate.month() + 1
            }月分析报告`}</div>
          </div>
        </div>
        {/* 全局日期和维度控制 */}

        {/* 诊断结论 */}
        <PageItem0 />
        <PageItem1 alarm={alarm} />
      </div>

      {/* 操作button */}
      <Button
        style={{
          width: '46px',
          height: '46px',
          position: 'fixed',
          right: '10%',
          bottom: '10%',
        }}
        type="primary"
        shape="circle"
        icon={<DownloadOutlined />}
        onClick={() => {
          if (canDownload) {
            toggleLoading(true);
            handleDownload();
          } else {
            message.info('数据还在加载，请稍后再点击下载');
          }
        }}
      />
    </div>
  );
}

export default connect(({ user, alarm }) => ({ user, alarm }))(AnalyzeReport);
