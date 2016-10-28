const chai = require('chai');

chai.should();
chai.use(require('chai-fs'));

describe('Base', function () {
    it('out.js should exist', function () {
        './out.js'.should.be.a.file();
    });

    it('new EasyPageNavigation should work', function () {
        const EasyPageNavigation = require('../out.js');

        (function () {new EasyPageNavigation(128, 10, 5)}).should.not.throw(Error);
    });
});