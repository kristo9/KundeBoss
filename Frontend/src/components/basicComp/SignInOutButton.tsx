import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../azure/authConfig";

export const SignInSignOutButton = () => {
    const { instance } = useMsal();
    return (
        <div>
            <AuthenticatedTemplate>
                <button onClick={() => instance.logout()} className="link">Sign Out</button>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <button onClick={() => instance.loginRedirect(loginRequest)} className="link">Sign In</button>
            </UnauthenticatedTemplate>
        </div>
    );
};