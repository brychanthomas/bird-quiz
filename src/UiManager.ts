import { birdLists } from './birdLists.js';

export class UiManager {

  private birdListsDiv: HTMLElement;
  private quizDiv: HTMLElement;

  constructor(startButtonCallback:()=>void, keyPressCallback:(key)=>void, backCallback:()=>void) {
    this.createBirdLists();
    this.createStartButton(startButtonCallback);
    this.createQuizPage(keyPressCallback);
    this.createBackButton(backCallback);
    this.setQuizPageVisible(false);
  }

  private createBirdLists() {
    this.birdListsDiv = document.createElement('div');
    this.birdListsDiv.id = 'birdListsDiv';
    document.body.appendChild(this.birdListsDiv);

    for (var list of birdLists) {
      var title = document.createElement('h2')
      title.textContent = list.name;
      this.birdListsDiv.appendChild(title);

      for (var bird of list.birds) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = bird;
        checkbox.value = bird;
        this.birdListsDiv.appendChild(checkbox);
        var label = document.createElement('label');
        label.textContent = bird;
        label.htmlFor = bird;
        this.birdListsDiv.appendChild(label);
        this.birdListsDiv.appendChild(document.createElement('br'));
      }
    }
  }

  private createStartButton(callback:()=>void) {
    var button = document.createElement('button');
    button.onclick = callback;
    button.textContent = "Start";
    this.birdListsDiv.appendChild(button);
  }

  private createQuizPage(callback:(key:Event)=>void) {
    this.quizDiv = document.createElement('div');
    this.quizDiv.id = 'quizDiv';
    document.body.appendChild(this.quizDiv);
    var input = document.createElement('input');
    input.type = 'text';
    input.id = "birdNameInput";
    input.onkeypress = callback;
    this.quizDiv.appendChild(input);
    var answerText = document.createElement('span');
    answerText.style.display = 'none';
    answerText.id = "answerText";
    this.quizDiv.appendChild(answerText);
    var progressBarContainer = document.createElement('div');
    progressBarContainer.id = 'progressBarContainer';
    this.quizDiv.appendChild(progressBarContainer);
    var progressBar = document.createElement('div');
    progressBar.id = 'progressBar';
    progressBarContainer.appendChild(progressBar);
  }

  private createBackButton(callback: ()=>void) {
    var back = document.createElement('button');
    back.onclick = callback;
    back.textContent = 'Back';
    this.quizDiv.insertBefore(back, this.quizDiv.firstChild);
  }

  public getSelectedBirds(): string[] {
    var checkedBoxes = document.querySelectorAll('input:checked');
    var birds = [];
    for (var bird of checkedBoxes) {
      birds.push((<HTMLInputElement>bird).value);
    }
    return birds;
  }

  public setBirdListsVisible(visible: boolean) {
    this.birdListsDiv.style.display = (visible ? 'block' : 'none');
  }

  public setQuizPageVisible(visible: boolean) {
    this.quizDiv.style.display = (visible ? 'block' : 'none');
    var progressBar = document.getElementById("progressBar");
    progressBar.style.width = '0%';
    progressBar.textContent = '';
  }

  public getAndClearTextInput() {
    var input = <HTMLInputElement>document.getElementById('birdNameInput');
    var text = input.value;
    input.value = '';
    return text;
  }

  public showAnswer(text, colour) {
    var answerText = document.getElementById("answerText");
    answerText.textContent = text;
    answerText.style.display = 'block';
    var colourFlasher = document.getElementById("colourFlasher");
    colourFlasher.style.backgroundColor = colour;
    colourFlasher.style.display = 'block';
    var timer = setInterval(function() {
      colourFlasher.style.opacity = String(Number(colourFlasher.style.opacity)+0.1);
      if (Number(colourFlasher.style.opacity) === 1) {
        clearInterval(timer);
      }
    }, 15);
  }

  public hideAnswer() {
    document.getElementById("answerText").style.display = 'none';
    var colourFlasher = document.getElementById("colourFlasher");
    var timer = setInterval(function() {
      colourFlasher.style.opacity = String(Number(colourFlasher.style.opacity)-0.1);
      if (Number(colourFlasher.style.opacity) === 0) {
        clearInterval(timer);
      }
    }, 15);
  }

  public setProgressBar(percentage) {
    var bar = document.getElementById("progressBar");
    bar.style.width = percentage + '%';
    bar.textContent = Math.round(percentage) + '%';
  }
}
