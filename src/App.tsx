import React from 'react';
import {Switch, BrowserRouter, Route, Redirect} from "react-router-dom";
import './App.scss';
import Button from "./components/UI/Button/Button";
import Register from "./pages/Register/Register.lazy";

function App() {


  return (
      <BrowserRouter>
        <div className="App">
            <Switch>
                <Route path="/register">
                  <Register/>
                </Route>

                <Route path="/">
                    <Redirect to="/register"/> {/* Just for dev */}
                </Route>
            </Switch>
        </div>
      </BrowserRouter>
  );
}

export default App;
