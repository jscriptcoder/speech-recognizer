const createSpeechRecognizer = require('../lib')

const input = document.getElementById('talk-to-me')
const notepad = document.getElementById('what-is-said')

const capitalize = s => s.replace(s.substr(0, 1), m => m.toUpperCase())
const toArray = arrLike => [].slice.call(arrLike)

createSpeechRecognizer(input, {
  onresult(e, recognizer) {
    notepad.value = toArray(e.results).reduce((acc, result) => {
      if (result.isFinal) {
        return `${acc}${result[0].transcript}.`
      } else {
        return `${acc}${result[0].transcript}`
      }
    }, '')

    notepad.scrollTop = notepad.scrollHeight
  }
})
