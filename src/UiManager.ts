import { birdLists } from './birdLists.js';

/**
 * Class that manages some of the UI functionality, such as creating elements
 * and background colour flashes.
 */
export class UiManager {

  private birdListsDiv: HTMLElement;
  private quizDiv: HTMLElement;

  /**
   * Construct an instance of UiManager
   * @param startButtonCallback callback called when start button on lists page pressed
   * @param keyPressCallback callback called when key pressed in name input on quiz page
   * @param backCallback callback called when back button pressed on quiz page
   */
  constructor(startButtonCallback:()=>void, keyPressCallback:(key:KeyboardEvent)=>void, backCallback:()=>void) {
    this.createBirdLists();
    this.createStartButton(startButtonCallback);
    this.createQuizPage(keyPressCallback);
    this.createBackButton(backCallback);
    this.setQuizPageVisible(false);
  }

  /**
   * Add HTML elements for bird lists to page. By iterating through
   * birdLists array.
   */
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

  /**
   * Add one bird list to the page.
   * @param  listName  the name of this bird list
   * @param  birds     an array where each element is an array of names for a single species
   * @param  container the HTML element to add the list into
   */
  private addBirdList(listName: string, birds: string[][], container: HTMLElement) {
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

  /**
   * Add the start button to the page.
   * @param  callback function to be called when start button pressed
   */
  private createStartButton(callback:()=>void) {
    let button = document.createElement('button');
    button.onclick = callback;
    button.textContent = "Start";
    button.id = "startButton";
    this.birdListsDiv.appendChild(button);
    this.birdListsDiv.appendChild(document.createElement('hr'));
    this.birdListsDiv.appendChild(document.createElement('br'));
    let wikipediaLink = document.createElement('a');
    wikipediaLink.href = 'https://en.wikipedia.org/wiki/List_of_birds_of_Wales';
    wikipediaLink.textContent = "Bird lists obtained from Wikipedia";
    wikipediaLink.id = "wikipediaAttribution";
    this.birdListsDiv.appendChild(wikipediaLink);
    this.birdListsDiv.appendChild(document.createElement('br'));
    let githubLink = document.createElement('a');
    githubLink.href = 'https://github.com/brychanthomas/bird-quiz';
    this.birdListsDiv.appendChild(githubLink);
    let githubImage = document.createElement('img');
    githubImage.src = 'https://opengraph.githubassets.com/1/brychanthomas/bird-quiz';
    githubImage.id = 'githubImage';
    githubLink.appendChild(githubImage);
  }

  /**
   * Add elements for the quiz page to the page (name input, attribution text,
   * answer text, progress bar).
   * @param  callback function to be called when key pressed in text input
   */
  private createQuizPage(callback:(key:Event)=>void) {
    this.quizDiv = document.createElement('div');
    this.quizDiv.id = 'quizDiv';
    document.body.appendChild(this.quizDiv);
    let attributionText = document.createElement('span');
    attributionText.id = "attribution";
    this.quizDiv.appendChild(attributionText);
    let input = document.createElement('input');
    input.type = 'text';
    input.id = "birdNameInput";
    input.onkeydown = callback;
    this.quizDiv.appendChild(input);
    let answerText = document.createElement('span');
    answerText.style.display = 'none';
    answerText.id = "answerText";
    this.quizDiv.appendChild(answerText);
    let progressBarContainer = document.createElement('div');
    progressBarContainer.id = 'progressBarContainer';
    this.quizDiv.appendChild(progressBarContainer);
    let progressBar = document.createElement('div');
    progressBar.id = 'progressBar';
    progressBarContainer.appendChild(progressBar);
  }

  /**
   * Add the quiz page back button to the page.
   * @param  callback function to be called when back button pressed
   */
  private createBackButton(callback: ()=>void) {
    var back = document.createElement('button');
    back.onclick = callback;
    back.textContent = 'Back';
    this.quizDiv.insertBefore(back, this.quizDiv.firstChild);
  }

  /**
   * Get the list of birds that are currently selected.
   * @return array where each element is an array of names for a certain species
   */
  public getSelectedBirds(): string[][] {
    var checkedBoxes = document.querySelectorAll('input:checked');
    var birds = [];
    for (var bird of checkedBoxes) {
      if ((<HTMLInputElement>bird).name !== "format" && (<HTMLInputElement>bird).name !== "selectAll") {
        birds.push(JSON.parse((<HTMLInputElement>bird).value))
      }
    }
    return birds;
  }

  /**
   * Get which format is currently selected.
   * @return the format that is currently selected (pictures or sounds)
   */
  public getSelectedFormat(): 'pictures'|'sounds' {
    var checkedRadio = document.querySelectorAll('input[name=format]:checked');
    return (<HTMLInputElement>checkedRadio[0]).value === 'sounds' ? 'sounds' : 'pictures';
  }

  /**
   * Make the bird lists page visible/invisible.
   * @param  visible whether to make the bird lists visible (true) or invisible (false)
   */
  public setBirdListsVisible(visible: boolean) {
    this.birdListsDiv.style.display = (visible ? 'block' : 'none');
  }

  /**
   * Make the quiz page visible/invisible.
   * @param  visible whether to make the quiz page visible (true) or invisible (false)
   */
  public setQuizPageVisible(visible: boolean) {
    this.quizDiv.style.display = (visible ? 'block' : 'none');
    var progressBar = document.getElementById("progressBar");
    progressBar.style.width = '0%';
    progressBar.textContent = '';
    document.getElementById("image").style.display = (visible ? 'block' : 'none');
  }

  /**
   * Get the text currently typed into the bird name input and clear it.
   * @return text user has typed into input
   */
  public getAndClearTextInput() {
    var input = <HTMLInputElement>document.getElementById('birdNameInput');
    var text = input.value;
    input.value = '';
    return text;
  }

  /**
   * Show answer to question and change background colour
   * @param  text   answer to question
   * @param  colour colour to make background
   */
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

  /**
   * Hide the answer text and fade the background back to normal colour.
   */
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

  /**
   * Set percentage of progress bar on quiz page.
   * @param  percentage value betewen 0 and 100 to set progress bar to
   */
  public setProgressBar(percentage: number) {
    var bar = document.getElementById("progressBar");
    bar.style.width = percentage + '%';
    bar.textContent = Math.round(percentage) + '%';
  }
}
