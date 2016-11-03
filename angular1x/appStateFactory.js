// appState implements a Finite State Machine, defined by states and transitions.
// States have properties that may be queried and Transitions are the allowed paths between states. 
// Calling the 'signal' method will trigger a transition from the current state to the next state.
// Sending a signal to the State Machine only asks it to transition to the next state. 
// Required for a transition to happen: the transition must exist and any enterState method must return a truthy value.
// Angular factory returns a singelton, but the init function returns an Object, which allows you may use
// several state machines at once (see below, for a usage example).
angular.module('CorsApp')
.factory("appState", function () {
    return {
        init: function (machine, opt_init_signal, log) {
            machine.signal = function changeState(signal, message) {
                var current_state_name = machine.current_state_name || "start";
                var next_state_name = machine.trans[current_state_name][signal];
                var ns_obj; // next_state_object 'ns_obj' may contain properties and methods of the anticipated next state
                var ok_to_transition = true;
                var msg_obj;
                if (next_state_name) {
                    ns_obj = machine.states[next_state_name];
                    if (ns_obj && angular.isFunction(ns_obj.enterState)) {
                        ok_to_transition = ns_obj.enterState.call();
                    }
                    if (ns_obj && ok_to_transition) {
                        if (log) {
                            console.log('on signal [' + signal + '] trans from state:' + current_state_name + ' --> ' + next_state_name);
                        }
                        machine.current_state_name = next_state_name;

                        if (message && angular.isString(message)) {
                            msg_obj = { WebMsg: message };
                        }
                        else if (message && angular.isObject(message)) {
                            msg_obj = message;
                        }
                        else {
                            msg_obj = { WebMsg: '' };
                        }
                        machine.current_state = angular.merge({}, ns_obj, msg_obj);
                        // trigger a post state entered event method
                        if (ns_obj && angular.isFunction(ns_obj.stateEntered)) {
                            machine.current_state.WebMsg = machine.current_state.WebMsg || '';
                            machine.current_state.WebMsg += ns_obj.stateEntered.call();
                        }
                        if (log) {
                            console.log('  -- with properties ' + angular.toJson(machine.current_state));
                        }
                        return next_state_name;
                    }
                }
                if (log) {
                    console.log('NO Transition for signal [' + signal + '] from state:' + current_state_name + ' ;P');
                }
                return '';
            };
            machine.getStateProperty = function getStateProperty(property_name) {
                var display_state = machine.current_state || {};
                var value;
                if (property_name === machine.current_state_name) {
                    value = true;
                }
                else {
                    value = display_state[property_name] || '';
                }
                if (value === 'undefined') {
                    value = '';
                }
                return value;
            };
            
            // isFinalState is a method that reports true if the current state has no out-going transitions.
            machine.isFinalState = function isFinalState() {
                var current_state_name = machine.current_state_name || "start";
                var trans_out = machine.trans[current_state_name];
                // check if the trans_out object is empty
                for (var key in trans_out) {
                    if (trans_out.hasOwnProperty(key)) {
                        return false;
                    }
                }
                return true;
            };

            if (machine.current_state_name && machine.states[machine.current_state_name]) {
                machine.current_state = machine.states[machine.current_state_name];
            }
            else {
                machine.current_state = {};
            }
            if (opt_init_signal) {
                machine.signal(opt_init_signal);
            }

            return machine;
        }
    };
});

//// Usage:
//// Define a Statemachine with states and transitions
//// Note: States can have properties and event handler functions:
////    'enterState' is a guard on any transition into the state, if enterState
////          returns false, the transition is rejected.
////    'stateEntered' is called after the transition is made into the state
////          and all state properties have been set.
// var exampleStatemachine = {
//  states: {
//      'start': {},
//      'loading': { 
//          save_disabled: true, loading_gear_icon: true,
//          enterState: function () {
//              getData(); 
//              return true; 
//          } 
//      },
//      'clean': {},
//      'saving': { save_disabled: true, saving_gear_icon: true },
//      'save_error': { display_error: true },
//      'loading_error': {
//          save_disabled: true, display_error: true, 
//          stateEntered: function () {
//              $timeout(function () {
//                  mdState.signal('init');
//              }, 10000);
//              return '\nRetrying in 10 seconds.';
//          }
//      }
//  },
//  trans: {
//      'start': { 'init': 'loading' },
//      'loading': { 'success': 'clean', 'fail': 'loading_error' },
//      'clean': { 'save': 'saving' },
//      'saving': { 'success': 'clean', 'fail': 'save_error' },
//      'save_error': { 'save': 'saving' },
//      'loading_error': { 'init': 'loading' }
//  },
//  current_state_name: 'start',
//  };
//// initilize the statemachine and optionally trigger an initial transition
// var myAppStateMachine = appState.init(exampleStatemachine, 'init');
//// ... after loading happens send the statemachine a signal to transition...
// myAppStateMachine.signal('success');
//// at any time you can ask for a property of the current state, like this.
// save_disabled = myAppStateMachine.getStateProperty('save_disabled');
//// for instance to expose state properties to the view
// $scope.getDisplayStateFor = function(prop) {
//   return mdState.getStateProperty(prop);
// };
//// then spinkle in the markup 
////    <button ng-disabled="getDisplayStateFor('save_disabled')">save</button>
