const document = require('html-element').document;

export default class EasyPageNavigation {
    /*
    * Create a PageNavigation object
    * 
    * @exports
    * @param {number} dataNumber - Total data number, like posts, goods, etc.
    * @param {number} dataPerPage - How many data will display in per page
    * @param {number} linkPerPage - How many links in navigation, if you want get [1, 2, 3], set it as 3
    */
    constructor (dataNumber, dataPerPage, linkPerPage) {
        /*
         数据结构

         this: {
             dataNumber,
             dataPerPage,
             linkPerPage,
             totalPages,
             firstPart,
             lastPart
         }
        */
        this.dataNumber = dataNumber;
        this.dataPerPage = dataPerPage;
        this.linkPerPage = linkPerPage;
        this.totalPages = Math.ceil(dataNumber / dataPerPage);

        /**
         开始部分，如果当前页码小于或等于设定的导航链接数的中间位置时将始
        终将开始位置设置为第一个，否则当前页码前没有足够链接填充使当前页
        保持在导航中间部分
        **/
        this.firstPart = Math.ceil(linkPerPage / 2);

        /**
         结束部分，如果当前页码大于或等于总页数减去开始部分(同样是结束部分)
        时始终将最后一页设置为结束部分，理由同上
        **/
        this.lastPart = this.totalPages - this.firstPart;

        // 特殊情况处理
        if (linkPerPage % 2 == 0) {
            // 导航条内显示的链接数量，这里不能是偶数 (2, 4, 6),
            // 否则当前页面不能显示在中间，例如 [4, 5, *6*, 7, 8]
            throw new Error('Link per page should not be an odd number');
        }
    }

    /*
    * Get pages array
    *
    * @private
    * @currentPage {number} - Get it from parameter
    * @startPage {number} - Where to start list
    * @endPage {number} - Where to end list
    */
    _getPagesList (currentPage, startPage, endPage) {
        // 这里只用来生成导航链接
        let pageList = [];

        for (let i = startPage; i <= endPage; i++) {
            pageList.push({
                page: i,
                isCurrent: i == currentPage
            });
        }

        return pageList;
    }

    /*
    * Get pages navigation info object
    *
    * @param currentPage {number} - You should know it.
    * @property {array} pages - All pages in page navigation
    *
    * @typedef {object} Navigation info object
    *
    * @property {number} pages.page - Page number
    * @property {boolean} pages.isCurrent - Set as true if it is current page
    * @property {boolean} havePrevious - Have previous page, if it is true you can get previous page from 'previous'
    * @property {number} previous - If 'havePrevious' is true, this is previous page number, or it will be set as -1
    * @property {boolean} haveNext - Have next page, if it is true you can get next page from 'next'
    * @property {number} next - If 'haveNext' is true, this is next page number, or it will be set as -1
    *
    * @return {object} - {pages: [...], haveNext: bool, next: page number or -1, havePrevious: bool, previous: page number or -1}
    */
    getNavInfo (currentPage) {
        currentPage = parseInt(currentPage); // 不然你还想传个小数过来吗 ←_← 其实这是为了避免 String 类型导致意外用的

        // 特殊情况处理
        if (currentPage > this.totalPages || currentPage < 1) {
            currentPage = 1;
        }

        let navigationInfo = {
            pages: [],

            havePrevious: false,
            previous: -1,
            
            haveNext: false,
            next: -1
        };

        let enablePrevious = function (currentPage) {
            navigationInfo.havePrevious = true;
            navigationInfo.previous = --currentPage;
        }
        let enableNext = function (currentPage) {
            navigationInfo.haveNext = true;
            navigationInfo.next = ++currentPage;
        }


        if (currentPage <= this.firstPart) {
            // 开始部分处理
            let enoughOnePage = this.totalPages > this.linkPerPage; // 检查页数不足设定的单个导航内链接数量的情况
            navigationInfo.pages = this._getPagesList(currentPage, 1,  enoughOnePage ? this.linkPerPage : this.totalPages);

            if (currentPage > 1) {
                enablePrevious(currentPage);
            }
            enableNext(currentPage);
        } else if (currentPage > this.lastPart) {
            // 结束部分处理
            navigationInfo.pages = this._getPagesList(currentPage, this.totalPages - this.linkPerPage + 1, this.totalPages);

            if (currentPage < this.totalPages) {
                enableNext(currentPage);
            }
            enablePrevious(currentPage);
        } else if (currentPage > this.firstPart && currentPage <= this.lastPart) {
            // 这里只可能是中间部分了 :) 
            // 所以前后一定有足够的页面填充

            // 示例: firstPart = 3, total Pages = 5 , so [1, 2, *3*, 4, 5], 这里需要减去 1 才是左右应该填充的长度
            let part = this.firstPart - 1;
            navigationInfo.pages = this._getPagesList(currentPage, currentPage - part, currentPage + part);

            enablePrevious(currentPage);
            enableNext(currentPage);
        }

        return navigationInfo;
    }

