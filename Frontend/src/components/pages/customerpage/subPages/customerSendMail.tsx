import React from 'react';
import { sendMailCustomer } from '../../../../azure/api';
import { InputField, TextArea } from '../../../basicComp/inputField';
import { useForm } from 'react-hook-form';

function SendMail({ customerInfo }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  //watch

  type FormValues = {
    subject: string;
    receiver: string;
    text: string;
    includeSuppliers: Array<{ supplierID: string; active: boolean }>;
    includeCustomer: boolean;
  };

  // sendMailCustomer('604a7ae0fe05bd49dcb6b7a1', true, 'Kan du komme på teams?', 'Teams', null);

  return (
    <div>
      <h1>Send Mail</h1>

      <form
        onSubmit={handleSubmit((data) => {
          sendMailCustomer(customerInfo._id, data.includeCustomer, data.text, data.subject, null);
          alert(JSON.stringify(data));
        })}
      >
        {/* <MyInput name={'subject'} label={'Emne'} register={register('subject')} /> */}

        <label htmlFor='subject'>Emne </label>
        <input {...register('subject', { required: true })} id='subject' />
        {errors.subject && <p>Dette er nødvendig</p>}

        <label htmlFor='receiver'>Til </label>
        <input {...register('receiver', { required: true })} id='receiver'></input>

        <label htmlFor='text'>Text </label>
        <input {...register('text', { required: true })} id='text' />

        <label htmlFor='includeSuppliers'>includeSuppliers:</label>
        <input type='checkbox' {...register('includeSuppliers')} id='includeSuppliers'></input>

        <label htmlFor='includeCustomer'>includeCustomer:</label>
        <input type='checkbox' {...register('includeCustomer')} id='includeCustomer'></input>

        {/* {customerInfo.suppliers.map((supplier) => {
          return <Test register={...register()} />;
        })} */}

        <button type='submit'>Send</button>
      </form>

      {/* <form>
        <InputField labelText={'Fra'} lableType={'text'} lableName={'from'} placeholderText={'System'} />
        <InputField labelText={'Emne'} lableType={'text'} lableName={'subject'} placeholderText={'Emne'} />
        <InputField
          labelText={'Til'}
          lableType={'text'}
          lableName={'receivers'}
          placeholderText={'Bedriftens navn'}
          defaultValue={
            customerInfo && customerInfo.contact && customerInfo.contact.mail ? customerInfo.contact.mail : ''
          }
        />
        <TextArea labelText={'Mail tekst'} lableType={'text'} lableName={'mailTekst'} placeholderText={'Mail tekst'} />

        <label id='test'>test</label>
        <input type='checkbox' name='' id='test'></input>
        <button
          type='submit'
          onClick={(e) => {
            e.preventDefault();
            sendMailCustomer(customerInfo._id, true, 'testTestTest', 'testEmne', null);
          }}
        >
          Send
        </button>
      </form> */}
    </div>
  );
}

interface testInput {
  name: string;
  label: string;
  register: any;
}

function MyInput(props: testInput) {
  return (
    <div>
      <label htmlFor={props.name}>{props.label}</label>
      <input name={props.name} id={props.name} placeholder='Jane' {...props.register} />
    </div>
  );
}

function TestTes(suppliers: any, register: any) {
  // return (
  //   {suppliers.map((supplier)=>{
  //     return(
  //       <label>
  //       <input name='fruit' type='checkbox' value='Banana' ref={register} />{' '}
  //       Banana
  //     </label>
  //     );
  //   })}
  // <div>
  //   <label>
  //     <input name='fruit' type='checkbox' value='Banana' ref={register({ required: 'Please select fruits' })} />{' '}
  //     Banana
  //   </label>
  //   <label>
  //     <input name='fruit' type='checkbox' value='Apple' ref={register({ required: 'Please select fruits' })} /> Apple
  //   </label>
  //   <label>
  //     <input name='fruit' type='checkbox' value='Cherry' ref={register({ required: 'Please select fruits' })} />{' '}
  //     Cherry
  //   </label>
  //   <label>
  //     <input name='fruit' type='checkbox' value='Watermelon' ref={register({ required: 'Please select fruits' })} />{' '}
  //     Watermelon
  //   </label>
  //   <label>
  //     <input name='fruit' type='checkbox' value='Raspberry' ref={register({ required: 'Please select fruits' })} />{' '}
  //     Raspberry
  //   </label>
  // </div>
  // );
}

function Test(register: any, supplierID: string) {
  return (
    <div>
      <label htmlFor='includeCustomer'>includeCustomer:</label>
      <input type='checkbox' {...register('includeCustomer')} id='includeCustomer'></input>
    </div>
  );
}

export default SendMail;
