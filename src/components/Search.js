import React from "react";
import Results from "./Results"
import LoadingSpinner from "./LoadingSpinner"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

// The search component handles the search bar and fetches result data

class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            search: "",
            allResults: [],
            error: "",
            isLoading: false,
            resultsVisibility:false,
            navVisibility:false,
            loading:false,
            currentPage:1,
            lastPage: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.getResults = this.getResults.bind(this);
        this.switchResultsVisibility = this.switchResultsVisibility.bind(this)
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.getPageNumbers = this.getPageNumbers.bind(this);
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
            this.setState({currentPage:1}, function() {
                this.getResults()
            });
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

    //Check if current page is the last page
    getPageNumbers(response) {
        let link = response.headers.get('Link');
        console.log(link)
        if (link !== null) {
            
            let isNotLastPage = link.indexOf("last") !== -1;

            if (isNotLastPage === false) {
                this.setState({lastPage: true})
            }
        }
        return response
    }

    //Fetches the API data and saves it to the state
    getResults() { 
        this.setState({
            loading:true,
            resultsVisibility: true,
            navVisibility: true,
            lastPage:false,
        })
        
        let url = "https://api.github.com/users/" + this.state.search + "/repos?page=" + this.state.currentPage + "&per_page=30"

        //Fetch 100 repositories
        fetch(url)
            .then(this.checkStatus)
            .then(this.getPageNumbers)
            .then(this.parseJSON)

            //Successful fetch
            .then(function(data) {
                //If this is the last page hide page navigation
                if (this.state.lastPage === true || data.length < 30) {
                    console.log("Last page")
                    this.setState({navVisibility:false})
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

    prevPage() {
        this.setState({
            currentPage: this.state.currentPage - 1
        }, function() {
            this.getResults()
        })
    }

    nextPage() {
        this.setState({
            currentPage: this.state.currentPage + 1
        }, function() {
            this.getResults()
        })
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
                        onClick={() => {
                            this.setState({currentPage:1}, function() {
                                this.getResults()
                            });
                            
                            }}>
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

                    <div className="navWrap">
                        {!loading && this.state.resultsVisibility && this.state.currentPage !== 1 &&
                        <button onClick={this.prevPage} className="pageBtn prev"><FontAwesomeIcon icon={faChevronLeft} /> Previous</button>}

                        {!loading && this.state.resultsVisibility && this.state.navVisibility && 
                        <button onClick={this.nextPage} className="pageBtn next">Next <FontAwesomeIcon icon={faChevronRight} /></button>}
                    </div>

                    <h3>{this.state.error}</h3>
                </div>
            </div>
        )
    }  
}

export default Search;