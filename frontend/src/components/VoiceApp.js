import React, { useState, useEffect, useRef } from "react";

const VoiceApp = () => {
    const [transcript, setTranscript] = useState("");
    const [stressLevel, setStressLevel] = useState("Waiting...");
    const [suggestion, setSuggestion] = useState("Waiting for input...");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const keywordsRef = useRef(null);
    const audioRef = useRef(null); 

    useEffect(() => {
        // Load JSON file
        fetch("/stressKeywords.json")
            .then((response) => response.json())
            .then((data) => {
                keywordsRef.current = data; 
            })
            .catch((error) => console.error("Error loading keywords:", error));

        // Initialize SpeechRecognition
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            const recognition = recognitionRef.current;

            recognition.lang = "en-US";
            recognition.continuous = true;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcriptText = event.results[event.results.length - 1][0].transcript;
                setTranscript(transcriptText);
                analyzeSpeech(transcriptText);
            };

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onerror = (event) => console.error("Speech recognition error", event);
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current) recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
    };

    const analyzeSpeech = async (text) => {
        if (!keywordsRef.current) {
            setStressLevel("Loading keywords...");
            return;
        }

        const lowerText = text.toLowerCase();
        let detectedStress = "Normal Stress 🙂";

        // Check keywords first
        if (keywordsRef.current.high.some(word => lowerText.includes(word))) {
            detectedStress = "High Stress 😡";
        } else if (keywordsRef.current.medium.some(word => lowerText.includes(word))) {
            detectedStress = "Medium Stress 😐";
        } else if (keywordsRef.current.low.some(word => lowerText.includes(word))) {
            detectedStress = "Low Stress 😊";
        }

        setStressLevel(detectedStress);

        try {
            // Call OpenAI API for a relevant suggestion
            const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a helpful assistant that gives short, relevant suggestions based on user speech." },
                        { role: "user", content: `Based on this speech: "${text}", provide a short 1-2 line suggestion. If it involves stress, give stress-relief advice; otherwise, provide a relevant response.` }
                    ],
                    max_tokens: 50
                })
            });

            if (!openAiResponse.ok) {
                throw new Error("Failed to fetch suggestion");
            }

            const openAiData = await openAiResponse.json();
            const finalSuggestion = openAiData.choices[0].message.content.trim();

            setSuggestion(finalSuggestion);
            await readSuggestionAloud(finalSuggestion); // Ensure it reads the suggestion every time
        } catch (error) {
            console.error("Error fetching suggestion:", error);
            setSuggestion("I'm here to help. Try speaking again.");
        }
    };

    // Function to use Eleven Labs API for text-to-speech
    const readSuggestionAloud = async (text) => {
        if (!text) return;

        // Stop any previous audio playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        try {
            const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": "sk_1d72c65421fa5fe04dabf847773a8bbb8a260b823dc1fc0f"
                },
                body: JSON.stringify({
                    text: text,
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5
                    }
                })
            });

            if (!response.ok) {
                throw new Error("Failed to generate speech");
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            // Store reference to the audio element
            audioRef.current = audio;

            // Ensure it plays even for longer suggestions
            audio.play().catch(error => console.error("Error playing suggestion:", error));

        } catch (error) {
            console.error("Error playing suggestion:", error);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>🎤 Real-Time Speech Recognition</h1>
            <button onClick={startListening} disabled={isListening} style={buttonStyle}>
                Start Listening
            </button>
            <button onClick={stopListening} disabled={!isListening} style={buttonStyle}>
                Stop Listening
            </button>
            
            <p><strong>Transcript:</strong> {transcript || "No speech detected yet"}</p>
            <p><strong>Stress Level:</strong> {stressLevel}</p>

            {suggestion && (
                <div style={suggestionBoxStyle}>
                    <p><strong>Suggestion:</strong> {suggestion}</p>
                    <button onClick={() => readSuggestionAloud(suggestion)} style={buttonStyle}>
                        🔊 Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

// Styles
const buttonStyle = {
    margin: "10px",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
};

const suggestionBoxStyle = {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "10px",
    backgroundColor: "#f0f0f0",
    fontSize: "14px",
    display: "inline-block",
};

export default VoiceApp;
