from flask import Flask, render_template, request, redirect, url_for
import shutil
import glob
import os
from getImages import *
from audit import *
from flask_cors import CORS, cross_origin
import time

from keras.preprocessing import image
from keras.applications.vgg16 import VGG16
from keras.applications.vgg16 import preprocess_input
from keras.models import Model

from faceCrop import *
from skimage import io
import cv2
import threading
import re

from utils import *

feat_extractor = getFeatureExtractor()
model = getModel()
target_size=model.input_shape[1:3]

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["TEMPLATES_AUTO_RELOAD"] = True


def getStoredScores():
  return np.load('userQueryScores.npy', allow_pickle=True)[()]

def storeScores(key, value):
    userQueryScores = {}
    userQueryScores = np.load('userQueryScores.npy', allow_pickle=True)[()]
    userQueryScores[key] = value
    np.save('userQueryScores.npy', userQueryScores)

def getControlName(userId):
  controlNames = np.load('controlNames.npy', allow_pickle=True)[()]
  if userId in controlNames.keys():
    return controlNames[userId]
  else:
    return "gender"

def processQueryInBackground(query, userId):
  # query = re.escape(query)
  # print (q)

  try:
    DATASET_PATH = "static/google_images_" + query + "/"
    if not os.path.isdir(DATASET_PATH):
      get_google_images(query)

    score = getScore(query, userId)  
    score = np.round(score,2)
    score = max(min(score, 1), -1)

    # score = -0.75
    controlName = getControlName(userId)
    print (controlName)
    storeScores((userId, query, controlName), str(score))

    return str(score)
  except:
    controlName = getControlName(userId)    
    userQueryScores = np.load('userQueryScores.npy', allow_pickle=True)[()]
    userQueryScores.pop((userId, query, controlName), None)
    np.save('userQueryScores.npy', userQueryScores)    

    return "error"


@app.route('/repcheck.py/<query>/<userId>')
@cross_origin()
def processQuery(query, userId):

  userQueryScores = getStoredScores()
  controlName = getControlName(userId)  

  if (userId, query, controlName) in userQueryScores.keys():
    score = userQueryScores[(userId, query, controlName)]
  else:
    score = "loading"
    storeScores((userId, query, controlName), score)

    process_thread = threading.Thread(target=processQueryInBackground, name="ProcessImages", args=(query, userId))
    process_thread.start()    

  print (query, userId, controlName, score)
  return score


@app.route('/control_set')
def webprint():
    return render_template('control_set.html') 

@app.route('/about')
def about():
    return render_template('about.html') 
	
@app.route('/uploader_1/<userId>', methods = ['GET', 'POST'])
def upload_file_1(userId):
    if request.method == 'POST':

      folder = "static/All_control_sets/Control_"+userId;
      if not os.path.exists(folder):
        os.makedirs(folder)

      folder = "static/All_control_sets/Control_"+userId+"/Group_1/";
      if not os.path.exists(folder):
        os.makedirs(folder)
      else:
        for f in os.listdir(folder):
          os.remove(folder+f)


      files = request.files.getlist("file")
      for i, file in enumerate(files):
          extension = os.path.splitext(file.filename)[1]
          name = str(i+1)+extension
          file.save(folder+name)

      control_features_1 = {}

      for path in (os.listdir(folder)):
            img = cv2.imread(folder+path, flags = cv2.IMREAD_COLOR)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            # os.remove(folder+path)
            faces = detect_faces(img)
            if len(faces) != 0:
                img = Image.fromarray(img).crop(faces[0])
                img.save(folder+path)

            feat = getFeature([folder+path, feat_extractor, target_size])
            control_features_1[folder+path] = list(feat)

      np.save("static/All_control_sets/Control_"+userId+ "/control_features_1.npy", control_features_1)
      print (userId, "new group 1 images uploaded")

      userQueryScores = np.load('userQueryScores.npy', allow_pickle=True)[()]
      userQueryScores_new = {}
      for (u, q, n) in userQueryScores.keys():
        if u == userId:
          continue
        userQueryScores_new[(u,q,n)] = userQueryScores[(u,q, n)]
      np.save('userQueryScores.npy', userQueryScores_new)    

    return redirect('/control_set')


