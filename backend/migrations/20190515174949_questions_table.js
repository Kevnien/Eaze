
exports.up = function(knex, Promise) {
    return knex.schema.createTable('questions_table', function(table){
        table.increments();
        table
            .integer('survey_id')
            .notNullable()
            .references('id').inTable('survey_table');
        table
            .string('question')
            .notNullable();
        table
            .timestamp('created_at')
            .defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('questions_table');
};
