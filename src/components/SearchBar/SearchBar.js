import React, { Component } from "react";
import Bootstrap, {
  Row,
  Col,
  Button,
  Container,
  Table,
  Form
} from "bootstrap-4-react";
import { Display1, Display2, Display3, Display4 } from "bootstrap-4-react";
import style from "./SearchBar.css";
import { List } from "bootstrap-4-react";

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heading: "Search a Plant",
      term: "",
      placeholder: "Ex: Rose, Palm, California, etc.",
      results: [],
      latin_name: "",
      bloom_time: "",
      plant_type: "",
      appropriate_location: "",
      classN: "hideButton",
      classTable: "hideButton",
      searchButtonTerm: "Search",
      advancedFilterTerm: "More Filters"
    };
  }

  render() {
    return (
      <Container>
        <Display4>{this.state.heading}</Display4>

        <input
          value={this.state.term}
          className="input-primary"
          onChange={event => this.onInputChange(event.target.value)}
          placeholder={this.state.placeholder}
          onSubmit={() => {
            this.handleButtonClick();
            console.log("hello");
          }}
        />
        <br></br>
        <Button
          variant="primary"
          className="btn-primary default-button"
          type="button"
          onSubmit={() => {
            this.handleButtonClick();
            console.log("hello");
          }}
          onClick={() => {
            this.setState({ searchButtonTerm: "Loading..." });

            this.handleButtonClick();
          }}
        >
          {this.state.searchButtonTerm}
        </Button>

        <Button
          variant="primary"
          className="btn-primary default-button"
          type="button"
          onSubmit={() => {
            this.handleAdvancedFilterClick();
            console.log("hello");
          }}
          onClick={() => {
            if (this.state.advancedFilterTerm === "More Filters")
              this.setState({ advancedFilterTerm: "Hide Filters" });
            else this.setState({ advancedFilterTerm: "More Filters" });

            this.handleAdvancedFilterClick();
          }}
        >
          {this.state.advancedFilterTerm}
        </Button>

        <Button
          variant="primary"
          className={`btn-primary default-button ${this.state.classN}`}
          onClick={() => {
            this.handleClearButtonClick();
          }}
        >
          Clear Results
        </Button>
        {/* <Row>
          <Col className="colHead">Name</Col>
          <Col className="colHead">Apt. Location</Col>
          <Col className="colHead">Bloom Time</Col>
          <Col className="colHead">Plant Type</Col>
        </Row> */}

        <Table
          className={`table-primary-1 ${this.state.classTable}`}
          striped
          bordered
          hover
        >
          <thead>
            <tr>
              <th className="head-1">Name</th>
              <th>Apt. Location</th>
              <th>Bloom Time</th>
              <th>Plant Type</th>
            </tr>
          </thead>
          <tbody>
            {this.state.results.map(result => {
              return (
                <>
                  <tr>
                    <td>{result.common_name} </td>
                    <td>{result.appropriate_location} </td>
                    <td>{result.bloom_time} </td>
                    <td>{result.plant_type} </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>

        {/* {this.state.results.map(result => {
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
        })} */}
      </Container>
    );
  }

  handleButtonClick = () => {
    const query = this.queryGenerator(this.state.term);

    //fetch response from OMDB and update state
    if (this.state.term) {
      fetch(query)
        .then(response => response.json())
        .then(response => {
          for (let i = 0; i < response.length; i++) {
            this.setState({
              results: [response[i], ...this.state.results]
            });
            if (response.length) {
              this.showClear();
              this.setState({ classTable: "showButton" });
              this.setState({ searchButtonTerm: "Search" });
            }
          }
        });
      this.setState({ heading: "Enter another plant name" });
      this.forceUpdate();
      const term = this.state.term;
      this.setState({ term: "" });
      this.setState({ placeholder: "Ex: Rose, Palm, California, etc." });
    } else {
      window.alert("Please enter a search term");
    }
  };

  addLower = term => {
    return term.charAt(0).toLowerCase() + this.state.term.slice(1);
  };
  addUpper = term => {
    return term.charAt(0).toUpperCase() + this.state.term.slice(1);
  };

  handleClearButtonClick = () => {
    this.setState({
      results: [],
      classN: "hideButton"
    });
    this.setState({ classTable: "hideButton" });
  };

  showClear = () => {
    this.setState({ classN: "showButton" });
  };

  onInputChange(term) {
    this.setState({ term });
    // this.props.onSearchTermChange(term);
  }
  queryGenerator = () => {
    //Get value from search box
    //Curate query
    var term2 = "";
    if (this.state.term.charAt(0) === this.state.term.charAt(0).toUpperCase()) {
      term2 = this.addLower(this.state.term);
    } else {
      term2 = this.addUpper(this.state.term);
    }
    const query = `https://data.sfgov.org/resource/vmnk-skih.json?$where=common_name%20like%20%27%25${this.state.term}%25%27%20OR%20common_name%20like%20%27%25${term2}%25%27`;
    // const query = `https://data.sfgov.org/resource/vmnk-skih.json?$where=common_name like '%25${this.state.term}%25' || common_name like '%25${term2}%25' `;
    // https://data.cityofchicago.org/resource/tt4n-kn4t.json?$where=job_titles like '%25CHIEF%25'
    //soda.demo.socrata.com/resource/4tka-6guv.json?$where=magnitude > 3.0
    // https: // const query =
    // "https://soda.demo.socrata.com/resource/4tka-6guv.json?$where=latin_name like aloe";
    console.log({ query });

    return query;
  };

  handleAdvancedFilterClick = () => {
    if (this.state.filterShow) {
      this.setState({ filterClass: "hideButton" });
    } else {
      this.setState({ filterClass: "showButton" });
    }
  };

  searchQuery(term) {}
}
export default SearchBar;
