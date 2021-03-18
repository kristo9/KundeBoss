//
// MOCK MOCK MOCK MOCK MOCK MOCK MOCK MOCK MOCK MOCK
//
let username = null;

function callApi(endpoint, token, data) {}

function prepareCall(apiName, data = null) {}

export function callLogin() {}

export function getCustomer(id: string) {}

export function getEmployee(tag = null): Promise<any> {
  return Promise.resolve();
}

export function modifyEmployeeData(
  employeeId: string = null,
  name: string = null,
  admin: string = null,
  isCustomer: boolean = null,
  customers: any
) {}

export function setUsername(user) {}

export function isLogedIn() {}

export function logToken() {}
