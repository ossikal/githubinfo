import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

/* LoadingSpinner generates an icon representing that the results are being loaded
Activated by making it visible
*/

class LoadingSpinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        
        return ( 
            <div className="spinnercont">
                <span className="spinner"><FontAwesomeIcon icon={faSpinner} spin size="3x" /></span>
            </div>
        )
    }
}
  
export default LoadingSpinner;

