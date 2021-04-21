"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataValidation_1 = require("../SharedFiles/dataValidation");
const dataBase_1 = require("../SharedFiles/dataBase");
const auth_1 = require("../SharedFiles/auth");
/**
 * @description Get alle data about a customer
 * @param contect : Context
 * @param req : HttpRequest
 */
exports.default = (context, req) => {
    var _a;
    req.body = dataValidation_1.prepInput(context, req.body);
    /*  Returns if there are no request body */
    if (req.body === null) {
        return context.done();
    }
    let replyId = null;
    let replyText = null;
    /**
     * @description Registeres reply in database
     * @param db : database connection
     */
    const functionQuery = (db) => {
        db.collection(dataBase_1.collections.mail).updateOne({ 'receivers.replyId': replyId }, { '$set': { 'receivers.$.reply': { 'text': replyText, 'date': new Date() } } }, (error, docs) => {
            if (error) {
                auth_1.errorQuery(context);
                context.res.body = { text: 'Something went wrong' };
                return context.done();
            }
            if (docs.modifiedCount === 1) {
                context.log('Success!');
                context.res = {
                    body: { text: replyText ? 'Reply text registered' : 'Confirmation registered' },
                };
            }
            else {
                context.log('No document found');
                context.res = {
                    status: 400,
                    body: {
                        text: 'Error, not found',
                    },
                };
            }
            context.done();
        });
    };
    if (req.body.replyId) {
        replyId = req.body.replyId;
        if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.replyText) {
            if (req.body.replyText.length < 1000) {
                replyText = req.body.replyText;
            }
            else {
                context.res = {
                    status: 400,
                    body: {
                        text: 'Feil, hold svartekst under 1000 tegn',
                    },
                };
                return context.done();
            }
        }
        dataBase_1.connectWrite(context, functionQuery);
    }
    else {
        context.res.body = 'No replyId found';
        return context.done();
    }
};
//# sourceMappingURL=index.js.map