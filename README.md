# Speech Recognizer
Voice to text using HTML5 Speech Recognition API.

[Demo here]()

## Motivation
No many people know there is a nice Speech Recognition API built-in right in the browser. Maybe some pre-trained model?, RNN/LSTM architecture?. Support is not the best, but hey! why not to provide with it if it's there?. Might be very useful. Anyway, this was more for me to explore this API and learn about it. So I decided to build a wrapper to this API, and make it a bit more user friendly ;-)

## API
The library exposes ony one factory function (I simply don't like classes):
```ts
createSpeechRecognizer(trigger: HTMLElement, config: RecognizerConfig): Recognizer
```
`trigger` is the element that will be used to start (and stop) manually the speech recognition. `Recognizer` instance has the following interface:
```ts
interface Recognizer {
  trigger: HTMLElement;
  
  // Will indicate whether or not the recognizer is listening
  recognizing: boolean;
  
  // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/SpeechRecognition
  speech: SpeechRecognition;
}
```
`config` contains the configuration items for the `recognizer`. Here is in more details:
```ts
interface RecognizerConfig {
  // Controls whether continuous results are returned for each recognition, or
  // only a single result.
  continuous: boolean;

  // Controls whether interim results should be returned (true) or not (false).
  // Interim results are results that are not yet final.
  interimResults: boolean;

  // Sets the maximum number of SpeechRecognitionAlternatives provided per
  // SpeechRecognitionResult.
  maxAlternatives: number;

  // Sets the language of the current SpeechRecognition. If not specified, this
  // defaults to the HTML lang attribute value, or the user agent's language
  // setting if that isn't set either.
  lang: string;

  // CSS class for the trigger element.
  clsTrigger: string;

  // CSS class for the trigger element indicating we're listening
  clsTriggerRecognizing: string;

  // Will run when the user agent has started to capture audio.
  onaudiostart(event: SpeechRecognitionEvent, recognizer: Recognizer): void;

  // Will run when the user agent has finished capturing audio.
  onaudioend(event: SpeechRecognitionEvent, recognizer: Recognizer): void;

   // Will run when the speech recognition service has begun listening to
   // incoming audio with intent to recognize grammars associated with the
   // current SpeechRecognition.
  onstart(event: SpeechRecognitionEvent, recognizer: Recognizer): void;

   // Will run when the speech recognition service has disconnected.
  onend(event: SpeechRecognitionEvent, recognizer: Recognizer): void;

  // Will run when any sound — recognisable speech or not — has been detected.
  onsoundstart(event: SpeechRecognitionEvent, recognizer: Recognizer): void;

  // Will run when the user agent has finished capturing audio.
  onsoundend(event: SpeechRecognitionEvent, recognizer): void;

  // Will run when sound recognised by the speech recognition service as speech
  // has been detected.
  onspeechstart(event: SpeechRecognitionEvent, recognizer: Recognizer): void;

  // Will run when speech recognised by the speech recognition service has
  // stopped being detected.
  onspeechend(event: SpeechRecognitionEvent, recognizer: Recognizer): void;

  // Will run when the speech recognition service returns a result — a word or
  // phrase has been positively recognized and this has been communicated back
  // to the app.
  onresult(transcription: SpeechRecognitionResultList, idx: number, event, recognizer): void;

  // Will run when a speech recognition error occurs.
  onerror(event: SpeechRecognitionEvent, recognizer: Recognizer): void;

  // Will run when the speech recognition service returns a final result with
  // no significant recognition.
  onnomatch(event: SpeechRecognitionEvent, recognizer: Recognizer): void;
}
```
