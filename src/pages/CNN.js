import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";

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
  const [modelLoaded, setModelLoaded] = useState(false); // Add this state

  // Add useEffect for auto-loading
  useEffect(() => {
    const loadSavedModel = () => {
      try {
        const cnn = new ConvolutionalNeuralNetwork();
        const success = cnn.loadWeights();
        if (success) {
          console.log('Successfully loaded saved model!');
          setModel(cnn);
          setModelLoaded(true);
        } else {
          console.log('No saved model found, please train a new one.');
        }
      } catch (error) {
        console.error('Error loading saved model:', error);
      }
    };

    loadSavedModel();
  }, []);

  class ConvolutionalNeuralNetwork {
    constructor() {
      // Helper for Xavier/Glorot initialization
      const glorotInit = (fanIn, fanOut) => {
        const limit = Math.sqrt(6 / (fanIn + fanOut));
        return () => Math.random() * 2 * limit - limit;
      };

      // Conv layer 1: 1x28x28 -> 8x24x24
      const conv1Init = glorotInit(25, 25 * 8); // 5x5 filter, 1 input channel, 8 filters
      this.conv1 = {
        filters: Array(8)
          .fill()
          .map(() =>
            Array(1)
              .fill()
              .map(() =>
                Array(5)
                  .fill()
                  .map(() => Array(5).fill().map(conv1Init)),
              ),
          ),
        bias: Array(8).fill(0),
      };

      // Conv layer 2: 8x12x12 -> 16x8x8
      const conv2Init = glorotInit(25 * 8, 25 * 16); // 5x5 filter, 8 input channels, 16 filters
      this.conv2 = {
        filters: Array(16)
          .fill()
          .map(() =>
            Array(8)
              .fill()
              .map(() =>
                Array(5)
                  .fill()
                  .map(() => Array(5).fill().map(conv2Init)),
              ),
          ),
        bias: Array(16).fill(0),
      };

      // FC layers with proper initialization
      const fc1Init = glorotInit(16 * 4 * 4, 128);
      const fc2Init = glorotInit(128, 10);

      this.fc1 = {
        weights: Array(16 * 4 * 4)
          .fill()
          .map(() => Array(128).fill().map(fc1Init)),
        bias: Array(128).fill(0),
      };

      this.fc2 = {
        weights: Array(128)
          .fill()
          .map(() => Array(10).fill().map(fc2Init)),
        bias: Array(10).fill(0),
      };

      this.bn1 = {
        gamma: Array(8).fill(1),    // Scale for conv1
        beta: Array(8).fill(0)      // Shift for conv1
      };
      
      this.bn2 = {
        gamma: Array(16).fill(1),   // Scale for conv2
        beta: Array(16).fill(0)     // Shift for conv2
      };
      
      this.bnFC1 = {
        gamma: Array(128).fill(1),  // Scale for FC1
        beta: Array(128).fill(0)    // Shift for FC1
      };
    
      // Initialize running statistics
      this.runningMean = null;
      this.runningVar = null;
    }

    relu(x) {
      return Math.max(0, x);
    }

    reluDerivative(x) {
      return x > 0 ? 1 : 0;
    }

    // Stable sigmoid implementation
    sigmoid(x) {
      const clampedX = Math.min(Math.max(x, -709), 709); // Prevent overflow
      return x >= 0
        ? 1 / (1 + Math.exp(-clampedX))
        : Math.exp(clampedX) / (1 + Math.exp(clampedX));
    }

    sigmoidDerivative(x) {
      const sx = this.sigmoid(x);
      return sx * (1 - sx);
    }

    maxPool(input, size, saveIndices = false) {
      const height = input[0].length;
      const width = input[0][0].length;
      const channels = input.length;
      const pooledHeight = Math.floor(height / size);
      const pooledWidth = Math.floor(width / size);

      const output = Array(channels)
        .fill()
        .map(() =>
          Array(pooledHeight)
            .fill()
            .map(() => Array(pooledWidth).fill(0)),
        );

      // Save indices for backpropagation if requested
      const indices = saveIndices
        ? Array(channels)
            .fill()
            .map(() =>
              Array(pooledHeight)
                .fill()
                .map(() =>
                  Array(pooledWidth)
                    .fill()
                    .map(() => ({ i: 0, j: 0 })),
                ),
            )
        : null;

      for (let c = 0; c < channels; c++) {
        for (let i = 0; i < pooledHeight; i++) {
          for (let j = 0; j < pooledWidth; j++) {
            let max = -Infinity;
            let maxI = 0;
            let maxJ = 0;

            for (let di = 0; di < size; di++) {
              for (let dj = 0; dj < size; dj++) {
                const val = input[c][i * size + di][j * size + dj];
                if (val > max) {
                  max = val;
                  maxI = i * size + di;
                  maxJ = j * size + dj;
                }
              }
            }
            output[c][i][j] = max;
            if (saveIndices) {
              indices[c][i][j] = { i: maxI, j: maxJ };
            }
          }
        }
      }
      return { output, indices };
    }

    batchNorm(x, training = true) {
      // Running statistics for inference
      if (!this.runningMean) this.runningMean = new Array(x.length).fill(0);
      if (!this.runningVar) this.runningVar = new Array(x.length).fill(1);
      
      const epsilon = 1e-8;
      const momentum = 0.9;
    
      if (training) {
        // Calculate mean and variance for current batch
        const mean = x.reduce((a, b) => a + b, 0) / x.length;
        const variance = x.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / x.length;
        
        // Update running statistics
        for (let i = 0; i < this.runningMean.length; i++) {
          this.runningMean[i] = momentum * this.runningMean[i] + (1 - momentum) * mean;
          this.runningVar[i] = momentum * this.runningVar[i] + (1 - momentum) * variance;
        }
        
        // Normalize using batch statistics
        return x.map(val => (val - mean) / Math.sqrt(variance + epsilon));
      } else {
        // Use running statistics for inference
        return x.map((val, i) => 
          (val - this.runningMean[i]) / Math.sqrt(this.runningVar[i] + epsilon)
        );
      }
    }

    // Add dropout helper function
    dropout(x, rate = 0.5, training = true) {
      if (!training) return x;  // During inference, no dropout
      
      // For 2D arrays (convolutional layers)
      if (Array.isArray(x[0])) {
        return x.map(row => 
          row.map(val => 
            Math.random() > rate ? val / (1 - rate) : 0
          )
        );
      }
      
      // For 1D arrays (fully connected layers)
      return x.map(val => 
        Math.random() > rate ? val / (1 - rate) : 0
      );
    }

    convolve(input, layer, saveCache = false) {
      try {
        // Add input validation
        if (!input || !input[0] || !input[0][0]) {
          console.error(
            "Invalid input dimensions:",
            input?.length,
            input[0]?.length,
          );
          throw new Error("Invalid input dimensions");
        }

        const inputChannels = input.length;
        const inputHeight = input[0].length;
        const inputWidth = input[0][0].length;
        const filterSize = layer.filters[0][0].length; // Should be 5 for both conv layers

        // Calculate output dimensions
        const height = Math.max(0, inputHeight - filterSize + 1);
        const width = Math.max(0, inputWidth - filterSize + 1);
        const numFilters = layer.filters.length;

        // Add dimension validation
        if (height <= 0 || width <= 0) {
          console.error("Invalid output dimensions:", height, width);
          throw new Error("Invalid output dimensions");
        }

        const output = Array(numFilters)
          .fill()
          .map(() =>
            Array(height)
              .fill()
              .map(() => Array(width).fill(0)),
          );

        const preActivations = saveCache
          ? Array(numFilters)
              .fill()
              .map(() =>
                Array(height)
                  .fill()
                  .map(() => Array(width).fill(0)),
              )
          : null;

        for (let f = 0; f < numFilters; f++) {
          for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
              let sum = layer.bias[f];

              for (let c = 0; c < inputChannels; c++) {
                for (let di = 0; di < filterSize; di++) {
                  for (let dj = 0; dj < filterSize; dj++) {
                    if (i + di < inputHeight && j + dj < inputWidth) {
                      sum +=
                        input[c][i + di][j + dj] * layer.filters[f][c][di][dj];
                    }
                  }
                }
              }

              if (saveCache) {
                preActivations[f][i][j] = sum;
              }
              output[f][i][j] = this.relu(sum);
            }
          }
        }
        return { output, preActivations };
      } catch (error) {
        console.error("Error in convolve:", error);
        throw error;
      }
    }

    forward(inputArray, saveCache = false, training = true) {  // Add training parameter
      try {
        // Reshape input to 1x28x28
        const input = [Array(28).fill().map((_, i) => 
          Array(28).fill().map((_, j) => inputArray[i * 28 + j])
        )];
    
        // First conv layer
        const conv1Result = this.convolve(input, this.conv1, saveCache);
        const conv1Normalized = conv1Result.output.map(channel => 
          this.batchNorm(channel.flat()).reduce((rows, val, index) => {
            const rowIndex = Math.floor(index / channel[0].length);
            if (!rows[rowIndex]) rows[rowIndex] = [];
            rows[rowIndex].push(val);
            return rows;
          }, [])
        );
        
        // Add dropout after conv1
        const conv1Dropout = conv1Normalized.map(channel =>
          this.dropout(channel, 0.1, training)  // 10% dropout rate
        );
        
        const pool1Result = this.maxPool(conv1Dropout, 2, saveCache);
    
        // Second conv layer
        const conv2Result = this.convolve(pool1Result.output, this.conv2, saveCache);
        const conv2Normalized = conv2Result.output.map(channel => 
          this.batchNorm(channel.flat()).reduce((rows, val, index) => {
            const rowIndex = Math.floor(index / channel[0].length);
            if (!rows[rowIndex]) rows[rowIndex] = [];
            rows[rowIndex].push(val);
            return rows;
          }, [])
        );
        
        // Add dropout after conv2
        const conv2Dropout = conv2Normalized.map(channel =>
          this.dropout(channel, 0.1, training)  // 10% dropout rate
        );
        
        const pool2Result = this.maxPool(conv2Dropout, 2, saveCache);
    
        // Flatten
        const flattened = pool2Result.output.flat(2);
    
        // FC1 with batch norm and dropout
        const fc1 = Array(128).fill(0);
        const fc1PreAct = saveCache ? Array(128).fill(0) : null;
        
        for (let i = 0; i < 128; i++) {
          let sum = this.fc1.bias[i];
          for (let j = 0; j < flattened.length; j++) {
            sum += flattened[j] * this.fc1.weights[j][i];
          }
          if (saveCache) fc1PreAct[i] = sum;
          fc1[i] = this.relu(sum);
        }
        
        const fc1Normalized = this.batchNorm(fc1);
        const fc1Dropout = this.dropout(fc1Normalized, 0.1, training);  // 10% dropout rate for FC layer
    
        // FC2 layer
        const output = Array(10).fill(0);
        const outputPreAct = saveCache ? Array(10).fill(0) : null;
        
        for (let i = 0; i < 10; i++) {
          let sum = this.fc2.bias[i];
          for (let j = 0; j < 128; j++) {
            sum += fc1Dropout[j] * this.fc2.weights[j][i];
          }
          if (saveCache) outputPreAct[i] = sum;
          output[i] = this.sigmoid(sum);
        }
    
        if (saveCache) {
          return {
            output,
            cache: {
              input,
              conv1: { 
                ...conv1Result, 
                normalized: conv1Normalized,
                dropout: conv1Dropout 
              },
              pool1: pool1Result,
              conv2: { 
                ...conv2Result, 
                normalized: conv2Normalized,
                dropout: conv2Dropout 
              },
              pool2: pool2Result,
              flattened,
              fc1: fc1Dropout,
              fc1PreAct,
              fc1Raw: fc1,
              fc1Normalized,
              output: outputPreAct
            }
          };
        }
        
        return output;
      } catch (error) {
        console.error("Error in forward pass:", error);
        throw error;
      }
    }

    backpropagate(input, target, learningRate = 0.01) {
      try {
        // Helper function to safely create and fill arrays
        const createArray = (dimensions, defaultValue = 0) => {
          if (dimensions.length === 0) return defaultValue;
          return Array(dimensions[0])
            .fill()
            .map(() => createArray(dimensions.slice(1), defaultValue));
        };

        // Forward pass with cache
        const { output, cache } = this.forward(input, true);

        // Gradient clipping function
        const clipGradient = (grad) => {
          if (typeof grad !== "number" || isNaN(grad)) return 0;
          const threshold = 10; // Increased from 5
          return Math.min(Math.max(grad, -threshold), threshold);
        };

        // Initialize all gradients with proper dimensions
        const fc2WeightGrads = createArray([128, 10]);
        const fc2BiasGrads = createArray([10]);
        const fc1WeightGrads = createArray([cache.flattened.length, 128]);
        const fc1BiasGrads = createArray([128]);
        const conv2FilterGrads = createArray([16, 8, 5, 5]);
        const conv2BiasGrads = createArray([16]);
        const conv1FilterGrads = createArray([8, 1, 5, 5]);
        const conv1BiasGrads = createArray([8]);

        // Output layer gradients
        const outputDelta = output.map((o, i) =>
          clipGradient(
            (o - target[i]) * this.sigmoidDerivative(cache.output[i]),
          ),
        );

        // FC2 gradients
        for (let i = 0; i < 128; i++) {
          for (let j = 0; j < 10; j++) {
            fc2WeightGrads[i][j] = clipGradient(cache.fc1[i] * outputDelta[j]);
          }
        }
        outputDelta.forEach((delta, i) => {
          fc2BiasGrads[i] = clipGradient(delta);
        });

        // FC1 backprop
        const fc1Delta = createArray([128]);
        for (let i = 0; i < 128; i++) {
          let error = 0;
          for (let j = 0; j < 10; j++) {
            error += outputDelta[j] * this.fc2.weights[i][j];
          }
          fc1Delta[i] = clipGradient(
            error * this.reluDerivative(cache.fc1PreAct[i]),
          );
        }

        // FC1 gradients
        for (let i = 0; i < cache.flattened.length; i++) {
          for (let j = 0; j < 128; j++) {
            fc1WeightGrads[i][j] = clipGradient(
              cache.flattened[i] * fc1Delta[j],
            );
          }
        }
        fc1Delta.forEach((delta, i) => {
          fc1BiasGrads[i] = clipGradient(delta);
        });

        // Reshape FC1 gradients for conv layers
        const pool2Delta = createArray([16, 4, 4]);
        let deltaIdx = 0;
        for (let c = 0; c < 16; c++) {
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
              let error = 0;
              for (let k = 0; k < 128; k++) {
                error += fc1Delta[k] * this.fc1.weights[deltaIdx][k];
              }
              pool2Delta[c][i][j] = clipGradient(error);
              deltaIdx++;
            }
          }
        }

        // Conv2 backprop
        const conv2Delta = createArray([16, 8, 8]);
        for (let c = 0; c < 16; c++) {
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
              if (cache.pool2.indices[c]?.[i]?.[j]) {
                const { i: maxI, j: maxJ } = cache.pool2.indices[c][i][j];
                if (maxI < 8 && maxJ < 8) {
                  conv2Delta[c][maxI][maxJ] = clipGradient(
                    pool2Delta[c][i][j] *
                      this.reluDerivative(
                        cache.conv2.preActivations[c][maxI][maxJ],
                      ),
                  );
                }
              }
            }
          }
        }

        // Conv2 gradients
        for (let f = 0; f < 16; f++) {
          let biasGrad = 0;
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              if (typeof conv2Delta[f]?.[i]?.[j] === "number") {
                biasGrad += conv2Delta[f][i][j];
              }
            }
          }
          conv2BiasGrads[f] = clipGradient(biasGrad);

          for (let c = 0; c < 8; c++) {
            for (let i = 0; i < 5; i++) {
              for (let j = 0; j < 5; j++) {
                let grad = 0;
                for (let di = 0; di < 8; di++) {
                  for (let dj = 0; dj < 8; dj++) {
                    if (
                      typeof cache.pool1.output[c]?.[di + i]?.[dj + j] ===
                        "number" &&
                      typeof conv2Delta[f]?.[di]?.[dj] === "number"
                    ) {
                      grad +=
                        conv2Delta[f][di][dj] *
                        cache.pool1.output[c][di + i][dj + j];
                    }
                  }
                }
                conv2FilterGrads[f][c][i][j] = clipGradient(grad);
              }
            }
          }
        }

        // Pool1 backprop
        const pool1Delta = createArray([8, 12, 12]);
        for (let c = 0; c < 8; c++) {
          for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 12; j++) {
              if (cache.pool1.indices[c]?.[i]?.[j]) {
                const { i: maxI, j: maxJ } = cache.pool1.indices[c][i][j];
                if (maxI < 12 && maxJ < 12) {
                  pool1Delta[c][maxI][maxJ] = clipGradient(
                    conv2Delta[c]?.[i]?.[j] || 0,
                  );
                }
              }
            }
          }
        }

        // Conv1 gradients
        for (let f = 0; f < 8; f++) {
          let biasGrad = 0;
          for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 12; j++) {
              if (typeof pool1Delta[f]?.[i]?.[j] === "number") {
                biasGrad += pool1Delta[f][i][j];
              }
            }
          }
          conv1BiasGrads[f] = clipGradient(biasGrad);

          for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
              let grad = 0;
              for (let di = 0; di < 24; di++) {
                for (let dj = 0; dj < 24; dj++) {
                  if (
                    typeof cache.input[0]?.[di + i]?.[dj + j] === "number" &&
                    typeof pool1Delta[f]?.[di]?.[dj] === "number"
                  ) {
                    grad +=
                      pool1Delta[f][di][dj] * cache.input[0][di + i][dj + j];
                  }
                }
              }
              conv1FilterGrads[f][0][i][j] = clipGradient(grad);
            }
          }
        }

        // Update function with safety checks
        const safeUpdate = (param, grad, lr = learningRate) => {
          if (typeof param !== "number" || typeof grad !== "number")
            return param;
          return param - lr * clipGradient(grad);
        };

        // Update all parameters
        // [Previous update code with safeUpdate...]

        // Update weights and biases with gradient clipping
        const applyUpdate = (param, grad) => {
          const clippedGrad = clipGradient(grad);
          return param - learningRate * clippedGrad;
        };

        // Update conv1
        for (let f = 0; f < 8; f++) {
          this.conv1.bias[f] = applyUpdate(
            this.conv1.bias[f],
            conv1BiasGrads[f],
          );
          for (let c = 0; c < 1; c++) {
            for (let i = 0; i < 5; i++) {
              for (let j = 0; j < 5; j++) {
                this.conv1.filters[f][c][i][j] = applyUpdate(
                  this.conv1.filters[f][c][i][j],
                  conv1FilterGrads[f][c][i][j],
                );
              }
            }
          }
        }

        // Update conv2
        for (let f = 0; f < 16; f++) {
          this.conv2.bias[f] = applyUpdate(
            this.conv2.bias[f],
            conv2BiasGrads[f],
          );
          for (let c = 0; c < 8; c++) {
            for (let i = 0; i < 5; i++) {
              for (let j = 0; j < 5; j++) {
                this.conv2.filters[f][c][i][j] = applyUpdate(
                  this.conv2.filters[f][c][i][j],
                  conv2FilterGrads[f][c][i][j],
                );
              }
            }
          }
        }

        // Update FC1
        for (let i = 0; i < cache.flattened.length; i++) {
          for (let j = 0; j < 128; j++) {
            this.fc1.weights[i][j] = applyUpdate(
              this.fc1.weights[i][j],
              fc1WeightGrads[i][j],
            );
          }
        }
        for (let i = 0; i < 128; i++) {
          this.fc1.bias[i] = applyUpdate(this.fc1.bias[i], fc1BiasGrads[i]);
        }

        // Update FC2
        for (let i = 0; i < 128; i++) {
          for (let j = 0; j < 10; j++) {
            this.fc2.weights[i][j] = applyUpdate(
              this.fc2.weights[i][j],
              fc2WeightGrads[i][j],
            );
          }
        }
        for (let i = 0; i < 10; i++) {
          this.fc2.bias[i] = applyUpdate(this.fc2.bias[i], fc2BiasGrads[i]);
        }
      } catch (error) {
        console.error("Error in backpropagation:", error);
        console.error("Stack trace:", error.stack);
        throw error;
      }
    }

    // Add methods for computing loss and accuracy
    computeLoss(output, target) {
      return -target.reduce((sum, t, i) => {
        const o = output[i];
        return (
          sum + (t * Math.log(o + 1e-10) + (1 - t) * Math.log(1 - o + 1e-10))
        );
      }, 0);
    }

    getAccuracy(predictions, targets) {
      let correct = 0;
      for (let i = 0; i < predictions.length; i++) {
        const predIndex = predictions[i].indexOf(Math.max(...predictions[i]));
        const targetIndex = targets[i].indexOf(1);
        if (predIndex === targetIndex) correct++;
      }
      return correct / predictions.length;
    }

    saveWeights(name = 'mnist-weights') {
      const weights = {
        conv1: {
          filters: this.conv1.filters,
          bias: this.conv1.bias
        },
        conv2: {
          filters: this.conv2.filters,
          bias: this.conv2.bias
        },
        fc1: {
          weights: this.fc1.weights,
          bias: this.fc1.bias
        },
        fc2: {
          weights: this.fc2.weights,
          bias: this.fc2.bias
        },
        // Include batch norm parameters if using them
        bn1: this.bn1,
        bn2: this.bn2,
        bnFC1: this.bnFC1,
        runningMean: this.runningMean,
        runningVar: this.runningVar,
        // Save timestamp for versioning
        savedAt: new Date().toISOString()
      };
  
      try {
        localStorage.setItem(name, JSON.stringify(weights));
        return true;
      } catch (error) {
        console.error('Error saving weights:', error);
        return false;
      }
    }
  
    loadWeights(name = 'mnist-weights') {
      try {
        const savedWeights = localStorage.getItem(name);
        if (!savedWeights) return false;
  
        const weights = JSON.parse(savedWeights);
  
        // Load the weights
        this.conv1.filters = weights.conv1.filters;
        this.conv1.bias = weights.conv1.bias;
        this.conv2.filters = weights.conv2.filters;
        this.conv2.bias = weights.conv2.bias;
        this.fc1.weights = weights.fc1.weights;
        this.fc1.bias = weights.fc1.bias;
        this.fc2.weights = weights.fc2.weights;
        this.fc2.bias = weights.fc2.bias;
  
        // Load batch norm parameters if they exist
        if (weights.bn1) this.bn1 = weights.bn1;
        if (weights.bn2) this.bn2 = weights.bn2;
        if (weights.bnFC1) this.bnFC1 = weights.bnFC1;
        if (weights.runningMean) this.runningMean = weights.runningMean;
        if (weights.runningVar) this.runningVar = weights.runningVar;
  
        return true;
      } catch (error) {
        console.error('Error loading weights:', error);
        return false;
      }
    }
  }

  // Update the training function to use the new backpropagation
  const trainModel = async () => {
    try {
      console.log("Training the model...");
      setIsTraining(true);
      setProgress(0);
      const cnn = new ConvolutionalNeuralNetwork();
      setModel(cnn);

      const trainingData = await loadMNIST();
      if (!trainingData || trainingData.length === 0) {
        throw new Error("No training data loaded");
      }

      // Validate first sample
      const firstSample = trainingData[0];
      if (
        !firstSample.input ||
        firstSample.input.length !== 784 ||
        !firstSample.target ||
        firstSample.target.length !== 10
      ) {
        throw new Error("Invalid data format");
      }

      const miniBatchSize = 128; // Increased batch size
      const numEpochs = 20; // More epochs
      const initialLearningRate = 0.005; // Adjusted learning rate
      let learningRate = initialLearningRate;

      const momentum = 0.9;
      let prevGradients = null;

      // Split data into training and validation sets
      const validationSplit = 0.1;
      const splitIndex = Math.floor(
        trainingData.length * (1 - validationSplit),
      );
      const trainingSet = trainingData.slice(0, splitIndex);
      const validationSet = trainingData.slice(splitIndex);

      let bestValidationAccuracy = 0;
      let epochsWithoutImprovement = 0;

      for (let epoch = 0; epoch < numEpochs; epoch++) {
        console.log(`Starting epoch ${epoch + 1}`);

        // Shuffle training data
        trainingSet.sort(() => Math.random() - 0.5);

        let epochLoss = 0;
        let trainAccuracy = 0;
        let batchesTrained = 0;

        // Train in mini-batches
        for (let i = 0; i < trainingSet.length; i += miniBatchSize) {
          const batch = trainingSet.slice(
            i,
            Math.min(i + miniBatchSize, trainingSet.length),
          );

          let batchLoss = 0;
          let batchCorrect = 0;

          // Train on batch
          batch.forEach(({ input, target }) => {
            try {
              const output = cnn.forward(input, false, true);
              batchLoss += cnn.computeLoss(output, target);

              // Check accuracy
              const predicted = output.indexOf(Math.max(...output));
              const actual = target.indexOf(1);
              if (predicted === actual) batchCorrect++;

              cnn.backpropagate(input, target, learningRate, momentum);
            } catch (error) {
              console.error("Error in training step:", error);
            }
          });

          epochLoss += batchLoss;
          trainAccuracy += batchCorrect;
          batchesTrained++;

          // Log progress more frequently
          if (batchesTrained % 5 === 0) {
            const progress =
              ((epoch * trainingSet.length + i) /
                (numEpochs * trainingSet.length)) *
              100;
            const batchAccuracy = (batchCorrect / batch.length) * 100;
            console.log(
              `Batch ${batchesTrained}: Loss=${(batchLoss / batch.length).toFixed(4)}, Accuracy=${batchAccuracy.toFixed(2)}%`,
            );
            setProgress(progress);
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }

        // Calculate epoch metrics
        const avgLoss = epochLoss / trainingSet.length;
        const trainAccuracyPct = (trainAccuracy / trainingSet.length) * 100;

        // Compute validation metrics
        const validationResults = validationSet.map((sample) => {
          const output = cnn.forward(sample.input);
          const loss = cnn.computeLoss(output, sample.target);
          const predicted = output.indexOf(Math.max(...output));
          const actual = sample.target.indexOf(1);
          return { loss, correct: predicted === actual };
        });

        const validationLoss =
          validationResults.reduce((sum, r) => sum + r.loss, 0) /
          validationSet.length;
        const validationAccuracy =
          (validationResults.filter((r) => r.correct).length /
            validationSet.length) *
          100;

        console.log(`Epoch ${epoch + 1}/${numEpochs}`);
        console.log(
          `Train Loss: ${avgLoss.toFixed(4)}, Train Accuracy: ${trainAccuracyPct.toFixed(2)}%`,
        );
        console.log(
          `Validation Loss: ${validationLoss.toFixed(4)}, Validation Accuracy: ${validationAccuracy.toFixed(2)}%`,
        );

        // Learning rate scheduling
        if (epoch > 0 && epoch % 5 === 0) {
          learningRate *= 0.5;
          console.log(`Reducing learning rate to ${learningRate}`);
        }
      }

      console.log("Training complete, saving weights...");
      cnn.saveWeights();
      setModelLoaded(true);
      console.log("Weights saved successfully!");

    } catch (error) {
      console.error("Training error:", error);
    } finally {
      setIsTraining(false);
    }
  };

  // Update the prediction function to include confidence scores
  const classifyDigit = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const input = [];

    // Downsample and normalize input
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
        input.push(
          sum /
            (Math.floor(canvas.width / 28) * Math.floor(canvas.height / 28)),
        );
      }
    }

    const output = model.forward(input, false, false);
    const predictedDigit = output.indexOf(Math.max(...output));
    const confidence = (Math.max(...output) * 100).toFixed(1);

    setPrediction({
      digit: predictedDigit,
      confidence: confidence,
      probabilities: output.map((p) => (p * 100).toFixed(1)),
    });
  };

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
    window.addEventListener("resize", updateCanvasSize);

    // Initialize canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = canvasSize / 14; // Adjust line width based on canvas size
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Cleanu
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [canvasSize]);

  const getCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.type.startsWith("touch")
      ? e.touches[0].clientX
      : e.clientX;
    const clientY = e.type.startsWith("touch")
      ? e.touches[0].clientY
      : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
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
    const ctx = canvas.getContext("2d");
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
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPrediction(null);
  };

  const loadMNIST = async () => {
    console.log("Loading MNIST dataset...");
    return new Promise((resolve, reject) => {
      Papa.parse("/data/mnist_train.csv", {
        download: true,
        header: false,
        complete: (results) => {
          const trainingData = results.data
            .filter((row) => row.length > 1) // Filter out empty rows
            .map((row) => {
              if (row[0] === "label") return null;

              try {
                const label = parseInt(row[0]);
                if (isNaN(label) || label < 0 || label > 9) return null;

                const input = row.slice(1).map((pixel) => {
                  const value = parseFloat(pixel) / 255.0;
                  return isNaN(value) ? 0 : value;
                });

                // Ensure input is exactly 784 pixels
                if (input.length !== 784) return null;

                const target = new Array(10).fill(0);
                target[label] = 1;

                return { input, target };
              } catch (error) {
                console.error("Error processing row:", error);
                return null;
              }
            })
            .filter(Boolean); // Remove null values

          console.log("Processed training data size:", trainingData.length);
          resolve(trainingData);
        },
        error: (error) => {
          console.error("Error loading MNIST data:", error);
          reject(error);
        },
      });
    });
  };

  // Update your UI to show loading status
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
              {isTraining ? 'Training...' : modelLoaded ? 'Retrain Model' : 'Train Model'}
            </button>
            
            <button 
              onClick={clearCanvas}
              style={styles.button}
            >
              Clear Canvas
            </button>
          </div>

          {modelLoaded && (
            <div style={{...styles.alert, backgroundColor: '#a7f3d0'}}>
              <p style={{...styles.alertText, color: '#047857'}}>
                Model loaded and ready to use!
              </p>
            </div>
          )}

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
              <p style={styles.progressText}>Training Progress: {progress.toFixed(1)}%</p>
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

          {!model && !isTraining && !modelLoaded && (
            <div style={styles.alert}>
              <p style={styles.alertText}>
                Please train the model to start classifying digits.
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    touchAction: "none",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#1a1a1a",
    textAlign: "center",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
  },
  buttonContainer: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    width: "8rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#1d4ed8",
    },
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
  },
  progressContainer: {
    width: "100%",
  },
  progressBar: {
    width: "100%",
    height: "0.5rem",
    backgroundColor: "#e5e7eb",
    borderRadius: "0.25rem",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2563eb",
    transition: "width 0.2s",
  },
  progressText: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginTop: "0.5rem",
    textAlign: "center",
  },
  canvasContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  canvas: {
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    backgroundColor: "white",
    cursor: "crosshair",
    touchAction: "none",
    maxWidth: "300px",
    maxHeight: "300px",
  },
  alert: {
    backgroundColor: "#f3f4f6",
    borderRadius: "0.375rem",
    padding: "0.75rem 1rem",
    border: "1px solid #e5e7eb",
    width: "100%",
  },
  alertText: {
    color: "#1f2937",
    fontSize: "0.875rem",
    textAlign: "center",
  },
};

export default DigitClassifier;
