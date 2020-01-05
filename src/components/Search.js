import React from "react";
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
        this.switchResultsVisibility = this.switchResultsVisibility.bind(this)
    }

    //Called from the results component
    switchResultsVisibility() {
        this.setState({
          resultsVisibility: !this.state.resultsVisibility
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
        let link = response.headers.get('Link');
        if (link !== null) {
            let links = link.split(',');
            console.log(links[1])
        }
      
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

    //Fetches the API data and saves it to the state
    getResults() {
        this.setState({
            loading:true,
            resultsVisibility: true
        })

        //Fetch 100 repositories
        fetch("https://api.github.com/users/" + this.state.search + "/repos?page=1&per_page=30")
            .then(this.checkStatus)
            .then(this.parseJSON)

            //Successful fetch
            .then(function(data) {
                if (data.length > 99) {
                    console.log(data.length)
                }
                
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
                <div className="searchContainer">
                    <input 
                        type="text" 
                        name="user-search" 
                        id="search" 
                        placeholder="Search for a Github user..."
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        autoFocus={true}
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
                        searchResults={this.state.allResults}
                        resultsVisibility={this.state.resultsVisibility}
                        search={this.state.search}
                        switchResultsVisibility={this.switchResultsVisibility}
                    />
                    }
                    <h3>{this.state.error}</h3>
                </div>
            </div>
        )
    }  
}

export default Search;