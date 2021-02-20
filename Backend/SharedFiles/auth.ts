const tenantID = "301091f0-e24f-43fa-bd87-59350cc3fbb6";
const clientID = "6bb502c3-c416-44f7-97cb-705b2b1a50ba";
const authority = "login.microsoftonline.com";
const version = "v2.0";
const discovery = "well-known/openid-configuration";
const scope = [
  "access_as_user"
];
/*module.exports.validateIssuer = true;
module.exports.passReqToCallback = false;
module.exports.loggingLevel = "info";*/

const jwksUri = `https://${authority}/${tenantID}/discovery/${version}/keys`;
const issuer = `https://${authority}/${tenantID}/${version}`;
const audience = "6bb502c3-c416-44f7-97cb-705b2b1a50ba";

module.exports.options = {
  jwksUri: jwksUri,
  issuer: issuer,
  audience: audience
};