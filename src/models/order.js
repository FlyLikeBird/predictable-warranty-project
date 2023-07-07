import {
  getOrderList,
  getOrderDetail,
  getOrderRecords,
  getOrderFitting,
  getOrderTrend,
  getOrderCheck,
  getOrderStatus,
  addOrder,
  updateOrder,
  getMaintainList,
  getMaintainDetail,
  getMaintainSumInfo,
} from '../services/orderService';
import { getAlarmList } from '../services/alarmService';
import moment from 'moment';

const initialState = {
  orderTypeMaps: {
    0: { text: '保养', color: '#722ed1' },
    1: { text: '维修', color: '#2568ff' },
  },
  orderStatusMaps: {
    0: { text: '未分配', color: '#ffbe7f' },
    1: { text: '执行中', color: '#709cff' },
    2: { text: '待验收', color: '#a073df' },
    3: { text: '已完成', color: '#85dd96' },
    4: { text: '挂起', color: '#f772bc' },
    5: { text: '驳回', color: '#e76464' },
  },
  orderSourceMaps: {
    1: '告警转工单',
    2: '维修申请',
    3: '缺陷上报',
    4: '系统生成',
  },
  orderList: [],
  currentPage: 1,
  isLoading: false,
  total: 0,
  chartInfo: {},
  checkInfo: {},
  statusInfo: {},
  optional: {},
  maintainList: [],
  maintainSumInfo: {},
  maintainDetail: {},
};

