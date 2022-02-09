import './App.css';
import Homepage from "./routes/Homepage/Homepage.lazy";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* webpage index */}
        <Route path="/" element={<Homepage/>}/>

        {/* catch all 404 page if nothing matches */}
        <Route path="*" element={<p>404!</p>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
