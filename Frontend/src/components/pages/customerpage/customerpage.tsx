import "./customerpage.css";

/**
 * @returns A react component with the customer page
 */
function Customerpage() {
  return (
    <div>
      <div style={{ float: "left", background: "gray" }}>
        <Sidebar />
      </div>
      <div>
        <h1>Velkommen</h1>
        <h1>Her er kundesiden</h1>
      </div>
    </div>
  );
}

function Sidebar(params: any) {
  return (
    <div>
      <button>das 1</button>
      <button>das 2</button>
      <button>das 3</button>
      <button>das 4</button>
      <button>das 5</button>
      <button>das 6</button>
      <button>das 7</button>
      <button>das 8</button>
      <p>fmkasfkas dksa lk aslkd lkasm dlkam l</p>
      <p>dnasjknd jdasnkdjd jnasj dnask jk dans</p>
    </div>
  );
}

export default Customerpage;
