import "./customerpage.css";
import "../../basicComp/basic.css";

/**
 * @returns A react component with the customer page
 */
function Customerpage() {
  return (
    <div className="margin-right H100">
      <div style={{ float: "left", background: "gray", height: "100%", width: "10%" }}>
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
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <h2>
        <b>Kunde navn</b>
      </h2>
      <SidebarButton text="Mail" />
      <SidebarButton text="Informasjon" />
      <SidebarButton text="Send Mail" />
      <SidebarButton text="div 1" />
      <SidebarButton text="div 2" />
      <SidebarButton text="div 3" />
      <SidebarButton text="div 4" />
    </div>
  );
}

function SidebarButton(prop: { text: string }) {
  return (
    <div className="knapp">
      <button className="text">{prop.text}</button>
    </div>
  );
}

export default Customerpage;
