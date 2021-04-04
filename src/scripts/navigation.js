let scrollY = window.scrollY;
let sections = document.querySelectorAll('section.page');
let sectionCurrent = null;
let activeElement = document.getElementById('active-element');

let linksEls = document.querySelectorAll('a.link-local');
for(let link of linksEls) {
    link.addEventListener('click', function(event){
        event.preventDefault();
        const url = this.getAttribute('href');
        findRootAndScrollTo(url);
        window.history.pushState({},"", url);
    });
}

document.addEventListener('scroll', function (e){
    const newSectionCurrent = updateSectionCurrent();
    if(newSectionCurrent !== sectionCurrent) {
        sectionCurrent = newSectionCurrent;
        window.history.pushState({},"", '/'+sectionCurrent);
        updateMenu();
    }
}, { passive: true });

function updateMenu() {
    const menuItems = document.querySelectorAll('#main a');
    let menuItemActive = null;
    for(let item of menuItems) {
        if(item.getAttribute('href').indexOf(sectionCurrent) >= 0) {
            menuItemActive = item;
            break;
        }
    }
    if(
        menuItemActive &&
        menuItemActive &&
        typeof menuItemActive.offsetWidth != 'undefined' &&
        typeof menuItemActive.offsetLeft != 'undefined'
    ) {
        activeElement.style.opacity = '1';
        activeElement.style.width = menuItemActive.offsetWidth + 'px';
        activeElement.style.left = menuItemActive.offsetLeft + 'px';
    } else {
        activeElement.style.opacity = '0';
    }
}

function findRoot(pathname) {
    const pathnameDecode = pathname.substring(1);
    let root = null;

    for(let section of sections) {
        if(section.getAttribute('id').indexOf(pathnameDecode) === 0) {
            root = section.getAttribute('id');
            break;
        }
    }

    return root;
}

function findRootAndScrollTo(url) {
    const root = findRoot(url);
    scrollToSection(root);
    return root;
}

function updateSectionCurrent(event) {
    if(typeof event === undefined) event = false;

    if(event === 'load') {
        return findRootAndScrollTo(window.location.pathname);
    }

    for(let section of sections) {
        const position = section.getBoundingClientRect();
        if(position.bottom > window.innerHeight/4 && position.y < window.innerHeight) {
            return section.getAttribute('id');
        }
    }
}

function scrollToSection(section) {
    const scrollTarget = document.getElementById(section);

    if(scrollTarget) {
        setTimeout(function(){
            scrollTarget.scrollIntoView();
        },300);
    }
}

window.addEventListener('load', function (){
    sectionCurrent = updateSectionCurrent('load');
    updateMenu();
});
