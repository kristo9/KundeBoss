/**
 * Displays the customer notes.
 * @param custInfo information about the customer.
 * @returns a react component with the notes about the customer.
 */
function SupplierNotesPage(supInfo: any) {
  return (
    <div>
      <h1>Her er det Notater</h1>
      {supInfo.comment ? supInfo.comment : 'Leverandøren har ingen notater'}
    </div>
  );
}

export default SupplierNotesPage;
