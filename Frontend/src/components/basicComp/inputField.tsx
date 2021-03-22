import { PromptState } from 'msal/lib-commonjs/utils/Constants';
import React from 'react';

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

export function InputField(props: inputProps) {
  return (
    <div>
      <label htmlFor={props.lableName}>{props.labelText}:</label>
      <input
        type={props.lableType}
        name={props.lableName}
        id={props.lableName}
        defaultValue={props.defaultValue != 'null' ? props.defaultValue : ''}
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
        defaultValue={props.defaultValue != 'null' ? props.defaultValue : ''}
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
