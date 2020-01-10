import React from "react";
import Commits from "./Commits"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

// The results component generates results based on the search component's data

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           search: this.props.search,
           commitsUrl: "",
           commitsVisibility: false,
           reponame: ""
        };
        this.switchCommitsVisibility = this.switchCommitsVisibility.bind(this);
    }
    
    // Switches the visibility of the commits
    switchCommitsVisibility() {
        this.setState(prevState => ({
          commitsVisibility: !prevState.commitsVisibility
        })) 
    }

    render() {
        
        //Map repository search results
        const results = this.props.searchResults.map(r => (

            <div className="resultCard" key={r.id} onClick={() => {
                this.setState({
                    commitsUrl: r.commits_url,
                    reponame: r.name
                });
                this.switchCommitsVisibility();
                this.props.switchResultsVisibility();}}>

                {r.name}
                <span className="arrow"><FontAwesomeIcon icon={faChevronRight} /></span>
            </div>

        ))

        return ( 
            <div>
                {this.props.resultsVisibility && 
                    <div className="repositoriesContainer">
                        <h2>Repositories of {this.state.search}</h2>
                        
                        {results}
                    </div>
                }

                {this.state.commitsVisibility &&
                    <button className="backBtn" onClick={() => {
                        this.switchCommitsVisibility();
                        this.props.switchResultsVisibility();
                        }}><FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                }

                <div className="commitsContainer">
                    {this.state.commitsVisibility && 
                    <Commits
                        commitsVisibility={this.state.commitsVisibility}
                        switchCommitsVisibility={this.switchCommitsVisibility}
                        commit_url={this.state.commitsUrl}
                        reponame={this.state.reponame}
                    />}
                </div>
            </div>
        )
    }
}
  
export default Results;

