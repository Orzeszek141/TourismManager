import React from "react";
import { useNavigate } from 'react-router-dom';
export default function Register() {
  var json;
  const [user, setUser] = React.useState({ name: "", email: "", password: "", role: 1 });
  const [allUsers, setAllUsers] = React.useState([]);
  const [formErrors, setFormErrors] = React.useState({});
  const navigate = useNavigate();
  return (
    <form>
      <h3>Rejestracja</h3>
      <ul>
        {Object.entries(formErrors || {}).map(([prop, value]) => {
          return (
            <li className='alert alert-danger' key={prop}>
              {value}
            </li>
          );
        })}
      </ul>
      <div className="mb-3">
        <label>Nazwa</label>
        <input
          type="text"
          className="form-control"
          placeholder="Nazwa użytkownika"
          value={user.name}
          name="name"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label>Address email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Wpisz email"
          value={user.email}
          name="email"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label>Hasło</label>
        <input
          type="password"
          className="form-control"
          placeholder="Wpisz hasło"
          value={user.password}
          name="password"
          onChange={handleChange}
        />
      </div>
      <div className="mx-auto">
        <button type="submit" disabled={Object.entries(formErrors || {}).length > 0 || user.name === "" || user.email === "" || user.password === ""} onClick={register} className="btn btn-warning">
          Utwórz konto
        </button>
      </div>
    </form>
  );

  function register(event) {
    event.preventDefault();
    json = JSON.stringify(user);
    fetch("https://localhost:7002/api/Auth", {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: json
    })
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    let currentFormErrors = formErrors;
    switch (name) {
      case 'name':
        setUser({ ...user, name: value });
        if (minMaxLength(value, 3)) {
          currentFormErrors[
            name
          ] = `Nazwa użytkownika powinna zawierać minimum 3 znaki`;
        } else {
          if (validName(value)) {
            currentFormErrors[
              name
            ] = `Nazwa użytkownika nie może zaczynać się od cyfry`;
          }
          else {
            delete currentFormErrors[name];
          }
        }
        break;
      case 'email':
        setUser({ ...user, email: value });
        if (!value || validEmail(value)) {
          currentFormErrors[name] = `Podano zły format adresu email`;
        } else {
          if (userExists(value)) {
            currentFormErrors[name] =
              'Istnieje już użytkownik o podanym adresie email.';
          } else {
            delete currentFormErrors[name];
          }
        };
        break;
      case 'password':
        setUser({ ...user, password: value });
        if (minMaxLength(value, 8)) {
          currentFormErrors[name] = 'Hasło musi posiadać minimum 8 znaków';
        } else {
          if (validPassword(value)) {
            currentFormErrors[
              name
            ] = `Hasło powinno składać się z przynajmniej jednej małej litery, dużej litery i liczby`;
          }
          else {
            delete currentFormErrors[name];
          }
        };
        break;
      default:
        break;
    }
    setFormErrors(currentFormErrors);
  }

  function minMaxLength(text, minLength, maxLength) {
    let result = !text || text.length < minLength;
    if (maxLength)
      result = result || text.length < minLength;
    return result;
  }

  function validEmail(text) {
    const regex = RegExp(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );

    return !regex.test(text);
  }

  function validName(text) {
    const regex = RegExp(
      /^[^0-9]\w+$/
    );

    return !regex.test(text);
  }

  function validPassword(text) {
    const regex = RegExp(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    );

    return !regex.test(text);
  }

  function userExists(email) {
    var k = false;
    fetch('https://localhost:7002/api/Auth/getUsers/', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => setAllUsers(data));
    allUsers.map(u => {
      if (u.email === email) {
        k = true
      }
    })
    return k;
  }

}