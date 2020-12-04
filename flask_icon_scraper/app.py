
from flask import jsonify
from flask import render_template
from flask import request
from flask import Flask
from flask_util_js import FlaskUtilJs
from flask_cors import CORS
from selenium import webdriver 
from selenium.webdriver.common.keys import Keys  
from selenium.webdriver.chrome.options import Options 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from RestaurantIconScraperHeadless import startIconScrape, initWebDriver

app=Flask(__name__)
CORS(app)

#can set up headless chrome driver globablly
'''DRIVER_PATH = './chromedriverv86'
options = Options()  
options.add_argument("--headless")
wDriver = webdriver.Chrome(executable_path=DRIVER_PATH, chrome_options=options)'''

@app.route('/')
def default(): return jsonify("default")

@app.route('/icon_scrape', methods=['POST'])
def add():
    #acquire data from ajax request
    search_key = request.form['search_key']
    save_name = request.form['save_name']

    #global wDriver
    scrapeSuccess = -1

    #Uncomnet line below left to run IconScrape, stores in scrapeImagesTest Folder
    #scrapeSuccess = startIconScrape(search_key,save_name)

    #print("This is search_key: ", search_key, ". This is save_name: ", save_name)
    return jsonify({'status': 200,'search_key':search_key, 'save_name':save_name, 'returnScrape':scrapeSuccess})



if __name__=='__main__':
  app.run()