import React, { useState, useEffect } from "react";

function MyTaskCard({ id, progress, title, activeToken, current_progress }) {
    const [newProgress, setNewProgress] = useState(current_progress);
    useEffect(() => {
        // Update newProgress with the progress prop when it changes
        setNewProgress(progress);
    }, [progress]);

    const handleProgressUpdate = async () => {
        try {
            const response = await fetch(`tasks/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${activeToken}`
                },
                body: JSON.stringify({ progress: newProgress })
            });
            const data = await response.json();
            console.log(data);
            
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    const handleProgressChange = (e) => {
        setNewProgress(parseInt(e.target.value)); 
    };

    

    return (
        <>
            <div className="card mt-5 mb-5 ms-5 bg-light" style={{ width: "250px" }}>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">ID: {id}</p>
                    <div className="progress mt-2 mb-3">
                        <div className="progress-bar bg-success" role="progressbar" style={{ width: `${newProgress}%` }} aria-valuenow={newProgress} aria-valuemin="0" aria-valuemax="100">
                            Progress: {newProgress}%
                        </div>
                    </div>
                    <input
                        type="range"
                        className="form-range"
                        min="0"
                        max="100"
                        value={newProgress}
                        onChange={handleProgressChange} 
                    />
                    <button className="btn btn-primary mt-2" onClick={handleProgressUpdate}>
                        Update Progress
                    </button>
                </div>
            </div>
        </>
    );
}

export default MyTaskCard;
