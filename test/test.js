var log_tbl = require('console.tablefy');

var array = [
  {
    name: 'John',
    second: 'Smith'
  },
  {
    name: 'my complete and long txt',
    second:
`Lorem Ipsum is simply dummy text of the printing and
typesetting industry. Lorem Ipsum has been
the industry's standard dummy text ever since the 1500s,

Aldus PageMaker including versions of Lorem Ipsum.`
  },
  {
    name: 'Smith',
    second: "Jones",
    any: 'OOOOOHHHHHHHH',
    number: 092832
  },
  {
    name: 'Emily',
    second: [
      ["John", "Smith"],
      ["Jane", "Doe"],
      [
        "Emily",
        [
          ["John", "Smith"],
          [
            [
              ["John", "Smith"], ["Jane", "Doe"], ["Emily", "Jones"]
            ],
              "Doe"
          ],
          ["Emily", "Jones"]
        ]
      ]
    ],
    other: ["Jane", "Doe"],
  },
  {
    name: 'Jane',
    any: {
      name: 'John',
      second: 'Smith',
      and: {
        name: 'Emily',
        second: "Jones",
        any: [ [ "John", "Smith" ], [ "Jane", "Doe" ] ],
        number: 092832
      },
    },
    other: null,
  },
  'WOW',
  123
],

config = {
  cell_pos: 'right', /* right, left, center */
  window_pos: 'right', /* right, left, center */
  head_color: 'cyan', /* (default is cyan) ascii colors names :
    black, red, green, yellow,
    blue, magenta, cyan, light_gray, dark_ray,
    light_red, light_green, light_yellow, light_blue,
    light_magenta, light_cyan, default_White
    or ascii code, ex.: \x1b[91m
  */
  style: 'honeywell', /* honeywell | norc | ramac | void */
  title: 'My table',
  orientation: 'horizontal', /* horizontal | vertical */
  responsive: true, /* reposnsive by terminal window */
  log: true, /* true | false | function (...tables) => { console.log(...tables); } */
  // custom: {
  //   // topBody: `═`,
  //   // topJoin: `╤`,
  //   topLeft: `💢`,
  //   topRight: `💢`,
  //
  //   // bottomBody: `═`,
  //   // bottomJoin: `╧`,
  //   bottomLeft: `💢`,
  //   bottomRight: `💢`,
  //
  //   // bodyLeft: `║`,
  //   // bodyRight: `║`,
  //   // bodyJoin: `│`,
  //   //
  //   // joinBody: `─`,
  //   // joinLeft: `╟`,
  //   // joinRight: `╢`,
  //   joinJoin: `🌀`
  // }
};

console.tablefy(array, config);
console.tablefy('test', [{ test: 'test' }], config);

config.log = false;
var tables = console.tablefy([ [ "John", "Smith" ], [ "Jane", "Doe" ] ], config);
console.log(...tables);
