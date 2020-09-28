'use strict';

(function () {
  const bigPicture = document.querySelector('.big-picture');
  const imgUploadOverlay = document.querySelector('.img-upload__overlay');
  const uploadForm = document.querySelector('.img-upload__form');

  const Key = {
    ENTER: 'Enter',
    ESC: 'Escape'
  };

  // закрываем модальные окна
  const closeModal = function (event) {
    const target = event.target;
    if (target.closest('.cancel') || target.classList.contains('overlay') ||  event.key === Key.ESC) {
      document.body.classList.remove('modal-open');
      bigPicture.classList.add('hidden');
      imgUploadOverlay.classList.add('hidden');
      document.removeEventListener('keydown', closeModal);
      uploadForm.reset();
    }
  }

  const onError = function (errorMessage) {
    const dataErrorMessage = document.createElement('div');
    dataErrorMessage.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    dataErrorMessage.style.position = 'absolute';
    dataErrorMessage.style.left = 0;
    dataErrorMessage.style.right = 0;
    dataErrorMessage.style.padding = '10px'
    dataErrorMessage.style.fontSize = '30px';
    dataErrorMessage.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', dataErrorMessage);
  };

  document.addEventListener('click', closeModal);

  const getRandomInt = function(min, max) {
    let rand = min + Math.random() * (max - min);
    return Math.round(rand);
  }


  window.utils = {
    random: getRandomInt,
    error: onError,
    closeModal: closeModal,
    keyEsc: Key.ESC,
    keyEnter:  Key.ENTER
  }
})();
