const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

// READS all the surveys
router.get('/', (req, res) => {
    db('surveys_table')
        .select()
        .then(surveys => {
            let cleanedArray = [];
            surveys.forEach(survey => {
                const item = {"id":survey.id, "title":survey.title};
                cleanedArray.push(item);
            });
            res.status(200).json(cleanedArray);
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
});

// CREATES a new survey
router.post('/', (req, res) => {
    const survey = req.body;
    db('surveys_table')
        .insert(survey)
        .then(id => {
            res.status(200).json({"success":'created new survey with id', "id":id[0]});
        })
        .catch(err => res.status(500).json(err.message));
});

// READS a specific survey by its id number
router.get('/:id', (req, res) => {
    const {id} = req.params;
    db('surveys_table')
        .where('id', '=', id)
        .then(object => {
            if(object.length !== 0){
                res.status(200).json(object[0]);
            }else{
                res.status(400).json({"error":`no survey with id ${id} exists`});
            }
        })
        .catch(err => res.status(500).json(err.message));
});

// UPDATES the name of the survey and updates the 'updated_at' column for the entry
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const newTitle = req.body;
    let oldTitle = "";
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    newTitle.updated_at = dateTime;
    db('surveys_table')
        .where('id', '=', id)
        .then(survey => {
            if(survey.length !== 0){
                oldTitle = survey[0].title;
            }else{
                res.status(400).json({"error":`survey of id ${id} not found`});
            }
        })
        .catch(err => res.status(500).json(err.message));
    db('surveys_table')
        .where('id', '=', id)
        .update(newTitle)
        .then(bool => {
            if(bool === 1){
                res.status(200).json({
                    "success":"successfully updated",
                    "id":id,
                    "new_title":newTitle,
                    "old_title":oldTitle
                });
            }else{
                res.status(400).json(`error":"unable to update survey of id ${id}`);
            }
        })
        .catch(err => res.status(500).json({"error":err.message}));
});

// DELETES a specific survey by its id number
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    db('surveys_table')
        .where('id', '=', id)
        .del()
        .then(bool => {
            if(bool === 1){
                db('questions_table')
                    .where('survey_id','=',id)
                    .del()
                    .then(count => {
                        res.status(200).json({"success":`deleted ${count} questions that referenced survey ${id}`})
                    })
                    .catch(err => res.status(500).json({
                        "server error":err.message,
                        "survey id":id
                    }));
            }else{
                res.status(400).json({"user error":`could not find survey of id ${id}`});
            }
        })
        .catch(err => {res.status(500).json({"server error":err.message})});
});

// DELETES all questions for a survey
router.delete('/delete_questions/:id', (req, res) => {
    const {id} = req.params;
    db('questions_table')
        .where('survey_id','=',id)
        .del()
        .then(count => {
            res.status(200).json({
                "success":"cleared survey of questions",
                "amount_deleted":count,
                "survey_id":id
            });
        })
        .catch(err => res.status(500).json({"server error":err.message}));
});

// CREATES a new question for a survey
router.post('/:id', (req, res) => {
    const {id} = req.params;
    const question = req.body;
    db('surveys_table')
        .where('id','=', id)
        .then(object =>{
            const survey = object[0];
            if(object.length !== 0){
                question.survey_id = survey.id;
                db('questions_table')
                    .insert(question)
                    .then(id => {
                        res.status(200).json({"success":`question created with id`, "id":id[0]});
                    })
                    .catch(err => res.status(500).json(err.message));
            }else{
                res.status(400).json({"error":`no survey with id ${id} exists`});
            }
        })
        .catch(err => res.status(500).json(err.message));
});

// READS a question
router.get('/question/:id', (req, res) => {
    const {id} = req.params;
    db('surveys_table')
        .where({id: id})
        .then(something => {
            res.status(200).json({"success":something});
        })
        .catch(err => res.status(500).json({"error":err.message}));
});

// UPDATES a question
router.put('/question/:id', (req, res) => {
    const {id} = req.params;
    const newQuestion = req.body;
    let oldQuestion = {};
    let survey_id = 0;
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    db('questions_table')
        .where('id', '=', id)
        .then(question => {
            if(question.length !== 0){
                oldQuestion = question[0];
                survey_id = question[0].survey_id;
                db('surveys_table')
                    .where({id: survey_id})
                    .update({updated_at: dateTime})
                    .then(count => {
                        if(count === 0){
                            res.status(400).json({"error":count});
                        }else{
                            db('questions_table')
                                .where({id: id})
                                .update(newQuestion)
                                .then(count => {
                                    if(count === 1){
                                        res.status(200).json({
                                            "success":"successfully updated question",
                                            "id":id,
                                            "new_question":newQuestion.question,
                                            "old_question":oldQuestion.question
                                        });
                                    }else{
                                        res.status(400).json({"error":"unable to update question","id":id})
                                    }
                                })
                                .catch(err => res.status(500).json({"error":err.message}));
                        }
                    })
                    .catch(err => res.status(400).json({"error":err.message}));
            }else{
                res.status(400).json({"error":"question with that id not found","id":id});
            }
        })
        .catch(err => res.status(500).json({"error":err.message}));
});

module.exports = router;