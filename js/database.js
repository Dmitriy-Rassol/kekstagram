'use strict';

(function () {
  const URL = 'https://javascript.pages.academy/kekstagram';
  const URL_DATA = './js/data';
  const METHOD = {
    GET: 'GET',
    POST: 'POST'
  };
  const StatusCode = {
    OK: 200
  };
  const TIMEOUT = 10000;
  let database = '';
  const createResponse = function (onSuccess, onError, method, url, data) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        database = xhr.response;
        onSuccess(database);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Время ответа от сервера привысило ' + xhr.timeout / 10 + ' сек');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(method, url);
    xhr.send(data);
  };

const load = function (onSuccess, onError) {
    createResponse(onSuccess, onError, METHOD.GET, URL_DATA);
  };

const upload = function (data, onSuccess, onError) {
    createResponse(onSuccess, onError, METHOD.POST, URL, data);
  };

  window.backend = {
    load: load,
    upload: upload,
    db: database.length
  };
})();

