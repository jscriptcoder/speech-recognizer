const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const DEFAULT_CONFIG = {
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
  lang: 'en',
  clsInput: 'speech-recognizer-input',
  clsInputRecognizing: 'speech-recognizer-input--recognizing',
  clsActivate: 'speech-recognizer-activate',
  clsActivateRecognizing: 'speech-recognizer-activate--recognizing',
  beforeSpeech: "Say what you want. I'm listening...",
  onstart() {},
  onresult() {},
  onend() {},
}

export function createSpeechRecognizer(input, config = {}) {
  config = { ...DEFAULT_CONFIG, ...config }

  if (SpeechRecognition) {

    const recognizer = {
      input,
      button: document.createElement('button'),
      recognizing: false,
      speech: new SpeechRecognition(),
    }

    configureRecognizer(config, recognizer)
    setupControls(config, recognizer)

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
  const { speech, input, button } = recognizer

  // speech.onaudioend = _ => {
  //   console.log('onaudioend')
  // }
  //
  // speech.onaudiostart = _ => {
  //   console.log('onaudiostart')
  // }

  speech.onend = e => {
    // console.log('onend', e)

    recognizer.recognizing = false
    input.placeholder = input.dataset['originalPlaceholder']
    input.classList.remove(config.clsInputRecognizing)
    button.classList.remove(config.clsActivateRecognizing)

    config.onend(recognizer)
  }

  speech.onerror = e => {
    console.log('onerror', e)
  }

  // speech.onnomatch = _ => {
  //   console.log('onnomatch')
  // }

  speech.onresult = e => {
    console.log('onresult', e)

    input.value = toArray(e.results).reduce((acc, result) => {
      if (result.isFinal) {
        return result[0].transcript
      } else {
        return acc + result[0].transcript
      }
    }, '')

    config.onresult(e, recognizer)
  }

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

  speech.onstart = e => {
    // console.log('onstart', e)

    recognizer.recognizing = true
    input.value = ''
    input.placeholder = config.beforeSpeech
    input.classList.add(config.clsInputRecognizing)
    button.classList.add(config.clsActivateRecognizing)

    config.onstart(recognizer)
  }

}

function toArray(arrLike) {
  return [].slice.call(arrLike)
}

function setupControls(config, recognizer) {
  const { input, button } = recognizer

  input.classList.add(config.clsInput)
  button.classList.add(config.clsActivate)

  input.dataset['originalPlaceholder'] = input.placeholder
  button.addEventListener('click', createClickHandler(recognizer))

  if (input.nextSibling) {
    input.parentNode.insertBefore(button, input.nextSibling)
  } else {
    input.parentNode.appendChild(button)
  }

}

function createClickHandler(recognizer) {
  const { speech } = recognizer

  return _ => {
    if (recognizer.recognizing) {
      speech.stop()
    } else {
      speech.start()
    }
  }
}

module.exports = createSpeechRecognizer
