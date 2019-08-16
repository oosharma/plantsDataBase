import React, { Component } from "react";
import Bootstrap, { Row, Col, Button, Container } from "bootstrap-4-react";
import { Display1, Display2, Display3, Display4 } from "bootstrap-4-react";
import style from "./SearchBar.css";

import { List } from "bootstrap-4-react";

// import style from "./SearchBar.css";

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heading: "Enter a plant name",
      term: "Plant Name",
      results: [],
      latin_name: "",
      bloom_time: "",
      plant_type: "",
      appropriate_location: ""
    };
  }

  render() {
    return (
      <Container>
        <Display4>{this.state.heading}</Display4>

        <input
          value={this.state.term}
          onChange={event => this.onInputChange(event.target.value)}
        />
        <Button
          variant="primary"
          onClick={() => {
            this.handleButtonClick();
          }}
        >
          Search
        </Button>
        <Row>
          <Col className="colHead">Name</Col>
          <Col className="colHead">Apt. Location</Col>
          <Col className="colHead">Bloom Time</Col>
          <Col className="colHead">Plant Type</Col>
        </Row>

        {this.state.results.map(result => {
          return (
            <>
              <Row>
                <Col>{result.common_name}</Col>
                <Col>{result.appropriate_location}</Col>
                <Col>{result.bloom_time}</Col>
                <Col> {result.plant_type}</Col>
              </Row>
            </>
          );
        })}
      </Container>
    );
  }

  handleButtonClick = () => {
    const query = this.queryGenerator(this.state.term);

    //fetch response from OMDB and update state

    console.log("hello");
    fetch(query)
      .then(response => response.json())
      .then(response => {
        for (let i = 0; i < response.length; i++) {
          this.setState({
            // latin_name: [
            //   ...this.state.latin_name,
            //   {
            //     latin_name: response[i].latin_name
            //     // plant_type: response[i].plant_type,
            //     // appropriate_location: response[i].appropriate_location,
            //     // bloom_time: response[i].bloom_time
            //   }
            // ],
            // bloom_time: [
            //   ...this.state.bloom_time,
            //   {
            //     bloom_time: response[i].bloom_time
            //     // plant_type: response[i].plant_type,
            //     // appropriate_location: response[i].appropriate_location,
            //     // bloom_time: response[i].bloom_time
            //   }
            // ],
            // plant_type: [
            //   ...this.state.plant_type,
            //   {
            //     plant_type: response[i].plant_type
            //     // plant_type: response[i].plant_type,
            //     // appropriate_location: response[i].appropriate_location,
            //     // bloom_time: response[i].bloom_time
            //   }
            // ],
            // appropriate_location: [
            //   ...this.state.appropriate_location,
            //   {
            //     appropriate_location: response[i].appropriate_location
            //     // plant_type: response[i].plant_type,
            //     // appropriate_location: response[i].appropriate_location,
            //     // bloom_time: response[i].bloom_time
            //   }
            // ],
            results: [...this.state.results, response[i]]
          });
        }
      });
    this.setState({ heading: "Enter another plant name" });
  };

  onInputChange(term) {
    this.setState({ term });
    // this.props.onSearchTermChange(term);
  }
  queryGenerator = () => {
    //Get value from search box
    //Curate query

    const query = `https://data.sfgov.org/resource/vmnk-skih.json?$where=common_name like '%25${this.state.term}%25'`;
    // https://data.cityofchicago.org/resource/tt4n-kn4t.json?$where=job_titles like '%25CHIEF%25'
    //soda.demo.socrata.com/resource/4tka-6guv.json?$where=magnitude > 3.0
    // https: // const query =
    // "https://soda.demo.socrata.com/resource/4tka-6guv.json?$where=latin_name like aloe";

    return query;
  };

  searchQuery(term) {}
}
export default SearchBar;
