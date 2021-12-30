import { Species } from './Species.js';
import { UiManager } from './UiManager.js'

function initialise() {
  ui.setBirdListsVisible(false);
  for (var bird of ui.getSelectedBirds()) {
    speciesList.push(new Species(bird));
  }
  ui.setQuizPageVisible(true);
  question();
}

function question() {
  var speciesIndex = Math.floor(Math.random()*speciesList.length);
  console.log(speciesList);
  console.log(speciesList[speciesIndex]);
  speciesList[speciesIndex].playSound();
}

function onKeyPress(event) {
  if (event.keyCode === 13) {
    question();
  }
}

var ui = new UiManager(initialise, function(e) {console.log(e.keyCode)});
var speciesList: Species[] = [];
