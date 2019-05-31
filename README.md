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
* GET / - confirms endpoint works
# /create/
* GET / - gets all the surveys in the db
* POST / - body:{"title":"title of survey"} ; inserts a new survey into the db ; returns success message with id of survey
* GET /:id - returns the id, title, created_at, and updated_at values of the survey with that id; also returns all questions for that survey
* PUT /:id - body:{"title":"new title"}; returns id, new_title, updated_at, and old_title
* DELETE /:id - deletes survey and returns how many questions were deleted with that survey
* POST /:id - id of survey to add question to ; body:{"question":"survey question"} ; inserts question for a survey into the db ; returns success message with id of question
* GET /question/:id - returns id, survey_id, question, and created_at of the question with that id
* PUT /question/:id - body:{"question":"updated question"}; returns id, new_question, and old_question
* DELETE /question/:id - deletes question with that id; returns id of deleted question
# /answer/
* GET / - returns sessions created
* POST /:id - creates a session for the survey with that id, session would hold a set of answers; return id of newly created session
* GET /:id - returns id, survey_id, created_at, and updated_at for the session with that id; also returns answers for that session
* PUT /:id - updates the session so that it has a new updated_at value
* DELETE /:id - deletes session with that id and accompanying answers; returns id and amt_questions_deleted
* POST /:survey_id/:session_id/:question_id - body:{"answer":"answer to survey question"}; returns survey_id, session_id, question_id, and id
* GET /:survey_id/:session_id/:question_id - returns object with id, session_id, question_id, answer, and created_at
* PUT /:survey_id/:session_id/:question_id - body:{"answer":"updated answer"}; returns survey_id, session_id, question_id, changes; changes is an object that holds the new answer
* DELETE /:survey_id/:session_id/:question_id - deletes the answer and updates updated_at field for session entry

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
