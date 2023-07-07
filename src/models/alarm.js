import {
  getRuleList,
  addRule,
  updateRule,
  delRules,
  bindRule,
  unbindRule,
  getRuleMachs,
  getRuleParams,
  getAlarmList,
  updateAlarmInfo,
  getAlarmPercent,
  getAlarmTrend,
  getAlarmRank,
} from '../services/alarmService';
import moment from 'moment';
let date = new Date();
const warningType = {
  1: '电气安全',
  2: '指标越限',
  3: '通讯异常',
};
// auth_type 用户权限（0：普通用户；1：区域维护人员；2：区域负责人）
const initialState = {
  ruleList: [],
  ruleMachs: [],
  currentPage: 1,
  total: 0,
  sensorTypes: [
    { title: '电表', key: 1 },
    { title: '震动', key: 4 },
  ],
  statusMaps: {
    0: '未处理',
    1: '已转维修工单',
    2: '已处理',
    3: '已消警',
  },
  ruleParams: [],
  alarmList: [],
  //  筛选条件
  optional: {},
  alarmPercent: {},
  alarmTrend: {},
  alarmRank: {},
  // 告警趋势状态

  // 告警列表执行----相关状态
  recordListInfo: {},
  executeType: [],
  recordHistory: [],
  recordProgress: [],
  isLoading: false,
};

