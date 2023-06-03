import React from 'react';
import MachCostChart from './MachCostChart';
import MachAlarmRank from './MachAlarmRank';
import MachAlarmTrend from './MachAlarmTrend';
import RealtimeAlarm from './RealtimeAlarm';
import TotalAlarmTrend from './TotalAlarmTrend';
import OrderTrend from './OrderTrend';
import style from '@/pages/IndexPage.css';

const componentMaps = {
  A: MachCostChart,
  B: MachAlarmRank,
  C: MachAlarmTrend,
  D: RealtimeAlarm,
  E: TotalAlarmTrend,
  F: OrderTrend,
};

function ChartCardList({ onDispatch, list, data, msg, chartMaps }) {
  return (
    <div style={{ height: '100%', overflow: 'hidden auto' }}>
      {list.map((item) => {
        let Com = componentMaps[item.key]
          ? componentMaps[item.key]
          : () => {
              return null;
            };

        return (
          <div
            key={item.key}
            className={style['card-container-wrapper']}
            style={{ width: '50%', height: '50%' }}
          >
            <Com
              item={item}
              data={item.key === 'D' ? msg : data[item.key]}
              chartMaps={chartMaps}
              onDispatch={onDispatch}
            />
          </div>
        );
      })}
    </div>
  );
}

export default ChartCardList;
