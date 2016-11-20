export class FSM {
  private fsa: Object;
  private current_state: string;
  private logging: boolean = false;
  constructor(fsa: Object, options: Object = {logging: false}) {
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
      console.log('The start state was not initialized! A well formed state machine must have a start state. Either Define a state named "Start" or set one state\'s property to {start_state: true}');
    }
    if (options['logging']) {
      this.logging = true;
    }
  }

  // signal the state machine with an environment that a guard can evaluate within.
  signal(requested_transition: string, env = null) {
    let next_state = '';
    let default_state = '';
    let possible_trans = this.fsa['trans'][this.current_state];
    if (possible_trans[requested_transition]) {
      let pt = possible_trans[requested_transition];
      for (let tn in pt) {
        if (typeof pt[tn] === 'boolean' && pt[tn] === true) {
          //alert('signal '+ requested_transition + ' to default_state ' + tn );
          default_state = tn;
        }
        else {
          if (pt[tn].call(env)) {
            next_state = tn;
          }
        }
      }
      if (!next_state && default_state) {
        if (this.logging) { console.log('going to defualt_state: ' + default_state ); }
        this.current_state = default_state;
        return this.current_state;
      }
      else if (next_state) {
        if (this.logging) { console.log('going to next_state: ' + next_state ); }
        this.current_state = next_state;
        return this.current_state;
      }
      if (this.logging) { console.log('no transition taken for signal: ' + requested_transition ); }
      return ""; // no transition was taken.
    }
  }

  currently(some_state_name: string) {
    return (this.current_state === some_state_name);
  }

  getCurrentStateName() {
    return this.current_state;
  }

  // determin if the current state is a *final state.
  // Two possibilities are checked *(1) and *(2)
  isFinalState() {
    // *(1) first of all if the current state object has a truthy property 'final_state'
    let curr_state_obj = this.fsa['states'][this.current_state];
    if (curr_state_obj.final_state) {
      return true;
    }
    // also we check if there are *(2) no transitions out
    let possible_trans = this.fsa['trans'][this.current_state];
    return this.isEmptyObject(possible_trans);
  }

  isEmptyObject(obj) {
    return (Object.keys(obj).length === 0);
  }

  // determin if the current state has a certain transition out, based on the given signal.
  hasTransition(signal: string): boolean {
    let possible_trans = this.fsa['trans'][this.current_state];
    if (possible_trans[signal]) {
      return true;
    }
    return false;
  }
}
