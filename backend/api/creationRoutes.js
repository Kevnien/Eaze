const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

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

router.post('/', (req, res) => {
    const survey = req.body;
    db('surveys_table')
        .insert(survey)
        .then(id => {
            res.status(200).json({"success":'created new survey with id', "id":id[0]});
        })
        .catch(err => res.status(500).json(err.message));
});

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

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    db('surveys_table')
        .where('id', '=', id)
        .del()
        .then(bool => {
            if(bool === 1){
                res.status(200).json({"success":"survey deleted","bool":bool});
            }else{
                res.status(400).json({"user error":`could not find survey of id ${id}`});
            }
        })
        .catch(err => {res.status(500).json({"server error":err.message})});
});

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
})

module.exports = router;