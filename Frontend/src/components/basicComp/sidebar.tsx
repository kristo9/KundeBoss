import React, { useState, FunctionComponent } from 'react';
import './sidebar.css';

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
      <h2 className='sidebarHederText'>{props.text ? props.text : props.altText}</h2>
      <div>
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
    </div>
  );
}

export function SidebarItem(props: SBButtonProp) {
  let classNameName = props.currentlyActiveID === props.ID ? 'buttonActive' : 'buttonNotActive';

  return (
    <button onClick={props.onClick} className={classNameName}>
      {props.text}
    </button>
  );
}