export default {
  namespace: 'order',
  state: initialState,
  effects: {
    *initOrder(action, { put, call }) {
      yield put({ type: 'userList/fetchUserList' });
      yield put({ type: 'mach/fetchMachList', payload: { pageSize: 1000 } });
      yield put({ type: 'fetchOrderStatus' });
      yield put({ type: 'fetchOrderList' });
    },
    *fetchOrderList(action, { put, call, select }) {
      let {
        user: { companyId, startDate, endDate },
        order: { optional },
      } = yield select();
      let { resolve, reject, currentPage, pageSize } = action.payload || {};
      currentPage = currentPage || 1;
      pageSize = pageSize || 10;
      let params = {
        companyId,
        beginDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        page: currentPage,
        pageSize,
      };
      Object.keys(optional).forEach((key) => {
        if (optional[key] && optional[key] !== 'all') {
          params[key] = optional[key];
        }
      });
      let { data } = yield call(getOrderList, params);
      if (data && data.code === 200) {
        yield put({
          type: 'getOrderListResult',
          payload: { data: data.data, currentPage, total: data.total },
        });
        if (resolve) resolve(data.data);
      }
    },
    *fetchOrderDetail(action, { put, call, select }) {
      let { resolve, reject, id } = action.payload;
      let { data } = yield call(getOrderDetail, { workTicketsId: id });
      if (data && data.code === 200) {
        resolve(data.data);
      } else {
        reject(data.message);
      }
    },
    *fetchOrderFitting(action, { put, call, select }) {
      let { resolve, reject, workTicketsId, currentPage } =
        action.payload || {};
      let { data } = yield call(getOrderFitting, { workTicketsId });
      if (data && data.code === 200) {
        resolve(data.data);
      } else {
        reject(data.message);
      }
    },
    *fetchRelatedAlarm(action, { put, call, select }) {
      let {
        user: { companyId },
      } = yield select();
      let { resolve, reject, equipmentCode } = action.payload || {};
      let date = moment(new Date());
      let { data } = yield call(getAlarmList, {
        companyId,
        equipmentCode,
        beginDate: date.startOf('year').format('YYYY-MM-DD'),
        endDate: date.endOf('year').format('YYYY-MM-DD'),
        page: 1,
        pageSize: 1000,
      });
      if (data && data.code === 200) {
        resolve(data.data);
      } else {
        reject(data.message);
      }
    },
    *fetchOrderRecords(action, { put, call, select }) {
      let { resolve, reject, workTicketsId } = action.payload || {};
      let { data } = yield call(getOrderRecords, { workTicketsId });
      if (data && data.code === 200) {
        resolve(data.data);
      } else {
        reject(data.message);
      }
    },
    *fetchOrderHistoryList(action, { put, call, select }) {
      let {
        user: { companyId },
      } = yield select();
      let { resolve, reject, equipmentCode, currentPage } =
        action.payload || {};
      currentPage = currentPage || 1;
      let { data } = yield call(getOrderList, {
        companyId,
        equipmentCode,
        page: 1,
        pageSize: 12,
      });
      if (data && data.code === 200) {
        if (resolve) resolve(data.data);
      } else {
        if (reject) reject(data.message);
      }
    },
    *addOrderAsync(action, { put, call, select, all }) {
      let {
        user: { companyId, userInfo },
      } = yield select();
      let { values, resolve, reject, forEdit } = action.payload || {};
      values.companyId = companyId;
      values.userName = userInfo.userName;
      values.userId = userInfo.userId;
      if (values.fileList && values.fileList.length) {
        let imagePaths = yield all([
          ...values.fileList.map((file) => call(upload, { file })),
        ]);
        if (imagePaths && imagePaths.length) {
          imagePaths = imagePaths.map((i) => i.data.data);
          values.workTicketsFiles = imagePaths[0].photoPath;
        }
      }
      values.workTicketsFiles = null;
      let { data } = yield call(forEdit ? updateOrder : addOrder, {
        ...values,
      });
      if (data && data.code === 200) {
        if (resolve) resolve();
        yield put({ type: 'fetchOrderList' });
      } else {
        if (reject) reject(data.message);
      }
    },
    // 工单趋势
    *initTrend(action, { put }) {
      yield put({ type: 'fetchOrderTrend' });
      yield put({ type: 'fetchOrderCheck' });
      yield put({ type: 'fetchOrderStatus' });
    },
    *fetchOrderTrend(action, { put, call, select }) {
      let {
        user: { companyId, startDate, endDate },
      } = yield select();
      let { resolve, reject } = action.payload || {};
      let { data } = yield call(getOrderTrend, {
        companyId,
        beginDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      });
      if (data && data.code === 200) {
        yield put({
          type: 'getOrderTrendResult',
          payload: { data: data.data },
        });
        if (resolve) resolve();
      } else {
        if (reject) reject(data.message);
      }
    },
    *fetchOrderCheck(action, { put, call, select }) {
      let {
        user: { companyId },
      } = yield select();
      let { data } = yield call(getOrderCheck, { companyId });
      if (data && data.code === 200) {
        yield put({
          type: 'getOrderCheckResult',
          payload: { data: data.data },
        });
      }
    },
    *fetchOrderStatus(action, { put, call, select }) {
      let {
        user: { companyId, startDate, endDate },
      } = yield select();
      let { data } = yield call(getOrderStatus, {
        companyId,
        beginDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      });
      if (data && data.code === 200) {
        yield put({
          type: 'getOrderStatusResult',
          payload: { data: data.data },
        });
      }
    },
    *initMaintain(action, { put, call }) {
      yield put({ type: 'mach/fetchMachList' });
      yield put({ type: 'userList/fetchUserList' });
      yield put({ type: 'fetchMaintainList' });
      yield put({ type: 'fetchMaintainSumInfo' });
    },
    *fetchMaintainList(action, { put, call, select }) {
      let {
        user: { companyId },
        order: { optional },
      } = yield select();
      let { currentPage } = action.payload || {};
      currentPage = currentPage || 1;
      let params = { companyId, page: currentPage, pageSize: 12 };
      Object.keys(optional).forEach((key) => {
        if (optional[key] && optional[key] !== 'all') {
          params[key] = optional[key];
        }
      });
      yield put({ type: 'toggleLoading' });
      let { data } = yield call(getMaintainList, params);
      if (data && data.code === 200) {
        yield put({
          type: 'getMaintainListResult',
          payload: { data: data.data, currentPage, total: data.total },
        });
      }
    },
    *fetchMaintainSumInfo(action, { put, call, select }) {
      let { data } = yield call(getMaintainSumInfo);
      if (data && data.code === 200) {
        yield put({
          type: 'getMaintainSumInfoResult',
          payload: { data: data.data },
        });
      }
    },
    *fetchMaintainDetail(action, { put, call, select }) {
      let { equipmentCode } = action.payload || {};
      let { data } = yield call(getMaintainDetail, { equipmentCode });
    },
  },
  reducers: {
    toggleLoading(state) {
      return { ...state, isLoading: true };
    },
    getOrderListResult(state, { payload: { data, currentPage, total } }) {
      return { ...state, orderList: data, currentPage, total };
    },
    getMaintainListResult(state, { payload: { data, currentPage, total } }) {
      return {
        ...state,
        maintainList: data,
        currentPage,
        total,
        isLoading: false,
      };
    },
    getMaintainSumInfoResult(state, { payload: { data } }) {
      let infoList = [
        {
          key: '1',
          title: '本月需保养设备数',
          value: data.localMonthMission,
          unit: '台',
        },
        {
          key: '2',
          title: '下月需保养设备数',
          value: data.nextMonthMission,
          unit: '台',
        },
        {
          key: '3',
          title: '超时未保养设备数',
          value: data.timeOutMission,
          unit: '台',
        },
        {
          key: '4',
          title: '维保准时率',
          value: (+data.onTimeRate).toFixed(1),
          unit: '%',
        },
      ];
      data.infoList = infoList;
      return { ...state, maintainSumInfo: data };
    },
    setOptional(state, { payload }) {
      return { ...state, optional: payload };
    },
    getOrderTrendResult(state, { payload: { data } }) {
      return { ...state, chartInfo: data };
    },
    getOrderCheckResult(state, { payload: { data } }) {
      return { ...state, checkInfo: data };
    },
    getOrderStatusResult(state, { payload: { data } }) {
      let infoList = [],
        total = 0;
      Object.keys(state.orderStatusMaps).forEach((key) => {
        total +=
          data.equipmentWorkStatusCount && data.equipmentWorkStatusCount[key]
            ? data.equipmentWorkStatusCount[key]
            : 0;
        infoList.push({
          key,
          title: state.orderStatusMaps[key].text,
          value:
            data.equipmentWorkStatusCount && data.equipmentWorkStatusCount[key]
              ? data.equipmentWorkStatusCount[key]
              : 0,
        });
      });
      infoList.push({ key: 6, title: '本月工单数', value: total });
      data.infoList = infoList;
      return { ...state, statusInfo: data };
    },
    reset() {
      return initialState;
    },
  },
};
