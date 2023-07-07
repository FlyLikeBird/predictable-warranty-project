import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { authToken, apiToken } from '../utils/encryption';

// 计费方案
export function getRateList(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/energyEleRate/getEnergyEleRate?' + str, {
    method: 'GET',
  });
}

export function addRate(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/energyEleRate/addEnergyEleRate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: str,
  });
}

export function updateRate(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/energyEleRate/updateEnergyEleRate', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: str,
  });
}

export function delRate(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/energyEleRate/deleteEnergyEleRateById', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: str,
  });
}

// 具体的计费规则
export function addQuarter(data = {}) {
  let token = apiToken();
  data.token = token;
  return request('/energyEleRate/addEnergyEleRateQuarter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data.payload),
  });
}
export function updateQuarter(data = {}) {
  let token = apiToken();
  data.token = token;
  return request('/energyEleRate/updateEnergyEleRateQuarter', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data.payload),
  });
}
export function delQuarter(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/energyEleRate/deleteEnergyEleRateQuarterById', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: str,
  });
}

// 获取模板
export function getTpl(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/energyEleRate/getEleRateTmpList?' + str, {
    method: 'GET',
  });
}
export function getTplQuarterList(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/energyEleRate/getEleRateQuarterTmpByTmpId?' + str, {
    method: 'GET',
  });
}

// 获取和设置能源费率信息
export function getFeeRate(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/energyEleRate/getRateInfo?' + str, {
    method: 'GET',
  });
}

export function setFeeRate(data = {}) {
  return request
    .post('/client/energyRateInfo/addRateInfo', { data, baseURL })
    .catch((err) => console.log(err));
}

export function isActive(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/feerate/activerate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: str,
  });
}

export function isUnActive(data = {}) {
  let token = apiToken();
  data.token = token;
  let str = translateObj(data);
  return request('/feerate/unactive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: str,
  });
}
