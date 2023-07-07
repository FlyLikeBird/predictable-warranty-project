import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { authToken, apiToken } from '../utils/encryption';

export function getBoardList(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/dataView/getEquipmentDashboards?' + str, {
    method: 'GET',
  });
}

export function updateBoardList(data = {}) {
  let formData = new FormData();
  formData.append('companyId', data.companyId);
  formData.append('dashboardsDetail', JSON.stringify(data.dashboardsDetail));
  return request('/dataView/addEquipmentDashboards', {
    method: 'POST',
    body: formData,
  });
}
//
export function getMachStatus(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/dataView/getEquipmentStatusCount?' + str, {
    method: 'GET',
  });
}

export function getSumAlarm(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/dataView/getEquipmentWarningCount?' + str, {
    method: 'GET',
  });
}

export function getMachWarningRank(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/dataView/getEquipmentWarningRanking?' + str, {
    method: 'GET',
  });
}

export function getMachWarningTrend(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/warning/getEquipmentWarningTrend?' + str, {
    method: 'GET',
  });
}

export function getCostTrend(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/dataView/getCostsTrend?' + str, {
    method: 'GET',
  });
}
