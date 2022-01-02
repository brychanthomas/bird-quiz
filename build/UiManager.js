import { birdLists } from './birdLists.js';
export class UiManager {
    constructor(startButtonCallback, keyPressCallback, backCallback) {
        this.createBirdLists();
        this.createStartButton(startButtonCallback);
        this.createQuizPage(keyPressCallback);
        this.createBackButton(backCallback);
        this.setQuizPageVisible(false);
    }
    createBirdLists() {
        this.birdListsDiv = document.createElement('div');
        this.birdListsDiv.id = 'birdListsDiv';
        document.body.appendChild(this.birdListsDiv);
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
            var title = document.createElement('h2');
            title.textContent = list.name;
            activeCol.appendChild(title);
            for (var bird of list.birds) {
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = bird[0];
                checkbox.name = "birdLists";
                checkbox.value = JSON.stringify(bird);
                activeCol.appendChild(checkbox);
                var label = document.createElement('label');
                label.textContent = bird[0];
                label.htmlFor = bird[0];
                activeCol.appendChild(label);
                activeCol.appendChild(document.createElement('br'));
            }
        }
        var title = document.createElement('h2');
        title.textContent = "Format";
        this.birdListsDiv.appendChild(title);
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
    createStartButton(callback) {
        var button = document.createElement('button');
        button.onclick = callback;
        button.textContent = "Start";
        button.id = "startButton";
        this.birdListsDiv.appendChild(button);
    }
    createQuizPage(callback) {
        this.quizDiv = document.createElement('div');
        this.quizDiv.id = 'quizDiv';
        document.body.appendChild(this.quizDiv);
        var attributionText = document.createElement('span');
        attributionText.id = "attribution";
        this.quizDiv.appendChild(attributionText);
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
    createBackButton(callback) {
        var back = document.createElement('button');
        back.onclick = callback;
        back.textContent = 'Back';
        this.quizDiv.insertBefore(back, this.quizDiv.firstChild);
    }
    getSelectedBirds() {
        var checkedBoxes = document.querySelectorAll('input[name=birdLists]:checked');
        var birds = [];
        for (var bird of checkedBoxes) {
            birds.push(bird.value);
        }
        return birds;
    }
    getSelectedFormat() {
        var checkedRadio = document.querySelectorAll('input[name=format]:checked');
        return checkedRadio[0].value === 'sounds' ? 'sounds' : 'pictures';
    }
    setBirdListsVisible(visible) {
        this.birdListsDiv.style.display = (visible ? 'block' : 'none');
    }
    setQuizPageVisible(visible) {
        this.quizDiv.style.display = (visible ? 'block' : 'none');
        var progressBar = document.getElementById("progressBar");
        progressBar.style.width = '0%';
        progressBar.textContent = '';
    }
    getAndClearTextInput() {
        var input = document.getElementById('birdNameInput');
        var text = input.value;
        input.value = '';
        return text;
    }
    showAnswer(text, colour) {
        var answerText = document.getElementById("answerText");
        answerText.textContent = text;
        answerText.style.display = 'block';
        var colourFlasher = document.getElementById("colourFlasher");
        colourFlasher.style.backgroundColor = colour;
        colourFlasher.style.display = 'block';
        var timer = setInterval(function () {
            colourFlasher.style.opacity = String(Number(colourFlasher.style.opacity) + 0.1);
            if (Number(colourFlasher.style.opacity) === 1) {
                clearInterval(timer);
            }
        }, 15);
    }
    hideAnswer() {
        document.getElementById("answerText").style.display = 'none';
        var colourFlasher = document.getElementById("colourFlasher");
        var timer = setInterval(function () {
            colourFlasher.style.opacity = String(Number(colourFlasher.style.opacity) - 0.1);
            if (Number(colourFlasher.style.opacity) === 0) {
                clearInterval(timer);
            }
        }, 15);
    }
    setProgressBar(percentage) {
        var bar = document.getElementById("progressBar");
        bar.style.width = percentage + '%';
        bar.textContent = Math.round(percentage) + '%';
    }
}