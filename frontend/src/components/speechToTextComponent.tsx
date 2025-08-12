import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function SpeechToTextComponent({ transcript, setTranscript }: { transcript: string, setTranscript: (t: string) => void }) {
    const {
        transcript: internalTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    React.useEffect(() => {
        if (internalTranscript !== transcript) {
            setTranscript(internalTranscript);
        }
    }, [internalTranscript, transcript, setTranscript]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div className="speech-to-text-component">
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={SpeechRecognition.startListening}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <div className='panel-content'>
                <p>Transcript: {transcript || <span style={{ color: "#aaa" }}>[No speech detected]</span>}</p>
            </div>
        </div>
    );
}

export default SpeechToTextComponent;