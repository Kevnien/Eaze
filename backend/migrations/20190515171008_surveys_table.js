
exports.up = function(knex, Promise) {
    return knex.schema.createTable('surveys_table', function(table){
        table.increments();
        table
            .string('title')
            .notNullable()
            .unique();
        table.timestamp('created_at')
            .defaultTo(knex.fn.now());
        table.timestamp('updated_at')
            .defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('surveys_table');
};
