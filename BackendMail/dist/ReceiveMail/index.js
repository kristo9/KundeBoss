"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataValidation_1 = require("../SharedFiles/dataValidation");
const dataBase_1 = require("../SharedFiles/dataBase");
const mailparser_1 = require("mailparser");
const auth_1 = require("../SharedFiles/auth");
/**
 * @description Get alle data about a customer
 * @param contect : Context
 * @param req : HttpRequest
 */
exports.default = (context, req) => {
    /*  Returns if there are no request body */
    if (req.body === null) {
        return context.done();
    }
    let replyId = null;
    let replyText = null;
    /**
     * @description Parses incoming mail
     */
    const parseMail = () => {
        try {
            mailparser_1.simpleParser(req.body).then((parsed) => {
                parsed = JSON.parse(JSON.stringify(parsed));
                let data = parsed.attachments[0].content.data;
                let decodedData = Buffer.from(data).toString();
                let dataArr = decodedData.split('--xYzZY');
                for (let i = 0, len = dataArr.length; i < len; ++i) {
                    if (dataArr[i].includes('name="subject"')) {
                        replyId = dataArr[i].substring(dataArr[i].lastIndexOf('<replyId:') + 9, dataArr[i].lastIndexOf('>'));
                    }
                    else if (dataArr[i].includes('name="text"')) {
                        replyText = dataArr[i].substring(dataArr[i].indexOf('name=') + 14);
                        replyText = replyText.substring(0, replyText.indexOf(process.env['EmailAddress'] + ' wrote:'));
                        replyText = replyText.substring(0, replyText.lastIndexOf('\n'));
                        replyText = replyText.replace(/^\s+|\s+$/g, '');
                        replyText = dataValidation_1.prepInput(context, replyText);
                    }
                }
                dataBase_1.connectWrite(context, functionQuery);
            });
        }
        catch (_a) {
            dataValidation_1.errorWrongInput(context, 'error while parsing mail');
            return context.done();
        }
    };
    /**
     * @description Registeres reply in database
     * @param db : database connection
     */
    const functionQuery = (db) => {
        db.collection(dataBase_1.collections.mail).updateOne({ 'receivers.replyId': replyId }, { '$set': { 'receivers.$.reply': { 'text': replyText, 'date': new Date() } } }, (error, docs) => {
            if (error) {
                auth_1.errorQuery(context);
                context.res.body = 'Something went wrong';
                return context.done();
            }
            if (docs.modifiedCount === 1) {
                context.log('Success!');
                /* fs.readFile(path.resolve(__dirname, 'index.html'), 'UTF-8', (err, htmlContent) => {
                  context.res.body = htmlContent;
                  return context.done(null, context.res);
                });*/
                context.res = {
                    body: '<body><script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>' +
                        '<div><lottie-player src="https://assets6.lottiefiles.com/packages/lf20_oiAkLg.json"background="transparent"' +
                        'speed="1"style="width: 300px; height: 300px; position: fixed; top: 30%; left: 40%"autoplay></lottie-player>' +
                        '<h6 style="position: fixed; top: 60%; left: 46%">CONFIRMATION SENT!</h6></div></body>',
                    headers: {
                        'Content-Type': 'text/html',
                    },
                };
            }
            else {
                context.log('No document found');
                context.res.body = 'Not found';
            }
            context.done();
        });
    };
    /* Determines if function was triggered by incoming mail (POST) or GET request  */
    if (req.method === 'GET') {
        /* Registeres reply in db */
        if (req.query.replyId) {
            replyId = req.query.replyId;
            dataBase_1.connectWrite(context, functionQuery);
        }
        else {
            context.res.body = 'No replyId found';
            context.done();
        }
    }
    else {
        /* Parses reply mail */
        parseMail();
    }
};
//# sourceMappingURL=index.js.map