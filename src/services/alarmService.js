import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { authToken, apiToken } from '../utils/encryption';

export function getRuleList(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/warning/warningRule/getEquipmentWarningRuleList?' + str, {
    method: 'GET',
  });
}

export function getRuleParams(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/equipment/getEquipmentRuntimeMetrics?' + str, {
    method: 'GET',
  });
}

export function getParamRuleInfo(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/warning/warningRule/getRuleByRuntimeMetricsId?' + str, {
    method: 'GET',
  });
}

export function addRule(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/warning/warningRule/addEquipmentWarningRule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: str,
  });
}

export function updateRule(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/warning/warningRule/editEquipmentWarningRule', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: str,
  });
}

export function delRules(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/warning/warningRule/deleteEquipmentWarningRule', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data.ids),
  });
}

export function getRuleMachs(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/warning/warningRule/getWarningRuleRelational?' + str, {
    method: 'GET',
  });
}

export function bindRule(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/warning/warningRule/addEquipmentWarningRuleRelational', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: str,
  });
}

export function unbindRule(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/warning/warningRule/removeEquipmentWarningRuleRelational', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: str,
  });
}
// 告警列表
export function getAlarmList(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/warning/getEquipmentWarningList?' + str, {
    method: 'GET',
  });
}

export function getAlarmPercent(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/warning/getEquipmentWarningPercentage?' + str, {
    method: 'GET',
  });
}

export function getAlarmTrend(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/warning/getEquipmentWarningTrend?' + str, {
    method: 'GET',
  });
}

export function getAlarmRank(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/dataView/getEquipmentWarningRanking?' + str, {
    method: 'GET',
  });
}