    /*
    * Get pages navigation html code
    *
    * @param currentPage {number} - You should know it.
    * @param optionsObj {object} - Check GitHub document for detail.
    *
    * @return {string} - HTML string
    */
    getNavHTML (currentPage, optionsObj) {
        const options = {
            outerElement: 'ul',
            outerElementClass: '',
            outerElementId: '',

            innerElement: 'li',
            innerElementClass: '',

            linkElement: 'a',
            linkElementClass: '',
            linkTemplate: '/page/{pageNum}',
            linkReplacePattern: /{pageNum}/,

            currentPageClass: 'current',

            nextElement: 'a',
            nextElementClass: 'next',
            nextElementId: '',
            previousElement: 'a',
            previousElementClass: 'previous',
            previousElementId: ''
        };

        // 合并用户设置
        Object.assign(options, optionsObj);

        // Will you did this?
        if (!options.linkElement) {
            options.linkElement = 'a';
        }
        if (!options.prevElement) {
            options.prevElement = 'a';
        }
        if (!options.nextElement) {
            options.nextElement = 'a';
        }
        
        // 如果链接匹配规则是文本，则尝试解析为正则
        let RegExpPattern = /^\/(.*)\/$/;
        if (typeof options.linkReplacePattern === 'string' && RegExpPattern.test(options.linkReplacePattern)) {
            options.linkReplacePattern = new RegExp(options.linkReplacePattern.match(RegExpPattern)[1]);
        }

        let navInfo = this.getNavInfo(currentPage);

        
        // 处理链接部分 (a标签)
        let linkList = [];

        // 处理上一页链接
        if (options.previousElement && navInfo.havePrevious) {
            let previousElement = document.createElement(options.previousElement);
            previousElement.innerHTML = navInfo.previous;
            previousElement.href = options.linkTemplate.replace(options.linkReplacePattern, navInfo.previous);

            if (options.previousElementClass) {
                previousElement.setAttribute('class', options.previousElementClass);
            }
            if (options.previousElementId) {
                previousElement.setAttribute('id', options.previousElementId);
            }

            linkList.push(previousElement);
        }

        navInfo.pages.forEach((pageInfo) => {
            let link = document.createElement(options.linkElement);

            link.innerHTML = pageInfo.page;

            // 根据设定的链接匹配正则替换页码
            link.setAttribute('href', options.linkTemplate.replace(options.linkReplacePattern, pageInfo.page));

            if (options.linkElementClass) {
                link.setAttribute('class', options.linkElementClass);
            }
            if (pageInfo.isCurrent) {
                let originClass = link.getAttribute('class') ? link.getAttribute('class') + ' ' : '';
                link.setAttribute('class', originClass + options.currentPageClass);
            }

            linkList.push(link);
        });

        // 处理下一页链接
        if (options.nextElement && navInfo.haveNext) {
            let nextElement = document.createElement(options.nextElement);
            nextElement.innerHTML = navInfo.next;
            nextElement.href = options.linkTemplate.replace(options.linkReplacePattern, navInfo.next);

            if (options.nextElementClass) {
                nextElement.setAttribute('class', options.nextElementClass);
            }
            if (options.nextElementId) {
                nextElement.setAttribute('id', options.nextElementId);
            }

            linkList.push(nextElement);
        }

        // 处理链接容器
        if (options.innerElement) {
            linkList = linkList.map((linkElement) => {
                let innerElement = document.createElement(options.innerElement);

                if (options.innerElementClass) {
                    innerElement.setAttribute('class', options.innerElementClass);
                }

                innerElement.appendChild(linkElement);

                return innerElement;
            });
        }

        // 处理外部容器
        if (options.outerElement) {
            let outerElement = document.createElement(options.outerElement);

            if (options.outerElementClass) {
                outerElement.setAttribute('class', options.outerElementClass);
            }
            if (options.outerElementId) {
                outerElement.setAttribute('id', options.outerElementId);
            }

            linkList.forEach((linkElement) => {
                outerElement.appendChild(linkElement);
            });

            return outerElement.outerHTML;
        } else {
            return linkList.map((link) => link.outerHTML).join('');
        }
    }
}