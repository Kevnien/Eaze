
exports.up = function(knex, Promise) {
    return knex.schema.createTable('answers_table', function(table){
        table.increments();
        table
            .integer('session_id')
            .notNullable()
            .references('id').inTable('sessions_table');
        table
            .integer('question_id')
            .notNullable()
            .references('id').inTable('questions_table');
        table
            .unique(['session_id', 'question_id'])
        table
            .string('answer')
        table
            .timestamp('created_at')
            .defaultTo(knex.fn.now());
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('answers_table');
};
