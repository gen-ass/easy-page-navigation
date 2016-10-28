const chai = require('chai');
const EasyPageNavigation = require('../out.js');

chai.should();

describe('getNavHTML()', function () {
    describe('Basic', function () {
        const pageNav = new EasyPageNavigation(128, 10, 5);
        const navHTML = pageNav.getNavHTML(1);

        it('should be equal with perset data when no options', function () {
            const data = '<ul><li><a href="/page/1" class="current">1</a></li><li><a href="/page/2">2</a></li><li><a href="/page/3">3</a></li><li><a href="/page/4">4</a></li><li><a href="/page/5">5</a></li><li><a href="/page/2" class="next">2</a></li></ul>';

            navHTML.should.be.equal(data);
        });
        it('should parse link even \'linkReplacePattern\' is a string ', function () {
            pageNav.getNavHTML(1, {
                linkTemplate: '/test/%2%',
                linkReplacePattern: '/%2%/'
            }).should.contain('/test/1');
        });
        it('should work without outerElement', function () {
            const data = '<li><a href="/page/1" class="current">1</a></li><li><a href="/page/2">2</a></li><li><a href="/page/3">3</a></li><li><a href="/page/4">4</a></li><li><a href="/page/5">5</a></li><li><a href="/page/2" class="next">2</a></li>';

            pageNav.getNavHTML(1, {
                outerElement: ''
            }).should.be.equal(data);
        });
        it('should work without outerElement and innerElement', function () {
            const data = '<a href="/page/1" class="current">1</a><a href="/page/2">2</a><a href="/page/3">3</a><a href="/page/4">4</a><a href="/page/5">5</a><a href="/page/2" class="next">2</a>';

            pageNav.getNavHTML(1, {
                outerElement: '',
                innerElement: ''
            }).should.be.equal(data);
        });
        it('should ignore empty *Element options value', function () {
            pageNav.getNavHTML(1, {
                linkElement: '',
                prevElement: '',
                nextElement: ''
            }).should.contain('<a href')
        });
    });

    describe('Custom', function () {
        const pageNav = new EasyPageNavigation(128, 10, 5);

        it('should work with custom options', function () {
            const options = {
                outerElement: 'div',
                outerElementClass: 'outer-class',
                outerElementId: 'outer-id',

                innerElement: 'span',
                innerElementClass: 'inner-class',

                linkElement: 'aa',
                linkElementClass: 'link-class',
                linkTemplate: '/page/{pageNum}',
                linkReplacePattern: /{pageNum}/,

                currentPageClass: 'test-current',

                nextElement: 'aa',
                nextElementClass: 'next-test',
                nextElementId: 'a-next',
                previousElement: 'a',
                previousElementClass: 'previous-test',
                previousElementId: 'a-previous'
            };

            const data = '<div class="outer-class" id="outer-id"><span class="inner-class"><aa href="/page/1" class="link-class test-current">1</aa></span><span class="inner-class"><aa href="/page/2" class="link-class">2</aa></span><span class="inner-class"><aa href="/page/3" class="link-class">3</aa></span><span class="inner-class"><aa href="/page/4" class="link-class">4</aa></span><span class="inner-class"><aa href="/page/5" class="link-class">5</aa></span><span class="inner-class"><aa class="next-test" id="a-next">2</aa></span></div>';

            ( pageNav.getNavHTML(1, options) ).should.equal(data);
        });
    })
});