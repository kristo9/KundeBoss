// Add here the endpoints and scopes for the web API you would like to use.
export const apiConfig = {
  uri: 'https://kundebossfunctionapp.azurewebsites.net/api/', // e.g. http://localhost:5000/api
  scopes: ['api://6bb502c3-c416-44f7-97cb-705b2b1a50ba/access_as_user'], // e.g. ["scp1", "scp2"]
};

export const apiConfigMail = {
  uri: 'https://mailparserfunctionapp.azurewebsites.net/api/',
  key: 'PK1L40wd6giUcSCJcg3guPxem6TROrIP1fyUdasaLcnhAOQdVy38Dw=='
}