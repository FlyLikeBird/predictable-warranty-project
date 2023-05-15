import React, { useEffect } from 'react';
import { connect } from 'dva';
import TableSelector from './components/TableSelector';
import TableContainer from './components/CostTable';

function CostReport({ dispatch, user, report, mach }) {
  const { authorized } = user;
  const { costList, category, costColumns, currentPage, total } = report;
  useEffect(() => {
    if (authorized) {
      dispatch({ type: 'user/toggleTimeType', payload: '2' });
      dispatch({ type: 'mach/fetchMachList' });
      dispatch({ type: 'report/fetchCostReport' });
    }
  }, [authorized]);
  useEffect(() => {
    return () => {
      dispatch({ type: 'report/reset' });
    };
  }, []);
  return (
    <>
      <div style={{ height: '90px' }}>
        <TableSelector
          list={mach.list}
          onSearch={(obj) =>
            dispatch({ type: 'report/fetchCostReport', payload: obj })
          }
        />
      </div>
      <div style={{ height: 'calc( 100% - 90px)', paddingTop: '1rem' }}>
        <TableContainer
          list={costList}
          category={[
            { title: '能源成本', unit: '元', dataIndex: 'electricityCost' },
            { title: '维保成本', unit: '元', dataIndex: 'maintenanceCost' },
          ]}
          dateColumn={costColumns}
          currentPage={currentPage}
          total={total}
        />
      </div>
    </>
  );
}

export default connect(({ user, report, mach }) => ({ user, report, mach }))(
  CostReport,
);
