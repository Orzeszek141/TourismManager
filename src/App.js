import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Navbar from "./components/Navbar.js";
import Users from './components/Users.js';
import { Home } from './components/Home.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Profil from './components/Profil.js';
import ManagePlace from './components/ManagePlace.js';
import PlaceForm from './components/PlaceForm.js';

class App extends Component {
  static displayName = App.name;

  render() {

    return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/users' element={<Users />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profil' element={<Profil />} />
          <Route path='/manage_place' element={<ManagePlace />} />
          <Route path='/place_form' element={<PlaceForm />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App