import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tennis-app',
  templateUrl: 'tennis.component.html',
  styleUrls: ['tennis.component.css']
})

export class TennisAppComponent {
  title = "";
  p1 = 0;
  p2 = 0;
  state = new State({"states":{"Game P1":{},"Game P2":{},"Deuce":{},"Advantage P2":{},"Advantage P1":{},"Start":{},"P2 leads":{},"All":{},"P1 leads":{}},"trans":{"Game P1":{},"Game P2":{},"Deuce":{"1":{"Advantage P1":true},"2":{"Advantage P2":true}},"Advantage P2":{"1":{"Deuce":true},"2":{"Game P2":true}},"Advantage P1":{"1":{"Game P1":true},"2":{"Deuce":true}},"Start":{"1":{"P1 leads":true},"2":{"P2 leads":true}},"P2 leads":{"1":{"All":function () { return (this.tied() && this.score('P1') < this.forty());},"Deuce":function () { return (this.tied() && this.score('P1') >= this.forty());}},"2":{"P2 leads":true,"Game P2":function () { return (this.score('P2') >= this.forty());}}},"All":{"1":{"P1 leads":true},"2":{"P2 leads":true}},"P1 leads":{"1":{"P1 leads":true,"Game P1":function () { return (this.score('P1') >= this.forty());}},"2":{"All":function () { return (this.tied() && this.score('P2') < this.forty());},"Deuce":function () { return (this.tied() && this.score('P2') >= this.forty());}}}},"views":[{"name":"primary","nodes":{"Game P1":{"position":{"x":50,"y":300},"width":90},"Game P2":{"position":{"x":550,"y":300},"width":90},"Deuce":{"position":{"x":300,"y":250},"width":60},"Advantage P2":{"position":{"x":450,"y":250},"width":110},"Advantage P1":{"position":{"x":154,"y":250},"width":110},"Start":{"position":{"x":300,"y":70},"width":60},"P2 leads":{"position":{"x":502,"y":106},"width":90},"All":{"position":{"x":300,"y":150}},"P1 leads":{"position":{"x":112,"y":105},"width":90}},"edges":{}},{"name":"kitty corner","nodes":{"Game P1":{"position":{"x":490,"y":50},"width":90},"Game P2":{"position":{"x":490,"y":250},"width":90},"Deuce":{"position":{"x":210,"y":150},"width":60},"Advantage P2":{"position":{"x":350,"y":200},"width":110},"Advantage P1":{"position":{"x":350,"y":100},"width":110},"Start":{"position":{"x":10,"y":150},"width":60},"P2 leads":{"position":{"x":75,"y":250},"width":90},"All":{"position":{"x":120,"y":150}},"P1 leads":{"position":{"x":75,"y":50},"width":90}},"edges":{}}]});

  point(player: string): void {
    if (player === '1') { this.p1 += 1; }
    if (player === '2') { this.p2 += 1; }
    this.state.signal(player, this);
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
  }
}

class State {
  private fsa: Object;
  private current_state: string;
  constructor(fsa: Object) {
    this.fsa = fsa;
    // initialize the current_state to the start_state.
    if (fsa && fsa['states'] && fsa['states']['Start']) {
      this.current_state = 'Start';
    }
    for (let state_name in fsa['states']) {
      if (fsa['states'][state_name].start_state) {
        this.current_state = state_name;
        break;
      }
    }
    if (!this.current_state) {
      alert('The start state was not initialized in the StateMachine constructor');
    }
  }

  // signal the state machine with an environment that a guard can evaluate within.
  signal(trans: string, env) {
    let next_state = '';
    let default_state = '';
    let possible_trans = this.fsa['trans'][this.current_state];
    if (possible_trans[trans]) {
      let pt = possible_trans[trans];
      for (let tn in pt) {
        if (typeof pt[tn] === 'boolean' && pt[tn] === true) {
          //alert('signal '+ trans + ' to default_state ' + tn );
          default_state = tn;
        }
        else {
          if (pt[tn].call(env)) {
            next_state = tn;
          }
        }
      }
      if (!next_state && default_state) {
        //alert('using default_state ' + default_state );
        this.current_state = default_state;
      }
      else if (next_state) {
        //alert('using next_state ' + next_state );
        this.current_state = next_state;
      }
    }
  }

  getCurrentStateName() {
    return this.current_state;
  }
}


//37215
