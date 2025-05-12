from flask import Flask, render_template, send_from_directory
import os

# Flask uygulamasını oluştur (EN ÜSTTE OLMALI)
app = Flask(__name__)

# Konfigürasyon ayarları
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Önbellek sorununu çözer

# Route tanımları
@app.route('/protected_images/<filename>')
def protected_images(filename):
    return send_from_directory('static/images', filename)

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