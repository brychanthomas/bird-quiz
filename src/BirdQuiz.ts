import { Species } from './Species.js';
import { UiManager } from './UiManager.js'

export class BirdQuiz {

  private ui: UiManager;
  private speciesList: Species[];
  private currentSpecies: Species;
  private questionsAsked: number;
  private correctAnswers: number;

  constructor() {
    this.ui = new UiManager(this.startQuiz.bind(this), this.onKeyPress.bind(this), this.backToLists.bind(this));
    this.speciesList = [];
    this.questionsAsked = 0;
    this.correctAnswers = 0;
  }

  startQuiz() {
    var birdsSelected = this.ui.getSelectedBirds();
      if (birdsSelected.length > 0) {
      this.ui.setBirdListsVisible(false);
      for (var bird of this.ui.getSelectedBirds()) {
        this.speciesList.push(new Species(bird));
      }
      this.ui.setQuizPageVisible(true);
      this.askQuestion();
    }
  }

  onKeyPress(event) {
    if (event.keyCode === 13) {
      if (this.ui.getAndClearTextInput().toLowerCase() === this.currentSpecies.getName().toLowerCase()) {
        this.ui.showAnswer(this.currentSpecies.getName(), 'palegreen');
        this.correctAnswers++;
      } else {
        this.ui.showAnswer(this.currentSpecies.getName(), 'pink');
      }
      this.questionsAsked++;
      this.ui.setProgressBar(100 * this.correctAnswers / this.questionsAsked);
      setTimeout(function() {
        this.ui.hideAnswer();
        this.askQuestion();
      }.bind(this), 2000);
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
    this.correctAnswers = 0;
    this.questionsAsked = 0;
  }

}
