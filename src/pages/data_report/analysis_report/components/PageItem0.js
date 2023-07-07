import React from 'react';
import NormalPieChart from './charts/NormalPieChart';
import RingPieChart from './charts/RingPieChart';
import PieChart from '@/pages/alarm_manage/components/PieChart';
import MultiPieChart from '@/pages/operation_manage/components/MultiPieChart';
import style from '../AnalysisReport.css';
import IndexStyle from '@/pages/IndexPage.css';

function PageItem0({ alarm, order }) {
  const { alarmPercent, statusMaps } = alarm;
  const { statusInfo, orderTypeMaps, orderStatusMaps } = order;
  return (
    <div className={style['page-container']}>
      <div className={style['page-title']}>
        <div className={style['text-container']}>平台概览</div>
        <div className={style['symbol']}></div>
      </div>
      <div style={{ height: '128px', paddingBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              width: 'calc((100% - 3rem )/4 )',
              borderRadius: '4px',
              backgroundImage: 'linear-gradient(to Right, #16aeff, #1676ff)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>设备总数</div>
            <div>
              <span style={{ fontSize: '2rem' }}>42</span>
              <span>台</span>
            </div>
            <div>
              <span style={{ marginRight: '4px' }}>运行中</span>
              <span>41</span>
              <span style={{ marginLeft: '1rem' }}>42.63%</span>
            </div>
          </div>
          <div
            style={{
              width: 'calc((100% - 3rem )/4 )',
              borderRadius: '4px',
              background: '#f7f8fa',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>终端数</div>
            <div style={{ color: '#195fff' }}>
              <span style={{ fontSize: '2rem' }}>45</span>
              <span>台</span>
            </div>
            <div>
              <span style={{ marginRight: '4px' }}>上月</span>
              <span>3482</span>
              <span style={{ marginLeft: '1rem' }}>42.63%</span>
            </div>
          </div>
          <div
            style={{
              width: 'calc((100% - 3rem )/4 )',
              borderRadius: '4px',
              background: '#f7f8fa',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>终端异常次数</div>
            <div style={{ color: '#f54b4c' }}>
              <span style={{ fontSize: '2rem' }}>3</span>
              <span>次</span>
            </div>
            <div>
              <span style={{ marginRight: '4px' }}>上月</span>
              <span>10</span>
              <span style={{ marginLeft: '1rem' }}>42.63%</span>
            </div>
          </div>
          <div
            style={{
              width: 'calc((100% - 3rem )/4 )',
              borderRadius: '4px',
              background: '#f7f8fa',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>设备运行成本</div>
            <div style={{ color: '#195fff' }}>
              <span style={{ fontSize: '2rem' }}>3400</span>
              <span>元</span>
            </div>
            <div>
              <span style={{ marginRight: '4px' }}>上月</span>
              <span>3482</span>
              <span style={{ marginLeft: '1rem' }}>42.63%</span>
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      <div style={{ height: '260px', paddingBottom: '1rem' }}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              width: 'calc((100% - 2rem )/3 )',
              borderRadius: '4px',
              background: '#f7f8fa',
            }}
          >
            <RingPieChart
              title="设备异常率"
              data={{
                发生异常: { value: 10, color: '#ff7b00' },
                未有异常: { value: 30, color: '#e5e6eb' },
              }}
            />
          </div>
          <div
            style={{
              width: 'calc((100% - 2rem )/3 )',
              borderRadius: '4px',
              background: '#f7f8fa',
            }}
          >
            <NormalPieChart
              title="设备状态分布"
              data={{
                良好: { value: 23, color: '#00b42a' },
                一般: { value: 13, color: '#165dff' },
                隐患: { value: 3, color: '#ff7d00' },
                故障: { value: 3, color: '#f53f3f' },
              }}
            />
          </div>
          <div
            style={{
              width: 'calc((100% - 2rem )/3 )',
              borderRadius: '4px',
              background: '#f7f8fa',
            }}
          >
            <NormalPieChart
              title="设备投产时长分布"
              data={{
                '0-1年': { value: 5, color: '#00b42a' },
                '1-5年': { value: 6, color: '#165dff' },
                '5-15年': { value: 28, color: '#ff7d00' },
                '15年+': { value: 3, color: '#f53f3f' },
              }}
            />
          </div>
        </div>
      </div>
      {/*  */}
      <div
        className={IndexStyle['card-container']}
        style={{
          height: '240px',
          boxShadow: 'none',
          background: '#f7f8fa',
          overflow: 'hidden',
          marginBottom: '1rem',
        }}
      >
        <PieChart
          title="告警类型和状态分布"
          data={alarmPercent}
          statusMaps={statusMaps}
        />
      </div>
      <div
        className={IndexStyle['card-container']}
        style={{
          height: '240px',
          boxShadow: 'none',
          background: '#f7f8fa',
          overflow: 'hidden',
          marginBottom: '1rem',
        }}
      >
        <MultiPieChart
          data={statusInfo}
          orderTypeMaps={orderTypeMaps}
          orderStatusMaps={orderStatusMaps}
        />
      </div>

      <div
        style={{
          height: '120px',
          display: 'flex',
          background: '#f7f8fa',
          padding: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            color: '#fff',
            textAlign: 'center',
            backgroundImage: 'linear-gradient(to Bottom, #2368ff, #a0d0ff)',
          }}
        >
          <div>诊断</div>
          <div>建议</div>
        </div>
        <ul style={{ color: '#1860ff' }}>
          <li>
            <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
              当月新增一台电机未绑定传感器，建议尽快安装传感器保障电机健康运行
            </span>
          </li>
          <li>
            <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
              电机运行成本较上月高出12.3%，其中维保成本高出24.4%。
            </span>
          </li>
          <li>
            <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
              有3台电机已处于生命周期的淘汰期，为防止影响正常生产综合维保成本，建议尽快更换电机
            </span>
          </li>
          <li>
            <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
              生命周期进入末期，维修、养护成本较高、能效水平较差，不建议再继续使用，可考虑更换电机设备
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default PageItem0;
