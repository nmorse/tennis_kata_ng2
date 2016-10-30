import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tennis-app',
  templateUrl: 'tennis.component.html',
  styleUrls: ['tennis.component.css']
})
export class TennisAppComponent {
  //37215
  state = new State({"states":{"P1 leads":{},"All":{},"P2 leads":{},"Start":{},"Advantage P1":{},"Advantage P2":{},"Deuce":{},"Game P2":{},"Game P1":{}},"trans":{"P1 leads":{"1":"Game P1","2":"Deuce"},"All":{"1":"P1 leads","2":"P2 leads"},"P2 leads":{"1":"Deuce","2":"Game P2"},"Start":{"1":"P1 leads","2":"P2 leads"},"Advantage P1":{"1":"Game P1","2":"Deuce"},"Advantage P2":{"1":"Deuce","2":"Game P2"},"Deuce":{"1":"Advantage P1","2":"Advantage P2"},"Game P2":{},"Game P1":{}},"views":[{"name":"primary","nodes":{"P1 leads":{"position":{"x":112,"y":105},"width":90},"All":{"position":{"x":300,"y":150}},"P2 leads":{"position":{"x":502,"y":106},"width":90},"Start":{"position":{"x":300,"y":70},"width":60},"n0":{"position":{"x":154,"y":250},"width":110},"n1":{"position":{"x":450,"y":250},"width":110},"n2":{"position":{"x":300,"y":250},"width":60},"n3":{"position":{"x":550,"y":300},"width":90},"n4":{"position":{"x":50,"y":300},"width":90}},"edges":{}},{"name":"kitty corner","nodes":{"n4":{"position":{"x":490,"y":50},"width":90},"n3":{"position":{"x":490,"y":250},"width":90},"n2":{"position":{"x":210,"y":150},"width":60},"n1":{"position":{"x":350,"y":200},"width":110},"n0":{"position":{"x":350,"y":100},"width":110},"Start":{"position":{"x":10,"y":150},"width":60},"P2 leads":{"position":{"x":75,"y":250},"width":90},"All":{"position":{"x":120,"y":150}},"P1 leads":{"position":{"x":75,"y":50},"width":90}},"edges":{}}]});
  //                   { states:{a:{start_state: true}, b:{}},
  //                    transitions:{a:{P1:"b"}, b:{P2:"a"}}});
  point(player: string): void {
    this.state.signal(player);
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
  signal(trans: string) {
    let next_state = '';
    let possible_trans = this.fsa['trans'][this.current_state];
    if (possible_trans[trans]) {
      let pt = possible_trans[trans];
      if (typeof pt === 'string') {
        this.current_state = pt;
      }
      else {
        for (let tn in pt) {
          if (pt[tn].guard && eval(pt[tn].guard)) {
            next_state = tn;
            break;
          }
        }
        if (!next_state) {
          for (let tn in pt) {
            if (!pt[tn].guard) {
              next_state = tn;
              break;
            }
          }
        }
      }
      if (next_state) {
        this.current_state = next_state;
      }
    }
  }

  getCurrentStateName() {
    return this.current_state;
  }
}
