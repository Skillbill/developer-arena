<template>
  <nav>
    <ul class="pagination">
      <li class="page-item" :class="{disabled: curPage === 1}">
        <a class="page-link" href="#" @click.prevent="showPage(curPage - 1)">Previous</a>
      </li>
      <li class="page-item" :class="{active: page === curPage}" v-for="page in pages" :key="page">
        <a class="page-link" href="#" @click.prevent="showPage(page)">{{page}}</a>
      </li>
      <li class="page-item" :class="{disabled: curPage === pageCount}">
        <a class="page-link" href="#" @click.prevent="showPage(curPage + 1)">Next</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Paginate',
  props: [
    'pageCount'
  ],
  data: function () {
    return {
      curPage: 1
    }
  },
  computed: {
    pages: function () {
      return Array(this.pageCount).fill(0).map((e, i) => i + 1)
    }
  },
  methods: {
    showPage (page) {
      this.curPage = page
      this.$emit('pageChanged', page)
    }
  }
}
</script>
