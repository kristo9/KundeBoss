"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.modifyEmployeeData = exports.deleteSupplier = exports.deleteCustomer = exports.deleteEmployee = exports.getEmployee = exports.getSupplier = exports.getCustomer = exports.getAllEmployees = exports.sendMailCustomer = exports.newSupplier = exports.newCustomer = exports.callLogin = void 0;
var node_fetch_1 = require("node-fetch");
var stuff_1 = require("./stuff");
function runTest() {
    return __awaiter(this, void 0, void 0, function () {
        var res, i;
        var _this = this;
        return __generator(this, function (_a) {
            res = [];
            for (i = 0; i < 1; ++i) {
                //res.push(callLogin());
                res.push(getCustomer('60782f09d4cd6b141cad9288'));
                //res.push(getEmployee());
                //res.push(getSupplier('605b37ae6c35ab18d8c49da7'));
            }
            res.forEach(function (r, index) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!(1 == 1)) return [3 /*break*/, 2];
                            _b = (_a = console).log;
                            _c = index + ' ';
                            return [4 /*yield*/, r];
                        case 1:
                            _b.apply(_a, [_c + (_d.sent())]);
                            _d.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
function callApi(endpoint, token, data) {
    var _this = this;
    //const headers = new Headers();
    var bearer = "Bearer " + token;
    data = data ? data : {};
    var headers = {
        // 'Accept': 'application/json',
        'Authorization': bearer
    };
    var options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    };
    console.log('Calling Web API...');
    return node_fetch_1["default"](endpoint, options).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
        var stat, body, _a, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    stat = response.status;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, response.json()];
                case 2:
                    body = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    console.log('error');
                    return [3 /*break*/, 4];
                case 4:
                    res = { body: body, stat: stat };
                    return [2 /*return*/, body];
            }
        });
    }); });
}
function prepareCall(apiName, data) {
    if (data === void 0) { data = null; }
    try {
        return callApi(stuff_1.apiConfig.uri + apiName, stuff_1.accessToken, data); //,role);
    }
    catch (error) {
        console.warn(error);
    }
}
/**
 * @description
 * @returns
 */
function callLogin() {
    console.log('callLogin');
    return prepareCall('LoginTrigger').then(function (response) {
        return response;
    });
}
exports.callLogin = callLogin;
/**
 * @description Creates new customer
 * @param id id of the customer you want to change. Use null to create a new customer
 * @param name name of company
 * @param mail mail to contact person
 * @param phone phone number to contact person
 * @param contactName name of contactperson
 * @param suppliers array, contains json objects (id, name) of suppliers
 * @param tags array, contains strings of tags
 * @param comment string,
 * @param infoReference
 * @returns json object ?
 */
function newCustomer(id, name, mail, phone, contactName, suppliers, tags, comment, 
//types: [] = null,
//typeValues: [] = null,
//customerAgreements: [],
infoReference) {
    if (phone === void 0) { phone = null; }
    if (contactName === void 0) { contactName = null; }
    if (suppliers === void 0) { suppliers = null; }
    if (tags === void 0) { tags = null; }
    if (comment === void 0) { comment = null; }
    if (infoReference === void 0) { infoReference = null; }
    var data = {
        name: name,
        phone: phone,
        mail: mail,
        contactName: contactName,
        suppliers: suppliers,
        tags: tags,
        comment: comment,
        infoReference: infoReference,
        id: id
    };
    return prepareCall('NewCustomer', data);
}
exports.newCustomer = newCustomer;
/*
newSupplier('Nasjonal catering', 'Padme@NC.com', 74839283, 'Padmé Amidala Naberrie', 'Senator of Naboo, former Queen of Naboo')
*/
/**
 * @description Creates a new supplier
 * @param id id of the supplier you want to change. Use null to create a new supplier
 * @param name
 * @param mail
 * @param phone
 * @param contactName
 * @param comment
 * @returns
 */
function newSupplier(id, name, mail, phone, contactName, comment
//mailgroup: null
) {
    if (phone === void 0) { phone = null; }
    if (contactName === void 0) { contactName = null; }
    if (comment === void 0) { comment = null; }
    var data = {
        name: name,
        phone: phone,
        mail: mail,
        contactName: contactName,
        comment: comment,
        id: id
    };
    return prepareCall('NewSupplier', data);
}
exports.newSupplier = newSupplier;
/**
 * @description Send mail to a customer and their suppliers
 * @param customerId : ObjectId
 * @param includeCustomer
 * @param text
 * @param subject
 * @param supplierIds : Optional, Array with the suppliers ObjectIds
 * @returns
 */
function sendMailCustomer(customerId, includeCustomer, text, subject, supplierIds) {
    if (supplierIds === void 0) { supplierIds = []; }
    var data = {
        customerId: {
            id: customerId,
            include: includeCustomer ? 'true' : 'false'
        },
        text: text,
        subject: subject,
        supplierIds: supplierIds
    };
    return prepareCall('SendMailCustomer', data);
}
exports.sendMailCustomer = sendMailCustomer;
/*      <button onClick={async () => {
          console.log("Her skal det komme tekst: ")
          console.log(await getAllEmployees())
          console.log("------------------------")}}>
          KNAPP
        </button>
        */
