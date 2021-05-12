import React from 'react';
import '../basicComp/sendMail.css';
import '../basicComp/basic.css';

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
interface checkboxProps {
  register: any; //ReturnType<typeof useForm>['register']; // gir register typen :)
  labelText: string;
  lableName: string;
  value: string;
  defaultValue: boolean;
  required?: boolean;
}

interface SelectProps {
  register: any;
  name: string;
  defaultValue: string | number | null;
  defaultOption: {
    name: string;
    value: string | number | null;
  };
  options: {
    name: string;
    value: string | number | null;
  }[];
}

export function MultipleInputField(props: multipleInputField) {
  return (
    <div>
      {props.text}
      <div>{props.children}</div>
    </div>
  );
}

export function InputField(props: inputProps) {
  return (
    <div className='input displayInfoDiv'>
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
    <div className='input displayInfoDiv'>
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

export function Checkbox(props: checkboxProps) {
  return (
    <span>
      <label htmlFor={props.lableName}>{props.labelText}:</label>
      <input
        type='Checkbox'
        name={props.lableName}
        id={props.lableName}
        required={props.required}
        value={props.value}
        // checked={props.defaultValue}
        {...props.register}
      />
    </span>
  );
}

export function Select(props: SelectProps) {
  return (
    <select defaultValue={props.defaultValue} name={props.name} {...props.register} className='custom-select'>
      <option value={props.defaultOption?.value}>{props.defaultOption.name}</option>
      {props.options?.map((option) => {
        return (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        );
      })}
    </select>
  );
}
