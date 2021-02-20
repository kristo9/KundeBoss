const sanitizeHtml = require('sanitize-html');

module.exports.sanitizeHtml = (input: string) => sanitizeHtml(input);

module.exports.sanitizeHtmlJson = (input: JSON) => JSON.parse(sanitizeHtml(JSON.stringify(input)));

module.exports.name = (name: string) => name.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u) != null;

module.exports.phone = (number: any) => number.toString().match(/^[+]{1}[0-9]{10}$|^[0-9]{8}$|^[0-9]{12}$/) != null;

module.exports.mail = (mail: string) => mail.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) != null;

module.exports.age = (age: string) => age.match(/^[1]?[0-9]{1,2}$/) != null;

module.exports.date = (date: string) => date.match(/^(?:(?:31(-)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(-)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(-)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(-)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/) != null;

module.exports._id = (_id: string) => _id.match(/^[0-9a-f]{24}$/) != null;
