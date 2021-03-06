import { Species } from './Species.js';
import { UiManager } from './UiManager.js'

export class BirdQuiz {

  private ui: UiManager;
  private speciesList: Species[];
  private currentSpecies: Species;
  private questionsAsked: number;
  private correctAnswers: number;
  private format: 'pictures'|'sounds';
  private page: 'lists'|'quiz';

  constructor() {
    this.ui = new UiManager(this.startQuiz.bind(this), this.onKeyPress.bind(this), this.backToLists.bind(this));
    this.questionsAsked = 0;
    this.correctAnswers = 0;
    this.page = 'lists';
  }

  startQuiz() {
    this.format = this.ui.getSelectedFormat();
    var birdsSelected = this.ui.getSelectedBirds();
    this.speciesList = [];
    if (birdsSelected.length > 0) {
      this.ui.setBirdListsVisible(false);
      for (var bird of this.ui.getSelectedBirds()) {
        this.speciesList.push(new Species(bird));
      }
      this.ui.setQuizPageVisible(true);
      this.page = 'quiz';
      this.chooseSpecies();
      this.askQuestion();
    } else {
      alert('Please select at least one species first!');
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.currentSpecies.nameCorrect(this.ui.getAndClearTextInput())) {
        this.ui.showAnswer(this.currentSpecies.getName(), 'palegreen');
        this.correctAnswers++;
      } else {
        this.ui.showAnswer(this.currentSpecies.getName(), 'pink');
      }
      this.questionsAsked++;
      this.ui.setProgressBar(100 * this.correctAnswers / this.questionsAsked);
      setTimeout(function() {
        this.ui.hideAnswer();
        this.chooseSpecies();
        this.askQuestion();
      }.bind(this), 2000);
    }
  }

  private chooseSpecies() {
    let speciesIndex = Math.floor(Math.random()*this.speciesList.length);
    console.log(this.speciesList[speciesIndex]);
    this.currentSpecies = this.speciesList[speciesIndex];
  }

  askQuestion() {
    if (this.page !== 'quiz') {
      return;
    }
    let success: boolean;
    if (this.format === 'sounds') {
      success = this.currentSpecies.playSound();
    } else {
      success = this.currentSpecies.showImage();
    }
    if (!success) {
      setTimeout(this.askQuestion.bind(this), 100);
    }
  }

  backToLists() {
    this.page = 'lists';
    this.currentSpecies.stopSound();
    this.currentSpecies.hideImage();
    this.ui.setQuizPageVisible(false);
    this.ui.setBirdListsVisible(true);
    this.correctAnswers = 0;
    this.questionsAsked = 0;
  }

}
