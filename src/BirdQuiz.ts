import { Species } from './Species.js';
import { UiManager } from './UiManager.js'

export class BirdQuiz {

  private ui: UiManager;
  private speciesList: Species[];
  private currentSpecies: Species;

  constructor() {
    this.ui = new UiManager(this.startQuiz.bind(this), this.onKeyPress.bind(this), this.backToLists.bind(this));
    this.speciesList = [];
  }

  startQuiz() {
    this.ui.setBirdListsVisible(false);
    for (var bird of this.ui.getSelectedBirds()) {
      this.speciesList.push(new Species(bird));
    }
    this.ui.setQuizPageVisible(true);
    this.askQuestion();
  }

  onKeyPress(event) {
    if (event.keyCode === 13) {
      if (this.ui.getTextInput().toLowerCase() === this.currentSpecies.getName().toLowerCase()) {
        console.log("correct");
      } else {
        console.log("incorrect");
      }
      setTimeout(this.askQuestion.bind(this), 2000);
    }
  }

  askQuestion() {
    var speciesIndex = Math.floor(Math.random()*this.speciesList.length);
    console.log(this.speciesList);
    console.log(this.speciesList[speciesIndex]);
    this.speciesList[speciesIndex].playSound();
    this.currentSpecies = this.speciesList[speciesIndex];
  }

  backToLists() {
    this.currentSpecies.stopSound();
    this.ui.setQuizPageVisible(false);
    this.ui.setBirdListsVisible(true);
  }

}
