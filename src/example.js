import createSpeechRecognizer from '../lib'

const notepad = document.getElementById('notepad')
const trigger = document.getElementById('trigger-recognition')

const capitalize = s => s.replace(s.trim().substr(0, 1), m => m.toUpperCase())
const toArray = arrLike => [].slice.call(arrLike)

const results = []

let notepadText = notepad.value

createSpeechRecognizer(trigger, {
  continuous: true,
  onresult(results) {
    const transcription = results.reduce((acc, result) => {
      return {
        transcript: result.isFinal
          ? `${result.transcript}.`
          : acc.transcript + result.transcript,

        isFinal: result.isFinal
      }
    }, { transcript: '', isFinal: false })

    const transcript = capitalize(transcription.transcript)
    if (transcription.isFinal) {
      notepad.value = notepadText += transcript
    } else {
      notepad.value = notepadText + transcript
    }

  }
})
