import React, { Component } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      loading: true,
    };
  }

  componentDidMount() {
    fetch('https://localhost:7002/api/Auth/places', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => this.setState({ places: data, loading: false }));
  }


  render() {
    const { places, loading } = this.state;
    if (loading) {
      return <p>Ładowanie danych...</p>
    }
    else {
      return (
        <Row xs={1} md={3} className="g-4">
          {places.map(place => {
            if (place.accepted) {
              return (
                <Col key={place.id}>
                  <Card>
                    <Card.Img variant="top" src={place.url} alt="new" />
                    <Card.Body>
                      <Card.Title>{place.name}</Card.Title>
                      <Card.Text>
                        {place.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              )
            }
            else {
              return (null);
            }
          })}
        </Row>
      );
    }
  }
}