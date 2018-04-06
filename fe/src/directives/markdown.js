import marked from 'marked'

function md(el, binding, vnode) {
  let html = marked(binding.value || '', {sanitize: true});
  el.innerHTML = html;
  el.classList.add('v-md');
}

export default {
  inserted: md,
  update: md
}
