'use strict';

(function () {
  // Переменные для большого фото
  const bigPicture = document.querySelector('.big-picture');
  const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  const bigPictureDescription = bigPicture.querySelector('.big-picture__social .social__caption');
  const bigPictureLikes = bigPicture.querySelector('.big-picture__social .likes-count');
  const bigPictureCommentsCount = bigPicture.querySelector('.social__comment-count .comments-count');
  const bigPictureCommentsCountStart = bigPicture.querySelector('.social__comment-count .comments-count-start');
  const bigPictureUserComments = bigPicture.querySelector('.social__comments');
  const bigPictureUserComment = bigPicture.querySelector('.social__comment');
  const commentsLoadBtn =  bigPicture.querySelector('.comments-loader');
  const commentUserInput = bigPicture.querySelector('.social__footer-text');
  const commentUserSend = bigPicture.querySelector('.social__footer-btn');
  const socialFooter = bigPicture.querySelector('.social__footer');
  const socialPicture = socialFooter.querySelector('.social__picture');
  let a = 5;
  let next = 0;
  const showBigPicture = function (bigPhotoData) {
    document.querySelector('body').classList.add('modal-open');
    bigPicture.classList.remove('hidden');
    fillBigPictureInfo(bigPhotoData);
    createPictureComments(bigPhotoData);
    commentsLoadBtn.addEventListener('click', function () {
      bigPictureUserComments.innerHTML = '';
      for (let i = 0; i < bigPhotoData.comments.length; i++) {
        bigPictureUserComments.append(createPictureComment(bigPhotoData.comments[i]))
      }
      commentsLoadBtn.classList.add('hidden');
      bigPictureCommentsCountStart.textContent = bigPictureCommentsCount.textContent
    });
    document.addEventListener('keydown', window.utils.closeModal)
  };

  const userMessage = function () {
    const bigPictureComment = bigPictureUserComment.cloneNode(true);
    const bigPictureUserData = bigPictureComment.querySelector('.social__picture');
    if (commentUserInput.value) {
      bigPictureUserData.src = socialPicture.src;
      bigPictureUserData.alt = "имя";
      bigPictureComment.querySelector('.social__text').textContent = commentUserInput.value;
      commentUserInput.value = '';
      socialPicture.src = "img/avatar-" + window.utils.random(1,6) +".svg";
      bigPictureUserComments.appendChild(bigPictureComment);
      bigPictureCommentsCount.textContent = parseInt(bigPictureCommentsCount.textContent) + 1;
      bigPictureCommentsCountStart.textContent = bigPictureCommentsCount.textContent;
    }
    return bigPictureUserComments;
  }

  commentUserSend.addEventListener('click', userMessage)

//  Заполняем информацией увеличенное фото
  const fillBigPictureInfo = function (photoData) {
    bigPictureImg.src = photoData.url;
    bigPictureDescription.textContent = photoData.description;
    bigPictureLikes.textContent = photoData.likes;
    bigPictureCommentsCount.textContent = photoData.comments.length;
    hashDesc(bigPictureDescription);
    commentsCount();
  }

  const commentsCount = function () {
    if (bigPictureCommentsCount.textContent < 5 ) {
      bigPictureCommentsCountStart.textContent = bigPictureCommentsCount.textContent;
      commentsLoadBtn.classList.add('hidden');
    } else {
      bigPictureCommentsCountStart.textContent = 5;
      commentsLoadBtn.classList.remove('hidden');
    }
  }

// Ставим хэштеги
  const hashDesc = function (desc) {
    const arr = desc.textContent.split('#');
    if (desc.textContent.charAt() === '#') {
      desc.innerHTML = '';
      arr.shift();
      for (let i = 0; i < arr.length; i++) {
        const a = document.createElement('a');
        a.textContent = '#' + arr[i] + '\u00A0';
        a.href = a.textContent.trim();
        a.classList.add('social__hash-link');
        desc.append(a) ;
      }
    } else {
      desc.innerHTML = '';
      desc.textContent = arr[0];
      for (let i = 1; i < arr.length; i++) {
        const a = document.createElement('a');
        a.textContent = '#' + arr[i] + '\u00A0';
        a.href = a.textContent.trim();
        a.classList.add('social__hash-link');
        desc.append(a);
      }
    }
  }

  // Создаем комментарий к увеличенному фото
  //  Получаем комментарий для добавления к фото
  const createPictureComment = function (commentData) {
    const bigPictureComment = bigPictureUserComment.cloneNode(true);
    const bigPictureUserData = bigPictureComment.querySelector('.social__picture');

    bigPictureUserData.src = commentData.avatar;
    bigPictureUserData.alt = commentData.name;
    bigPictureComment.querySelector('.social__text').textContent = commentData.message;

    return bigPictureComment;
  };
//  Создаем массив комментариев для фото
  const createPictureComments = function (photoData) {
    bigPictureUserComments.innerHTML = '';
    photoData.comments.slice(next, a).forEach(comment => {
      bigPictureUserComments.appendChild(createPictureComment(comment));
    });
  };

  window.bigPictures = {
    showBigPicture : showBigPicture
  }
})();
