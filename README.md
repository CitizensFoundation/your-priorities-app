# Your Priorities Version 6

## Live server
https://yrpri.org/

## To run

```
# Git clone with the Active Citizen submodule library
git clone https://github.com/rbjarnason/your-priorities-app.git
cd your-priorities-app
git submodule init
git submodule update

# In app root folder
npm install & bower install

cp server_api/config/config.json.dist server_api/config/config.json
vi server_api/config/config.json # Add information about an empty postgres database

./start

Go to localhost:4242 in your browser
```


## For S3 Image Upload
```
# To run with image upload to S3 enabled
AWS_ACCESS_KEY_ID=XXX AWS_SECRET_ACCESS_KEY=XXX S3_BUCKET=my-test ./start
```

## Active Citizen PredictionIO recommendations (optional)
```
Install PredictionIO

Install Universal Recommendation

Import your data with the Active Citizen events_importer script (if you already have some data)

train the template
deploy the template
```
[https://prediction.io/](https://prediction.io/)
[https://templates.prediction.io/PredictionIO/template-scala-parallel-universal-recommendation](https://templates.prediction.io/PredictionIO/template-scala-parallel-universal-recommendation)

## About Active Citizen
```
Open source library, API and UI for activity streams and notifications 
using machine learning to recommend content to users.
```
[https://github.com/rbjarnason/active-citizen](https://github.com/rbjarnason/active-citizen)

## Developed by the non-profit Citizens Foundation Iceland
```
Our mission is to bring people together to debate and prioritize innovative ideas 
to improve their communities. We believe that without participation 
there is no democracy.
```
[http://www.citizens.is/](http://www.citizens.is/)

## The Team
- Robert Bjarnason
- Gunnar Grimsson
- Nathalie Stembert
- Maren Valsdottir
- Alexander Máni Gautason
