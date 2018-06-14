const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

/**
 * Configuration with default values
 * @type {RecognizerConfig}
 */
const DEFAULT_CONFIG = {
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

  /**
   * Will run when the user agent has started to capture audio.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onaudiostart(event, recognizer) {},

  /**
   * Will run when the user agent has finished capturing audio.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onaudioend(event, recognizer) {},

  /**
   * Will run when the speech recognition service has begun listening to
   * incoming audio with intent to recognize grammars associated with the
   * current SpeechRecognition.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onstart(event, recognizer) {},

  /**
   * Will run when the speech recognition service has disconnected.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onend(event, recognizer) {},

  /**
   * Will run when any sound — recognisable speech or not — has been detected.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onsoundstart(event, recognizer) {},

  /**
   * Will run when the user agent has finished capturing audio.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onsoundend(event, recognizer) {},

  /**
   * Will run when sound recognised by the speech recognition service as speech
   * has been detected.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onspeechstart(event, recognizer) {},

  /**
   * Will run when speech recognised by the speech recognition service has
   * stopped being detected.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onspeechend(event, recognizer) {},

  /**
   * Will run when the speech recognition service returns a result — a word or
   * phrase has been positively recognized and this has been communicated back
   * to the app.
   * @param {SpeechRecognitionResultList} results
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onresult(transcription, idx, event, recognizer) {},

  /**
   * Will run when a speech recognition error occurs.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onerror(event, recognizer) {},

  /**
   * Will run when the speech recognition service returns a final result with
   * no significant recognition.
   * @param {SpeechRecognitionEvent} event
   * @param {Recognizer} recognizer
   */
  onnomatch(event, recognizer) {},
}

/**
 * Factory function returning a new recognizer instance.
 * @param {HTMLElement} trigger
 * @param {RecognizerConfig} config
 * @returns {Recognizer}
 */
export default function createSpeechRecognizer(trigger, config = {}) {
  config = { ...DEFAULT_CONFIG, ...config }

  if (SpeechRecognition) {

    // Recognizer instance
    const recognizer = {
      trigger, // HTMLElement that will trigger the speach recognition
      recognizing: false, // Will indicate whether or not we're listening

      // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/SpeechRecognition
      speech: new SpeechRecognition(),
    }

    configureRecognizer(config, recognizer)
    setupTrigger(config, recognizer)

    return recognizer

  } else {
    // TODO: Speech Recognition not supported
  }
}


/**
 * @param {RecognizerConfig} config
 * @param {Recognizer} recognizer
 */
function configureRecognizer(config, recognizer) {
  const { speech } = recognizer

  speech.continuous = config.continuous
  speech.interimResults = config.interimResults
  speech.maxAlternatives = config.maxAlternatives
  speech.lang = config.lang

  setupRecognizerListeners(config, recognizer)
}

/**
 * @param {RecognizerConfig} config
 * @param {Recognizer} recognizer
 */
function setupRecognizerListeners(config, recognizer) {
  const { speech, trigger } = recognizer

  speech.onaudiostart = event => config.onaudiostart(event, recognizer)
  speech.onaudioend = event => config.onaudioend(event, recognizer)
  speech.onerror = event => config.onerror(event, recognizer)
  speech.onnomatch = event => config.onnomatch(event, recognizer)
  speech.onsoundstart = event => config.onsoundstart(event, recognizer)
  speech.onsoundend = event => config.onsoundend(event, recognizer)
  speech.onspeechstart = event => config.onspeechstart(event, recognizer)
  speech.onspeechend = event => config.onspeechend(event, recognizer)

  speech.onend = event => {
    recognizer.recognizing = false // Indicates we are no longer listening
    trigger.classList.remove(config.clsTriggerRecognizing)
    config.onend(event, recognizer)
  }

  speech.onresult = event => {

    // Let's do a results clean-up
    const results = toArray(event.results)
      .slice(event.resultIndex) // Takes transcriptions that are relevant
      .map(result => ({
        transcript: result[0].transcript,
        confidence: result[0].confidence,
        isFinal: result.isFinal
      }))

    config.onresult(results, event, recognizer)
  }

  speech.onstart = event => {
    recognizer.recognizing = true // Indicates we're listening
    trigger.classList.add(config.clsTriggerRecognizing)
    config.onstart(event, recognizer)
  }

}

/**
 * Turns array-like objects into true arrays
 * @param {any} arrLike
 * @returns {Array}
 */
function toArray(arrLike) {
  return [].slice.call(arrLike)
}

/**
 * @param {RecognizerConfig} config
 * @param {Recognizer} recognizer
 */
function setupTrigger(config, recognizer) {
  const { trigger } = recognizer
  trigger.classList.add(config.clsTrigger)
  trigger.addEventListener('click', createTriggerHandler(recognizer))
}

/**
 * @param {Recognizer} recognizer
 * @returns {Function} onclick handler
 */
function createTriggerHandler(recognizer) {
  const { speech } = recognizer

  return _ => {
    if (recognizer.recognizing) {
      speech.stop()
    } else {
      speech.start()
    }
  }
}
