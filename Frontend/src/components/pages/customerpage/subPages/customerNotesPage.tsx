import react from 'react';

/**
 * Displays the customer notes.
 * @param custInfo information about the customer.
 * @returns a react component with the notes about the customer.
 */
function CustomerNotesPage(custInfo: any) {
  return (
    <div>
      <h1>Her er det Notater</h1>
      {custInfo.comment ? custInfo.comment : 'Kunden har ingen notater'}
    </div>
  );
}

export default CustomerNotesPage;
