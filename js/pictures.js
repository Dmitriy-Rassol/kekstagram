'use strict';

const photoListElement = document.querySelector('.pictures');
const photoTemplateElement = document.querySelector('#picture').content.querySelector('.picture');

const renderPhoto = function (photoElement) {
  const photoTemplate = photoTemplateElement.cloneNode(true);
  photoTemplate.querySelector('.picture__img').src = photoElement.url;
  photoTemplate.querySelector('.picture__likes').textContent = photoElement.likes;
  photoTemplate.querySelector('.picture__comments').textContent = photoElement.comments.length;

  photoTemplate.addEventListener('click', function () {
    window.bigPictures.showBigPicture(photoElement);
  });
  return photoTemplate;
}

const onSuccess = function (fragmentNum) {
  const fragment = document.createDocumentFragment();
  fragmentNum.forEach((element) => {
    fragment.appendChild(renderPhoto(element));
  })
  photoListElement.appendChild(fragment)
}

window.backend.load(onSuccess, window.utils.error);

