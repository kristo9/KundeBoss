import React from 'react';
import { useForm } from 'react-hook-form';
import { RegularExpressionLiteral } from 'typescript';

interface inputProps {
  register: any; //ReturnType<typeof useForm>['register']; // gir register typen :)
  labelText: string;
  lableType: string;
  lableName: string;
  placeholderText?: string;
  defaultValue?: string;
  required?: boolean;
}
interface multipleInputField {
  text: string;
  children: React.ReactNode;
}

export function MultipleInputField(props: multipleInputField) {
  return (
    <div>
      {props.text}
      <div>{props.children}</div>
    </div>
  );
}

//NYE

export function InputField(props: inputProps) {
  return (
    <div>
      <label htmlFor={props.lableName}>{props.labelText}:</label>
      <input
        type={props.lableType}
        name={props.lableName}
        id={props.lableName}
        defaultValue={props.defaultValue !== 'null' ? props.defaultValue : ''}
        placeholder={props.placeholderText}
        required={props.required}
        {...props.register}
      />
    </div>
  );
}

export function TextArea(props: inputProps) {
  return (
    <div>
      <label htmlFor={props.lableName}>{props.labelText}:</label>
      <textarea
        name={props.lableName}
        id={props.lableName}
        defaultValue={props.defaultValue !== 'null' ? props.defaultValue : ''}
        placeholder={props.placeholderText}
        required={props.required}
        {...props.register}
      />
    </div>
  );
}

export function MultipleInputField1(props: multipleInputField) {
  return (
    <div>
      {props.text}
      <div>{props.children}</div>
    </div>
  );
}
