import { component, componentize } from '../../library'
import { LinearProgress as MwcLinearProgress } from '@material/mwc-linear-progress'

/**
 * @attr indeterminate
 * @attr progress
 * @attr buffer
 * @attr reverse
 * @attr close
 */
@component('mdc-linear-progress')
export default class LinearProgress extends componentize(MwcLinearProgress) { }