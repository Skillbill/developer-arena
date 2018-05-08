import Vue from 'vue'
import Countdown from '@/components/Countdown'

function getRenederedText(date) {
  const Constructor = Vue.extend(Countdown);
  const vm = new Constructor({
    propsData: {
      date
    }
  }).$mount();
  return vm.$el.textContent.trim();
}

describe('Countdown.vue', () => {
  it('should render correct contents', () => {
    let text = getRenederedText(new Date().toISOString());
    expect(text).toMatch(/(.){2}:(.){2}:(.){2}/);
  });

  it('should render 00:00:00 for a past date', () => {
    let text = getRenederedText('2011-01-07T15:23:00.000Z');
    expect(text).toBe('00:00:00');
  });
});
