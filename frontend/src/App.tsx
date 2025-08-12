import { useState } from 'react'
import SpeechToTextComponent from './components/speechToTextComponent.tsx';
import DoctorResponseComponent from './components/doctorResponseComponent.tsx';
import ImageUploadComponent from './components/imageUploadComponent.tsx';
import './App.css'

function App() {
  const [transcript, setTranscript] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!transcript) {
      setResponse("Please speak or type a question");
      return;
    }
    if (!image) {
      setResponse("Please upload an image first");
      return;
    }
    setLoading(true);

    // Convert image to base64
    const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided"));
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

    let imageBase64 = "";
    try {
      console.log("Converting image to base64...");
      console.log(image);
      imageBase64 = await toBase64(image);
    } catch {
      setResponse('Error reading image');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/chat/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
            input : {
              question: transcript,
              image: imageBase64
            }
          }
        )
      });
      const data = await res.json();
      setResponse(data.output || 'No response');
    } catch (e) {
      setResponse('Error contacting server');
    }
    setLoading(false);
  };

  return (
    <div className="app-root light">
      <h2 className="app-title">AI Doctor with Vision and Voice</h2>
      <div className="app-grid">
        <div className="audio-panel">
          <SpeechToTextComponent
            transcript={transcript}
            setTranscript={setTranscript}
          />
        </div>
        <div className="right-panels">
          <DoctorResponseComponent
            response={response}
            loading={loading}
          />
          {(transcript.trim() !== "" && image) && (
            <button className="flag-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
        <div className="image-panel">
          <ImageUploadComponent
            image={image}
            setImage={setImage}
          />
        </div>
      </div>
    </div>
  )
}

export default App
