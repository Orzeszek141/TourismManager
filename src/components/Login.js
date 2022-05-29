import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const [user, setUser] = React.useState({ email: "", password: "" });
  const navigate = useNavigate();
  return (
    <form>
      <h3>Logowanie</h3>
      <div className="mb-3">
        <label>Address email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Wpisz email"
          value={user.email}
          onChange={(event) => setUser({ ...user, email: event.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>Hasło</label>
        <input
          type="password"
          className="form-control"
          placeholder="Wpisz hasło"
          value={user.password}
          onChange={(event) => setUser({ ...user, password: event.target.value })}
        />
      </div>
      <div className="mb-3">
        <div className="custom-control custom-checkbox">
        </div>
      </div>
      <div className="mx-auto">
        <button type="submit" onClick={login} className="btn btn-success">
          Zatwierdź
        </button>
      </div>
    </form>
  );

  function login(event) {
    event.preventDefault();
    axios.post("https://localhost:7002/api/Auth/authenticate", {
      email: user.email,
      password: user.password,
    })
      .then((res) => {
        if (res != null) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('email', res.data.auth.email);
          navigate("/profil");
        }
      })
      .catch((err) => {
        window.alert("Upewni się że podałeś poprawne dane logowania!");
      });
  }
}