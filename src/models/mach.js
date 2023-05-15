import {
  getTplList,
  getMachRunningStatus,
  getMachRunningParams,
  getMachRunningChart,
  getMachList,
  addMach,
  updateMach,
  delMach,
  getUnbindSensors,
  getBindSensors,
  getSensorModelList,
  getSensorList,
  addSensor,
  updateSensor,
  delSensor,
  bindSensor,
  unbindSensor,
  upload,
} from '../services/machService';
import { getRuleParams, getParamRuleInfo } from '../services/alarmService';

const initialState = {
  list: [],
  tplList: [],
  currentPage: 1,
  isLoading: false,
  total: 0,
  sensorList: [],
  sensorTypes: [
    { title: '电表', key: 1 },
    { title: '震动', key: 4 },
  ],
  sensorModelMaps: {},
  ruleParams: [],
  //  筛选条件
  optional: {},
  // 获取可绑定的传感器列表
  unbindSensors: [],
  // 获取当前设备已绑定的传感器
  bindSensors: [],
  // 设备状态列表
  statusList: [],

  detailInfo: {},
  chartInfo: {},
};

export default {
  namespace: 'mach',
  state: initialState,
  effects: {
    *initMachList(action, { put, call }) {
      yield put({ type: 'userList/fetchUserList' });
      yield put({ type: 'fetchUnbindSensors' });
      yield put({ type: 'fetchMachList' });
      yield put({ type: 'fetchTplList' });
    },
    *fetchTplList(action, { put, call }) {
      let { data } = yield call(getTplList);
      if (data && data.code === 200) {
        yield put({ type: 'getTplListResult', payload: { data: data.data } });
      }
    },
    *fetchMachList(action, { put, call, select }) {
      let {
        user: { companyId },
      } = yield select();
      let { currentPage, pageSize } = action.payload || {};
      currentPage = currentPage || 1;
      pageSize = pageSize || 12;
      yield put({ type: 'toggleLoading' });
      let { data } = yield call(getMachList, {
        companyId,
        page: currentPage,
        pageSize,
      });
      if (data && data.code === 200) {
        yield put({
          type: 'getMachListResult',
          payload: { data: data.data, currentPage, total: data.total },
        });
      }
    },
    *fetchUnbindSensors(action, { put, call, select }) {
      let {
        user: { companyId },
      } = yield select();
      let { data } = yield call(getUnbindSensors, { companyId });
      if (data && data.code === 200) {
        yield put({
          type: 'getUnbindSensorsResult',
          payload: { data: data.data },
        });
      }
    },
    *fetchBindSensors(action, { put, call, select }) {
      let { equipmentCode, resolve, reject } = action.payload || {};
      let { data } = yield call(getBindSensors, { equipmentCode });
      if (data && data.code === 200) {
        yield put({
          type: 'getBindSensorsResult',
          payload: { data: data.data },
        });
        if (resolve) resolve(data.data);
      } else {
        if (reject) reject(data.message);
      }
    },
    *addMachAsync(action, { put, call, select, all }) {
      let {
        user: { companyId },
      } = yield select();
      let { values, resolve, reject, forEdit } = action.payload || {};
      values.companyId = companyId;
      if (values.fileList && values.fileList.length) {
        let imagePaths = yield all([
          ...values.fileList.map((file) => call(upload, { file })),
        ]);
        if (imagePaths && imagePaths.length) {
          imagePaths = imagePaths.map((i) => i.data.data);
          values.equipmentPhotoPath = imagePaths[0].photoPath;
        }
      }
      values.fileList = null;
      let { data } = yield call(forEdit ? updateMach : addMach, { ...values });
      if (data && data.code === 200) {
        // 判断是否有绑定的传感器
        if (values.sensorList) {
          let dataArr = yield all(
            values.sensorList.map((item) =>
              call(
                item.action === 'bind' ? bindSensor : unbindSensor,
                item.action === 'bind'
                  ? {
                      equipmentCode: values.equipmentCode,
                      sensorCode: item.payload,
                    }
                  : { equipmentSensorId: item.payload },
              ),
            ),
          );
          if (dataArr && dataArr.length) {
          } else {
            if (reject) reject(data.message);
          }
        }
        // 有可能执行解绑操作，重新获取未绑定的传感器列表
        yield put({ type: 'fetchUnbindSensors' });
        if (resolve) resolve();
        yield put({ type: 'fetchMachList' });
      } else {
        if (reject) reject(data.message);
      }
    },
    *delMachAsync(action, { put, call, select }) {
      let { resolve, reject, equipmentCode } = action.payload || {};
      let { data } = yield call(delMach, { equipmentCode });
      if (data && data.code === 200) {
        if (resolve) {
          yield put({ type: 'fetchMachList' });
        }
      } else {
        if (reject) reject(data.message);
      }
    },
    // 传感器
    *fetchSensorModels(action, { put, call, select, all }) {
      let {
        mach: { sensorTypes },
      } = yield select();
      let dataArr = yield all(
        sensorTypes.map((i) => call(getSensorModelList, { energyType: i.key })),
      );
      if (dataArr && dataArr.length) {
        let result = sensorTypes.reduce((sum, cur, index) => {
          sum[cur.key] = dataArr[index].data.data;
          return sum;
        }, {});
        yield put({ type: 'getSensorModelsResult', payload: { data: result } });
      }
    },
    *fetchSensorList(action, { put, call, select }) {
      let {
        user: { companyId },
        mach: { optional },
      } = yield select();
      let { currentPage } = action.payload || {};
      currentPage = currentPage || 1;
      let params = { companyId, page: currentPage, pageSize: 12 };
      Object.keys(optional).forEach((key) => {
        if (optional[key]) {
          params[key] = optional[key];
        }
      });
      let { data } = yield call(getSensorList, params);
      if (data && data.code === 200) {
        yield put({
          type: 'getSensorResult',
          payload: { data: data.data, currentPage },
        });
      }
    },
    *addSensorAsync(action, { put, call, select, all }) {
      let {
        user: { companyId },
      } = yield select();
      let { values, resolve, reject, forEdit, forDel } = action.payload || {};
      values.companyId = companyId;
      if (forDel) {
        values.deleteStatus = 1;
      }
      let { data } = yield call(forEdit ? updateSensor : addSensor, {
        ...values,
      });
      if (data && data.code === 200) {
        yield put({ type: 'fetchSensorList' });
        if (resolve) resolve();
      } else {
        if (reject) reject(data.message);
      }
    },
    *fetchMachRunningStatus(action, { put, call, select }) {
      let {
        user: { companyId },
      } = yield select();
      let { data } = yield call(getMachRunningStatus, { companyId });
      if (data && data.code === 200) {
        yield put({
          type: 'getMachRunningStatusResult',
          payload: { data: data.data },
        });
      }
    },
    *fetchMachRunningParams(action, { put, call, select }) {
      let {
        user: { companyId },
      } = yield select();
      let { equipmentCode } = action.payload || {};
      let { data } = yield call(getMachRunningParams, {
        companyId,
        equipmentCode,
      });
    },
    *fetchMachRunningChart(action, { put, call, select }) {
      let {
        user: { companyId, startDate, endDate },
      } = yield select();
      let { resolve, reject, currentDate, equipmentCode } =
        action.payload || {};
      let dateStr = currentDate.format('YYYY-MM-DD');
      let { data } = yield call(getMachRunningChart, {
        companyId,
        equipmentCode,
        beginDate: dateStr + ' 00:00:00',
        endDate: dateStr + ' 23:59:59',
      });
      if (data && data.code === 200) {
        resolve(data.data);
      } else {
        reject(data.message);
      }
    },
    *fetchRuleParams(action, { put, call, select }) {
      let { equipmentCode } = action.payload || {};
      let { data } = yield call(getRuleParams, { equipmentCode });
      if (data && data.code === 200) {
        yield put({
          type: 'getRuleParamsResult',
          payload: { data: data.data },
        });
      }
    },
    *fetchParamRuleInfo(action, { put, call, select }) {
      let {
        user: { companyId },
      } = yield select();
      let { resolve, reject, runtimeMetricsId, equipmentCode } =
        action.payload || {};
      let { data } = yield call(getParamRuleInfo, {
        companyId,
        runtimeMetricsId,
        equipmentCode,
      });
      if (data && data.code === 200) {
        resolve(data.data);
      } else {
        reject(data.message);
      }
    },
  },
  reducers: {
    toggleLoading(state) {
      return { ...state, isLoading: true };
    },
    getMachListResult(state, { payload: { data, currentPage, total } }) {
      return { ...state, list: data, currentPage, total, isLoading: false };
    },
    getBindSensorsResult(state, { payload: { data } }) {
      return { ...state, bindSensors: data };
    },
    getUnbindSensorsResult(state, { payload: { data } }) {
      return { ...state, unbindSensors: data };
    },
    getSensorResult(state, { payload: { data, currentPage, total } }) {
      return { ...state, sensorList: data, currentPage, total };
    },
    getSensorModelsResult(state, { payload: { data } }) {
      return { ...state, sensorModelMaps: data };
    },
    getTplListResult(state, { payload: { data } }) {
      return { ...state, tplList: data };
    },
    getMachRunningStatusResult(state, { payload: { data } }) {
      return { ...state, statusList: data };
    },
    getRuleParamsResult(state, { payload: { data } }) {
      return { ...state, ruleParams: data };
    },
    setOptional(state, { payload }) {
      return { ...state, optional: payload };
    },
    reset() {
      return initialState;
    },
  },
};
