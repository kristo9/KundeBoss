import React, { useState, FunctionComponent } from 'react';
import '../pages/customerpage/customerpage.css';

export interface SBProps {
  buttons: SBElementProps;

  text?: string;
  altText?: string;
}

export interface SBButtonProp {
  icon?: any;
  text: string;
  onClick: any;

  ID: string;
  currentlyActiveID?: string;
}

export interface SBElementProps extends Array<SBButtonProp> {}

export function Sidebar(props: SBProps) {
  const [buttonState, setButtonState] = useState(props.buttons[0].ID);

  return (
    <div className='sidebar'>
      {props.text ? props.text : props.altText}

      {props.buttons.map((button) => {
        return (
          <SidebarItem
            text={button.text}
            onClick={() => {
              button.onClick();
              setButtonState(button.ID);
            }}
            ID={button.ID}
            currentlyActiveID={buttonState}
            key={button.ID}
          />
        );
      })}
    </div>
  );
}

export function SidebarItem(props: SBButtonProp) {
  let classNameName = props.currentlyActiveID === props.ID ? 'b buttonActive' : 'b buttonNotActive';

  return (
    <div className={classNameName} onClick={props.onClick}>
      <button>{props.text}</button>
    </div>
  );
}
