import { Species } from './species.js';

var robin = new Species("European Robin");
setTimeout(function() {
  robin.playSound();
}, 2000);
