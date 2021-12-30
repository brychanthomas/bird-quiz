import { birdLists } from './birdLists.js';

export class UiManager {
  constructor() {
    this.createBirdLists();
  }

  private createBirdLists() {
    var birdListsDiv = document.createElement('div');
    birdListsDiv.id = 'birdListsDiv';
    document.body.appendChild(birdListsDiv);

    for (var list of birdLists) {
      var title = document.createElement('h2')
      title.textContent = list.name;
      birdListsDiv.appendChild(title);

      for (var bird of list.birds) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = bird;
        checkbox.name = bird;
        birdListsDiv.appendChild(checkbox);
        var label = document.createElement('label');
        label.textContent = bird;
        birdListsDiv.appendChild(label);
        birdListsDiv.appendChild(document.createElement('br'));
      }
    }
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
    document.getElementById('birdListsDiv').style.display = (visible ? 'block' : 'none');
  }
}
