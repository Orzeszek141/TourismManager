import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
function Navigation() {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const [role, setRole] = React.useState(2);
    const [name, setName] = React.useState("");
    if (token === null) {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                            <Navbar.Brand href="/">Podróżnik</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                    <Nav.Link href="/register">Zarejestruj się</Nav.Link>
                                    <Nav.Link href="/login">Zaloguj się</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                        <br />
                    </div>
                </div>
            </div>
        )
    }
    else if (email !== null) {
        fetch('https://localhost:7002/api/Auth/getUser/' + email, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
        })
            .then(response => response.json())
            .then(data => {
                setRole(data.role)
                setName(data.name)
            });
        const welcome = "Witaj " + name + "!";
        if (role === 1) {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                                <Navbar.Brand href="/">Podróżnik</Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="mr-auto">
                                        <Nav.Link href="/place_form">Zaproponuj miejsce</Nav.Link>
                                    </Nav>
                                    <Nav className="ms-auto">
                                        <NavDropdown title={welcome} id="basic-nav-dropdown">
                                            <NavDropdown.Item href="/profil">Profil</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item onClick={Logout}>Wyloguj się</NavDropdown.Item>
                                        </NavDropdown>123456
                                    </Nav>
                                </Navbar.Collapse>
                            </Navbar>
                            <br />
                        </div>
                    </div>
                </div>
            )
        }
        else if (role === 0) {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                                <Navbar.Brand href="/">Podróżnik</Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="mr-auto">
                                        <Nav.Link href="/manage_place">Zarządzaj miejscami</Nav.Link>
                                        <Nav.Link href="/place_form">Dodaj miejsce</Nav.Link>
                                        <Nav.Link href="/users">Użytkownicy</Nav.Link>
                                    </Nav>
                                    <Nav className="ms-auto">
                                        <NavDropdown title={welcome} id="basic-nav-dropdown">
                                            <NavDropdown.Item href="/profil">Profil</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item onClick={Logout}>Wyloguj się</NavDropdown.Item>
                                        </NavDropdown>123456
                                    </Nav>
                                </Navbar.Collapse>
                            </Navbar>
                            <br />
                        </div>
                    </div>
                </div>
            )
        }
    }
    function Logout() {
        localStorage.clear();
        navigate("/");
    }
}
export default Navigation;