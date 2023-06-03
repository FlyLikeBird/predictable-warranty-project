import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { authToken, apiToken } from '../utils/encryption';

export function getOrderList(data = {}) {
  let token = apiToken();
  // data.token = token;
  let str = translateObj(data);
  return request('/workTickets/getEquipmentWorkTicketsList?' + str, {
    method: 'GET',
  });
}

export function getOrderDetail(data = {}) {
  let token = apiToken();
  // data.token = token;
  let str = translateObj(data);
  return request('/workTickets/getEquipmentWorkTickets?' + str, {
    method: 'GET',
  });
}
export function getOrderRecords(data = {}) {
  let token = apiToken();
  // data.token = token;
  let str = translateObj(data);
  return request('/workTickets/getEquipmentWorkTicketsRecords?' + str, {
    method: 'GET',
  });
}

// 添加工单信息
export function addOrder(data = {}) {
  let token = apiToken();
  data.token = token;
  let params = {};
  Object.keys(data).forEach((key) => {
    if (data[key]) {
      params[key] = data[key];
    }
  });
  return request('/workTickets/addEquipmentWorkTickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(params),
  });
}

export function updateOrder(data = {}) {
  let token = apiToken();
  data.token = token;
  let params = {};
  Object.keys(data).forEach((key) => {
    if (data[key]) {
      params[key] = data[key];
    }
  });
  return request('/workTickets/updateEquipmentWorkTickets', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(params),
  });
}

export function getOrderFitting(data = {}) {
  let token = apiToken();
  // data.token = token;
  let str = translateObj(data);
  return request('/workTickets/getEquipmentWorkTicketsFittings?' + str, {
    method: 'GET',
  });
}

export function getOrderTrend(data = {}) {
  let token = apiToken();
  // data.token = token;
  let str = translateObj(data);
  return request('/workTickets/analyse/getEquipmentWorkTicketsTrend?' + str, {
    method: 'GET',
  });
}

export function getOrderCheck(data = {}) {
  let token = apiToken();
  // data.token = token;
  let str = translateObj(data);
  return request(
    '/workTickets/analyse/getEquipmentWorkTicketsPersonnel?' + str,
    {
      method: 'GET',
    },
  );
}

export function getOrderStatus(data = {}) {
  let token = apiToken();
  // data.token = token;
  let str = translateObj(data);
  return request('/dataView/getEquipmentWorkStatusCount?' + str, {
    method: 'GET',
  });
}

// 保养计划
export function getMaintainList(data = {}) {
  let token = apiToken();
  // data.token = token;
  let str = translateObj(data);
  return request('/wisdomOM/getUpkeepProject?' + str, {
    method: 'GET',
  });
}
export function getMaintainDetail(data = {}) {
  let token = apiToken();
  // data.token = token;
  let str = translateObj(data);
  return request('/wisdomOM/getUpkeepProjectDetail?' + str, {
    method: 'GET',
  });
}
export function getMaintainSumInfo(data = {}) {
  let token = apiToken();
  // data.token = token;
  let str = translateObj(data);
  return request('/wisdomOM/getUpkeepProjectCount?' + str, {
    method: 'GET',
  });
}
