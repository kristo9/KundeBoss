import './App.css';
import Navbar from '../navbar/Navbar';
import StartPage from '../startpage/Startpage';
import { BrowserRouter } from "react-router-dom";



function App() {

  return (
    <div className="app">
      <BrowserRouter>
        <div className="Navbar">
          <Navbar />
        </div>
        <div className="Startpage">
          <StartPage />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
