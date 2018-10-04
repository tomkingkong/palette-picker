// { hex: '#ab9ff0', shape: 'CUT_DIAMOND' },
// { hex: '#fff000', shape: 'DIAMOND' },
// { hex: '#192f99', shape: 'TRIANGLE' },
// { hex: '#2d2d2d', shape: 'HEXAGON' },
// { hex: '#04ff84', shape: 'OCTAGON' },

// { name: 'cool' },
// { name: 'dawg' },
// { name: 'beans' }

// { proj_id: 1, color1: 1, color2: 3, color3: 4, color4: 2, color5: 5 },
// { proj_id: 2, color1: 3, color2: 1, color3: 4, color4: 5, color5: 2 },
// { proj_id: 3, color1: 5, color2: 2, color3: 3, color4: 4, color5: 1 }


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('palettes').del()
  //   .then(() => knex('colors').del())
  //   .then(() => knex('projects').del())
  //   .then(() => {
  //     return Promise.all([
  //       knex('projects').insert([
  //         { name: 'cool' }
  //       ], 'id')
  //       .then(project => {
  //         return knex('colors').insert([
  //           { hex: '#fff000', shape: 'DIAMOND' },
  //           { hex: '#ab9ff0', shape: 'CUT_DIAMOND' },
  //           { hex: '#192f99', shape: 'TRIANGLE' },
  //           { hex: '#2d2d2d', shape: 'HEXAGON' },
  //           { hex: '#04ff84', shape: 'OCTAGON' },
  //         ])
  //       })
  //       .then()
  //     ])
  //   })
};
