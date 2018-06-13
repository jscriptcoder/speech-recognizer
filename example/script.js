(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

exports.createSpeechRecognizer = createSpeechRecognizer;
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var DEFAULT_CONFIG = {
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
  lang: 'en',
  clsInput: 'speech-recognizer-input',
  clsInputRecognizing: 'speech-recognizer-input--recognizing',
  clsActivate: 'speech-recognizer-activate',
  clsActivateRecognizing: 'speech-recognizer-activate--recognizing',
  beforeSpeech: "Say what you want. I'm listening...",
  onstart: function onstart() {},
  onresult: function onresult() {},
  onend: function onend() {}
};

function createSpeechRecognizer(input) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  config = _extends({}, DEFAULT_CONFIG, config);

  if (SpeechRecognition) {

    var recognizer = {
      input: input,
      button: document.createElement('button'),
      recognizing: false,
      speech: new SpeechRecognition()
    };

    configureRecognizer(config, recognizer);
    setupControls(config, recognizer);

    return recognizer;
  } else {
    // Speech Recognition not supported
  }
}

function configureRecognizer(config, recognizer) {
  var speech = recognizer.speech;

  speech.continuous = config.continuous;
  speech.interimResults = config.interimResults;
  speech.maxAlternatives = config.maxAlternatives;
  speech.lang = config.lang;

  setupRecognizerListeners(config, recognizer);
}

function setupRecognizerListeners(config, recognizer) {
  var speech = recognizer.speech,
      input = recognizer.input,
      button = recognizer.button;

  // speech.onaudioend = _ => {
  //   console.log('onaudioend')
  // }
  //
  // speech.onaudiostart = _ => {
  //   console.log('onaudiostart')
  // }

  speech.onend = function (e) {
    // console.log('onend', e)

    recognizer.recognizing = false;
    input.placeholder = input.dataset['originalPlaceholder'];
    input.classList.remove(config.clsInputRecognizing);
    button.classList.remove(config.clsActivateRecognizing);

    config.onend(recognizer);
  };

  speech.onerror = function (e) {
    console.log('onerror', e);
  };

  // speech.onnomatch = _ => {
  //   console.log('onnomatch')
  // }

  speech.onresult = function (e) {
    console.log('onresult', e);

    input.value = toArray(e.results).reduce(function (acc, result) {
      if (result.isFinal) {
        return result[0].transcript;
      } else {
        return acc + result[0].transcript;
      }
    }, '');

    config.onresult(e, recognizer);
  };

  // speech.onsoundend = _ => {
  //   console.log('onsoundend')
  // }
  //
  // speech.onsoundstart = _ => {
  //   console.log('onsoundstart')
  // }
  //
  // speech.onspeechend = _ => {
  //   console.log('onspeechend')
  // }
  //
  // speech.onspeechstart = _ => {
  //   console.log('onspeechstart')
  // }

  speech.onstart = function (e) {
    // console.log('onstart', e)

    recognizer.recognizing = true;
    input.value = '';
    input.placeholder = config.beforeSpeech;
    input.classList.add(config.clsInputRecognizing);
    button.classList.add(config.clsActivateRecognizing);

    config.onstart(recognizer);
  };
}

function toArray(arrLike) {
  return [].slice.call(arrLike);
}

function setupControls(config, recognizer) {
  var input = recognizer.input,
      button = recognizer.button;

  input.classList.add(config.clsInput);
  button.classList.add(config.clsActivate);

  input.dataset['originalPlaceholder'] = input.placeholder;
  button.addEventListener('click', createClickHandler(recognizer));

  if (input.nextSibling) {
    input.parentNode.insertBefore(button, input.nextSibling);
  } else {
    input.parentNode.appendChild(button);
  }
}

function createClickHandler(recognizer) {
  var speech = recognizer.speech;

  return function (_) {
    if (recognizer.recognizing) {
      speech.stop();
    } else {
      speech.start();
    }
  };
}

module.exports = createSpeechRecognizer;

},{}],2:[function(require,module,exports){
'use strict';

var createSpeechRecognizer = require('../lib');

var input = document.getElementById('talk-to-me');
var notepad = document.getElementById('what-is-said');

var capitalize = function capitalize(s) {
  return s.replace(s.substr(0, 1), function (m) {
    return m.toUpperCase();
  });
};
var toArray = function toArray(arrLike) {
  return [].slice.call(arrLike);
};

createSpeechRecognizer(input, {
  onresult: function onresult(e, recognizer) {
    notepad.value = toArray(e.results).reduce(function (acc, result) {
      if (result.isFinal) {
        return '' + acc + result[0].transcript + '.';
      } else {
        return '' + acc + result[0].transcript;
      }
    }, '');

    notepad.scrollTop = notepad.scrollHeight;
  }
});

},{"../lib":1}]},{},[2]);
