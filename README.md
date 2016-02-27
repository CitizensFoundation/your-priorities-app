# Your Priorities Version 6

## Live demo
https://beta.yrpri.org/

## To run

```
# In app root folder
npm install & bower install

cp server_api/config/config.json.dist server_api/config/config.json
vi server_api/config/config.json # Add information about an empty postgres database

./start

# To run with image upload to S3 enabled
AWS_ACCESS_KEY_ID=XXX AWS_SECRET_ACCESS_KEY=XXX S3_BUCKET=my-test ./start

Go to localhost:4242 in your browser
```
