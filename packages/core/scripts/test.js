'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

const jest = require('jest');
const argv = process.argv.slice(2);

jest.run(argv);
