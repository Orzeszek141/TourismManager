import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
export default function PlaceForm() {
  var json, dane;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const location = useLocation();
  const placeId = location.state;
  const [place, setPlace] = React.useState({});
  const [user, setUser] = React.useState({});
  useEffect(() => {
    if (token === null) {
      window.alert("Nie powinno Cie tu być");
      navigate("/");
    }

    fetch('https://localhost:7002/api/Auth/getUser/' + email, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      },
    })
      .then(response => response.json())
      .then(data => setUser(data));
    if (placeId !== null) {
      fetch('https://localhost:7002/api/Auth/getPlace/' + placeId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + token
        },
      })
        .then(response => response.json())
        .then(data => setPlace(data));
    }
    else {
      setPlace({ name: "", description: "", url: "", accepted: false, user: null })
    }
  }, [email, placeId, token])
  return (
    <form>
      <h3>Fromularz dla miejsca turystycznego</h3>
      <div className="mb-3">
        <label>Nazwa miejsca turystycznego</label>
        <input
          type="text"
          className="form-control"
          placeholder="Wpisz nazwe"
          value={place.name}
          onChange={(event) => setPlace({ ...place, name: event.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>Opis miejsca turystycznego</label>
        <input
          type="text"
          className="form-control"
          placeholder="Podaj opis"
          value={place.description}
          onChange={(event) => setPlace({ ...place, description: event.target.value })}
        />
      </div>
      <div className="mb-3">
        <label>Link do zdjęcia</label>
        <input
          type="text"
          className="form-control"
          placeholder="Podaj link do zdjęcia"
          value={place.url}
          onChange={(event) => setPlace({ ...place, url: event.target.value })}
        />
      </div>
      {
        placeId === null ?
          <div className="mx-auto">
            <button type="submit" onClick={add} className="btn btn-warning">
              Dodaj miejsce
            </button>
          </div>
          :
          <div className="mx-auto">
            <button type="submit" onClick={edit} className="btn btn-warning">
              Edytuj miejsce
            </button>
          </div>
      }
    </form>
  );

  function add(event) {
    event.preventDefault();
    dane = place
    if (user.role === 0) {
      dane.accepted = true
    }
    dane.user = user
    json = JSON.stringify(dane);
    fetch("https://localhost:7002/api/Auth/addPlace", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      },
      body: json
    })
      .then((result) => {
        window.alert("Dodano propozycje miejsca");
        console.log(result);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function edit(event) {
    event.preventDefault();
    dane = place
    if (user.role === 0) {
      dane.accepted = true
    }
    dane.user = user
    axios.put("https://localhost:7002/api/Auth/changePlace/" + placeId, place,
      {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then((result) => {
        window.alert("Edytowano miejsce");
        console.log(result);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}