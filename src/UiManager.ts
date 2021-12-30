import { birdLists } from './birdLists.js';

export class UiManager {

  private birdListsDiv: HTMLElement;
  private quizDiv: HTMLElement;

  constructor(startButtonCallback:()=>void, keyPressCallback:(key)=>void) {
    this.createBirdLists();
    this.createStartButton(startButtonCallback);
    this.createQuizPage(keyPressCallback);
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
        checkbox.value = bird;
        checkbox.name = bird;
        this.birdListsDiv.appendChild(checkbox);
        var label = document.createElement('label');
        label.textContent = bird;
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
  }

  public getTextInput() {
    var input = <HTMLInputElement>document.getElementById('birdNameInput');
    return input.value;
  }
}
