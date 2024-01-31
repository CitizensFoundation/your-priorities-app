# Your Priorities Version 9

![alt text](https://citizens.is/wp-content/uploads/2018/08/Capture-2.png "Your Priorities screenshot")

## The Top Rated Citizen Engagement Platform
- Rated #1 on PeoplePowered: [Platform ratings](https://www.peoplepowered.org/platform-ratings)
- Top ranking in the [2022 Digital Democracy Report](https://www.solonian-institute.com/digitaldemocracyreport)
- Top listing in [OECD Guidelines for Citizen Participation Processes](https://www.oecd.org/publications/oecd-guidelines-for-citizen-participation-processes-f765caf6-en.htm)


## Key Features

* Citizen participation social network for digital democracy and social innovation
* Communities and groups for simple organization of any type of participation project
* Crowdsource ideas about any subject
* Effective debating system that is highly resistant to trolling and personal arguments
* Users can submit ideas and debate points as text, audio or video
* Users can prioritize ideas and debate points by voting them up or down
* Configurable and powerful surveys for ideas and user registration
* Custom emoji ratings where admins can configure groups to allow up to 4 different custom emoji ratings per group instead of the voting up and down
* Plausible Analytics is built in with useful promotion features
* AI driven recommendation engine that recommends relevant posts to users
* Highly scalable audio and video processing engine (using Amazon Elastic Transcoder and S3 or the Your Priorities Encoder)
* Automatic Speech to Text conversion in 28 languages (using Google's TextToSpeech API)
* Machine translations between 28 languages (using Google Translate API)
* Simple moderation of all content for community and groups in one place
* Assigns an automated toxicity score for all incoming content. Uses the open source Perspective API, developed by the New York Times, The Economist, Guardian, Google & others.
* Users can view and moderate their own submitted content in one place
* Full GDPR compliance
* Localized in 28 languages
* Advanced anti-Fraud system for detection malicious actors and quickly deleting unwanted content
* Bad BOT management system for managing badly behaving crawlers, includes rate control
* Post status system where posts can be set to open open, in progress, approved or rejected
* Admins can easily and automatically email post status update all the people who supported or opposed posts
* Optional categories system for posts with simple filters
* Smart notifications in browser and email
* Newsfeeds for communities, groups and posts with activity lists where users can also share links and comment
* Ideas and debate points can be easily shared on social media
* Participation groups can be configured for many different types of participation projects
* Authentication is configurable offering eID, Facebook, email and/or anonymous login
* The client app is a progressive web app that can be very easily installed as a native app on mobile phones while also being a website
* Built with Web Components making the app fast on inexpensive mobile phones
* Open source, non profit and built with passion over 16 years
* AI generated images support (Dalle3) for admins and users (if admins allow it)
* Land Use Game module
* GPT4 based AI assistant that offers a hybrid UI for exploring communities and groups
* Supported by mass amounts of volunteer work, the EU, city of Reykjavik, World Bank, city of Kopavogur, Scottish Government and the Norwegian Consumer Authority

## Getting Started Cloud Tutorial

https://citizens.is/getting-started/

Get started with Your Priorities on our cloud platform.

## Deployment with Docker Compose

[Docker deployment guide](https://docs.google.com/document/d/1t9oZRIIOqmxtAszeWLGRb0_ixsmSLdXvwGeej2EA5R8/)

[Docker admin guide](https://docs.google.com/document/d/1lG0FwKbsy5J2RMio08Q-viR7xG0YYGVmY2zqmENcNtM/)

## Examples of live servers running Your Priorities

* https://yrpri.org/
* https://betraisland.is/
* https://betrireykjavik.is/
* https://www.junges.wien/
* https://engage.parliament.scot/

## How to run

```
# Git clone with the Active Citizen submodule library
git clone https://github.com/rbjarnason/your-priorities-app.git
cd your-priorities-app
git submodule init
git submodule update

# In web app root folder
yarn install
cd client_app
bower install

cp server_api/config/config.json.dist server_api/config/config.json
vi server_api/config/config.json # Add information about an empty postgres database

./start

Go to localhost:4242 in your browser
```

Create an user and give it admin privileges by running the following command in the root of the app
```bash
node server_api/scripts/setAdminOnAll.js your@email.com
```

You need to set the ENV var REDIS_URL to point to your local redis installation with 
URL format like redis://user:pwd@hostname:port

Bunyan is used for logging into JSON, which is great for feeding for 
example into Elastic Search for analytic - https://github.com/trentm/node-bunyan 
The log is piped to STDOUT so you need to pipe it into a file > /var/log/yrpri.log

To build a client_app/build production folder with web components
```bash
npm install polymer-cli
cd client_app
./createDist
```

If you are moving from version 6 to version 7 make sure to clear out the bower_components folder before running bower install
```bash
rm -r client_app/bower_components
```

For production mode you need to supply the URL to the database as an ENV variable
```bash
postgres://username:password@dbhost:dbport/dbname
```

For production please define SESSION_SECRET=somethingrandomandlong

Google Analytics can be disabled through DISABLE_GA=1

## Email Support

For SMTP support define SMTP_SERVER, SMTP_USERNAME, SMTP_PASSWORD and SMTP_PORT.
We assume security through STARTTLS negotiation.

When using Heroku SENDGRID_USERNAME, and SENDGRID_PASSWORD need to be defined.

## Running behind another web server

If you are running behind a web server like nginx and want to disable production 
to force https, you can define an ENV variable as DISABLE_FORCE_HTTPS=1

Also if you are running behind nginx you want to add the following to your config:
proxy_set_header   X-Forwarded-Proto  https;

## For S3 Image Upload

If you use Amazon AWS S3:
```
# To run with image upload to S3 enabled
AWS_ACCESS_KEY_ID=XXX AWS_SECRET_ACCESS_KEY=XXX S3_BUCKET=my-test S3_REGION=eu-central-1 ./start
```

If you use an alternative to Amazon AWS S3:
```
# To run with image upload to a S3 alternative enabled
AWS_ACCESS_KEY_ID=XXX AWS_SECRET_ACCESS_KEY=XXX S3_BUCKET=my-test S3_ENDPOINT=my.s3.website.com ./start
```

You will need to have the ImageMagick package installed otherwise you might get errors like: "Command failed: identify"

## Your Priorities uses Active Citizen
```
Active Citizen is an open source library, API and UI for activity streams and notifications 
using machine learning to recommend content to users.
```
[https://github.com/rbjarnason/active-citizen](https://github.com/rbjarnason/active-citizen)

## Running the Active Citizen background workers

The background workers community via the main Redis connection of the app. To start run the following command with all environmental variables needed
```
node server_api/active-citizen/workers/main.js
```

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

## Environmental variables used for a full production environment with all features

All those configuration variables are optional but some depend on each other.
```
AC_ANALYTICS_BASE_URL              
AC_ANALYTICS_CLUSTER_ID            
AC_ANALYTICS_KEY                  
ADEPT_SCALE_LICENSE_KE          
ADEPT_SCALE_URL                    
AIRBRAKE_API_KEY                    
AIRBRAKE_PROJECT_ID                
AWS_ACCESS_KEY_ID                  
AWS_SECRET_ACCESS_KEY                
AWS_TRANSCODER_AUDIO_PIPELINE_ID  
AWS_TRANSCODER_AUDIO_PRESET_ID    
AWS_TRANSCODER_FLAC_PRESET_ID      
AWS_TRANSCODER_PIPELINE_ID          
AWS_TRANSCODER_PORTRAIT_PRESET_ID  
AWS_TRANSCODER_PRESET_ID          
DATABASE_URL                      
EMBEDLY_KEY                        
GOOGLE_APPLICATION_CREDENTIALS_JSON
GOOGLE_PERSPECTIVE_API_KEY          
GOOGLE_TRANSCODING_FLAC_BUCKET      
HEROKU_POSTGRESQL_URL      
NEW_RELIC_APP_NAME                work
NEW_RELIC_LICENSE_KEY              
NEW_RELIC_LOG                      
NEW_RELIC_NO_CONFIG_FILE            
PIOAccessKey                        
PIOEngineUrl                     
PIOEventUrl                      
REDIS_URL                          
S3_ACCELERATED_ENDPOINT            
S3_AUDIO_PUBLIC_BUCKET              
S3_AUDIO_UPLOAD_BUCKET            
S3_BUCKET                          
S3_REPORTS_BUCKET                  
S3_VIDEO_PUBLIC_BUCKET            
S3_VIDEO_THUMBNAIL_BUCKET          
S3_VIDEO_UPLOAD_BUCKET          
SENDGRID_PASSWORD                  
SENDGRID_USERNAME                 
```


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

## The Team
Your Priorities - Citizens participation application

Developed in 2008-2024 by
Robert Bjarnason, robert@citizens.is
Gunnar Grimsson, gunnar@citizens.is
Gudny Maren Valsdottir 
Alexander Mani Gautason
Joshua Lanthier-Welch
Katherine Breadlove
Nathalie Stembert
and many others...
 

## With help from

Browser testing enabled by BrowserStack

[<img src="https://s3.amazonaws.com/yrpri-direct-asset/bsLogo.svg" width="200">](https://www.browserstack.com/)

