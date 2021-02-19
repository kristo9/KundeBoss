import { Context, HttpRequest } from "@azure/functions"
import { verify, VerifyOptions } from 'azure-ad-verify-token';
const auth = require('../SharedFiles/auth');

module.exports = (context: Context, req: HttpRequest): any => {

    let token = req.headers.authorization;

    if (token)
        token = req.headers.authorization.replace(/^Bearer\s+/, "");
    else {
        context.res = {
            status: 500,
            body: {
                "error": "no token"
            }
        };
        return context.done();
    }

    const options: VerifyOptions = {
        jwksUri: "https://login.microsoftonline.com/301091f0-e24f-43fa-bd87-59350cc3fbb6/discovery/v2.0/keys",
        issuer: `https://${auth.authority}/${auth.tenantID}/${auth.version}`,
        audience: auth.audience
    };

    verify(token, options)
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