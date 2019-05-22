## Instructions on how to run
* cd backend/
* yarn
* yarn start 

npm
* cd backend/
* npm install
* npm start

## Endpoints
All bodies should be in JSON

# /api/
* all endpoints begin with /api/
* GET / - gets all the surveys in the db without the timestamp
# /create/
* GET / - responds with status 200 and json object to confirm create endpoint is working
* POST / - body:{"title":"title of survey"} ; inserts a new survey into the db ; returns success message with id of survey
* POST /:id = id:id of survey to add question to ; body:{"question":"survey question"} ; inserts question for a survey into the db ; returns success message with id of question

# Take-home exercise for backend interviews at Eaze

Build the API to allow for the anonymous creation/taking of surveys (i.e. you don't have to create a user account to create a survey).

Ideally you will use either NodeJS, or .NET Core. These are the two primary platforms that we use at Eaze. You may use another language/platform (e.g., Python, Java, Ruby) if you so choose, but please be aware it will take us significantly longer in that case to get back to you with feedback.

## General

* Please include a README with instructions on how to run it. 
* Use whatever libraries you like. 
* Finally, have fun!

## Specifications:

API Should Support:
* Creating a survey
* Taking a Survey
* Getting Results of a Survey
* A survey should consist of survey questions and each question should have yes/no (true/false) answers

Note: no frontend is needed and any submitted will not be part of review.

## Data Persistence

* You will need to persist the data in some way. 
* You DO NOT need to use any external data persistance (database,cache etc), and the easier for us to run it the better :).  
* But think about how you would want to do it in production and write up (one paragraph) how you would do it. 
