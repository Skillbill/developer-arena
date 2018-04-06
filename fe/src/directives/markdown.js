import marked from 'marked'

function md(el, binding, vnode) {
  let html = marked(binding.value || '', {sanitize: true});
  if(binding.arg === 'strip' && binding.modifiers) {
    for(let tag in binding.modifiers) {
      html = html.replace(new RegExp(`<(\\/?)${tag}.*?>`, 'gi'), '');
    }
  }
  el.innerHTML = html;
  el.classList.add('v-md');
}

export default {
  inserted: md,
  update: md
}
