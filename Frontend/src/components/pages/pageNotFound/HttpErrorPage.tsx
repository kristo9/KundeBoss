import React from 'react';

function HttpErrorPage(props: any) {
  return (
    <div>
      <h1>Dette er ErrorPage</h1>
  <p>Noe galt har skjedd! Ånei :( Errorkoden din er {props}</p>
    </div>
  );
}

export default HttpErrorPage;