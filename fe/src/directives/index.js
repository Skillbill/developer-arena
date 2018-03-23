import Vue from 'vue'
import markdown from './markdown'

export function register() {
  Vue.directive('md', markdown);
}
