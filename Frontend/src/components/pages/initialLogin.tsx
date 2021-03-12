/**
 * All employees without acces will be redirected to this page.
 * @returns A react component contaning the page that users without access will see.
 */
function InitialPage() {
  return (
    <div className='add-margins'>
      <p>Du har ikke tilgang</p>
      <p>Kontakt admin (noe informasjon)</p>
    </div>
  );
}

export default InitialPage;
