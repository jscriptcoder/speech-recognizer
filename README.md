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
```
