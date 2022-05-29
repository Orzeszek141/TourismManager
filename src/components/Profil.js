import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Col, Button } from 'react-bootstrap';
import axios from 'axios';
export default class Profil extends Component {
  constructor(props) {
    super(props);
    this.state = { oldpass: "", newpass: "", confirmedpass: "", rol: "Użytkownik", user: {}, token: localStorage.getItem("token"), email: localStorage.getItem("email") };

    this.changePassword = this.changePassword.bind(this);
  }
  componentDidMount() {

    fetch('https://localhost:7002/api/Auth/getUser/' + this.state.email, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.state.token
      },
    })
      .then(response => response.json())
      .then(data => this.setState({ user: data }));
    if (this.state.user.role === 0) { this.setState({ rol: "Administrator" }); }
  }

  render() {
    if (this.state.email != null) {
      return (
        <Container className='p-4'>
          <Col mx="auto">
            <Card>
              <Card.Body>
                <Card.Title>{this.state.user.name}</Card.Title><br />
                <Card.Text>
                  Email: {this.state.user.email} <br /><br />
                  Rola: {this.state.rol} <br /><br />
                </Card.Text>
                <Card.Title>Zmaina hasła</Card.Title><br />
                <Card.Text>
                  <form onSubmit={this.changePassword}>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Wpisz aktualne hasło"
                      value={this.state.oldpass}
                      onChange={e => this.setState({ oldpass: e.target.value })}
                    /><br />
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Wpisz nowe hasło"
                      value={this.state.newpass}
                      onChange={e => this.setState({ newpass: e.target.value })}
                    /><br />
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Powtórz nowe hasło"
                      value={this.state.confirmedpass}
                      onChange={e => this.setState({ confirmedpass: e.target.value })}
                    /><br />
                    <Button type="submit" variant="primary">Zmień hasło</Button><br /><br />
                  </form>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Container>
      );
    }
  }
  changePassword(event) {
    event.preventDefault();
    if (this.state.oldpass !== "" && this.state.newpass !== "" && this.state.confirmedpass !== "") {
      if (this.state.oldpass !== this.state.user.password) {
        window.alert("Podano błędne aktualne hasło!");
      }
      else if (this.state.oldpass === this.state.newpass) {
        window.alert("Aktualne hasło i nowe hasło są takie same!")
      }
      else if (this.state.confirmedpass !== this.state.newpass) {
        window.alert("Nowe hasło i powtórzone hasło są różne!")
      }
      else {
        let u = { id: this.state.user.id, name: this.state.user.name, email: this.state.user.email, password: this.state.newpass, role: this.state.user.role };
        axios.put("https://localhost:7002/api/Auth/changePassword/" + this.state.user.id, u,
          {
            headers: {
              'Authorization': 'Bearer ' + this.state.token
            }
          })
          .then(
            window.alert("Zmieniono hasło!"),
            window.location.reload()
          )
          .catch((err) => {
            console.log(err);
          });
      }
    }
    else {
      window.alert("Któraś z danych nie została wypełniona!")
    }
  }
}