"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorQuery = void 0;
/**
 * @description Sets status and result body when db query failes
 * @param context
 * @param errorMsg
 */
const errorQuery = (context, errorMsg = 'Error running query') => {
    context.log(errorMsg);
    context.res = {
        status: 500,
        'headers': {
            'Content-Type': 'application/json',
        },
        body: errorMsg,
    };
};
exports.errorQuery = errorQuery;
//# sourceMappingURL=auth.js.map