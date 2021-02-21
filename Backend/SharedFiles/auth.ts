const tenantID = "301091f0-e24f-43fa-bd87-59350cc3fbb6";
const clientID = "6bb502c3-c416-44f7-97cb-705b2b1a50ba";
const authority = "login.microsoftonline.com";
const version = "v2.0";
const discovery = "well-known/openid-configuration";
const scope = [
	"access_as_user"
];

const jwksUri = `https://${authority}/${tenantID}/discovery/${version}/keys`;
const issuer = `https://${authority}/${tenantID}/${version}`;
const audience = "6bb502c3-c416-44f7-97cb-705b2b1a50ba"; // TODO Kundeboss
//const audience = "8c5bb92b-060f-4c48-b577-12b9389d2c80"; // TODO LOCAL

module.exports.options = {
	audience: audience,
	issuer: issuer
};

let jwksClient = require('jwks-rsa');

let client = jwksClient({
	jwksUri: jwksUri
});

let signingKey = null;

module.exports.getKey = (header, callback) => {
	if (signingKey == null) {

		client.getSigningKey(header.kid, (err, key) => {
			signingKey = key.publicKey;
			callback(null, signingKey);
		});
	}
	else {
		callback(null, signingKey);
	}
}