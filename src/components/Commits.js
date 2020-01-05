import React from "react";


class Commits extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           
        };
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

        //Map 10 latest commits
        const commits = this.props.commits.slice(0,10).map(r => (
            <div className="commitCard" key={r.node_id}>
                <h4>{r.commit.message}</h4>
                <img src={r.author && r.author.avatar_url} alt="Author of the commit"></img>
                <p>{r.commit.author.name}</p>
                <p>{[this.formatDate(r.commit.author.date)]}</p>
            </div>
        ))
        
        return ( 
            <div>
                {this.props.commitsVisibility && <h2>Latest 10 commits</h2>}
                <div>
                    {commits}
                </div>  
            </div>
        )
    }
}
  
export default Commits;

