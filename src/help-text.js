import {activationStrategy} from 'aurelia-router';

export class HelpText {
    determineActivationStrategy(){
        return activationStrategy.replace;
    }
}
