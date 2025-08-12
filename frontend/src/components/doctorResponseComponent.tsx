import React, { useRef, useEffect, useState } from "react";
import { useSpeech } from "react-text-to-speech";

function DoctorResponseComponent({ response, loading }: { response: string, loading: boolean }) {
    const [processingTime, setProcessingTime] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const {
      speechStatus, // String that stores current speech status
      start, // Function to start the speech or put it in queue
      pause, // Function to pause the speech
      stop, // Function to stop the speech or remove it from queue
    } = useSpeech({ text: response});

    useEffect(() => {
        if (loading) {
            setProcessingTime(0);
            intervalRef.current = setInterval(() => {
                setProcessingTime(prev => +(prev + 0.1).toFixed(1));
            }, 100);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [loading]);

    return (
        <div className="doctor-panel">
            <div style={response == '' ? { display: 'none' } : {columnGap: "0.5rem", textAlign: "right"}}>
              {speechStatus !== "started" ? <button onClick={start} style={{marginRight: 5}}>Start</button> : <button style={{marginRight:5}} onClick={pause}>Pause</button>}
              <button onClick={stop}>Stop</button>
            </div>
            <div className="panel-label">Doctor's Response</div>
            <div className="panel-content">
              {/* TODO: Show doctor's response here */}
              {loading ? <span className="panel-placeholder">Loading...</span> : <span>{response}</span>}
            </div>
            <div className="panel-footer">
              processing | {processingTime.toFixed(1)}s
            </div>            
        </div>
    )
}

export default DoctorResponseComponent;

