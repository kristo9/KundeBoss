import './App.css';
import Navbar from '../navbar/Navbar';
import StartPage from '../startpage/Startpage';


function App() {

  return (
    <div className="app">
      <div className="Navbar">
        <Navbar />
      </div>
      <div className="Startpage">
        <StartPage />
      </div>
    </div>
  );
}

export default App;
