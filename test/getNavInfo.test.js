const chai = require('chai');
const EasyPageNavigation = require('../out.js');

chai.should();

describe('getNavInfo()', function () {
    describe('Basic', function () {
        const pageNav = new EasyPageNavigation(128, 10, 5);
        const navInfo = pageNav.getNavInfo(1);

        it('should return an object', function () {
            navInfo.should.be.a('object');
        });
        it('should have property \'pages\'', function () {
            navInfo.should.have.property('pages');
            navInfo.pages.should.have.length(5);
        });
        it('should not have \'previous\' but \'Next\'', function () {
            navInfo.havePrevious.should.be.false,
            navInfo.previous.should.be.equal(-1);

            navInfo.haveNext.should.be.true;
            navInfo.next.should.be.equal(2);
        });
        it('should return nothing if no currentPage in parameter', function () {
            let invalidInfo = pageNav.getNavInfo();

            invalidInfo.pages.should.be.empty;
            invalidInfo.havePrevious.should.be.false;
            invalidInfo.haveNext.should.be.false;
        });
    });

    describe('Current Page is 5', function () {
        const pageNav = new EasyPageNavigation(128, 10, 5);
        const navInfo = pageNav.getNavInfo(5);

        it('should be equal with preset data', function () {
            const data = {
                pages: [
                    { page: 3, isCurrent: false },
                    { page: 4, isCurrent: false },
                    { page: 5, isCurrent: true },
                    { page: 6, isCurrent: false },
                    { page: 7, isCurrent: false }
                ],
                havePrevious: true,
                previous: 4,
                haveNext: true,
                next: 6
            };

            navInfo.should.be.deep.equal(data);
        })
    });

    describe('Current Page is 13', function () {
        const pageNav = new EasyPageNavigation(128, 10, 5);
        const navInfo = pageNav.getNavInfo(13);

        it('should be equal with preset data', function () {
            const data = {
                pages: [
                    { page: 9, isCurrent: false },
                    { page: 10, isCurrent: false },
                    { page: 11, isCurrent: false },
                    { page: 12, isCurrent: false },
                    { page: 13, isCurrent: true }
                ],
                havePrevious: true,
                previous: 12,
                haveNext: false,
                next: -1
            };

            navInfo.should.be.deep.equal(data);
        });
    });

    describe('Current Page is out of range', function () {
        const pageNav = new EasyPageNavigation(128, 10, 5);

        it('should return first part if current page <= 0 || > total', function () {
            const data = {
                pages: [
                    { page: 1, isCurrent: true },
                    { page: 2, isCurrent: false },
                    { page: 3, isCurrent: false },
                    { page: 4, isCurrent: false },
                    { page: 5, isCurrent: false }
                ],
                havePrevious: false,
                previous: -1,
                haveNext: true,
                next: 2
            };

            ( pageNav.getNavInfo(0) ).should.be.deep.equal(data);
            ( pageNav.getNavInfo(1) ).should.be.deep.equal(data);
            ( pageNav.getNavInfo(14) ).should.be.deep.equal(data);

        });
    });

    describe('Total pages small than links number in navigation', function () {
        const pageNav = new EasyPageNavigation(3, 10, 5);

        it('should be equal with preset data', function () {
            const data = {
                pages: [ { page: 1, isCurrent: true } ],
                havePrevious: false,
                previous: -1,
                haveNext: true,
                next: 2
            };

            ( pageNav.getNavInfo(1) ).should.be.deep.equal(data);
        })
    })
})