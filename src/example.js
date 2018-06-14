import createSpeechRecognizer from '../lib'

const notepad = document.getElementById('notepad')
const trigger = document.getElementById('trigger-recognition')

const capitalize = s => s.replace(s.substr(0, 1), m => m.toUpperCase())
const toArray = arrLike => [].slice.call(arrLike)

const results = []

createSpeechRecognizer(trigger, {
  continuous: true,
  onresult(results) {
    notepad.value = results.reduce((acc, result) => {
      if (result.isFinal) {
        return `${acc}${result.transcript}.`
      } else {
        return `${acc}${result.transcript}`
      }
    }, '')
  }
})
