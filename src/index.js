const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const DEFAULT_CONFIG = {
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
  lang: 'en',
  clsTrigger: 'speech-recognizer-trigger',
  clsTriggerRecognizing: 'speech-recognizer-trigger--recognizing',
  onaudiostart() {}, onaudioend() {},
  onstart() {}, onend() {},
  onsoundstart() {}, onsoundend() {},
  onspeechstart() {}, onspeechend() {},
  onresult() {},
  onerror() {},
  onnomatch() {},
}

export default function createSpeechRecognizer(trigger, config = {}) {
  config = { ...DEFAULT_CONFIG, ...config }

  if (SpeechRecognition) {

    // New recognizer instance
    const recognizer = {
      trigger, // Element that will trigger the speach recognition
      recognizing: false, // Will indicate whether or not we're listening

      // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/SpeechRecognition
      speech: new SpeechRecognition(),
    }

    configureRecognizer(config, recognizer)
    setupTrigger(config, recognizer)

    return recognizer

  } else {
    // Speech Recognition not supported
  }
}

function configureRecognizer(config, recognizer) {
  const { speech } = recognizer

  speech.continuous = config.continuous
  speech.interimResults = config.interimResults
  speech.maxAlternatives = config.maxAlternatives
  speech.lang = config.lang

  setupRecognizerListeners(config, recognizer)
}

function setupRecognizerListeners(config, recognizer) {
  const { speech, trigger } = recognizer

  speech.onaudiostart = config.onaudiostart
  speech.onaudioend = config.onaudioend
  speech.onerror = config.onerror
  speech.onnomatch = config.onnomatch
  speech.onsoundstart = config.onsoundstart
  speech.onsoundend = config.onsoundend
  speech.onspeechstart = config.onspeechstart
  speech.onspeechend = config.onspeechend

  speech.onend = e => {
    recognizer.recognizing = false // Indicates that we stop listening
    trigger.classList.remove(config.clsActivateRecognizing)
    config.onend(recognizer)
  }

  speech.onresult = e => {
    // TODO: think about this logic
    const transcript = toArray(e.results).reduce((acc, result) => {
      if (result.isFinal) {
        return result[0].transcript
      } else {
        return acc + result[0].transcript
      }
    }, '')

    config.onresult(e, recognizer)
  }

  speech.onstart = e => {
    recognizer.recognizing = true // Indicates that we're listening
    trigger.classList.add(config.clsActivateRecognizing)
    config.onstart(recognizer)
  }

}

function toArray(arrLike) {
  return [].slice.call(arrLike)
}

function setupControls(config, recognizer) {
  const { trigger } = recognizer
  trigger.classList.add(config.clsActivate)
  trigger.addEventListener('click', createTriggerHandler(recognizer))
}

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
