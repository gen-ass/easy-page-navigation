# Easy Page Navigation

## Description
This module can help you generate a page navigation in one minutes, output can be JSON or HTML.

### Usage:
```js
const EasyPageNav = require('easy-page-navigation');
    
let MyNav = new EasyPageNav(128, 10, 5);
console.log( MyNav.getNavInfo(6) );
```

This will print:
```js
{
	pages:[
	    { page: 4, isCurrent: false },
	    { page: 5, isCurrent: false },
	    { page: 6, isCurrent: true },
	    { page: 7, isCurrent: false },
	    { page: 8, isCurrent: false }
	],
	havePrevious: true,
	previous: 5,
	haveNext: true,
	next: 7
}
```
also, you can use `getNavHTML(currentPage)` to generate  it in HTML
```html
<ul>
    <li><a href="/page/1" class="current">1</a></li>
    <li><a href="/page/2">2</a></li>
    <li><a href="/page/3">3</a></li>
    <li><a href="/page/4">4</a></li>
    <li><a href="/page/5">5</a></li>
    <li><a href="/page/2" class="next">2</a></li>
</ul>
```
> Did you see? There is no previous buttion, because current page is first page.

## Parameters

### Constructor
|Parameter|Description|
|---------|-----------|
|dataNumber|Total data number, like posts, goods, etc.|
|dataPerPage|How many data will display in per page|
|linkPerPage|How many links in navigation, if you want get [1, 2, 3], set it as 3|
> linkPerPage must be an even number, because [1, 2, * 3 *, 4, 5]

### getNavInfo
|Parameter|Description|
|---------|-----------|
|currentPage|You should know this|

Return:
```js
{
	pages:[
	    { page: 4, isCurrent: false },
	    { page: 5, isCurrent: false },
	    { page: 6, isCurrent: true },
	    { page: 7, isCurrent: false },
	    { page: 8, isCurrent: false }
	],
	havePrevious: true,
	previous: 5,
	haveNext: true,
	next: 7
}
```

### getNavHTML
|Parameter|Description|
|---------|-----------|
|currentPage|You should know this|
|options|See next section|

## Available Options for getNavHTML
```js
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
```
> You can set `outerElement` to a empty string or null to disable outer element,same for `innerElement`
> 
>  But you can't do this for `linkElement`, if `linkElement` is a invalid value, it will be ignore.