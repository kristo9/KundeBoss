// Dette er en test
export interface IAllCustomerInformation {
  _id: string;
  contact: IContactPerson;
  comment: string;
  infoReference: string;
  tags: { tag: string }[];
  suppliers: {
    id: string;
    contact: IContactPerson;
  }[];
  mails: IMail[];

  categories: ICategory[];
  customerAgreements: string[];
}

interface IContactPerson {
  name: string;
  mail: string;
  number: number;
}

interface IMail {
  _id: string;
  date: string;
  sender: string;
  subject: string;
  text: string;
  recivers: IMailReciver;
}

interface IMailReciver {
  id: string;
  name: string;
  reply: string;
  replyId: string;
  type: string;
}

interface ICategory {
  values: IValue[];
}
interface IValue {
  name: string;
  value: any;
}
