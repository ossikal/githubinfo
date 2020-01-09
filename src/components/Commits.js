import React from "react";
import LoadingSpinner from "./LoadingSpinner"

// The commits component fetches commit data and displays it, based on what the user clicks in the results


class Commits extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commitResults: [],
            error: "",
            loading:false
        };
    }

    componentDidMount() {
        this.getCommits()
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
    getCommits() {
        this.setState({loading:true});
        let commit_url = this.props.commit_url;

        //Cut unnecessary part from URL
        commit_url = commit_url.substring(0, commit_url.length - 6)

        fetch(commit_url)
            .then(this.checkStatus)
            .then(this.parseJSON)
            
            //Successful fetch
            .then(function(data) {
                this.setState({
                    commitResults: data,
                    error: "",
                    loading:false
                })
            }.bind(this))

            //Error handling
            .catch(function(error) {
                //console.log('request failed', error)
                this.setState({error: "Not found"})
                this.setState({commitResults: [] })
            }.bind(this))
            
    }



    //Format ISO date to readable format
    formatDate(ISOdate) {
        let date = new Date(ISOdate);
        const m = date.getMonth() + 1; 
        const d = date.getDate();  
        const y = date.getFullYear();
        const hours = date.getHours();
        let mins = date.getMinutes();

        if (mins.toString().length < 2) {
            mins = "0" + mins;
        }

        let fulldate = d + "." + m + "." + y + " " + hours + "." + mins;
        return fulldate;
    }

    render() {
        const loading = this.state.loading;

        //Map 10 latest commits
        const commits = this.state.commitResults.slice(0,10).map(r => (
            <div className="commitCard" key={r.node_id}>
                <h4>{r.commit.message}</h4>
                <img src={r.author && r.author.avatar_url} alt="Author of the commit"></img>
                <p>{r.commit.author.name}</p>
                <p>{[this.formatDate(r.commit.author.date)]}</p>
            </div>
        ))
        
        return ( 
            
            <div>
                
                {loading ? <LoadingSpinner /> : this.props.commitsVisibility && <h2>Latest 10 commits</h2>}
                <div>
                    {commits} 
                </div>  
                
            </div>
        )
    }
}
  
export default Commits;

