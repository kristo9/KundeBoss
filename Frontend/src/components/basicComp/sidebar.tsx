// Libraries
import { useState } from 'react';

// CSS
import './sidebar.css';

// Interface for incomming props.
export interface SBProps {
  buttons: SBElementProps;

  text?: string;
  altText?: string;
}

// Interface for buttons.
export interface SBButtonProp {
  icon?: any;
  text: string;
  onClick: any;

  ID: string;
  currentlyActiveID?: string;
}

// Buttons interface array of SBButtonProp
export interface SBElementProps extends Array<SBButtonProp> {}

// Main function.
export function Sidebar(props: SBProps) {
  const [buttonState, setButtonState] = useState(props.buttons[0].ID);    // Local state buttonstate.

  // Returns a sidemenu of buttonprops and updates active button through buttonstate.
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

// Function that controlls if button is active or not.
export function SidebarItem(props: SBButtonProp) {
  let classNameName = props.currentlyActiveID === props.ID ? 'buttonActive' : 'buttonNotActive';

  return (
    <button onClick={props.onClick} className={classNameName}>
      {props.text}
    </button>
  );
}
