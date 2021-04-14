"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (context, myTimer) => {
    var timeStamp = new Date().toISOString();
    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp);
};
//# sourceMappingURL=index.js.map