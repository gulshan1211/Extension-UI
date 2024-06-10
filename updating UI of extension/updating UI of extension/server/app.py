from flask import Flask, render_template, request , jsonify
import torch
import random
import json
import nltk
from nltk.stem import WordNetLemmatizer
import numpy as np
from torch import nn
from torch.utils.data import DataLoader, Dataset
from flask_cors import CORS     

nltk.download('punkt')
nltk.download('wordnet')

app = Flask(__name__)
CORS(app)
# Load the intents data
with open('dataset/intents1.json', 'r') as f:
    intents = json.load(f)

stemmer = WordNetLemmatizer()

words = []
classes = []
documents = []
ignore_words = ['?']

for intent in intents['intents']:
    for pattern in intent['patterns']:
        w = nltk.word_tokenize(pattern)
        words.extend(w)
        documents.append((w, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

words = [stemmer.lemmatize(w.lower()) for w in words if w not in ignore_words]
words = sorted(list(set(words)))
classes = sorted(list(set(classes)))

# Define the neural network model
class NeuralNetwork(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(NeuralNetwork, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu1 = nn.ReLU()
        self.bn1 = nn.BatchNorm1d(hidden_size)
        self.dropout1 = nn.Dropout(0.2)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.relu2 = nn.ReLU()
        self.bn2 = nn.BatchNorm1d(hidden_size)
        self.dropout2 = nn.Dropout(0.2)
        self.fc3 = nn.Linear(hidden_size, output_size)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu1(x)
        x = self.bn1(x)
        x = self.dropout1(x)
        x = self.fc2(x)
        x = self.relu2(x)
        x = self.bn2(x)
        x = self.dropout2(x)
        x = self.fc3(x)
        return self.softmax(x)

# Load the trained model
def load_model(model_path, input_size, hidden_size, output_size):
    model = NeuralNetwork(input_size, hidden_size, output_size)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

model_path = 'model.pth'
input_size = len(words)
hidden_size = 8
output_size = len(classes)
model = load_model(model_path, input_size, hidden_size, output_size)

def preprocess_sentence(sentence, words):
    sentence_words = sentence.lower().split()
    sentence_words = [stemmer.lemmatize(word) for word in sentence_words if word in words]
    return sentence_words

def sentence_to_features(sentence_words, words):
    features = [1 if word in sentence_words else 0 for word in words]
    return torch.tensor(features).float().unsqueeze(0)

def generate_response(sentence, model, words, classes):
    sentence_words = preprocess_sentence(sentence, words)
    if len(sentence_words) == 0:
        return "I'm sorry, but I don't understand. Can you please rephrase or provide more information?"
    features = sentence_to_features(sentence_words, words)
    with torch.no_grad():
        outputs = model(features)
    probabilities, predicted_class = torch.max(outputs, dim=1)
    confidence = probabilities.item()
    predicted_tag = classes[predicted_class.item()]
    if confidence > 0.5:
        for intent in intents['intents']:
            if intent['tag'] == predicted_tag:
                return random.choice(intent['responses'])
    return "I'm sorry, but I'm not sure how to respond to that."

@app.route('/api/send_message', methods=['POST'])
def chat():
    user_input = request.form['user_input']
    response = generate_response(user_input, model, words, classes)
    return  jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
