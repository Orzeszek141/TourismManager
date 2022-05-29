import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem("token"),
      email: localStorage.getItem("email"),
      places: [],
      loading: true,
      logged: false,
    };
  }

  componentDidMount() {
    fetch('https://localhost:7002/api/Auth/places', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => this.setState({ places: data, loading: false }));

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
    const { places, loading, logged } = this.state;
    if (this.state.token === null) {
      window.alert("Nie powinno Cie tu być");
      return <Navigate to='/' />;
    }
    if (logged) {
      return <Navigate to='/' />;
    }
    if (loading) {
      return <p>Ładowanie danych...</p>
    }
    else {
      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center">Nazwa miejsca turystycznego</StyledTableCell>
                <StyledTableCell align="center">Opis miejsca turystycznego</StyledTableCell>
                <StyledTableCell align="center">Adres URL zdjęcia</StyledTableCell>
                <StyledTableCell align="center">Status miejsca</StyledTableCell>
                <StyledTableCell align="center">Użytkownik</StyledTableCell>
                <StyledTableCell align="center">Operacje</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {places.map((place) => {
                if (place.accepted) {
                  return (
                    <TableRow
                      key={place.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center">
                        {place.name}
                      </TableCell>
                      <TableCell align="center">{place.description}</TableCell>
                      <TableCell align="center">{place.url}</TableCell>
                      <TableCell align="center">Zaakceptowane</TableCell>
                      <TableCell align="center">{place.user.name}</TableCell>
                      <TableCell align="center">
                        <ButtonGroup aria-label="Basic example">
                          <Button variant="danger" onClick={() => this.delete(place.id)}>Usuń</Button>
                          <Link to="/place_form" state={place.id} ><Button variant="info">Edytuj</Button></Link>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  );
                }
                else {
                  return (
                    <TableRow
                      key={place.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center">
                        {place.name}
                      </TableCell>
                      <TableCell align="center">{place.description}</TableCell>
                      <TableCell align="center">{place.url}</TableCell>
                      <TableCell align="center">Oczekuje na akceptacje</TableCell>
                      <TableCell align="center">{place.user.name}</TableCell>
                      <TableCell align="center">
                        <ButtonGroup aria-label="Basic example">
                          <Link to="/place_form" state={place.id}><Button variant="info" >Edytuj</Button></Link>
                          <Button variant="success" onClick={() => this.accept(place)}>Zaakceptuj</Button>
                          <Button variant="warning" onClick={() => this.delete(place.id)}>Odrzuć</Button>
                        </ButtonGroup></TableCell>
                    </TableRow>
                  );
                }

              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  delete(id) {
    axios.delete("https://localhost:7002/api/Auth/removePlace/" + id,
      {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then(
        window.alert("Usunięto miejsce!"),
        window.location.reload()
      )
      .catch((err) => {
        console.log(err);
      });
  }

  accept(place) {
    let p = { id: place.id, name: place.name, description: place.description, url: place.url, accepted: true, user: place.user };
    axios.put("https://localhost:7002/api/Auth/changePlace/" + place.id, p,
      {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then(
        window.alert("Zaakceptowano miejsce!"),
        window.location.reload()
      )
      .catch((err) => {
        console.log(err);
      });
  }
}