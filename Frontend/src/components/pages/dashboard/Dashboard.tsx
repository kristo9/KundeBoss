import "./Dashboard.css";

interface infoProp{
  name: string;
  text: string;
}

function InfoBox(prop: infoProp){
  return(
    <div className="infoDiv">
      <span>
        <b>{prop.name}</b> 
      </span>
      <span>
        {prop.text}
      </span>
    </div>
  );
}


function Dashboard() {

  return (
    <div>
      <div className="page">
        <h1>Velkommen</h1>
        <h1>Her er dashboard</h1>
        <InfoBox name="Navn" text="Dette er en tekst"/>
      </div>
    </div>
  );
}

export default Dashboard;