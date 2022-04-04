import os, urllib.request, json # json for pretty output
from serpapi import GoogleSearch
import sys
import glob



def get_google_images(query):
    params = {
      "api_key": "d223577248c5bfd8df7319f6e2fe0b9674fb67fff6bea8a1474baf5006b02c83",
      "engine": "google",
      "q": query,
      "tbm": "isch"
    }


    LOC = "static/google_images_" + query
    if os.path.isdir(LOC):
        files = glob.glob(LOC+'/*')

        for f in files:
            print (f)
            os.remove(f)
    else:
        os.makedirs(LOC)


    search = GoogleSearch(params)
    results = search.get_dict()

    # print(json.dumps(results['suggested_searches'], indent=2, ensure_ascii=False))
    # print(json.dumps(results['images_results'], indent=2, ensure_ascii=False))

    # -----------------------
    # Downloading images

    # 
    opener=urllib.request.build_opener()
    opener.addheaders=[('User-Agent','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582')]
    urllib.request.install_opener(opener)
    for index, image in enumerate(results['images_results'][:50]):
        try:
            # print(f'Downloading {index} image...')
            
            # urllib.request.urlretrieve(image['original'], f'{LOC}/original_size_img_{index}.jpg')
            request = urllib.request.urlopen(image['original'], timeout=10)
            with open(f'{LOC}/original_size_img_{index}.jpg', 'wb') as f:
                f.write(request.read())
        except:
            print("error downloading image", index)

# if name == "__main__":
# get_google_images(sys.argv[1])

# 