import { Component } from '@angular/core';
import {FSM} from './fsm';

@Component({
  moduleId: module.id,
  selector: 'tennis-app',
  templateUrl: 'tennis.component.html',
  styleUrls: ['tennis.component.css']
})

export class TennisAppComponent {
  title = "Tennis Kata";
  p1 = 0;
  p2 = 0;
  state = this.initState();

  initState() {
    return new FSM(
      //{"states":{"P1 leads":{},"All":{},"P2 leads":{},"Start":{},"Game P2":{},"Game P1":{}},"trans":{"P1 leads":{"1":{"P1 leads":true,"Game P1":function () { return (this.score('P1') >= this.forty());}},"2":{"All":function () { return (this.tied() && this.score('P2') < this.forty());}}},"All":{"1":{"P1 leads":true},"2":{"P2 leads":true}},"P2 leads":{"1":{"All":function () { return (this.tied() && this.score('P1') < this.forty());}},"2":{"P2 leads":true,"Game P2":function () { return (this.score('P2') >= this.forty());}}},"Start":{"1":{"P1 leads":true},"2":{"P2 leads":true}},"Game P2":{},"Game P1":{}},"current_state_name":"Start","views":[{"name":"primary","nodes":{"P1 leads":{"position":{"x":75,"y":50},"width":90},"All":{"position":{"x":120,"y":150}},"P2 leads":{"position":{"x":75,"y":250},"width":90},"Start":{"position":{"x":10,"y":150},"width":60},"Game P2":{"position":{"x":490,"y":250},"width":90},"Game P1":{"position":{"x":490,"y":50},"width":90}}},{"name":"top down","nodes":{"P1 leads":{"position":{"x":112,"y":105},"width":90},"All":{"position":{"x":300,"y":150}},"P2 leads":{"position":{"x":502,"y":106},"width":90},"Start":{"position":{"x":300,"y":70},"width":60},"Game P2":{"position":{"x":550,"y":300},"width":90},"Game P1":{"position":{"x":50,"y":300},"width":90}}}]}
      //{"states":{"30 All":{},"30 15":{},"15 30":{},"Love 30":{},"30 Love":{},"15 All":{},"15 Love":{},"Love 15":{},"Start":{},"40 15":{},"40 Love":{},"30 40":{},"40 30":{},"15 40":{},"Love 40":{}},"trans":{"30 All":{"1":{"40 30":true},"2":{"30 40":true}},"30 15":{"1":{"40 15":true},"2":{"30 All":true}},"15 30":{"1":{"30 All":true},"2":{"15 40":true}},"Love 30":{"1":{"15 30":true},"2":{"Love 40":true}},"30 Love":{"1":{"40 Love":true},"2":{"30 15":true}},"15 All":{"1":{"30 15":true},"2":{"15 30":true}},"15 Love":{"1":{"30 Love":true},"2":{"15 All":true}},"Love 15":{"1":{"15 All":true},"2":{"Love 30":true}},"Start":{"1":{"15 Love":true},"2":{"Love 15":true}},"40 15":{},"40 Love":{},"30 40":{},"40 30":{},"15 40":{},"Love 40":{}},"current_state_name":"Start","views":[{"name":"primary","nodes":{"Start":{"position":{"x":10,"y":154},"width":60}}},{"name":"top down","nodes":{"Start":{"position":{"x":300,"y":70},"width":60}}}]}
      {"states":{"Game P2":{},"Game P1":{},"Love 40":{},"15 40":{},"40 30":{},"30 40":{},"40 Love":{},"40 15":{},"Start":{},"Love 15":{},"15 Love":{},"15 All":{},"30 Love":{},"Love 30":{},"15 30":{},"30 15":{},"30 All":{},"Deuce":{},"Advantage P1":{},"Advantage P2":{}},"trans":{"Game P2":{},"Game P1":{},"Love 40":{},"15 40":{},"40 30":{"2":{"Deuce":true}},"30 40":{"1":{"Deuce":true}},"40 Love":{},"40 15":{},"Start":{"1":{"15 Love":true},"2":{"Love 15":true}},"Love 15":{"1":{"15 All":true},"2":{"Love 30":true}},"15 Love":{"1":{"30 Love":true},"2":{"15 All":true}},"15 All":{"1":{"30 15":true},"2":{"15 30":true}},"30 Love":{"1":{"40 Love":true},"2":{"30 15":true}},"Love 30":{"1":{"15 30":true},"2":{"Love 40":true}},"15 30":{"1":{"30 All":true},"2":{"15 40":true}},"30 15":{"1":{"40 15":true},"2":{"30 All":true}},"30 All":{"1":{"40 30":true},"2":{"30 40":true}},"Deuce":{"1":{"Advantage P1":true},"2":{"Advantage P2":true}},"Advantage P1":{"1":{"Game P1":true},"2":{"Deuce":true}},"Advantage P2":{"1":{"Deuce":true},"2":{"Game P2":true}}},"current_state_name":"Start","views":[{"name":"primary","nodes":{"Start":{"position":{"x":10,"y":154},"width":60}}},{"name":"top down","nodes":{"Start":{"position":{"x":300,"y":70},"width":60},"Advantage P1":{"position":{"x":154,"y":250},"width":110},"Advantage P2":{"position":{"x":450,"y":250},"width":110},"Deuce":{"position":{"x":300,"y":250},"width":60},"Game P2":{"position":{"x":550,"y":300},"width":90},"Game P1":{"position":{"x":50,"y":300},"width":90}}}]}
      , {"logging": true}
    );
  }
  point(player: string): void {
    let current_state = this.state.getCurrentStateName();
    if(current_state != 'Game P1' && current_state != 'Game P2') {
      if (player === '1') { this.p1 += 1; }
      if (player === '2') { this.p2 += 1; }
      this.state.signal(player, this);
    }
  }

  tied() {return (this.p1 === this.p2);}

  score(player) {
    if (player === 'P1') { return this.p1; }
    if (player === 'P2') { return this.p2; }
  }

  forty() {return 3;}

  sayScore(score) {
    if (score === 0) {
      return 'Love';
    }
    if (score === 1) {
      return 'Fifteen';
    }
    if (score === 2) {
      return 'Thirty';
    }
    if (score === 3) {
      return 'Forty';
    }
    return '(over Forty)';
  }

  reset() {
    this.state = this.initState();
    this.p1 = 0;
    this.p2 = 0;
  }
}
