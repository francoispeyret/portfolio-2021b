let scrollY = window.scrollY;
let sections = document.querySelectorAll('section.page');
let sectionCurrent = updateSectionCurrent();
let activeElement = document.getElementById('active-element');

document.onload = updateMenu(sectionCurrent);

document.addEventListener('scroll', function (e){
    const newSectionCurrent = updateSectionCurrent();
    if(newSectionCurrent !== sectionCurrent) {
        sectionCurrent = newSectionCurrent;
        updateMenu(sectionCurrent);
    }
}, { passive: true });

function updateMenu(id) {
    const menuItems = document.querySelectorAll('#main a');
    let menuItemActive = null;
    for(let item of menuItems) {
        if(item.getAttribute('href').indexOf(id) >= 0) {
            menuItemActive = item;
            break;
        }
    }
    if(menuItemActive) {
        activeElement.style.opacity = 1;
        console.log(menuItemActive.offsetLeft);
        activeElement.style.width = menuItemActive.offsetWidth + 'px';
        activeElement.style.left = menuItemActive.offsetLeft + 'px';
    } else {
        activeElement.style.opacity = 0;
    }
}

function updateSectionCurrent() {
    for(let section of sections) {
        const position = section.getBoundingClientRect();
        if(position.bottom > window.innerHeight/4 && position.y < window.innerHeight) {
            return section.getAttribute('id');
        }
    }
}