/**
 * @description Gets all the employees and their data
 * @returns an array of JSON objects with:<br>
 *  'name'                              - string<br>
 *  'employeeId'                        - string<br>
 *  'admin'                             - string<br>
 *  'customerInformation'               - array<br>
 *  'customerInformation._id'           - objectId<br>
 *  'customerInformation.name'          - string<br>
 *  'customerInformation.permission'    - string<br>
 *
 */
function getAllEmployees() {
    return prepareCall('GetAllEmployees');
}
exports.getAllEmployees = getAllEmployees;
/**
 * @description Gets information about the customer that was provided as a parameter
 * @param id customer mongodb id
 * @returns
 */
function getCustomer(id) {
    var customerId = {
        id: id
    };
    return prepareCall('GetCustomerData', customerId);
}
exports.getCustomer = getCustomer;
/**
 * Gets information about a supplier
 * @param id supplier mongodb id
 * @returns json object
 */
function getSupplier(id) {
    var supplierId = {
        id: id
    };
    return prepareCall('GetSupplierData', supplierId);
}
exports.getSupplier = getSupplier;
/**
 * @description Gets all customers that the user has access to. Return may be customized by tags
 * @param tag Keywords that some customers have attached
 * @returns a JSON object with:<br>
 *   '_id'                              - objectId<br>
 *  'name'                              - string<br>
 *  'employeeId'                        - string<br>
 *  'customerInformation'               - array<br>
 *  'customerInformation._id'           - objectId<br>
 *  'customerInformation.name'          - string<br>
 *  'customerInformation.contact.name'  - string<br>
 *  'customerInformation.contact.mail'  - string<br>
 *  'customerInformation.tags'          - array<br>
 */
function getEmployee(tag) {
    if (tag === void 0) { tag = null; }
    tag = {
        tag: tag
    };
    return prepareCall('GetCustomers', tag);
}
exports.getEmployee = getEmployee;
/**
 * @description Deletes a employee, the employees mails and mailGroup from the database
 * @param mail Mail to the employee which is to be deleted
 * @returns returns result. if result.n = 1 the employee is deleted.
 */
function deleteEmployee(mail) {
    var data = {
        mail: mail
    };
    return prepareCall('DeleteEmployee', data);
}
exports.deleteEmployee = deleteEmployee;
/**
 * @description Deletes a customer, the customers mails and mailGroup from the database
 * @param mail Mail to the customer which is to be deleted
 * @returns returns result. if result.n = 1 the customer is deleted.
 */
function deleteCustomer(mail) {
    var data = {
        mail: mail
    };
    return prepareCall('DeleteCustomer', data);
}
exports.deleteCustomer = deleteCustomer;
/**
 * @description Deletes a supplier, the suppliers mails and mailGroup from the database
 * @param id Mongodb id of the supplier which is to be deleted
 * @returns returns result. if result.n = 1 the supplier is deleted.
 */
function deleteSupplier(id) {
    var data = {
        id: id
    };
    return prepareCall('DeleteSupplier', data);
}
exports.deleteSupplier = deleteSupplier;
/**
 * @description Modifies employee data
 * @param employeeId the mail of employee
 * @param name name of employee
 * @param admin admin lvl of employee
 * @param isCustomer
 * @param customers usually JSON object ?
 * @returns
 */
function modifyEmployeeData(employeeId, name, admin, isCustomer, customers) {
    if (employeeId === void 0) { employeeId = null; }
    if (name === void 0) { name = null; }
    if (admin === void 0) { admin = null; }
    if (isCustomer === void 0) { isCustomer = null; }
    console.log('Calling ModifyEmployeeData function');
    var data = {
        employeeId: employeeId,
        name: name,
        admin: admin,
        isCustomer: isCustomer,
        customers: customers
    };
    return prepareCall('ModifyEmployeeData', data);
}
exports.modifyEmployeeData = modifyEmployeeData;
var suppliers = [
    {
        'id': '605b42ee425cc56cf089a7ff',
        'contactName': 'Padmé Amidala Naberrie',
        'mail': 'Padme@NC.com',
        'phone': 74839283
    },
    {
        'id': '605b37b56c35ab18d8c49da9',
        'contactName': null,
        'mail': 'didbje@gmail.com',
        'phone': null
    },
];
function callFunctions() {
    return __awaiter(this, void 0, void 0, function () {
        var x;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, newCustomer(null, 'Lando Traveling Agency', 'lando.cal@LTA.net', 48101993, 'Lando Calrissian', suppliers)];
                case 1:
                    x = _a.sent();
                    console.log(x);
                    return [2 /*return*/];
            }
        });
    });
}
callFunctions();
