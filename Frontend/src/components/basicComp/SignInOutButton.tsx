// Libraries
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { useContext } from 'react';

// Configuarations
import { loginRequest } from '../../azure/authConfig';

// Context
import { LanguageContext } from '../../Context/language/LangContext';

// Function that proviedes sign in and out button.
export const SignInSignOutButton = () => {
  const { dictionary } = useContext(LanguageContext);     // Import global dictionary with useContext.
  const { instance } = useMsal();                         // Get instance to log in/out
  return (
    <div>
      <AuthenticatedTemplate>                             {/* If authenticated this template will be used*/}
        <button onClick={() => instance.logout()} className='Link'>
          {dictionary.signOut}
        </button>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>                            {/* If unauthenticated this template will be used*/}
        <button onClick={() => instance.loginRedirect(loginRequest)} className='Link'>
        {dictionary.signIn}
        </button>
      </UnauthenticatedTemplate>
    </div>
  );
};
