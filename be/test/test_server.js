const http = require('@/lib/http')
const srv = require('@/server')
const mock = require('@/test/mock')
const moment = require('moment')
const chai = require('chai')
const chaiHttp = require('chai-http')

const apiVersion = '1.0'
const _ = (path) => `/${apiVersion}${path}`

const expect = chai.expect
chai.use(chaiHttp)
chai.request.Request.prototype.by = function(userId) {
    this.header = Object.assign(this.header || {}, {Authorization: userId})
    return this
}

function createContest(done) {
    if (!this.contest) {
        return this.skip()
    }
    chai.request(srv).post(_('/admin/contest'))
        .by('admin')
        .send(this.contest)
        .end((err, res) => {
            if (!err) {
                expect(res).to.have.status(http.created)
                expect(res.body).to.be.a('object')
                expect(res.body).to.have.property('id')
                this.contest.id = res.body.id
            }
            done(err)
        })
}

function updateContest(done) {
    if (!this.contest || !this.contest.id) {
        return this.skip()
    }
    const id = this.contest.id
    chai.request(srv).patch(_(`/admin/contest/${id}`))
        .by('admin')
        .send(this.contest)
        .end((err, res) => {
            expect(res).to.have.status(http.ok)
            done(err)
        })
}

function deleteContest(done) {
    if (!this.contest || !this.contest.id) {
        return this.skip()
    }
    const id = this.contest.id
    chai.request(srv).delete(_(`/admin/contest/${id}`))
        .by('admin')
        .end((err, res) => {
            expect(res).to.have.status(http.noContent)
            done(err)
        })
}

describe('database', function() {
    it('is connected', function(done) {
        chai.request(srv).get(_('/health'))
            .end((err, res) => {
                expect(res).to.have.status(http.ok)
                expect(res.body).to.be.a('object').and.have.property('db')
                expect(res.body.db).to.be.a('object').and.have.property('connected').to.equals(true)
                done(err)
            })
    })
    after(function() {
        if (this.test.parent.tests.filter(test => test.state == 'failed').length) {
            // abort everything
            process.emit('SIGINT')
        }
    })
})

