/* 
Component only returns a string of "Denne siden finnes ikke" if page doesnt exict or cant be loaded.
*/

// Simple function that returns a string of page not exict. 
const PageNotFound = () => {
  return (
    <div
      className='add-margins'
      style={{
        fontSize: '50px',
      }}
    >
      <div>
        Denne siden finnes ikke. Denne siden finnes ikke. Denne siden finnes ikke. Denne siden finnes ikke. Denne siden
        finnes ikke. Denne siden finnes ikke. Denne siden finnes ikke. Denne siden finnes ikke. Denne siden finnes ikke.
        Denne siden finnes ikke. Denne siden finnes ikke. Denne siden finnes ikke.
        <b style={{ color: 'white' }}> Denne siden finnes ikke. </b>
        Denne siden finnes ikke. Denne siden finnes ikke. Denne siden finnes ikke. Denne siden finnes ikke. Denne siden
        finnes ikke. Denne siden finnes ikke. Denne siden finnes ikke.
      </div>
    </div>
  );
}

export default PageNotFound; // Exports default function PageNotFound.
