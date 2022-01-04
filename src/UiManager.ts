import { birdLists } from './birdLists.js';

export class UiManager {

  private birdListsDiv: HTMLElement;
  private quizDiv: HTMLElement;

  constructor(startButtonCallback:()=>void, keyPressCallback:(key:KeyboardEvent)=>void, backCallback:()=>void) {
    this.createBirdLists();
    this.createStartButton(startButtonCallback);
    this.createQuizPage(keyPressCallback);
    this.createBackButton(backCallback);
    this.setQuizPageVisible(false);
  }

  private createBirdLists() {
    this.birdListsDiv = document.getElementById('birdListsDiv');
    let table = document.createElement('table');
    this.birdListsDiv.appendChild(table);
    let row = document.createElement('tr');
    table.appendChild(row);
    let left = document.createElement('td');
    row.appendChild(left);
    let right = document.createElement('td');
    row.appendChild(right);
    var leftFlag = true;
    for (var list of birdLists) {
      let activeCol = right;
      if (leftFlag) {
        activeCol = left;
      }
      leftFlag = !leftFlag;

      this.addBirdList(list.name, list.birds, activeCol);
    }

    var title = document.createElement('h2')
    title.textContent = "Format";
    this.birdListsDiv.appendChild(title);
    this.birdListsDiv.appendChild(document.createElement('br'));
    for (var itm of ['Pictures', 'Sounds']) {
      var checkbox = document.createElement('input');
      checkbox.type = 'radio';
      checkbox.id = itm;
      checkbox.name = "format";
      checkbox.value = itm.toLowerCase();
      if (itm === 'Pictures') {
        checkbox.checked = true;
      }
      this.birdListsDiv.appendChild(checkbox);
      var label = document.createElement('label');
      label.textContent = itm;
      label.htmlFor = itm;
      this.birdListsDiv.appendChild(label);
      this.birdListsDiv.appendChild(document.createElement('br'));
    }
  }

  private addBirdList(listName, birds, container) {
    var checkbox = document.createElement('input'); //select all checkbox
    checkbox.type = 'checkbox';
    checkbox.id = listName + "selectAll";
    checkbox.name = "selectAll";

    var label = document.createElement('label');
    var title = document.createElement('h2');
    title.appendChild(checkbox);
    title.innerHTML += listName;
    label.htmlFor = listName + "selectAll";
    label.onclick = function(event: PointerEvent) {
      for (var c of document.getElementsByName(this)) {
        (<HTMLInputElement>c).checked = (<HTMLInputElement>event.target).checked;
      }
    }.bind(listName);
    label.appendChild(title);
    container.appendChild(label);
    container.appendChild(document.createElement('br'));

    for (var bird of birds) {
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = bird[0];
      checkbox.name = listName;
      checkbox.value = JSON.stringify(bird);
      container.appendChild(checkbox);
      var label = document.createElement('label');
      label.textContent = bird[0];
      label.htmlFor = bird[0];
      container.appendChild(label);
      container.appendChild(document.createElement('br'));
    }
  }

  private createStartButton(callback:()=>void) {
    var button = document.createElement('button');
    button.onclick = callback;
    button.textContent = "Start";
    button.id = "startButton";
    this.birdListsDiv.appendChild(button);
    this.birdListsDiv.appendChild(document.createElement('br'));
    var wikipediaLink = document.createElement('a');
    wikipediaLink.href = 'https://en.wikipedia.org/wiki/List_of_birds_of_Wales';
    wikipediaLink.textContent = "Bird lists obtained from Wikipedia";
    wikipediaLink.id = "wikipediaAttribution";
    this.birdListsDiv.appendChild(wikipediaLink);
  }

  private createQuizPage(callback:(key:Event)=>void) {
    this.quizDiv = document.createElement('div');
    this.quizDiv.id = 'quizDiv';
    document.body.appendChild(this.quizDiv);
    var attributionText = document.createElement('span');
    attributionText.id = "attribution";
    this.quizDiv.appendChild(attributionText);
    var input = document.createElement('input');
    input.type = 'text';
    input.id = "birdNameInput";
    input.onkeydown = callback;
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
      if ((<HTMLInputElement>bird).name !== "format" && (<HTMLInputElement>bird).name !== "selectAll") {
        birds.push((<HTMLInputElement>bird).value);
      }
    }
    return birds;
  }

  public getSelectedFormat(): 'pictures'|'sounds' {
    var checkedRadio = document.querySelectorAll('input[name=format]:checked');
    return (<HTMLInputElement>checkedRadio[0]).value === 'sounds' ? 'sounds' : 'pictures';
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

  public showAnswer(text: string, colour: string) {
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

  public setProgressBar(percentage: number) {
    var bar = document.getElementById("progressBar");
    bar.style.width = percentage + '%';
    bar.textContent = Math.round(percentage) + '%';
  }
}
