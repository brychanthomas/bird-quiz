export class Species {

  private name:string;
  private observations:any;

  public constructor(name: string) {
    this.name = name;
    this.getObservations();
  }

  private async getObservations() {
    let url = "https://api.inaturalist.org/v1/observations?sounds=true&quality_grade=research&order=desc&order_by=created_at"
    url += "&q=" + encodeURIComponent(this.name);
    url += "&page=1";
    url += "&per_page=50";
    let response = await fetch(url);
    if (response.ok) {
      let json = await response.json();
      this.observations = json.results;
    } else {
      alert(response.status);
    }
  }

  public playSound() {
    let observation = this.observations.splice(Math.floor(Math.random()*this.observations.length), 1)[0];
    let soundUrl = observation.sounds[0].file_url;
    let attribution = observation.sounds[0].attribution;
    document.getElementById("audio").setAttribute('src', soundUrl);
    (<HTMLVideoElement>document.getElementById("audio")).play();
    console.log(observation.uri);
  }
}
