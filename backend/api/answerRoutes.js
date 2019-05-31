const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

const SUCCESS = "success";
const USER_ERROR = 'user_error';

router.get('/', (req, res) => {
    res.status(200).json({SUCCESS:"endpoint works"});
});

// CREATE a session
router.post('/:id', (req, res) => {
    const {id} = req.params;
    const session = req.body;
    session.survey_id = id;
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    session.created_at = dateTime;
    session.updated_at = dateTime;
    db('surveys_table')
        .where({id: id})
        .then(array => {
            if(array.length === 1){
                db('sessions_table')
                    .insert(session)
                    .then(sessionId => {
                        res.status(200).json({SUCCESS:"session created","id":sessionId[0]});
                    })
                    .catch(err => res.status(500).json({"user_error":err.message}));
            }else{
                res.status(400).json({"user_error":"did not find survey with that id","id":id});
            }
        })
        .catch(err => res.status(500).json({"server_error":err.message}));
});

// READ a session
router.get('/:id', (req, res) => {
    const {id} = req.params;
    db('sessions_table')
        .where({id: id})
        .then(session => {
            if(session.length === 1){
                res.status(200).json({
                    SUCCESS: "found session",
                    "id": session[0].id,
                    "survey_id": session[0].survey_id,
                    "created_at": session[0].created_at,
                    "updated_at": session[0].updated_at
                });
            }else{
                res.status(400).json({USER_ERROR:"could not find a session with that id", "id":id});
            }
        })
        .catch(err => res.status(500).json(err.message));
});

// UPDATE a session
router.put('/:id', (req, res) => {
    const {id} = req.params;
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    db('sessions_table')
        .where({id: id})
        .update({updated_at: dateTime})
        .then(count => {
            if(count === 1){
                res.status(200).json({SUCCESS: "updated session"});
            }else{
                res.status(400).json({USER_ERROR:"could not update session with that id", "id":id, "count":count});
            }
        })
        .catch(err => res.status(200).json(err.message));
});

// DELETE a session
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    db('sessions_table')
        .where({id: id})
        .del()
        .then(count => {
            if(count === 1){
                res.status(200).json({SUCCESS: "deleted session", "id":id});
            }else{
                res.status(400).json({USER_ERROR: "could not find session with that id", "id":id});
            }
        })
        .catch(err => res.status(500).json(err.message));
});

// CREATE an answer to a question
router.post('/:survey_id/:session_id/:question_id', (req, res) => {
    const {survey_id, session_id, question_id} = req.params;
    const answer = req.body;
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    db('surveys_table')
        .where({id: survey_id})
        .then(survey => {
            if(survey.length === 1){
                db('sessions_table')
                    .where({id: session_id})
                    .then(session => {
                        if(session.length === 1){
                            answer.session_id = session[0].id;
                            db('questions_table')
                                .where({id: question_id})
                                .then(question => {
                                    answer.question_id = question[0].id;
                                    db('sessions_table')
                                        .where({id: session_id})
                                        .update({updated_at: dateTime})
                                        .then(count => {
                                            db('answers_table')
                                                .insert(answer)
                                                .then(id => {
                                                    res.status(200).json({
                                                        SUCCESS: "created an answer",
                                                        "survey_id": survey[0].id,
                                                        "session_id": session[0].id,
                                                        "question_id": question[0].id,
                                                        "id":id[0]});
                                                })
                                                .catch(err => res.status(500).json(err.message));
                                        })
                                        .catch(err => res.status(500).json(err.message));
                                        })
                        }else{
                            res.status(400).json({USER_ERROR:"could not find session", "id":session_id});
                        }
                    })
                    .catch(err => res.status(500).json(err.message));
            }else{
                res.status(400).json({USER_ERROR:"could not find survey", "id":survey_id});
            }
        })
        .catch(err => res.status(500).json(err.message));
});

// READ an answer
router.get('/:survey_id/:session_id/:question_id', (req, res) => {
    const {session_id, question_id} = req.params;
    db('answers_table')
        .where({session_id, question_id})
        .then(answer => {
            if(answer.length === 1){
                const object = answer[0];
                res.status(200).json({SUCCESS:"found answer", object});
            }else{
                res.status(400).json({USER_ERROR: "could not find answer with that session_id and question_id", session_id, question_id});
            }
        })
        .catch(err => res.status(500).json(err.message));
});

// UPDATE an answer
router.put('/:survey_id/:session_id/:question_id', (req, res) => {
    const {survey_id, session_id, question_id} = req.params;
    const changes = req.body;
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    db('answers_table')
        .where({session_id, question_id})
        .update({answer: changes.answer})
        .then(count => {
            if(count > 0){
                db('sessions_table')
                    .where({id: session_id})
                    .update({updated_at: dateTime})
                    .then(count => {
                        res.status(200).json({SUCCESS: "updated answer", survey_id, session_id, question_id, changes});
                    })
            }else{
                res.status(400).json({USER_ERROR: "failed to make changes", survey_id, session_id, question_id});
            }
        })
        .catch(err => res.status(500).json(err.message));
});

// DELETE an answer
router.delete('/:survey_id/:session_id/:question_id', (req, res) => {
    const {session_id, question_id} = req.params;
    db('answers_table')
        .where({session_id, question_id})
        .del()
        .then(count => {
            if(count > 0){
                res.status(200).json({SUCCESS: "deleted"});
            }else{
                res.status(400).json({USER_ERROR: "could not find that answer for that session", session_id, question_id});
            }
        })
        .catch(err => res.status(500).json(err.message));
});

module.exports = router;