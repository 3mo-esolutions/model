import { LitElement } from 'lit-element'
import { componentize } from '.'

export default abstract class Component extends componentize(LitElement) { }