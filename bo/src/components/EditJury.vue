<template>
  <main class="container mt-3">
    <div class="mb-2">
      <h3 v-if="contest" class="mb-3">Edit jury of contest #{{contest.id}} ({{contest.i18n['en'].title}})</h3>
    </div>
    <b-card-group deck class="m-3">
      <JudgeCard v-for="judge in judges" :key="judge.id" :judge="judge" @remove="remove(judge.id)" @select="value => select(judge.id, value)"></JudgeCard>
    </b-card-group>
    <b-button variant="primary mb-3" @click="create">Create</b-button>
  </main>
</template>

<script>
import api from '@/lib/api'
import feedback from '@/lib/feedback'
import JudgeCard from '@/components/JudgeCard'

export default {
  name: 'EditJury',
  components: {
    JudgeCard
  },
  props: {
    contestId: Number
  },
  data: function () {
    return {
      contest: null,
      judges: []
    }
  },
  methods: {
    create () {
      this.$router.push({
        name: 'newJudge'
      })
    },
    select (id, value) {
      if (value) {
        api.addJudgeToJury(this.contestId, id).catch(e => {
          api.apiError(e)
        })
      } else {
        api.removeJudgeFromJury(this.contestId, id).catch(e => {
          api.apiError(e)
        })
      }
    },
    remove (id) {
      api.deleteJudge(id).then(() => {
        this.judges = this.judges.filter(judge => judge.id !== id)
        feedback.judgeDeleted()
      }).catch(e => {
        api.apiError(e)
      })
    }
  },
  created: function () {
    api.getContestById(this.contestId).then(contest => {
      this.contest = contest
      return api.getJudges()
    }).then(judges => {
      judges.forEach(judge => {
        judge.image = api.getJudgeImageUrl(judge)
        judge.selected = this.contest.jury.map(o => o.judgeId).includes(judge.id)
      })
      this.judges = judges
    }).catch(e => {
      api.apiError(e)
    })
  }
}
</script>
