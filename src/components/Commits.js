import React from "react";
import ReactDOM from "react-dom";


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
        console.log(mins.toString().length)
        return fulldate;
    }

    render() {

        //Map 10 latest commits
        const commits = this.props.commits.slice(0,10).map(r => (
            <div className="commitCard" key={r.id}>
                <h4>{r.commit.message}</h4>
                <img src={r.author && r.author.avatar_url}></img>
                <p>{r.commit.author.name}</p>
                <p>{[this.formatDate(r.commit.author.date)]}</p>
            </div>
        ))
        
        return ( 
            <div>
                <div>
                    {commits}
                </div>  
            </div>
        )
    }
}
  
export default Commits;

