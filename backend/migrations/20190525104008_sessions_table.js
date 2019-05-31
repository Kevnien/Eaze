
exports.up = function(knex, Promise) {
  return knex.schema.createTable('sessions_table', function(table){
      table.increments();
      table
        .integer('survey_id')
        .notNullable()
        .references('id').inTable('survey_table');
      table
        .timestamp('created_at')
        .defaultTo(knex.fn.now());
    table
        .timestamp('updated_at')
        .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('sessions_table');
};
