import React from "react";
import Commits from "./Commits"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'


class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           commitResults: [],
           error: "",
           commitsVisibility: false,
           search: this.props.search
        };
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

    //Get list of commits, triggered on click of the search result
    getCommits(commit_url) {
        this.setState({
            commitsVisibility: true
        })

        //Cut unnecessary part from URL
        commit_url = commit_url.substring(0, commit_url.length - 6)

        fetch(commit_url)
            .then(this.checkStatus)
            .then(this.parseJSON)

            //Successful fetch
            .then(function(data) {
                this.setState({commitResults: data })
                this.setState({error: ""})
            }.bind(this))

            //Error handling
            .catch(function(error) {
                //console.log('request failed', error)
                this.setState({error: "Not found"})
                this.setState({commitResults: [] })
            }.bind(this))
            
    }


    render() {
        
        //Map search results
        const results = this.props.name.map(r => (

            <div className="resultCard" key={r.id} onClick={() => {this.getCommits(r.commits_url); this.props.switchResultsVisibility();}}>
                {r.name}
                <span className="arrow"><FontAwesomeIcon icon={faChevronRight} /></span>
            </div>

        ))

        return ( 
            <div>
                {this.props.resultsVisibility && 
                    <div className="repositoriesContainer">
                        <h2>Repositories for {this.state.search}</h2>
                        
                        {results}
                    </div>
                }

                {this.state.commitsVisibility && !this.props.resultsVisibility &&
                    <button className="backBtn" onClick={() => {
                        this.props.switchResultsVisibility()}}><FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                }

                <div className="commitsContainer">
                    {!this.props.resultsVisibility && 
                    <Commits
                        commits={this.state.commitResults}
                        commitsVisibility={this.state.commitsVisibility}
                    />}
                </div>
            </div>
        )
    }
}
  
export default Results;

