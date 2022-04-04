
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


def getModel():
	#Load the VGG model
	return VGG16(weights='imagenet', include_top=True)	

def getFeatureExtractor():
	model = getModel()
	feat_extractor = Model(inputs=model.input, outputs=model.get_layer("fc2").output)
	return feat_extractor

def loadImage(path, target_size):
    img = image.load_img(path, target_size=target_size)        
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    return img, x

def getFeature(inp):
    image_path = inp[0]
    feat_extractor = inp[1]
    target_size = inp[2]
    try:
        img, x = loadImage(image_path, target_size);
        feat = feat_extractor.predict(x)[0]

        return feat
    except Exception as e:
        print (inp, e)
        return []