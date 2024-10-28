import React, { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';

const DigitClassifier = () => {
  const [model, setModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prediction, setPrediction] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const predictTimeoutRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(280);

  class NeuralNetwork {
    constructor() {
      // Initialize weights with small random values
      this.weights1 = new Array(784).fill(0).map(() =>
        new Array(128).fill(0).map(() => Math.random() * 0.01 - 0.005) // Small random values
      );
      this.weights2 = new Array(128).fill(0).map(() =>
        new Array(10).fill(0).map(() => Math.random() * 0.01 - 0.005) // Small random values
      );
      this.bias1 = new Array(128).fill(0);
      this.bias2 = new Array(10).fill(0);
    }
  
    // Stable sigmoid function
    sigmoid(x) {
      if (x >= 0) {
        const z = Math.exp(-x);
        return 1 / (1 + z);
      } else {
        const z = Math.exp(x);
        return z / (1 + z);
      }
    }
  
    // Forward pass with NaN checks
    forward(input) {
      const hidden = new Array(128).fill(0).map(() => Math.random() * 2 - 1); // Random values between -1 and 1
      for (let i = 0; i < 128; i++) {
        let sum = this.bias1[i];
        for (let j = 0; j < 784; j++) {
          sum += input[j] * this.weights1[j][i];
        }
        hidden[i] = this.sigmoid(sum);
  
      }

      const output = new Array(10).fill(0).map(() => Math.random() * 2 - 1); // Random values between -1 and 1
      for (let i = 0; i < 10; i++) {
        let sum = this.bias2[i];
        for (let j = 0; j < 128; j++) {
          sum += hidden[j] * this.weights2[j][i];
        }
        output[i] = this.sigmoid(sum);
      }
  
      return output;
    }
  
    train(input, target, learningRate = 0.01) {
      // Forward pass
      const hidden = new Array(128).fill(0).map(() => Math.random() * 2 - 1); // Random values between -1 and 1
      for (let i = 0; i < 128; i++) {
        let sum = this.bias1[i];

        for (let j = 0; j < 784; j++) {
          sum += input[j] * this.weights1[j][i]
        }
        hidden[i] = this.sigmoid(sum);
      }
  
      const output = new Array(128).fill(0).map(() => Math.random() * 2 - 1); // Random values between -1 and 1
      for (let i = 0; i < 10; i++) {
        let sum = this.bias2[i];
        for (let j = 0; j < 128; j++) {
          sum += hidden[j] * this.weights2[j][i];
        }
        output[i] = this.sigmoid(sum);
      }
  
      // Backward pass
      const deltaOutput = output.map((o, i) => o - target[i]);
      const deltaHidden = new Array(128).fill(0);
  
      for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 10; j++) {
          deltaHidden[i] += deltaOutput[j] * this.weights2[i][j];
        }
        deltaHidden[i] *= hidden[i] * (1 - hidden[i]); // Sigmoid derivative
      }
  
      // Update weights and biases with clamping to avoid extreme updates
      for (let i = 0; i < 784; i++) {
        for (let j = 0; j < 128; j++) {
          const weightUpdate = learningRate * input[i] * deltaHidden[j];
          this.weights1[i][j] -= weightUpdate;
        }
      }
  
      for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 10; j++) {
          const weightUpdate = learningRate * hidden[i] * deltaOutput[j];
          this.weights2[i][j] -= weightUpdate;
        }
      }
  
      this.bias1 = this.bias1.map((b, i) => b - learningRate * deltaHidden[i]);
      this.bias2 = this.bias2.map((b, i) => b - learningRate * deltaOutput[i]);
    }
  }
  
  useEffect(() => {
    const updateCanvasSize = () => {
      // Set canvas size based on screen width
      const width = window.innerWidth;
      if (width <= 480) {
        // Mobile phones
        setCanvasSize(280);
      } else {
        // Larger screens
        setCanvasSize(200);
      }
    };

    // Initial size setup
    updateCanvasSize();

    // Add resize listener
    window.addEventListener('resize', updateCanvasSize);
    
    // Initialize canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = canvasSize / 14; // Adjust line width based on canvas size
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Cleanu
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [canvasSize]);

  const getCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Previous event handlers remain largely the same but using canvasSize
  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const coords = getCoordinates(e, canvas);
    setLastPos(coords);
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e, canvas);
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    
    setLastPos(coords);

    if (predictTimeoutRef.current) {
      clearTimeout(predictTimeoutRef.current);
    }
    
    predictTimeoutRef.current = setTimeout(() => {
      if (model) {
        classifyDigit();
      }
    }, 100);
  };

  // Previous helper functions remain the same
  const stopDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(false);
    if (model) {
      classifyDigit();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPrediction(null);
  };

  // Load the MNIST dataset
  const loadMNIST = async () => {
    console.log("Loading MNIST dataset...");
    return new Promise((resolve, reject) => {
      Papa.parse('/data/mnist_train.csv', {
        download: true,
        header: false,
        complete: (results) => {
          const trainingData = results.data.map(row => {
            // Skip the first row which contains the header.
            if (row[0] === "label") return null;

            const label = row[0];
            const input = row.slice(1).map(pixel => pixel / 255); // Normalize pixel values
            const target = new Array(10).fill(0);
            target[label] = 1; // One-hot encoding
            return { input, target };
          });

          // Remove the first element which is null
          trainingData.shift();

          resolve(trainingData);
        },
        error: reject,
      });
    });
  };

  const trainModel = async () => {
    console.log("Training the model...");
    setIsTraining(true);
    setProgress(0);
    const nn = new NeuralNetwork();
    setModel(nn);
  
    const trainingData = await loadMNIST();
    const miniBatchSize = 32; // You can adjust this size
    const numEpochs = 10;
  
    for (let epoch = 0; epoch < numEpochs; epoch++) {
      // Shuffle the training data
      trainingData.sort(() => Math.random() - 0.5);
  
      for (let i = 0; i < trainingData.length; i += miniBatchSize) {
        const miniBatch = trainingData.slice(i, i + miniBatchSize);
        
        // Train on each mini-batch
        miniBatch.forEach(({ input, target }) => {
          nn.train(input, target);
        });
      }
  
      setProgress(((epoch + 1) / numEpochs) * 100);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  
    setIsTraining(false);
  };
  

  const classifyDigit = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const input = [];
    
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        let sum = 0;
        const sX = Math.floor(x * (canvas.width / 28));
        const sY = Math.floor(y * (canvas.height / 28));
        
        for (let dy = 0; dy < Math.floor(canvas.height / 28); dy++) {
          for (let dx = 0; dx < Math.floor(canvas.width / 28); dx++) {
            const pixelIndex = ((sY + dy) * canvas.width + (sX + dx)) * 4;
            sum += (255 - imageData.data[pixelIndex]) / 255;
          }
        }
        input.push(sum / (Math.floor(canvas.width / 28) * Math.floor(canvas.height / 28)));
      }
    }

    const output = model.forward(input);
    const predictedDigit = output.indexOf(Math.max(...output));
    const confidence = Math.max(...output) * 100;
    setPrediction({ digit: predictedDigit, confidence: confidence.toFixed(1) });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Digit Classifier</h2>
        
        <div style={styles.content}>
          <div style={styles.buttonContainer}>
            <button 
              onClick={trainModel} 
              disabled={isTraining}
              style={{
                ...styles.button,
                ...(isTraining ? styles.buttonDisabled : {})
              }}
            >
              {isTraining ? 'Training...' : 'Train Model'}
            </button>
            
            <button 
              onClick={clearCanvas}
              style={styles.button}
            >
              Clear Canvas
            </button>
          </div>

          {isTraining && (
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${progress}%`
                  }}
                />
              </div>
              <p style={styles.progressText}>Training Progress: {progress}%</p>
            </div>
          )}

          <div style={styles.canvasContainer}>
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              style={styles.canvas}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
            />
          </div>

          {prediction !== null && (
            <div style={styles.alert}>
              <p style={styles.alertText}>
                Predicted Digit: {prediction.digit} (Confidence: {prediction.confidence}%)
              </p>
            </div>
          )}

          {!model && !isTraining && (
            <div style={styles.alert}>
              <p style={styles.alertText}>
                Please train the model first before drawing digits.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    touchAction: 'none',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    width: '8rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#1d4ed8',
    },
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: '0.5rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '0.25rem',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    transition: 'width 0.2s',
  },
  progressText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.5rem',
    textAlign: 'center',
  },
  canvasContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  canvas: {
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    cursor: 'crosshair',
    touchAction: 'none',
    maxWidth: '300px',
    maxHeight: '300px',
  },
  alert: {
    backgroundColor: '#f3f4f6',
    borderRadius: '0.375rem',
    padding: '0.75rem 1rem',
    border: '1px solid #e5e7eb',
    width: '100%',
  },
  alertText: {
    color: '#1f2937',
    fontSize: '0.875rem',
    textAlign: 'center',
  },
};

export default DigitClassifier;