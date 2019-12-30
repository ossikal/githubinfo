import React from "react";
import ReactDOM from "react-dom";
import Results from "./Results"
import LoadingSpinner from "./LoadingSpinner"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            search: "",
            allResults: [],
            error: "",
            isLoading: false,
            resultsVisibility:false,
            loading:false
        };

        this.handleChange = this.handleChange.bind(this);
        this.getResults = this.getResults.bind(this);
        this.handler = this.handler.bind(this)
        this.showResults = this.showResults.bind(this)
    }

    //Called from child component
    handler() {
        this.setState({
          resultsVisibility: false
        })
    }
    
    showResults() {
        this.setState({
          resultsVisibility: true
        })
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
        this.setState({
            loading:true,
            resultsVisibility: true
        })

        fetch("https://api.github.com/users/" + this.state.search + "/repos")
            .then(this.checkStatus)
            .then(this.parseJSON)

            //Successful fetch
            .then(function(data) {
                this.setState({
                    allResults: data,
                    error: "",
                    loading:false
                })
            }.bind(this))

            //Error handling
            .catch(function(error) {
                //console.log('request failed', error)
                this.setState({error: "Not found"})
                this.setState({allResults: [] })
            }.bind(this))
    }
            

    render() {
        const loading = this.state.loading;
        
        return (
            <div className="wrap">
                <div className="searchcontainer">
                    <input 
                        type="text" 
                        name="user-search" 
                        id="search" 
                        placeholder="Search for a Github user..."
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        autofocus="true"
                    />

                    <button 
                    id="search-button"
                    onClick={() => {this.getResults()}}>
                    <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
                <div className="results">
                    {loading ? <LoadingSpinner /> :
                    <Results 
                        name={this.state.allResults}
                        resultsVisibility={this.state.resultsVisibility}
                        search={this.state.search}
                        handler={this.handler}
                        showResults={this.showResults}
                    />
                    }
                    <h3>{this.state.error}</h3>
                </div>
            </div>
        )
    }  
}

export default Search;