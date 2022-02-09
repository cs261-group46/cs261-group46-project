import './App.css';
import Homepage from "./routes/Homepage/Homepage.lazy";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./routes/Login/Login.lazy";
import Register from "./routes/Register/Register.lazy";

function App() {
    return (
        <div data-testid="App">
            <BrowserRouter>
                <Routes>
                    {/* webpage index */}
                    <Route path="/" element={<Homepage/>}/>

                    {/* section to do with signing up / signing in */}
                    <Route path="auth">

                        {/* /auth just redirects to index */}
                        <Route index element={<Navigate to={"/"}/> }/>

                        {/* login form */}
                        <Route path={"login"} element={<Login/>}/>

                        {/* register form */}
                        <Route path={"register"} element={<Register/>}/>
                    </Route>

                    {/* catch all 404 page if nothing matches */}
                    <Route path="*" element={<p>404!</p>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