describe('contest', () => {
    context('state is DRAFT', () => {
        before('prepare draft contest', function(done) {
            this.contest = Object.assign({}, mock.draftContest)
            createContest.bind(this)(done)
        })
        after(deleteContest)
        it('is available for admins', function(done) {
            if (!this.contest.id) {
                return this.skip()
            }
            chai.request(srv).get(_('/admin/contest'))
                .by('admin')
                .end((err, res) => {
                    expect(res).to.have.status(http.ok)
                    expect(res.body).to.be.a('object')
                    expect(res.body).to.have.property('contests')
                    expect(res.body.contests).to.be.a('array')
                    expect(res.body.contests.map(c => c.id)).to.include(this.contest.id)
                    done()
                })
        })
        it('is NOT public', function(done) {
            if (!this.contest.id) {
                return this.skip()
            }
            chai.request(srv).get(_('/contest'))
                .end((err, res) => {
                    expect(res).to.have.status(http.ok)
                    expect(res.body).to.be.a('object')
                    expect(res.body).to.have.property('contests')
                    expect(res.body.contests).to.be.a('array')
                    expect(res.body.contests.map(c => c.id)).to.not.include(this.contest.id)
                    done()
                })
        })
    })
    context('state is ACTIVE', () => {
        before('prepare contest', function(done) {
            const tomorrow = moment().add(1, 'day')
            this.contest = Object.assign({}, mock.draftContest, {
                state: 'ACTIVE',
                endPresentation: tomorrow,
                endApplying: tomorrow,
                endVoting: tomorrow
            })
            createContest.bind(this)(done)
        })
        after(deleteContest)
        describe('client', () => {
            it('is able to fetch it as the last contest', function(done) {
                if (!this.contest.id) {
                    return this.skip()
                }
                chai.request(srv).get(_('/contest/last'))
                    .end((err, res) => {
                        expect(res).to.have.status(http.ok)
                        expect(res.body).to.be.a('object').and.have.property('contest')
                        expect(res.body.contest).to.have.property('id').and.to.equal(this.contest.id)
                        done(err)
                    })
            })
        })
        context('in PRESENTATION', () => {
            describe('project', () => {
                it('is NOT possible to submit', function(done) {
                    if (!this.contest.id) {
                        return this.skip()
                    }
                    chai.request(srv).post(_(`/contest/${this.contest.id}/project/`))
                        .by('user')
                        .send()
                        .end((err, res) => {
                            expect(res).to.have.status(http.preconditionFailed)
                            done()
                        })
                })
            })
        })
        context('in APPLYING', () => {
            before('prepare contest', function(done) {
                Object.assign(this.contest, {
                    endPresentation: moment().subtract(1, 'hour'),
                })
                updateContest.bind(this)(done)
            })
            describe('project', () => {
                it('is possible to submit', function(done) {
                    if (!this.contest.id) {
                        return this.skip()
                    }
                    chai.request(srv).post(_(`/contest/${this.contest.id}/project/`))
                        .by('user')
                        .type('form')
                        .field('title', mock.exampleProject.title)
                        .field('description', mock.exampleProject.description)
                        .attach('deliverable', require.resolve('@/package.json'))
                        .end((err, res) => {
                            expect(res).to.have.status(http.created)
                            expect(res.body).to.be.a('object')
                            expect(res.body).to.have.property('project')
                            expect(res.body.project).to.have.property('id')
                            this.project = res.body.project
                            done(err)
                        })
                })
                it('is possible to edit', function(done) {
                    if (!this.contest.id || !this.project.id) {
                        return this.skip()
                    }
                    chai.request(srv).put(_(`/contest/${this.contest.id}/project/${this.project.id}`))
                        .by('user')
                        .type('form')
                        .field('title', 'New Title')
                        .field('description', 'New Description')
                        .end((err, res) => {
                            expect(res).to.have.status(http.ok)
                            this.project = res.body.project
                            done(err)
                        })
                })
                it('is public', function(done) {
                    if (!this.contest.id || !this.project.id) {
                        return this.skip()
                    }
                    chai.request(srv).get(_(`/contest/${this.contest.id}/project`))
                        .end((err, res) => {
                            expect(res).to.have.status(http.ok)
                            expect(res.body).to.be.a('object').and.have.property('projects').and.to.be.a('array')
                            expect(res.body.projects.map(p => p.id)).to.include(this.project.id)
                            done(err)
                        })
                })
                describe('admin', () => {
                    it('is able to approve', function(done) {
                        if (!this.contest.id || !this.project.id) {
                            return this.skip()
                        }
                        chai.request(srv).put(_(`/admin/contest/${this.contest.id}/project/${this.project.id}/approve`))
                            .by('admin')
                            .end((err, res) => {
                                expect(res).to.have.status(http.noContent)
                                chai.request(srv).get(_(`/contest/${this.contest.id}/project/${this.project.id}`))
                                    .end((err, res) => {
                                        expect(res.body).to.be.a('object').and.have.property('project').and.to.be.a('object')
                                        expect(res.body.project).to.have.property('approved').and.equal(true)
                                        done(err)
                                    })
                            })
                    })
                })
                describe('user', () => {
                    it('is NOT able to vote', function(done) {
                        if (!this.contest.id || !this.project.id) {
                            return this.skip()
                        }
                        chai.request(srv).put(_(`/contest/${this.contest.id}/project/${this.project.id}/vote`))
                            .by('user')
                            .end((err, res) => {
                                expect(res).to.have.status(http.preconditionFailed)
                                done(err)
                            })
                    })
                })
            })
        })
        context('in VOTING', () => {
            before('prepare project', function(done) {
                chai.request(srv).post(_(`/contest/${this.contest.id}/project/`))
                    .by('projectOwner')
                    .type('form')
                    .field('title', mock.exampleProject.title)
                    .field('description', mock.exampleProject.description)
                    .attach('deliverable', require.resolve('@/package.json'))
                    .end((err, res) => {
                        expect(res).to.have.status(http.created)
                        expect(res.body).to.be.a('object')
                        expect(res.body).to.have.property('project')
                        expect(res.body.project).to.have.property('id')
                        this.project = res.body.project
                        done(err)
                    })
            })
            before('prepare contest', function(done) {
                Object.assign(this.contest, {
                    endApplying: moment().subtract(1, 'hour'),
                })
                updateContest.bind(this)(done)
            })
            describe('project', () => {
                it('is NOT possible to submit', function(done) {
                    if (!this.contest.id) {
                        return this.skip()
                    }
                    chai.request(srv).post(_(`/contest/${this.contest.id}/project/`))
                        .by('user')
                        .type('form')
                        .field('title', mock.exampleProject.title)
                        .field('description', mock.exampleProject.description)
                        .attach('deliverable', require.resolve('@/package.json'))
                        .end((err, res) => {
                            expect(res).to.have.status(http.preconditionFailed)
                            done(err)
                        })
                })
                it('is NOT possible to edit', function(done) {
                    if (!this.contest.id || !this.project.id) {
                        return this.skip()
                    }
                    chai.request(srv).put(_(`/contest/${this.contest.id}/project/${this.project.id}`))
                        .by('projectOwner')
                        .type('form')
                        .field('title', 'New Title')
                        .field('description', 'New Description')
                        .end((err, res) => {
                            expect(res).to.have.status(http.preconditionFailed)
                            done(err)
                        })
                })
                describe('user', function() {
                    it('is able to vote', function(done) {
                        if (!this.contest.id || !this.project.id) {
                            return this.skip()
                        }
                        chai.request(srv).put(_(`/contest/${this.contest.id}/project/${this.project.id}/vote`))
                            .by('user')
                            .end((err, res) => {
                                expect(res).to.have.status(http.noContent)
                                done(err)
                            })
                    })
                    it('is NOT able to vote more than once for the same project', function(done) {
                        if (!this.contest.id || !this.project.id) {
                            return this.skip()
                        }
                        chai.request(srv).put(_(`/contest/${this.contest.id}/project/${this.project.id}/vote`))
                            .by('user')
                            .end((err, res) => {
                                expect(res).to.have.status(http.preconditionFailed)
                                done(err)
                            })
                    })
                    it('is able to revoke its vote', function(done) {
                        if (!this.contest.id || !this.project.id) {
                            return this.skip()
                        }
                        chai.request(srv).delete(_(`/contest/${this.contest.id}/project/${this.project.id}/vote`))
                            .by('user')
                            .end((err, res) => {
                                expect(res).to.have.status(http.noContent)
                                chai.request(srv).get(_(`/contest/${this.contest.id}/project/${this.project.id}`))
                                    .end((err, res) => {
                                        expect(res).to.have.status(http.ok)
                                        expect(res.body).to.be.a('object')
                                        expect(res.body).to.have.property('project')
                                        expect(res.body.project).to.have.property('votes').and.to.be.a('array')
                                        expect(res.body.project.votes.map(v => v.id)).to.not.include('user')
                                        done(err)
                                    })
                            })
                    })
                })
            })
        })
    })
})
