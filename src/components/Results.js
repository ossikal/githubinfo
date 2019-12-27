import React from "react";
import ReactDOM from "react-dom";
import arrowright from "../img/arrow-right.svg"
import Commits from "./Commits"


class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           commitResults: [],
           error: "",
           resultsVisibility:this.props.resultsVisibility
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

        this.setState({
            resultsVisibility: false
        })
    }

    render() {
        
        //Map search results
        const names = this.props.name.map(r => (
            <div className="resultCard" key={r.id} onClick={() => {this.getCommits(r.commits_url)}}>
                {r.name}
                <img src={arrowright} alt="arrow-right" width="13px" className="arrow" />
            </div>
        ))

        return ( 
            <div>
                <div>
                    {this.state.resultsVisibility && names}
                </div>
                <div>
                    <Commits
                        commits={this.state.commitResults}
                    />
                </div>
            </div>
        )
    }
}
  
export default Results;

