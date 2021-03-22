import react from 'react';

function LoadingSymbol() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className='loading'>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default LoadingSymbol;
