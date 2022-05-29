import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { Navigate } from "react-router-dom";

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem("token"),
      email: localStorage.getItem("email"),
      users: [],
      loading: true,
      logged: false,
    };
  }

  componentDidMount() {
    fetch('https://localhost:7002/api/Auth', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.state.token
      },
    })
      .then(response => response.json())
      .then(data => this.setState({ users: data, loading: false }));

    fetch('https://localhost:7002/api/Auth/getUser/' + this.state.email, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.state.token
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.role === 1) {
          this.setState({ logged: true })
        }
      });
  }

  render() {
    const { users, loading, logged } = this.state;
    if (logged) {
      return <Navigate to='/' />;
    }
    if (loading) {
      return <p>Ładowanie danych...</p>
    }
    else {
      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Nazwa użytkownika</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Hasło</TableCell>
                <TableCell align="right">Rola</TableCell>
                <TableCell align="right">Usunąć?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                if (user.role === 0) {
                  return (
                    <TableRow
                      key={user.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {user.name}
                      </TableCell>
                      <TableCell align="right">{user.email}</TableCell>
                      <TableCell align="right">{user.password}</TableCell>
                      <TableCell align="right">Administrator</TableCell>
                      <TableCell align="right">
                        <Button onClick={() => this.delete(user.id)}>Usuń</Button>
                      </TableCell>
                    </TableRow>)
                }
                else {
                  return (
                    <TableRow
                      key={user.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {user.name}
                      </TableCell>
                      <TableCell align="right">{user.email}</TableCell>
                      <TableCell align="right">{user.password}</TableCell>
                      <TableCell align="right">Użytkownik</TableCell>
                      <TableCell align="right">
                        <Button variant="danger" onClick={() => this.delete(user.id)}>Usuń</Button>
                      </TableCell>
                    </TableRow>)
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  delete(id) {
    axios.delete("https://localhost:7002/api/Auth/remove/" + id,
      {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then(
        window.alert("Usunięto użytkownika!"),
        window.location.reload()
      )
      .catch((err) => {
        console.log(err);
      });
  }

}