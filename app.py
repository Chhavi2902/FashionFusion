from flask import Flask, request, jsonify
from flask_cors import CORS
from diffusers import DiffusionPipeline
import torch
import base64
import io
from PIL import Image
app = Flask(__name__)
CORS(app)

# Load the pipeline
pipeline = DiffusionPipeline.from_pretrained("ares1123/virtual-dress-try-on")
pipeline = pipeline.to("cuda" if torch.cuda.is_available() else "cpu")

@app.route('/try-on', methods=['POST'])
def try_on():
    # Get the image data from the request
    image_data = request.json['image']
    
    # Convert base64 image to PIL Image
    image = Image.open(io.BytesIO(base64.b64decode(image_data.split(',')[1])))
    
    # Process the image with the pipeline
    result = pipeline(image).images[0]  # Assuming the pipeline returns a list of images
    
    # Convert the result back to base64
    buffered = io.BytesIO()
    result.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return jsonify({'result': f'data:image/png;base64,{img_str}'})

if __name__ == '__main__':
    app.run(debug=True)