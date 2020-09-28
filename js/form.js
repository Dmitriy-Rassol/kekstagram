'use strict';
(function () {
  const MAX_SCALE = 100;
  const MIN_SCALE = 25;
  const SCALE_STEP = 25;
  const MIN_HASH_CHARACTERS = 2;
  const MAX_HASH_CHARACTERS = 20;
  const MAX_HASH = 5;
  const REGEXP = /^#[а-яА-ЯёЁa-zA-Z0-9]{1,19}$/;
  const infoPhoto = {};
  let currentEffect = '';
  const effectImgs = {
    none : 'none',
    chrome : {
      min : 0,
      max : 1
    },
    sepia : {
      min : 0,
      max : 1
    },
    marvin : {
      min : 0,
      max : 100
    },
    phobos : {
      min : 1,
      max : 3
    },
    heat : {
      min : 1,
      max : 3
    }
  }

  // переменные для загрузки и редактирования фото
  const uploadFile = document.querySelector('#upload-file');
  const uploadForm = document.querySelector('.img-upload__form');
  const imgUploadOverlay = document.querySelector('.img-upload__overlay');
  const imgUploadSubmit = document.querySelector('.img-upload__submit');
  const scaleControlSmaller = imgUploadOverlay.querySelector('.scale__control--smaller');
  const scaleControlBigger = imgUploadOverlay.querySelector('.scale__control--bigger');
  const scaleControlValue = imgUploadOverlay.querySelector('.scale__control--value');
  const effectsPreviewImgs = document.querySelectorAll('.effects__preview');
  const imgUploadPreview = document.querySelector('.img-upload__preview img');
  let scaleControlNumberValue = 100;
// переменные эффектов
  const effectLevelPin = document.querySelector('.effect-level__pin');
  const effectLevel = document.querySelector('.effect-level');
  const effectLevelValue = effectLevel.querySelector('.effect-level__value');
  const effectLevelLine = effectLevel.querySelector('.effect-level__line');
  const effectLevelDepth = effectLevelLine.querySelector('.effect-level__depth');
  const effectsRadio = document.querySelectorAll('.effects__radio');
  const imgUploadEffectLevel = document.querySelector('.img-upload__effect-level');
//  Переменные блока об ошибках
  const errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
  const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  const mainContainer = document.querySelector('main');
  const errorButtonClose = errorMessageTemplate.querySelector('.error__button');
  const successButtonClose = successMessageTemplate.querySelector('.success__button');

// Хэштеги
  const hashtags = imgUploadOverlay.querySelector('.text__hashtags');

  // Загрузка фото
  uploadFile.addEventListener('change', function (event) {
    const target = event.target;
    const reader = new FileReader();
    const file = target.files[0];
    reader.readAsBinaryString(file);
    reader.addEventListener('load', (event) => {
      if (file.type.match('image/jpeg') || file.type.match('image/png')) {
        infoPhoto.base64 = btoa(event.target.result);
        imgUploadPreview.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
        imgUploadOverlay.classList.remove('hidden');
        document.body.classList.add('modal-open');
        effectImgPreview();
        document.addEventListener('keydown', window.utils.closeModal);
      } else {
        errorMessage();
      }
    });
    effectDefault();
  });

// Подгружаем фото на миниатюрах фильтров
  const effectImgPreview = function () {
    for (let effectsPreviewImg of effectsPreviewImgs) {
      effectsPreviewImg.style.backgroundImage = 'url(' + imgUploadPreview.src + ')';
    }
  }

// Размер изображения
  const scalePreview = function (step) {
    scaleControlNumberValue += parseInt(step, 10);
    if (scaleControlNumberValue <= MAX_SCALE && scaleControlNumberValue >= MIN_SCALE) {
      imgUploadPreview.style.transform = 'scale(' + (scaleControlNumberValue / 100) + ')';
      scaleControlValue.value = scaleControlNumberValue + '%';
    }
    scaleControlBigger.disabled = scaleControlNumberValue >= MAX_SCALE;
    scaleControlSmaller.disabled = scaleControlNumberValue <= MIN_SCALE;
  };

// Сброс настроек изображения
  const effectDefault = function () {
    scaleControlValue.value = '100%';
    imgUploadPreview.style.transform = 'scale(1)';
    scaleControlBigger.disabled = true;
    scaleControlSmaller.disabled = false;
    effectLevelPin.style.left = '50%';
    effectLevelDepth.style.width = '50%'
    imgUploadEffectLevel.classList.add('hidden');

  };

  function onChangeEffect(evt) {
    currentEffect = evt.target.value;
    imgUploadPreview.className = 'effects__preview--' + currentEffect;
    imgUploadEffectLevel.classList[(currentEffect === 'none') ? 'add' : 'remove']('hidden');
    setEffectsValue();
  }

  const setEffectsValue = function () {
    let position = effectLevelLine.offsetWidth / 2;
    effectLevelPin.style.left = position + 'px';
    effectLevelDepth.style.width = position + 'px';
    imgUploadPreview.style.filter = getEffectsStyle(currentEffect);
  };

  function getEffectsStyle(effect, value) {
    let effectName = '';
    let currentValue = effectImgs[effect]['min'] + (effectImgs[effect]['max'] - effectImgs[effect]['min']) * value;
    const effectValue = (typeof value === 'undefined') ? (effectImgs[effect]['max']) / 2 : currentValue;
    switch (effect) {
      case 'none': effectName = 'none';
        break;
      case 'chrome': effectName = 'grayscale(' + effectValue + ')';
        break;
      case 'sepia': effectName = 'sepia(' + effectValue + ')';
        break;
      case 'marvin': effectName = 'invert(' + effectValue + '%' + ')';
        break;
      case 'phobos': effectName = 'blur(' + effectValue + 'px' + ')';
        break;
      case 'heat': effectName = 'brightness(' + effectValue + ')';
        break;
    }
    return effectName;
  }

  scaleControlBigger.addEventListener('click', function () {
    scalePreview(SCALE_STEP);
  });

  scaleControlSmaller.addEventListener('click', function () {
    scalePreview(-SCALE_STEP);
  });

  // Бегунок
  effectLevelPin.addEventListener('mousedown', function (event) {
    event.preventDefault();
    let startCoordX = event.clientX;

    const onMouseMove = function (event) {
      event.preventDefault();
      const shiftX = startCoordX - event.clientX;
      const coordPin = effectLevelPin.offsetLeft - shiftX;
      const coordLine = effectLevelLine.offsetLeft - effectLevelPin.offsetWidth;
      let effectPosition = coordPin;
      const effectIntensivity = Math.round(effectLevelPin.offsetLeft / (effectLevelLine.offsetWidth / 100));

      startCoordX = event.clientX;
      effectLevelPin.style.left = coordPin + 'px';

      if (coordPin > effectLevelLine.offsetWidth) {
        effectPosition = effectLevelLine.offsetWidth;
      } else if (coordPin < coordLine) {
        effectPosition = coordLine;
      }
      effectLevelValue.value = effectIntensivity;
      effectLevelPin.style.left = effectPosition + 'px';
      effectLevelDepth.style.width = effectLevelPin.style.left;
      imgUploadPreview.style.filter = getEffectsStyle(currentEffect, coordPin / effectLevelLine.offsetWidth);
    };

    const onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

// Эффект фото
  effectsRadio.forEach(function (effect) {
    effect.addEventListener('click', onChangeEffect);
  });

  // Хэштеги
  hashtags.addEventListener('input', function () {
    const string = hashtags.value;
    const hashtagsArray = string.split(' '); // Разбивает string на массив строк путём разделения строки указанной подстрокой ' '.
    let errorMessage = '';

    if (string !== '') {
      for (let i = 0; i < hashtagsArray.length; i++) {
        const tag = hashtagsArray[i];

        if (!REGEXP.test(tag)) {
          errorMessage = 'хештег должен начинаться с # и содержать только буквы или цифры. Длина от' + MIN_HASH_CHARACTERS + ' до ' + MAX_HASH_CHARACTERS + ' символов';
          break;
        } else if (hashtagsArray.length > MAX_HASH) {
          errorMessage = 'Нельзя указать больше ' + MAX_HASH + ' хэш-тегов!';
          break;
        } else if (hashtagsArray.indexOf(tag) !== hashtagsArray.lastIndexOf(tag)) {
          errorMessage = 'Хэш-Теги не должны повторяться!';
          break;
        } else if (tag.indexOf('#', 1) > 0) {
          errorMessage.setCustomValidity('Хэш-теги разделяются пробелами');
          break;
        }
      }
    }
    hashtags.setCustomValidity(errorMessage);
  });

  const createUploadMessage = function (message) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(message);
    mainContainer.appendChild(fragment);
  };

  const closeUploadMessage = function (message) {
    message.remove();
  };

  const onMessageEsc = function (evt, message) {
    if (evt.key === window.utils.keyEsc) {
      closeUploadMessage(message);
    }
  };

  const imgUploadReset = function () {
    imgUploadOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    imgUploadPreview.style.filter = 'none';
    scaleControlNumberValue = 100;
    uploadForm.reset();
    imgUploadSubmit.textContent = 'Опубликовать';
    imgUploadSubmit.disabled = false;
    document.removeEventListener('keydown', window.utils.closeModal);
  };

  const onUpload = function (message, button) {

    imgUploadReset();
    createUploadMessage(message);
    document.addEventListener('keydown', function (evt) {
      onMessageEsc(evt, message);
    });
    button.addEventListener('click', function () {
      closeUploadMessage(message);
    });
    document.addEventListener('click', function (evt) {
      const target = evt.target;
      if (target !== document.querySelector('.success__inner') && target !== document.querySelector('.error__inner')) {
        closeUploadMessage(message);
      }
    });
  };

  const onSuccessUpload = function () {
    onUpload(successMessageTemplate, successButtonClose);
  };

  const onErrorUpload = function () {
    onUpload(errorMessageTemplate, errorButtonClose);
  };

  const createLoadPhoto = function () {
    const photoUserTemplate = photoTemplateElement.cloneNode(true);
    photoUserTemplate.querySelector('.picture__img').src = imgUploadPreview.src;
    photoUserTemplate.querySelector('.picture__img').style.transform = imgUploadPreview.style.transform;
    photoUserTemplate.querySelector('.picture__img').style.filter = imgUploadPreview.style.filter;
    photoUserTemplate.querySelector('.picture__likes').textContent = 0;
    photoUserTemplate.querySelector('.picture__comments').textContent = 0;
    document.querySelector('.pictures').appendChild(photoUserTemplate);
  }

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    imgUploadSubmit.textContent = 'Загрузка...';
    imgUploadSubmit.disabled = true;
    window.backend.upload(new FormData(uploadForm), onSuccessUpload, onErrorUpload);
    createLoadPhoto();
  });

  // Сообщение об ошибке формата фотографии
  const errorMessage = function () {
    const error = errorMessageTemplate.cloneNode(true);
    error.querySelector('.error__title').textContent = 'Загрузите файл в формате "jpeg", "png"';
    document.body.append(error);
    error.querySelector('.error__button').addEventListener('click', function () {
      error.style.display = 'none';
    })
  }

  window.form = {
    createLoadPhoto: createLoadPhoto
  }

})();


