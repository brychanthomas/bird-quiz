var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * A class to represent a single species of bird: makes calls to the
 * iNaturalist API to get observations and displays pictures/plays sounds.
 */
export class Species {
    /**
     * Constructor for Species.
     * @param names  list of names for this species, with first name being iNaturalist name
     */
    constructor(names) {
        this.names = names;
        this.apiPage = 1;
        this.observations = [];
    }
    /**
     * Async method that retrieves observations from the iNaturalist API.
     * @param  format 'sounds' get get observations with sounds and 'pictures'
     * to get observations with pictures
     */
    getObservations(format) {
        return __awaiter(this, void 0, void 0, function* () {
            this.observations = undefined;
            let url = "https://api.inaturalist.org/v1/observations?quality_grade=research&order=desc&order_by=created_at&search_on=names";
            url += "&q=" + encodeURIComponent(this.names[0]);
            url += "&page=" + this.apiPage;
            url += "&per_page=30";
            url += (format === 'sounds') ? '&sounds=true' : '&photos=true';
            this.apiPage++;
            let response = yield fetch(url);
            if (response.ok) {
                let json = yield response.json();
                this.observations = json.results;
            }
            else {
                console.log(response);
            }
        });
    }
    /**
     * Plays a sound from a randomly selected observation via the HTML audio
     * element with id 'audio'. It also sets the attribution text.
     * @return false if observations not loaded, true if successful
     */
    playSound() {
        if (this.observations == undefined) { //if observations not loaded yet
            return false;
        }
        if (this.observations.length === 0) {
            this.getObservations('sounds');
            return false;
        }
        let observation = this.observations.splice(Math.floor(Math.random() * this.observations.length), 1)[0];
        let soundUrl = observation.sounds[0].file_url;
        let attribution = observation.sounds[0].attribution;
        document.getElementById("audio").setAttribute('src', soundUrl);
        document.getElementById("audio").play();
        document.getElementById("attribution").textContent = attribution + " via iNaturalist";
        console.log(observation.uri);
        return true;
    }
    /**
     * displays a picture from a randomly selected observation via the HTML img
     * element with id 'image'. It also sets the attribution text and the link to the
     * larger version of the image.
     * @return false if observations not loaded, true if successful
     */
    showImage() {
        if (this.observations == undefined) { //if observations not loaded yet
            return false;
        }
        if (this.observations.length === 0) { //if run out of observations
            this.hideImage();
            this.getObservations('pictures'); //load observations
            return false;
        }
        let observation = this.observations.splice(Math.floor(Math.random() * this.observations.length), 1)[0];
        let imageUrl = observation.photos[0].url.replace('square', 'medium');
        let attribution = observation.photos[0].attribution;
        document.getElementById("image").setAttribute('src', imageUrl);
        document.getElementById("image").style.display = 'block';
        document.getElementById("attribution").textContent = attribution + " via iNaturalist";
        document.getElementById("imageLink").href = imageUrl.replace('medium', 'large');
        console.log(observation.uri);
        return true;
    }
    /**
     * Stops playing any sound.
     */
    stopSound() {
        document.getElementById("audio").pause();
    }
    /**
     * Hides the image element.
     */
    hideImage() {
        document.getElementById("image").style.display = 'none';
    }
    /**
     * Get the primary name of the species.
     * @return primary name of species
     */
    getName() {
        return this.names[0];
    }
    /**
     * Checks whether an attempted name matches any names of this species.
     * @param attempt attempt at naming species
     * @return whether attempt was correct or not
     */
    nameCorrect(attempt) {
        let tidiedNames = this.names.map(n => n.toLowerCase().replace(/-/g, ' '));
        let tidiedAttempt = attempt.toLowerCase().replace(/-/g, ' ');
        return tidiedNames.indexOf(tidiedAttempt) !== -1;
    }
}
