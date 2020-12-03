
from flask import jsonify
from flask import render_template
from flask import request
from flask import Flask
from flask_util_js import FlaskUtilJs
from flask_cors import CORS
from RestaurantIconScraperHeadless import startIconScrape

app=Flask(__name__)
CORS(app)

@app.route('/')
def default(): return jsonify("default")

@app.route('/icon_scrape', methods=['POST'])
def add():
    a = request.form['search_key']
    b = request.form['save_name']
    #return jsonify(startIconScrape(a, b))
    print("This is search_key: ", a, ". This is save_name: ", b)
    return jsonify({'status': 200,'search_key':a, 'save_name':b})

if __name__=='__main__':
  app.run()