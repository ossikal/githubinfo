import React from "react";
import ReactDOM from "react-dom";
import arrowright from "../img/arrow-right.svg"
import Commits from "./Commits"
import {
    BrowserRouter as Router,
    Route, Link, Redirect, withRouter
} from "react-router-dom"

function Results(props) {
    const names = props.name.map(r => (
        <div className="resultCard" key={r.id} onClick={() => {console.log(r.commits_url)}}>
            {r.name}
            <img src={arrowright} alt="arrow-right" width="13px" className="arrow" />
        </div>
    ))

    return ( 
        <div>
            <div>{names}</div>
            
            
            <div>
                <Router>
                    <div>
                        <div>
                            <Link to="/commits">Commits</Link>
                        </div>
                        <Route path="/commits" render={() => <Commits />} />
                    </div>
                </Router>
            </div> 

        </div>
    )
}
  
export default Results;

