import { Context, HttpRequest } from "@azure/functions"
import { verify } from "jsonwebtoken"

const auth = require('../SharedFiles/auth');

export default (context: Context, req: HttpRequest): any => {

    let token = req.headers.authorization;

    if (token) {
        token = req.headers.authorization.replace(/^Bearer\s+/, "");
    }
    else {
        context.res = {
            status: 400,
            body: {
                "error": "no token"
            }
        };
        return context.done();
    }

    verify(token, auth.getKey, auth.options, (err: any, decoded: { [x: string]: any; }) => {
        // verified and decoded token
        if (err) {
            auth.signingKey = null;
            // invalid token
            context.res = {
                status: 401,
                body: {
                    'name': "unauthorized",
                }
            };

            return context.done();

        } else {
            context.res = {
                status: 200,
                body: {
                    'name': decoded['name'],
                    'issued-by': decoded['iss'],
                    'issued-for': decoded['aud'],
                    'using-scope': decoded['scp']
                }
            };
        }
        context.done();
    });
};