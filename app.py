from flask import request, redirect
import os
from views import views

app = Flask(__name__)
app.register_blueprint(views, url_prefix="/")

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return 'Fotoğraf yüklendi!'

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
    # app.py'ye ekleyin
@app.route('/ping')
def ping():
    return "OK"