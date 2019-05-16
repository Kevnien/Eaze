const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

router.get('/', (req, res) => {
    res.status(201).json({'message':'survey creation routes working'});
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