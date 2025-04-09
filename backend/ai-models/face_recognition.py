import cv2
import numpy as np
from deepface import DeepFace

# Open webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture image.")
        break

    # Analyze facial expression
    try:
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        detected_emotion = result[0]['dominant_emotion']
        print(f"Detected Emotion: {detected_emotion}")

    except Exception as e:
        print(f"Error in emotion detection: {str(e)}")

    # Break on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
