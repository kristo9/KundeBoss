import react from 'react';

/**
 * Displays the customer notes.
 * @param customerInfo information about the customer.
 * @returns a react component with the notes about the customer.
 */
function CustomerNotesPage({ customerInfo }: any) {
  console.log(customerInfo);
  return (
    <div>
      <h1>Her er det Notater</h1>
      {customerInfo.comment ? customerInfo.comment : 'Kunden har ingen notater'}
    </div>
  );
}

export default CustomerNotesPage;
