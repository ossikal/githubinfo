import React from "react";
import ReactDOM from "react-dom";
import Results from "./Results"

class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            search: "",
            allResults: [],
            error: "",
            isLoading: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.getResults = this.getResults.bind(this);
    }

    //Handles the search input change
    handleChange(event) {
        this.setState({
            search: event.target.value
        });
    }

    //Handles enter key press on search input
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          this.getResults()
        }
      }

    //Check HTTP status for fetch
    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
          return response
        } else {
          var error = new Error(response.statusText)
          error.response = response
          throw error
        }
    }
    
    //Parse JSON
    parseJSON(response) {
        return response.json()
    }

    //getResults fetches the API data and saves it to the state
    getResults() {
        fetch("https://api.github.com/users/" + this.state.search + "/repos")
            .then(this.checkStatus)
            .then(this.parseJSON)

            //Successful fetch
            .then(function(data) {
                this.setState({allResults: data })
                this.setState({error: ""})
            }.bind(this))

            //Error handling
            .catch(function(error) {
                //console.log('request failed', error)
                this.setState({error: "Not found"})
                this.setState({allResults: [] })
            }.bind(this))
    }
            

    render() {
        
        return (
            <div className="wrap">
                <input 
                    type="text" 
                    name="user-search" 
                    id="search" 
                    placeholder="Search for a Github user..."
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                />

                <button 
                id="search-button"
                onClick={() => {this.getResults()}}>
                Search</button>
    
                <div className="results">
                    <Results 
                        name={this.state.allResults}
                    />
                    <h3>{this.state.error}</h3>
                </div>
            </div>
        )
    }  
}

export default Search;