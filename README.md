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
npm install
cd client_app
bower install (make sure to always select the packages required by your-priorities-app)

cp server_api/config/config.json.dist server_api/config/config.json
vi server_api/config/config.json # Add information about an empty postgres database

./start

Go to localhost:4242 in your browser
```

Create an user and give it admin privileges by running the following command in the root of the app
```bash
node server_api/scripts/setAdminOnAll.js your@email.com
```

To build a client_dist production folder with vulcanized web components
```bash
npm install polymer-cli
cd client_app
./createDist
```

For production mode you need to supply the URL to the database as an ENV variable
```bash
postgres://username:password@dbhost:dbport/dbname
```


## For S3 Image Upload
```
# To run with image upload to S3 enabled
AWS_ACCESS_KEY_ID=XXX AWS_SECRET_ACCESS_KEY=XXX S3_BUCKET=my-test ./start
```

## Your Priorities uses Active Citizen
```
Active Citizen is an open source library, API and UI for activity streams and notifications 
using machine learning to recommend content to users.
```
[https://github.com/rbjarnason/active-citizen](https://github.com/rbjarnason/active-citizen)


## Your Priorities user help
```
Here are basic user instructions.
```
[User Instructions](https://docs.google.com/document/d/1OVCkpcOa4GcUmw6iDPqckMzWIaGi5Wso6UGacrIfFpw)


## Active Citizen PredictionIO recommendations (optional)
```
Install PredictionIO

Install Universal Recommendation

Import your data with the Active Citizen events_importer script (if you already have some data)

train the template
deploy the template
```
[https://prediction.io/](https://prediction.io/) and [https://github.com/actionml/universal-recommender](https://github.com/actionml/universal-recommender)

```
Here is a Dockerfile that can either be used to build a Docker container with PredictionIO 
and Universal Recommendation or as a recipe for building your own non-Docker Ubuntu/Debian 
based predictionIO VM on any cloud or locally.
```
[https://github.com/rbjarnason/docker-predictionio/blob/master/Dockerfile](https://github.com/rbjarnason/docker-predictionio/blob/master/Dockerfile)


## Active Citizen Tensorflow Classifications (experimental)
```
Install TensorFlow

The python classifier scripts are in active-citizen/engine/classifications

The export files for Your Priorities content are in active-citizen/exporters

Currently you need to use the exporters to generate datasets for the TensorFlow python scripts

Example dataset from our Better Reykjavik citizen particiaption website is provided in
active-citizen/exporters/datasets/better_reyjkavik

```

## Translation help
```
If you want to help us translate the app to your language please use Trensifex for online 
translation for the app. It's easy to use and free for open source projects. See instructions 
in the link below.
```
[Transifex translation help](https://docs.google.com/document/d/1ASb4XKjncZHHf0TBo-w4vK6u5fhE3lE3tszrlFEl95k)


## Developed by the non-profit Citizens Foundation Iceland
```
Our mission is to bring people together to debate and prioritize innovative ideas 
to improve their communities.
```
[http://www.citizens.is/](http://www.citizens.is/)

## Other live servers
https://betrireykjavik.is/

https://betraisland.is/

## The Team
- Robert Bjarnason
- Guðný Maren Valsdóttir
- Gunnar Grímsson
- Nathalie Stembert
- Alexander Máni Gautason
