from flask import Flask
app=Flask(__name__)

@app.route('/_generate_icon_image')
@app.route('/')
def hello():
  return "Hello World!"

if __name__=='__main__':
  app.run()