import React from 'react';
import "./styles.css";

const TeamViewColumn = ({ item }) => {
    const { worker : { attributes : { voiceActivity } } } = item;

    const activity = (voiceActivity && voiceActivity !== "") ? voiceActivity : "none";
    
    return (
        <div> 
            {activity}  
        </div>
    );
}

export default TeamViewColumn;