export default {
  namespace: 'alarm',
  state: initialState,
  effects: {
    *cancelable({ task, payload, action }, { call, race, take }) {
      yield race({
        task: call(task, payload),
        cancel: take(action),
      });
    },
    *cancelAll(action, { put }) {
      yield put({ type: 'reset' });
    },
    *initAlarmSetting(action, { call, put }) {
      yield put({ type: 'fetchRuleList' });
      yield put({ type: 'mach/fetchMachList' });
      yield put({ type: 'fetchRuleParams' });
    },
    // 告警规则
    *fetchRuleList(action, { select, call, put }) {
      try {
        let {
          user: { companyId },
        } = yield select();
        let { currentPage } = action.payload || {};
        currentPage = currentPage || 1;
        let { data } = yield call(getRuleList, {
          companyId,
          page: currentPage,
          pageSize: 12,
        });
        if (data && data.code === 200) {
          yield put({
            type: 'getRuleListResult',
            payload: { data: data.data, currentPage, total: data.total },
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    *fetchRuleParams(action, { select, call, put, all }) {
      try {
        let { data } = yield call(getRuleParams);
        if (data && data.code === 200) {
          yield put({
            type: 'getRuleParamsResult',
            payload: { data: data.data },
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    *addRuleAsync(action, { select, call, put }) {
      try {
        let {
          user: { companyId },
        } = yield select();
        let { values, resolve, reject, forEdit } = action.payload;
        values.companyId = companyId;
        let { data } = yield call(forEdit ? updateRule : addRule, values);
        if (data && data.code === 200) {
          yield put({ type: 'fetchRuleList' });
          if (resolve) resolve();
        } else {
          if (reject) reject(data.msg);
        }
      } catch (err) {
        console.log(err);
      }
    },
    *delRulesAsync(action, { call, put }) {
      try {
        let { ruleId } = action.payload || {};
        let { data } = yield call(delRules, { ids: [ruleId] });
        if (data && data.code === 200) {
          yield put({ type: 'fetchRuleList' });
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 获取规则关联电机，电机关联规则
    *fetchRuleMachs(action, { call, put, select }) {
      let { warningRuleId } = action.payload || {};
      let { data } = yield call(getRuleMachs, { warningRuleId });
      if (data && data.code === 200) {
        yield put({ type: 'getRuleMachsResult', payload: { data: data.data } });
      }
    },
    *bindRuleAsync(action, { call, put, all }) {
      let { resolve, reject, warningRuleId, result } = action.payload || {};
      if (result.length) {
        let dataArr = yield all(
          result.map((i) =>
            call(
              i.action === 'bind' ? bindRule : unbindRule,
              i.action === 'bind'
                ? { warningRuleId, equipmentCode: i.payload }
                : { equipmentWarningRuleId: i.payload },
            ),
          ),
        );
        if (dataArr && dataArr.length) {
          if (resolve) resolve();
        } else {
          if (reject) reject('关联异常，请稍后再试');
        }
      }
    },
    // 安全监控相关code
    *fetchAlarmList(action, { select, call, put }) {
      try {
        let {
          user: { companyId, startDate, endDate },
          alarm: { optional },
        } = yield select();
        let { currentPage } = action.payload || {};
        currentPage = currentPage || 1;
        let params = {
          companyId,
          beginDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          page: currentPage,
          pageSize: 12,
        };
        Object.keys(optional).forEach((key) => {
          if (optional[key] || optional[key] === 0) {
            params[key] = optional[key];
          }
        });
        yield put({ type: 'toggleLoading' });
        let { data } = yield call(getAlarmList, params);
        if (data && data.code === 200) {
          yield put({
            type: 'getAlarmListResult',
            payload: { data: data.data, currentPage, total: data.total },
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    *updateAlarmAsync(action, { select, call, put }) {
      let { values, resolve, reject } = action.payload || {};
      let { data } = yield call(updateAlarmInfo, values);
      if (data && data.code === 200) {
        if (resolve) resolve();
        yield put({ type: 'fetchAlarmList' });
      } else {
        if (reject) reject(data.message);
      }
    },
    *initAnalysis(action, { select, call, put }) {
      let {
        user: { startDate, endDate, timeType },
      } = yield select();
      yield put({ type: 'fetchAlarmPercent' });
      yield put({ type: 'fetchAlarmTrend' });
      yield put({ type: 'fetchAlarmRank' });
    },
    *fetchAlarmPercent(action, { select, call, put }) {
      let {
        user: { companyId, startDate, endDate },
        alarm: { optional },
      } = yield select();
      let { resolve, reject } = action.payload || {};
      let params = {
        companyId,
        beginDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      };
      Object.keys(optional).forEach((key) => {
        if (optional[key]) {
          params[key] = optional[key];
        }
      });
      let { data } = yield call(getAlarmPercent, params);
      if (data && data.code === 200) {
        yield put({
          type: 'getAlarmPercentResult',
          payload: { data: data.data },
        });
        if (resolve) resolve();
      } else {
        if (reject) reject();
      }
    },
    *fetchAlarmTrend(action, { select, call, put }) {
      let {
        user: { companyId, startDate, endDate, timeType },
        alarm: { optional },
      } = yield select();
      // 1是月维度 2是日维度 , 3是时维度
      let { resolve, reject } = action.payload || {};
      let params = {
        companyId,
        timeType: timeType === '10' ? '2' : timeType,
        beginDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      };
      Object.keys(optional).forEach((key) => {
        if (optional[key]) {
          params[key] = optional[key];
        }
      });
      let { data } = yield call(getAlarmTrend, params);
      if (data && data.code === 200) {
        yield put({
          type: 'getAlarmTrendResult',
          payload: { data: data.data },
        });
        if (resolve) resolve();
      } else {
        if (reject) reject(data.message);
      }
    },
    *fetchAlarmRank(action, { select, call, put }) {
      let {
        user: { companyId, startDate, endDate, timeType },
      } = yield select();
      let { resolve, reject } = action.payload || {};
      let params = {
        companyId,
        beginDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      };
      let { data } = yield call(getAlarmRank, params);
      if (data && data.code === 200) {
        yield put({ type: 'getAlarmRankResult', payload: { data: data.data } });
        if (resolve) resolve();
      } else {
        if (reject) reject(data.message);
      }
    },
    // 告警详情页
    *fetchSumInfo(action, { call, put, select, all }) {
      try {
        let { resolve, reject } = action.payload || {};
        let {
          user: { company_id, startDate, endDate },
        } = yield select();
        let begin_date = startDate.format('YYYY-MM-DD');
        let end_date = endDate.format('YYYY-MM-DD');
        yield put({ type: 'toggleLoading' });
        let [sumData, typeData, machData, fieldData] = yield all([
          call(getWarningDetail, { company_id, begin_date, end_date }),
          call(getWarningAnalyze, { company_id, begin_date, end_date }),
          call(getMachWarning, { company_id, begin_date, end_date }),
          call(getFieldWarning, { company_id, begin_date, end_date }),
        ]);
        if (
          sumData.data.code === '0' &&
          typeData.data.code === '0' &&
          machData.data.code === '0' &&
          fieldData.data.code === '0'
        ) {
          yield put({
            type: 'getSumInfo',
            payload: {
              sumInfo: sumData.data.data,
              typeInfo: typeData.data.data,
              machWarning: machData.data.data,
              fieldWarning: fieldData.data.data,
            },
          });
          if (resolve && typeof resolve === 'function') resolve();
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 诊断报告内的告警详情页
    *fetchReportSumInfo(action, { call, put, select, all }) {
      try {
        let { resolve, reject } = action.payload || {};
        let {
          user: { company_id, startDate, endDate },
        } = yield select();
        let begin_date = startDate.format('YYYY-MM-DD');
        let end_date = endDate.format('YYYY-MM-DD');
        let [sumInfo, detailInfo] = yield all([
          call(getWarningDetail, { company_id, begin_date, end_date }),
          call(getWarningAnalyze, { company_id, begin_date, end_date }),
        ]);
        if (sumInfo.data.code === '0' && detailInfo.data.code === '0') {
          yield put({
            type: 'getReportSumInfo',
            payload: {
              sumInfo: sumInfo.data.data,
              detailInfo: detailInfo.data.data,
            },
          });
          if (resolve && typeof resolve === 'function') resolve();
        } else {
          if (reject && typeof reject === 'function') reject();
        }
      } catch (err) {
        console.log(err);
      }
    },
    //
    // 告警列表页
    *fetchRecordList(action, { select, call, put }) {
      try {
        let {
          user: { company_id, pagesize },
          alarm: { pageNum },
        } = yield select();
        let { cate_code, keywords } = action.payload || {};
        cate_code = cate_code ? cate_code : '1';
        let params = { company_id, page: pageNum, pagesize, cate_code };
        if (keywords) {
          params['keywords'] = keywords;
        }
        yield put({ type: 'toggleLoading' });
        let { data } = yield call(getRecordList, params);
        if (data && data.code === '0') {
          yield put({
            type: 'getRecord',
            payload: { list: data.data, count: data.count },
          });
        } else if (data && data.code === '1001') {
          yield put({ type: 'user/loginOut' });
        }
      } catch (err) {
        console.log(err);
      }
    },

    *fetchRecordDetail(action, { select, call, put }) {
      try {
        let {
          user: { company_id },
        } = yield select();
        let { data } = yield call(getRecordDetail, {
          company_id,
          record_id: action.payload,
        });
      } catch (err) {
        console.log(err);
      }
    },
    *fetchExecuteType(action, { call, put }) {
      try {
        let { data } = yield call(getExecuteType);
        if (data && data.code === '0') {
          yield put({ type: 'getExecuteType', payload: { data: data.data } });
        } else if (data && data.code === '1001') {
          yield put({ type: 'user/loginOut' });
        }
      } catch (err) {
        console.log(err);
      }
    },
    *fetchRecordHistory(action, { call, put }) {
      try {
        let { data } = yield call(getHistoryLog, { mach_id: action.payload });
        if (data && data.code === '0') {
          yield put({ type: 'getRecordHistory', payload: { data: data.data } });
        }
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },
    *fetchProgressInfo(action, { call, put }) {
      try {
        let { data } = yield call(getProgressLog, {
          record_id: action.payload,
        });
        if (data && data.code) {
          yield put({ type: 'getProgress', payload: { data: data.data } });
        }
      } catch (err) {
        console.log(err);
      }
    },
    *confirmRecord(action, { select, call, put, all }) {
      try {
        let {
          user: { company_id },
        } = yield select();
        let {
          record_id,
          oper_code,
          execute_type,
          execute_info,
          photos,
          resolve,
          reject,
        } = action.payload;
        // photos字段是上传到upload接口返回的路径
        let uploadPaths;
        if (photos && photos.length) {
          let imagePaths = yield all([
            ...photos.map((file) => call(uploadImg, { file })),
          ]);
          uploadPaths = imagePaths.map((i) => i.data.data.filePath);
        }
        let { data } = yield call(confirmRecord, {
          company_id,
          record_id,
          photos: uploadPaths,
          log_desc: execute_info,
          oper_code,
          type_id: execute_type,
        });
        if (data && data.code === '0') {
          resolve();
          yield put({ type: 'fetchProgressInfo', payload: record_id });
          yield put({ type: 'fetchRecordList', payload: {} });
        } else if (data && data.code === '1001') {
          yield put({ type: 'user/loginOut' });
        } else {
          reject(data.msg);
        }
      } catch (err) {
        console.log(err);
      }
    },
    *setSceneInfo(action, { select, call, put }) {
      try {
        let {
          user: { company_id },
        } = yield select();
        let { file, resolve, reject } = action.payload || {};
        let { data } = yield call(uploadImg, { file });
        if (data && data.code === '0') {
          let imgPath = data.data.filePath;
          let sceneData = yield call(setSceneInfo, {
            company_id,
            image_path: imgPath,
          });
          if (sceneData && sceneData.data.code === '0') {
            yield put({ type: 'fetchSceneInfo' });
            if (resolve && typeof resolve === 'function') resolve();
          } else {
            if (reject && typeof reject === 'function')
              reject(sceneData.data.msg);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  reducers: {
    toggleLoading(state) {
      return { ...state, isLoading: true };
    },
    getRuleListResult(state, { payload: { data, currentPage, total } }) {
      return { ...state, ruleList: data, currentPage, total };
    },
    getRuleParamsResult(state, { payload: { data } }) {
      return { ...state, ruleParams: data };
    },
    getRuleMachsResult(state, { payload: { data } }) {
      return { ...state, ruleMachs: data };
    },
    getAlarmListResult(state, { payload: { data, currentPage, total } }) {
      return {
        ...state,
        alarmList: data,
        currentPage,
        total,
        isLoading: false,
      };
    },
    getAlarmPercentResult(state, { payload: { data } }) {
      return { ...state, alarmPercent: data };
    },
    getAlarmTrendResult(state, { payload: { data } }) {
      return { ...state, alarmTrend: data };
    },
    getAlarmRankResult(state, { payload: { data } }) {
      return { ...state, alarmRank: data };
    },
    setOptional(state, { payload }) {
      return { ...state, optional: payload };
    },
    getExecuteType(state, { payload: { data } }) {
      return { ...state, executeType: data };
    },
    getRecordHistory(state, { payload: { data } }) {
      return { ...state, recordHistory: data };
    },
    getProgress(state, { payload: { data } }) {
      return { ...state, recordProgress: data };
    },
    setPageNum(state, { payload }) {
      return { ...state, pageNum: payload };
    },
    reset(state) {
      return initialState;
    },
  },
};
