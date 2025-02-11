# imgsALT

imgsALT is a web application that generates accessible alt text for images using AI. Upload your image, and get AI-generated alt text descriptions suitable for improving web accessibility.

## Features

- Drag-and-drop image upload interface
- Supports PNG, JPG, and GIF formats
- AI-powered alt text generation
- Copy-to-clipboard functionality
- Responsive design
- Real-time image preview

## Requirements

- Python 3.x
- Flask
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ndyjones/imgsALT.git
cd imgsALT
```

2. Install required packages
```bash
pip install -r requirements.txt
```

3. Create .env file in the root directory and add your OpenAI API key:
```plaintext
OPENAI_API-KEY=your-api-key-here
```

## Usage

1. Start the Flask server:
```bash
python app.py
```

2. Open your web browser and navigate to:
```plaintext
http://localhost:7000
```

3. Upload an image by either dragging and dropping an image into the upload area OR clicking the upload area to select an image file.

4. Click "Generate ALT text" to process your image

5. Copy the generated alt text using the "Copy" button

## Project Structure

```
imgsALT/
├── static/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── script.js
├── templates/
│   └── index.html
├── uploads/
├── app.py
├── requirements.txt
└── .env #Add your OpenAI API keye here
```

## License

MIT License - see LICENSE file for details.

## Author

NC Jones (@ndyjones)

## Contributing 

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request
