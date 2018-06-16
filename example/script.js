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

exports.default = createSpeechRecognizer;
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

/**
 * Configuration with default values
 * @type {RecognizerConfig}
 */
var DEFAULT_CONFIG = {
  // Controls whether continuous results are returned for each recognition, or
  // only a single result.
  continuous: false,

  // Controls whether interim results should be returned (true) or not (false).
  // Interim results are results that are not yet final.
  interimResults: true,

  // Sets the maximum number of SpeechRecognitionAlternatives provided per
  // SpeechRecognitionResult.
  maxAlternatives: 1,

  // Sets the language of the current SpeechRecognition. If not specified, this
  // defaults to the HTML lang attribute value, or the user agent's language
  // setting if that isn't set either.
  lang: 'en',

  // CSS class for the trigger element.
  clsTrigger: 'speech-recognizer-trigger',

  // CSS class for the trigger element indicating we're listening
  clsTriggerRecognizing: 'speech-recognizer-trigger--recognizing',

  // CSS class for the trigger element indicating no support.
  clsTriggerNoSupport: 'speech-recognizer-trigger--no-support',

  /**
   * Will run when the user agent has started to capture audio.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onaudiostart: function onaudiostart(event, recognizer) {},

  /**
   * Will run when the user agent has finished capturing audio.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onaudioend: function onaudioend(event, recognizer) {},

  /**
   * Will run when the speech recognition service has begun listening to
   * incoming audio with intent to recognize grammars associated with the
   * current SpeechRecognition.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onstart: function onstart(event, recognizer) {},

  /**
   * Will run when the speech recognition service has disconnected.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onend: function onend(event, recognizer) {},

  /**
   * Will run when any sound — recognisable speech or not — has been detected.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onsoundstart: function onsoundstart(event, recognizer) {},

  /**
   * Will run when the user agent has finished capturing audio.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onsoundend: function onsoundend(event, recognizer) {},

  /**
   * Will run when sound recognised by the speech recognition service as speech
   * has been detected.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onspeechstart: function onspeechstart(event, recognizer) {},

  /**
   * Will run when speech recognised by the speech recognition service has
   * stopped being detected.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onspeechend: function onspeechend(event, recognizer) {},

  /**
   * Will run when the speech recognition service returns a result — a word or
   * phrase has been positively recognized and this has been communicated back
   * to the app.
   * @param {RecognizerResultList} results
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onresult: function onresult(results, idx, event, recognizer) {},

  /**
   * Will run when a speech recognition error occurs.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onerror: function onerror(event, recognizer) {},

  /**
   * Will run when the speech recognition service returns a final result with
   * no significant recognition.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onnomatch: function onnomatch(event, recognizer) {}
};

/**
 * Factory function returning a new recognizer instance.
 * @param {HTMLElement} trigger
 * @param {RecognizerConfig} config
 * @returns {Recognizer}
 */
function createSpeechRecognizer(trigger) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  config = _extends({}, DEFAULT_CONFIG, config);

  if (SpeechRecognition) {

    // Recognizer instance
    var recognizer = {
      trigger: trigger, // HTMLElement that will trigger the speach recognition
      recognizing: false, // Will indicate whether or not we're listening

      // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/SpeechRecognition
      speech: new SpeechRecognition()
    };

    configureRecognizer(config, recognizer);
    setupTrigger(config, recognizer);

    return recognizer;
  } else {
    trigger.classList.add(config.clsTriggerNoSupport);
  }
}

/**
 * @param {RecognizerConfig} config
 * @param {Recognizer} recognizer
 */
function configureRecognizer(config, recognizer) {
  var speech = recognizer.speech;

  speech.continuous = config.continuous;
  speech.interimResults = config.interimResults;
  speech.maxAlternatives = config.maxAlternatives;
  speech.lang = config.lang;

  setupRecognizerListeners(config, recognizer);
}

