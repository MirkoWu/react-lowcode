from flask import Flask, Response, request, render_template
from werkzeug.utils import secure_filename
import os

from flask_cors import CORS

app = Flask(__name__)
# # 设置图片保存文件夹
# UPLOAD_FOLDER = 'photo'
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# # 设置允许上传的文件格式
# ALLOW_EXTENSIONS = ['png', 'jpg', 'jpeg']


# # 判断文件后缀是否在列表中
# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[-1] in ALLOW_EXTENSIONS


# print("sss")


# @app.route('/', methods=['GET', 'POST'])
# def home():
#     return '<h1>hello world</h1>'


# # 上传图片
# @app.route("/photo/upload", methods=['POST', "GET"])
# def uploads():
#     if request.method == 'POST':
#         print("接收到请求")
#         # 获取post过来的文件名称，从name=file参数中获取
#         # file = request.files['file']
#         files = request.files.getlist('file')
#         print(len(files))f
#         for file in files:
#             print(file.filename)
#             if file and allowed_file(file.filename):
#             # secure_filename方法会去掉文件名中的中文
#             # file_name = secure_filename(file.filename)
#                 file_name = os.path.basename(file.filename)
#             # 保存图片
#                 file.save(os.path.join(app.config['UPLOAD_FOLDER'], file_name))
#             else:
#                 return "failed"
#         return "success"
#     else:
#         return '请上传文件'

CORS(app)    
@app.route('/getJson', methods=['GET', 'POST'])
def getJson():
    return '[{"name":"NavBar","attr":{}},{"name":"Containers","attr":{"style":{"border":"1px solid red"}},"children":[{"name":"Image","attr":{"width":100,"height":100,"src":"https://img2.baidu.com/it/u=1685092271,2574681286&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=797"}},{"name":"Rate","attr":{"size":"large","value":2}},{"name":"Space","attr":{}},{"name":"Switch","attr":{"size":"large"}},{"name":"Image","attr":{"width":100,"height":100,"src":"https://img2.baidu.com/it/u=1685092271,2574681286&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=797"}},{"name":"Button","value":"第一个","attr":{"color":"primary","size":"middle","value":"第一个"}}]},{"name":"Input","attr":{"size":"large","value":"第一个"}},{"name":"Image","attr":{"width":100,"height":100,"src":"https://img2.baidu.com/it/u=1685092271,2574681286&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=797"}}]'


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
