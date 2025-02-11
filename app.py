#!/usr/bin/env python3

"""
imgsALT - Image Alt Text Generator
A Flask application that generates accessible alt text for images using AI.

This module handles the web server setup, file uploads, and integration with the OpenAI API
for generating alt text descriptions of uploaded images.

Version: 1.0.0
Author: NC Jones @ndyjones
License: MIT
Created: February 2025
"""


from flask import Flask, request, render_template, jsonify
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from openai import OpenAI
import base64

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_alt_text(image_path):
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    # Read and encode the image
    with open(image_path, "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Updated to use new model
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Generate a concise, descriptive alt text for this image that would be suitable for accessibility purposes."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{encoded_image}"  # Updated format
                            }
                        }
                    ]
                }
            ],
            max_tokens=100
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating ALT text: {str(e)}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        alt_text = generate_alt_text(filepath)
        
        # Clean up the uploaded file
        os.remove(filepath)
        
        return jsonify({
            'success': True,
            'alt_text': alt_text
        })
    
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=7000)  