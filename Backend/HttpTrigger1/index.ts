import { Context, HttpRequest } from "@azure/functions"
import { verify } from 'azure-ad-verify-token';
const auth = require('../SharedFiles/auth');

module.exports = (context: Context, req: HttpRequest): any => {

    let token = req.headers.authorization;

    if (token)
        token = req.headers.authorization.replace(/^Bearer\s+/, "");
    else {
        context.res = {
            status: 400,
            body: {
                "error": "no token"
            }
        };
        return context.done();
    }



    verify(token, auth.options)
        .then(decoded => {
            // verified and decoded token
            context.log("valid token");

            context.res = {
                status: 200,
                body: {
                    'name': decoded['name'],
                    'issued-by': decoded['iss'],
                    'issued-for': decoded['aud'],
                    'using-scope': decoded['scp']
                }
            };
            return context.done();
        })
        .catch(error => {
            // invalid token
            context.res = {
                status: 500,
                body: {
                    'name': "unauthorized",
                }
            };
            context.log("invalid token");
            return context.done();
        });
};