/**
 * @param {RecognizerConfig} config
 * @param {Recognizer} recognizer
 */
function setupRecognizerListeners(config, recognizer) {
  var speech = recognizer.speech,
      trigger = recognizer.trigger;

  speech.onaudiostart = function (event) {
    return config.onaudiostart(event, recognizer);
  };
  speech.onaudioend = function (event) {
    return config.onaudioend(event, recognizer);
  };
  speech.onerror = function (event) {
    return config.onerror(event, recognizer);
  };
  speech.onnomatch = function (event) {
    return config.onnomatch(event, recognizer);
  };
  speech.onsoundstart = function (event) {
    return config.onsoundstart(event, recognizer);
  };
  speech.onsoundend = function (event) {
    return config.onsoundend(event, recognizer);
  };
  speech.onspeechstart = function (event) {
    return config.onspeechstart(event, recognizer);
  };
  speech.onspeechend = function (event) {
    return config.onspeechend(event, recognizer);
  };

  speech.onend = function (event) {
    recognizer.recognizing = false; // Indicates we are no longer listening
    trigger.classList.remove(config.clsTriggerRecognizing);
    config.onend(event, recognizer);
  };

  speech.onresult = function (event) {

    // Let's do a results clean-up
    var results = toArray(event.results).slice(event.resultIndex) // Takes transcriptions that are relevant
    .map(function (result) {
      return {
        transcript: result[0].transcript,
        confidence: result[0].confidence,
        isFinal: result.isFinal
      };
    });

    config.onresult(results, event, recognizer);
  };

  speech.onstart = function (event) {
    recognizer.recognizing = true; // Indicates we're listening
    trigger.classList.add(config.clsTriggerRecognizing);
    config.onstart(event, recognizer);
  };
}

/**
 * Turns array-like objects into true arrays
 * @param {any} arrLike
 * @returns {Array}
 */
function toArray(arrLike) {
  return [].slice.call(arrLike);
}

/**
 * @param {RecognizerConfig} config
 * @param {Recognizer} recognizer
 */
function setupTrigger(config, recognizer) {
  var trigger = recognizer.trigger;

  trigger.classList.add(config.clsTrigger);
  trigger.addEventListener('click', createTriggerHandler(recognizer));
}

/**
 * @param {Recognizer} recognizer
 * @returns {Function} onclick handler
 */
function createTriggerHandler(recognizer) {
  var speech = recognizer.speech;

  return function (_) {
    if (recognizer.recognizing) {
      speech.stop();
    } else {
      speech.start();
    }
  };
}

},{}],2:[function(require,module,exports){
'use strict';

var _lib = require('../lib');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notepad = document.getElementById('notepad');
var trigger = document.getElementById('trigger-recognition');

var capitalize = function capitalize(s) {
  return s.replace(s.trim().substr(0, 1), function (m) {
    return m.toUpperCase();
  });
};
var toArray = function toArray(arrLike) {
  return [].slice.call(arrLike);
};

var results = [];

var notepadText = notepad.value;

// There is an issue in mobile Chrome for Android:
// https://stackoverflow.com/questions/35112561/speech-recognition-api-duplicated-phrases-on-android
var lastTranscript = ''; // We need to sort of debounce this guy

(0, _lib2.default)(trigger, {
  continuous: true,
  onresult: function onresult(results) {
    var transcription = results.reduce(function (acc, result) {
      return {
        transcript: result.isFinal ? result.transcript + '.' : acc.transcript + result.transcript,

        isFinal: result.isFinal
      };
    }, { transcript: '', isFinal: false });

    if (transcription.transcript !== lastTranscript) {

      lastTranscript = transcription.transcript;

      var transcript = capitalize(transcription.transcript);
      if (transcription.isFinal) {
        notepad.value = notepadText += transcript;
      } else {
        notepad.value = notepadText + transcript;
      }
    }
  }
});

},{"../lib":1}]},{},[2]);
