from flask import Flask, render_template
import os

app = Flask(__name__)
from flask import send_from_directory

# app.py'de bu ayarı ekleyin
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Önbellek sorununu çözer

@app.route('/test-images')
def test_images():
    image_list = os.listdir('static/images')
    return f"Sunucudaki resimler: {image_list}"
@app.route('/')
def home():
    try:
        return render_template('index.html')
    except Exception as e:
        return f"Error: {str(e)}", 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)