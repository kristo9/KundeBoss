"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorWrongInput = exports.prepInput = void 0;
const sanitize = require('sanitize-html');
//const sanitizeHtml = (input: string) => sanitize(input);
/**
 * @description Sanitizes JSON and JSON[] objects
 * @param input: JSON | JSON[]
 * @returns JSON | JSON[]
 */
const sanitizeHtmlJson = (input) => JSON.parse(sanitize(JSON.stringify(input)));
/**
 * @description Sanitizes input and returns it. If input is null, context.res.status is sett to 400 and function returns null
 * @param context: Context
 * @param data: JSON | JSON[]
 * @returns JSON | JSON[] or null
 */
const prepInput = (context, input) => {
    if (input) {
        return sanitizeHtmlJson(input);
    }
    else {
        context.res = {
            'status': 400,
            'body': 'no body',
        };
        return null;
    }
};
exports.prepInput = prepInput;
/**
 * @description Sets context.res.status to 400, and context.res.body errorMsg.
 * @param context: Context
 * @param errorMsg: string = 'Wring input'
 */
const errorWrongInput = (context, errorMsg = 'Wrong input') => {
    context.res = {
        'status': 400,
        'body': errorMsg,
    };
    context.log(errorMsg);
};
exports.errorWrongInput = errorWrongInput;
//# sourceMappingURL=dataValidation.js.map