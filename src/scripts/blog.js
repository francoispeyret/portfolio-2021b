import showdown from 'showdown';

const converter = new showdown.Converter();

let blogModalStatus = false;
let blogModalContainer = document.getElementById('blog-modal-container');
let blogModalImage = document.getElementById('blog-modal-image');
let blogModalContent = document.getElementById('blog-modal-content');
let blogModalBackground = document.getElementById('blog-modal-background');

let linksBlogEls = document.querySelectorAll('a.link-blog');
for(let linkBlop of linksBlogEls) {
    linkBlop.addEventListener('click', function(event){
        event.preventDefault();
        const url = this.getAttribute('href');
        openModalLink(this);
        window.history.pushState({},"", url);
    });
}

blogModalBackground.addEventListener('click', () => {
    if(blogModalStatus) toggleModal();
});

document.querySelector('#main').addEventListener('click', () => {
    if(blogModalStatus) toggleModal();
});

function openModalLink(linkElement) {
    const urlMarkown = linkElement.getAttribute('data-markdown');
    blogModalImage.innerHTML = '';
    blogModalContent.innerHTML = '';
    fetch(urlMarkown)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            let imageModal = linkElement.querySelector('img');
            if(imageModal.getAttribute('src').length) {
                blogModalImage.innerHTML = '<img src='+imageModal.getAttribute('src')+' />';
            }
            blogModalContent.innerHTML = converter.makeHtml(data);
            toggleModal();
        });
}

function toggleModal() {
    if(blogModalStatus) {
        document.querySelector('html').style.overflowY = 'auto';
        blogModalBackground.style.opacity = '0';
        blogModalBackground.style.pointerEvents = 'none';
        blogModalContainer.style.opacity = '0';
        blogModalContainer.style.pointerEvents = 'none';
    } else {
        document.querySelector('html').style.overflowY = 'hidden';
        blogModalBackground.style.opacity = '1';
        blogModalBackground.style.pointerEvents = 'auto';
        blogModalContainer.style.opacity = '1';
        blogModalContainer.style.pointerEvents = 'auto';
    }
    blogModalStatus = !blogModalStatus;
}