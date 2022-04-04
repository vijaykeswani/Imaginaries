
import numpy as np
import os, sys, glob, re
from scipy.spatial import distance

from tqdm import tqdm
from IPython.display import Markdown, display
from matplotlib.pyplot import figure
from keras.preprocessing import image
from keras.applications.vgg16 import VGG16
from keras.applications.vgg16 import preprocess_input
from keras.models import Model

import random
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from matplotlib.pyplot import figure

from faceCrop import *
from skimage import io
import sys
from utils import *


feat_extractor = getFeatureExtractor()
model = getModel()
target_size=model.input_shape[1:3]

def getScore(query, userId):



    # Normalize \hat{d}(S) values
    def calibrate(ys, lower, upper):
        return (ys - lower) / (upper - lower)




    path = "static/All_control_sets/Control_" + userId + "/"

    # global controlGender
    # global controlImages

    print (path)
    controlGender, controlImages = {}, {}
    if os.path.isdir(path) and os.path.exists(path+'control_features_1.npy'):
        control_features_1 = np.load(path+'control_features_1.npy', allow_pickle=True)[()]
    else:
        control_features_1 = np.load('static/All_control_sets/Control_Gender/control_features_1.npy', allow_pickle=True)[()]

    for p, feat in control_features_1.items():
        controlGender[p+"_1"] = "f"
        controlImages[p+"_1"] = list(feat)           


    if os.path.isdir(path) and os.path.exists(path+'control_features_2.npy'):
        control_features_2 = np.load(path+'control_features_2.npy', allow_pickle=True)[()]                
    else:
        control_features_2 = np.load('static/All_control_sets/Control_Gender/control_features_2.npy', allow_pickle=True)[()]

    for p, feat in control_features_2.items():
        controlGender[p+"_2"] = "m"
        controlImages[p+"_2"] = list(feat)            

    # else:
    #     controlGender = np.load('static/All_control_sets/Control_Gender/controlGender.npy', allow_pickle=True)[()]
    #     controlImages = np.load('static/All_control_sets/Control_Gender/controlImages.npy', allow_pickle=True)[()]




    def sim(img1, img2):
        return 2 - distance.cosine(imageToFeatures[img1], imageToFeatures[img2])

    def simControl(img1, img2):
        return 2 - distance.cosine(controlImages[img1], controlImages[img2])

    def simCross(img1, img2):
        return 2 - distance.cosine(imageToFeatures[img1], controlImages[img2])


    def condition(g):
        return g=="f"

    def getBounds(control, condition):
        validation_m, validation_f = [], []
        for p in control:
            g = controlGender[p]
            if condition(g):
                validation_f = validation_f + [p]
            else:
                validation_m = validation_m + [p]

        
        simMatrix = np.array([np.array([simControl(img1, img2) for img1 in validation_m if img1 != img2]) for img2 in control])
        simSum = [np.mean(simMatrix[i]) for i in range(len(simMatrix))]
        fs = np.mean([simSum[i] for i in range(len(simSum)) if condition(controlGender[control[i]])])
        ms = np.mean([simSum[i] for i in range(len(simSum)) if not condition(controlGender[control[i]])])
        lowerFS, upperMS = fs, ms
        lowerR = fs/(fs+ms)
        lowerD1 = min(fs/ms, ms/fs)

        simMatrix = np.array([np.array([simControl(img1, img2) for img1 in validation_f if img1 != img2]) for img2 in control])
        simSum = [np.mean(simMatrix[i]) for i in range(len(simMatrix))]
        fs = np.mean([simSum[i] for i in range(len(simSum)) if condition(controlGender[control[i]])])
        ms = np.mean([simSum[i] for i in range(len(simSum)) if not condition(controlGender[control[i]])])
        upperFS, lowerMS = fs, ms
        upperR = fs/(fs+ms)
        lowerD2 = min(fs/ms, ms/fs)
        
        return lowerFS, lowerMS, upperFS, upperMS



    lowerFS, lowerMS, upperFS, upperMS = getBounds(list(controlImages.keys()), condition)
    print (lowerFS, lowerMS, upperFS, upperMS)
    print (controlGender)



    FACES_LOC = "static/google_images_faces_" + query + "/"
    DATASET_PATH = "static/google_images_" + query + "/"

    if os.path.isdir(FACES_LOC):
        [os.remove(FACES_LOC+file) for file in os.listdir(FACES_LOC)]        
    else:
        os.makedirs(FACES_LOC)

    for path in tqdm(os.listdir(DATASET_PATH)):
        try:
            img = io.imread(DATASET_PATH+path)
            faces = detect_faces(img)
            if len(faces) != 0:
                img = Image.fromarray(img).crop(faces[0])
                img.save(FACES_LOC+path)
        except:
            continue
        


    DATASET_PATH = FACES_LOC
    global imageToFeatures

    imageToFeatures = {}
    for path in tqdm(os.listdir(DATASET_PATH)):
        feat = getFeature([DATASET_PATH+path, feat_extractor, target_size])
    #     print (path, list(feat))
        if len(feat) == 0:
            continue
        imageToFeatures[path] = list(feat)


    # print (len(imageToFeatures))
    control = list(controlImages.keys())
    dataset = imageToFeatures.keys()


    simMatrix = np.array([[simCross(img1, img2) for img1 in dataset] for img2 in control])
    simSum = np.mean(simMatrix, axis=1)

    # idx = condition(np.array(controlGender.values()))
    # fs = np.mean(simSum[idx])
    # ms = np.mean(simSum[~idx])    



    checks = [10, 25, 50, 100]
    results = {}

    # for n in checks:




    fs = np.mean([simSum[i] for i in range(len(simSum)) if condition(controlGender[control[i]])])
    ms = np.mean([simSum[i] for i in range(len(simSum)) if not condition(controlGender[control[i]])])
    print ("Uncalibrated score", fs-ms, fs, ms)

    fs = calibrate(fs, lowerFS, upperFS)
    ms = calibrate(ms, lowerMS, upperMS)
    print ("Computed score", fs-ms, fs, ms)
    return fs-ms

