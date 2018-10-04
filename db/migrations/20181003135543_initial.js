
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', 
    function(table) {
      table.increments('id').primary();
      table.string('name');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('colors', 
    function(table) {
      table.increments('id').primary();
      table.string('hex');
      table.string('shape');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('palettes', 
    function(table) {
      table.increments('id').primary();
      table.integer('color1').unsigned()
      table.foreign('color1')
        .references('colors.id');
      table.integer('color2').unsigned()
      table.foreign('color2')
        .references('colors.id');
      table.integer('color3').unsigned()
      table.foreign('color3')
        .references('colors.id');
      table.integer('color4').unsigned()
      table.foreign('color4')
        .references('colors.id');
      table.integer('color5').unsigned()
      table.foreign('color5')
        .references('colors.id');
      table.integer('proj_id').unsigned()
      table.foreign('proj_id')
        .references('projects.id');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('colors'),
    knex.schema.dropTable('palettes'),
    knex.schema.dropTable('projects')
  ])
};
