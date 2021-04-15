import React from 'react';
import { useForm } from 'react-hook-form';
import { RegularExpressionLiteral } from 'typescript';

interface inputProps {
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

//TEST
interface inputProps1 {
  register: any; //ReturnType<typeof useForm>['register']; // gir register typen :)
  labelText: string;
  lableType: string;
  lableName: string;
  placeholderText?: string;
  defaultValue?: string;
  required?: boolean;
}
interface multipleInputField1 {
  text: string;
  children: React.ReactNode;
}

//DNASJDNJAS

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
      ></input>
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
      ></textarea>
    </div>
  );
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

export function InputField1(props: inputProps1) {
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

export function TextArea1(props: inputProps1) {
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

export function MultipleInputField1(props: multipleInputField1) {
  return (
    <div>
      {props.text}
      <div>{props.children}</div>
    </div>
  );
}
