# convert_model.py
import torch
import torch.nn as nn
import numpy as np
from torch.nn import TransformerEncoder, TransformerEncoderLayer
from collections import Counter
import json

class WordleTransformer(nn.Module):
    def __init__(self, vocab_size, word_list, vocab, d_model=128, nhead=4, num_layers=2, dim_feedforward=512):
        super().__init__()
        self.vocab_size = vocab_size
        self.word_list = word_list
        self.vocab = vocab
        # Create reverse vocab (index to char)
        self.idx_to_char = {idx: char for char, idx in vocab.items()}

        # Create word tensors for all valid words
        self.valid_words = torch.stack([word_to_tensor(word, vocab) for word in word_list])

        self.word_embedding = nn.Embedding(vocab_size, d_model)
        self.position_embedding = nn.Embedding(5, d_model)
        self.feedback_embedding = nn.Embedding(3, d_model)
        self.d_model = d_model

        encoder_layers = TransformerEncoderLayer(d_model, nhead, dim_feedforward)
        self.transformer = TransformerEncoder(encoder_layers, num_layers)

        # Output scores for each valid word
        self.fc = nn.Linear(d_model * 5, len(word_list))

        self.register_buffer('positions', torch.arange(5))

    def forward(self, guesses, feedbacks):
        batch_size = guesses.shape[0]
        num_guesses = guesses.shape[1]
        
        # Modified to avoid control flow issues
        if num_guesses == 0:
            # For empty guesses, create a dummy input with position embeddings only
            x = torch.zeros(batch_size, 5, self.d_model, device=guesses.device)
            x = x + self.position_embedding(self.positions).unsqueeze(0)
        else:
            # For non-empty guesses, process normally
            word_emb = self.word_embedding(guesses)
            pos_emb = self.position_embedding(self.positions)
            feedback_emb = self.feedback_embedding(feedbacks)

            x = word_emb + pos_emb.unsqueeze(0).unsqueeze(0) + feedback_emb
            x = x.view(batch_size, num_guesses * 5, -1)
        
        transformer_out = self.transformer(x)
        
        # For ONNX export, use reshape instead of view
        if num_guesses == 0:
            # When no guesses, use all positions
            output = transformer_out.reshape(batch_size, -1)
        else:
            # When we have guesses, take last 5 positions (last word)
            output = transformer_out[:, -5:, :].reshape(batch_size, -1)
        
        # Output scores for each valid word
        word_scores = self.fc(output)
        return word_scores

def word_to_tensor(word, vocab):
    """Convert a word to a tensor of character indices"""
    return torch.tensor([vocab[c] for c in word], dtype=torch.long)

def create_vocabulary(words):
    """Create character-level vocabulary"""
    chars = sorted(set(''.join(words)))
    return {char: idx for idx, char in enumerate(chars)}

def convert_model_to_onnx():
    # Load word list
    try:
        with open("words.txt", 'r') as file:
            word_list = [line.strip() for line in file.readlines()]
    except FileNotFoundError:
        print("Creating a sample word list for testing...")
        word_list = ["apple", "beach", "chair", "dance", "eagle", "flame", "grape", 
                    "happy", "image", "juice", "knife", "light", "music", "night", 
                    "ocean", "peace", "queen", "river", "snake", "table", "umbra", 
                    "vital", "water", "xenon", "yacht", "zebra"]

    vocab = create_vocabulary(word_list)
    vocab_size = len(vocab)
    print(f"Vocabulary size: {vocab_size}")
    
    # Create model
    model = WordleTransformer(vocab_size, word_list, vocab)
    
    try:
        # Load pretrained weights
        model.load_state_dict(torch.load("best_model.pt", map_location=torch.device('cpu')))
        print("Loaded pretrained model weights")
    except:
        print("Could not load model weights, using random initialization")
    
    model.eval()
    
    # Create dummy input for non-empty guesses case
    batch_size = 1
    num_guesses = 1  # Example: 1 previous guess
    guesses = torch.zeros((batch_size, num_guesses, 5), dtype=torch.long)
    feedbacks = torch.zeros((batch_size, num_guesses, 5), dtype=torch.long)
    
    # Export to ONNX format
    torch.onnx.export(
        model,
        (guesses, feedbacks),
        "wordle_model.onnx",
        export_params=True,
        opset_version=14,  # Increased to 14 to support scaled_dot_product_attention
        do_constant_folding=True,
        input_names=['guesses', 'feedbacks'],
        output_names=['word_scores'],
        dynamic_axes={
            'guesses': {1: 'num_guesses'},
            'feedbacks': {1: 'num_guesses'}
        }
    )
    
    print("Model converted to ONNX format and saved as wordle_model.onnx")
    
    # Also export a model for the empty guesses case
    empty_guesses = torch.zeros((batch_size, 0, 5), dtype=torch.long)
    empty_feedbacks = torch.zeros((batch_size, 0, 5), dtype=torch.long)
    
    torch.onnx.export(
        model,
        (empty_guesses, empty_feedbacks),
        "wordle_model_initial.onnx",
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=['guesses', 'feedbacks'],
        output_names=['word_scores'],
        dynamic_axes={
            'guesses': {1: 'num_guesses'},
            'feedbacks': {1: 'num_guesses'}
        }
    )
    
    print("Initial model (for empty guesses) converted to ONNX format")
    
    # Save vocabulary and word list for use in JavaScript
    with open("vocab.json", "w") as f:
        json.dump(vocab, f)
    
    with open("word_list.json", "w") as f:
        json.dump(word_list, f)
    
    print("Saved vocab.json and word_list.json")

# When called as a script, convert the model
if __name__ == "__main__":
    convert_model_to_onnx()