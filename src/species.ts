export class Species {

  private names:string[];
  private observations:any;
  private apiPage:number;

  public constructor(names: string[], format: 'sounds'|'pictures') {
    this.names = names;
    this.apiPage = 1;
    this.observations = [];
  }

  private async getObservations(format: 'sounds'|'pictures') {
    this.observations = undefined;
    let url = "https://api.inaturalist.org/v1/observations?quality_grade=research&order=desc&order_by=created_at"
    url += "&q=" + encodeURIComponent(this.names[0]);
    url += "&page=" + this.apiPage;
    url += "&per_page=30";
    url += (format === 'sounds') ? '&sounds=true' : '&photos=true';
    this.apiPage++;
    let response = await fetch(url);
    if (response.ok) {
      let json = await response.json();
      this.observations = json.results;
    } else {
      console.log(response);
    }
  }

  public playSound() {
    if (this.observations == undefined) { //if observations not loaded yet
      setTimeout(this.playSound.bind(this), 100); //try again in 100 seconds
      return;
    }
    if (this.observations.length === 0) {
      this.getObservations('sounds');
      setTimeout(this.playSound.bind(this), 100); //try again in 100 seconds
      return;
    }
    let observation = this.observations.splice(Math.floor(Math.random()*this.observations.length), 1)[0];
    let soundUrl = observation.sounds[0].file_url;
    let attribution = observation.sounds[0].attribution;
    document.getElementById("audio").setAttribute('src', soundUrl);
    (<HTMLVideoElement>document.getElementById("audio")).play();
    document.getElementById("attribution").textContent = attribution + " via iNaturalist";
    console.log(observation.uri);
  }

  public showImage() {
    if (this.observations == undefined) { //if observations not loaded yet
      this.hideImage();
      setTimeout(this.showImage.bind(this), 100); //try again in 100 seconds
      return;
    }
    if (this.observations.length === 0) { //if run out of observations
      this.hideImage();
      this.getObservations('pictures'); //load observations
      setTimeout(this.showImage.bind(this), 100); //try again in 100 seconds
      return;
    }
    let observation = this.observations.splice(Math.floor(Math.random()*this.observations.length), 1)[0];
    let imageUrl = observation.photos[0].url.replace('square', 'medium');
    let attribution = observation.photos[0].attribution;
    document.getElementById("image").setAttribute('src', imageUrl);
    document.getElementById("image").style.display = 'block';
    document.getElementById("attribution").textContent = attribution + " via iNaturalist";
    (<HTMLAnchorElement>document.getElementById("imageLink")).href = imageUrl.replace('medium', 'large');
    console.log(observation.uri);
  }

  public stopSound() {
    (<HTMLVideoElement>document.getElementById("audio")).pause();
  }

  public hideImage() {
    document.getElementById("image").style.display = 'none';
  }

  public getName() {
    return this.names[0];
  }

  public nameCorrect(attempt: string) {
    let tidiedNames = this.names.map(n=>n.toLowerCase().replace(/-/g,' '));
    let tidiedAttempt = attempt.toLowerCase().replace(/-/g, ' ');
    return tidiedNames.indexOf(tidiedAttempt) !== -1;
  }
}
