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
    console.log(req.body.replyText);
    let replyId = null;
    let replyText = null;
    /**
     * @description Registeres reply in database
     * @param db : database connection
     */
    const functionQuery = (db) => {
        db.collection(dataBase_1.collections.mail).findOne({ 'receivers.replyId': replyId }, {}, (error, docs) => {
            var _a, _b, _c;
            if (error) {
                auth_1.errorQuery(context);
                context.res.body = { text: 'Something went wrong' };
                return context.done();
            }
            let reply = (_c = (_b = (_a = docs === null || docs === void 0 ? void 0 : docs.receivers) === null || _a === void 0 ? void 0 : _a.find((receiver) => receiver.replyId == replyId)) === null || _b === void 0 ? void 0 : _b.reply) === null || _c === void 0 ? void 0 : _c.text;
            let newReply;
            if (!reply && !replyText) {
                newReply = { 'text': null, 'date': new Date() };
            }
            else {
                newReply = { 'text': (reply ? reply : '') + replyText + '\n\n', 'date': new Date() };
            }
            db.collection(dataBase_1.collections.mail).updateOne({ 'receivers.replyId': replyId }, {
                '$set': {
                    'receivers.$.reply': newReply,
                    'seenBy': [],
                },
            }, (error, docs) => {
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
        });
    };
    if (req.body.replyId) {
        replyId = req.body.replyId;
        if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.replyText) {
            if (req.body.replyText.length < 1000) {
                replyText = req.body.replyText == 'null' ? null : req.body.replyText;
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