@app.route('/uploader_2/<userId>', methods = ['GET', 'POST'])
def upload_file_2(userId):
    if request.method == 'POST':

      folder = "static/All_control_sets/Control_"+userId;
      if not os.path.exists(folder):
        os.makedirs(folder)

      folder = "static/All_control_sets/Control_"+userId+"/Group_2/";
      if not os.path.exists(folder):
        os.makedirs(folder)
      else:
        for f in os.listdir(folder):
          os.remove(folder+f)

      files = request.files.getlist("file")
      for i, file in enumerate(files):
          extension = os.path.splitext(file.filename)[1]
          name = str(i+1)+extension
          file.save(folder+name)

      control_features_2 = {}          
          
      for path in (os.listdir(folder)):
            img = cv2.imread(folder+path, flags = cv2.IMREAD_COLOR)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
            # os.remove(folder+path)
            faces = detect_faces(img)
            if len(faces) != 0:
                img = Image.fromarray(img).crop(faces[0])
                img.save(folder+path)

            feat = getFeature([folder+path, feat_extractor, target_size])
            control_features_2[folder+path] = list(feat)

      np.save("static/All_control_sets/Control_"+userId+ "/control_features_2.npy", control_features_2)
      print (userId, "new group 2 images uploaded")

      userQueryScores = np.load('userQueryScores.npy', allow_pickle=True)[()]
      userQueryScores_new = {}
      for (u, q, n) in userQueryScores.keys():
        if u == userId:
          continue
        userQueryScores_new[(u,q,n)] = userQueryScores[(u,q, n)]
      np.save('userQueryScores.npy', userQueryScores_new)    
    
    return redirect('/control_set')


@app.route('/control_set_images_1/<userId>')
def get_images_1(userId):
    path = 'static/All_control_sets/Control_' + userId + '/Group_1/'
    res = ""

    if not os.path.isdir(path):
      path = 'static/All_control_sets/Control_Gender/Group_1/'      

    forms = [".jpg",".png",".jpeg"]

    for file in os.listdir(path):
      if not file.endswith(tuple(forms)):
        continue

      link = path+file
      res += '<div class="grid-item"> <img src=' + link + ' width=50 /></div>'
    return res

@app.route('/control_set_images_2/<userId>')
def get_images_2(userId):
    path = 'static/All_control_sets/Control_' + userId + '/Group_2/'
    res = ""

    if not os.path.isdir(path):
      path = 'static/All_control_sets/Control_Gender/Group_2/'      


    forms = [".jpg",".png",".jpeg"]
    for file in os.listdir(path):
      if not file.endswith(tuple(forms)):
        continue

      link = path+file
      res += '<div class="grid-item"> <img src=' + link + ' width=50 /></div>'
    return res

@app.route('/revert_default_gender/<userId>')
def revert_default_gender(userId):
    path_user_1 = 'static/All_control_sets/Control_' + userId + '/Group_1/'
    path_default_1 = 'static/All_control_sets/Control_Gender/Group_1/'  

    path_user_2 = 'static/All_control_sets/Control_' + userId + '/Group_2/'
    path_default_2 = 'static/All_control_sets/Control_Gender/Group_2/'  

    if not os.path.isdir(path_user_1) or not os.path.isdir(path_user_2):
      return ""


    files = glob.glob(path_user_1+"*")
    for f in files:
        os.remove(f)    
    files = glob.glob(path_user_2+"*")
    for f in files:
        os.remove(f)    

    src_files = os.listdir(path_default_1)
    for file_name in src_files:
        shutil.copy(path_default_1 + file_name, path_user_1)    

    src_files = os.listdir(path_default_2)
    for file_name in src_files:
        shutil.copy(path_default_2 + file_name, path_user_2)    

    return ""

@app.route('/queryScores')
def queryScores():
    return render_template('queryScores.html') 

@app.route('/getAllQueryScores')
def getAllQueryScores():
    scores = getStoredScores()
    res = " <tr><th>User ID</th><th>Query</th><th>Attribute Name</th><th>Representation Score</th></tr>"
    for key, score in scores.items():
      userId = "Admin" if key[0] == "none" else key[0]
      res += "<tr>"
      res += "<td>" + userId + "</td>"
      res += "<td>" + key[1] + "</td>"
      res += "<td>" + getControlName(userId) + "</td>"            
      res += "<td>" + str(score) + "</td>"            
      res += "</tr>"

    return res




if __name__ == "__main__":
    app.run()
