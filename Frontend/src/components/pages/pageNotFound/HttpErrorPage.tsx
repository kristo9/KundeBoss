/*
ErrorPage for HTTP error messages. If HTTP error occurs this component will be returned.
*/

// Simple function that returns message with the error code. 
const HttpErrorPage = (props: any) => {
  return (
    <div>
      <h1>Dette er ErrorPage</h1>
      <p>Noe galt har skjedd! Ånei :( Errorkoden din er {props}</p>
    </div>
  );
}

export default HttpErrorPage; // Exports default function PageNotFound.