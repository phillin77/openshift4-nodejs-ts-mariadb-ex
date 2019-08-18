// process.env.NODE_ENV = 'test';

import * as util from 'util';

import 'mocha';
// import * as chai from 'chai';
// import chaiHttp = require('chai-http');
let chai = require('chai');
const should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

// import app from '../src/server/app';

describe('Dummy Test', () => {
    it('always be true', (done) => {
      done();
    });
  });