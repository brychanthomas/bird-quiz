import { Species } from './Species.js';
import { UiManager } from './UiManager.js';
export class BirdQuiz {
    constructor() {
        this.ui = new UiManager(this.startQuiz.bind(this), this.onKeyPress.bind(this), this.backToLists.bind(this));
        this.questionsAsked = 0;
        this.correctAnswers = 0;
    }
    startQuiz() {
        this.format = this.ui.getSelectedFormat();
        var birdsSelected = this.ui.getSelectedBirds();
        this.speciesList = [];
        if (birdsSelected.length > 0) {
            this.ui.setBirdListsVisible(false);
            for (var bird of this.ui.getSelectedBirds()) {
                this.speciesList.push(new Species(JSON.parse(bird)));
            }
            this.ui.setQuizPageVisible(true);
            this.askQuestion();
        }
    }
    onKeyPress(event) {
        if (event.key === 'Enter') {
            if (this.currentSpecies.nameCorrect(this.ui.getAndClearTextInput())) {
                this.ui.showAnswer(this.currentSpecies.getName(), 'palegreen');
                this.correctAnswers++;
            }
            else {
                this.ui.showAnswer(this.currentSpecies.getName(), 'pink');
            }
            this.questionsAsked++;
            this.ui.setProgressBar(100 * this.correctAnswers / this.questionsAsked);
            setTimeout(function () {
                this.ui.hideAnswer();
                this.askQuestion();
            }.bind(this), 2000);
        }
    }
    askQuestion() {
        var speciesIndex = Math.floor(Math.random() * this.speciesList.length);
        console.log(this.speciesList[speciesIndex]);
        if (this.format === 'sounds') {
            this.speciesList[speciesIndex].playSound();
        }
        else {
            this.speciesList[speciesIndex].showImage();
        }
        this.currentSpecies = this.speciesList[speciesIndex];
    }
    backToLists() {
        this.currentSpecies.stopSound();
        this.currentSpecies.hideImage();
        this.ui.setQuizPageVisible(false);
        this.ui.setBirdListsVisible(true);
        this.correctAnswers = 0;
        this.questionsAsked = 0;
    }
}
