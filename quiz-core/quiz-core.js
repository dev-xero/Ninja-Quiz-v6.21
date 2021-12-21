export class QuizCore {
	constructor() {
		this.timeElapsed = 30
		this.points = 0
		this.totalQuestions = questions.length
		this.currentQuestionIndex = 0
		this.currentQuestionNum = 1
		this.currentAnswered = 0
		this.quizBox = document.querySelector('#quiz-layout')
		this.renderOptionsUl = document.querySelector('#render-questions')
		this.timerComponent = document.querySelector('#countdown')
		this.timeDisplay = document.querySelector('#inner-timer')
		this.renderTitle = document.querySelector('#render-title')
		this.renderPoints = document.querySelector('#points-inner')
		this.renderTotalQuestions = document.querySelector('span#total')
		this.renderAnsweredQuestions = document.querySelector('span#current')
		this.nextQuestionButton = document.querySelector('#next-question')
		this.finishQuizButton = document.querySelector('#finish-quiz')
		this.finishedQuizBox = document.querySelector('#finished-quiz-box')
		this.pointsLost = 0
		this.wrongQuestions = 0
		this.correctQuestions = 0
		this.statsButton = document.querySelector('#stats-home')
	}
	startTimer = () => {
		this.timeElapsed = 30
		this.timerComponent.textContent = this.timeElapsed
		this.timeDisplay.textContent = `Time Left:`
		this.timerInit = setInterval(() => {
			if(this.timeElapsed > 0) {
				this.timeElapsed -= 1
				if(this.timeElapsed < 10) {
					this.timerComponent.textContent = `0${this.timeElapsed}`
				} else {
					this.timerComponent.textContent = this.timeElapsed
				}
			} else {
				this.timeDisplay.textContent = `Time's Up!`
				this.renderAnsweredQuestions.textContent = this.currentAnswered
				this.disableOptions()
				this.autoSelect()
				this.renderPoints.textContent = this.points
				this.timerComponent.textContent = `0${this.timeElapsed}`
				clearInterval(this.timerInit)
			}
		}, 1000)
	}
	renderTitleFunc= () => {
		this.renderTitle.textContent = `
			${questions[this.currentQuestionIndex].num}. ${questions[this.currentQuestionIndex].question}
		`
	}
	renderOptions = () => {
		this.renderOptionsUl.innerHTML = ''
		const indexOption = (n = 0) => {
			if(n < questions[this.currentQuestionIndex].options.length) {
				this.renderOptionsUl.innerHTML += `
					<li class="question">
						${questions[this.currentQuestionIndex].options[n]}
					</li>
				` 
				indexOption(n + 1)
			}
		}
		const attachEvents = (n = 0) => {
			if(n < this.renderOptionsUl.childElementCount) {
				this.renderOptionsUl.children[n].addEventListener('click', this.handleClick, false)
				attachEvents(n + 1)
			}
		}
		indexOption(0)
		attachEvents(0)
	}
	handleClick = (event) => {
		clearInterval(this.timerInit)
		if(this.currentQuestionNum < this.totalQuestions) {
			this.nextQuestionButton.classList.add('visible')
		} else {
			this.finishQuizButton.classList.add('visible')
		}
		if(event.target.textContent.trim() === questions[this.currentQuestionIndex].answer) {
			if(this.timeElapsed >= 15) {
				this.awardBonus()
			} else {
				this.points += 1
			}
			this.correctQuestions++
			this.currentAnswered = this.currentAnswered + 1
			this.renderAnsweredQuestions.textContent = this.currentAnswered
			event.target.innerHTML += `<i class="icon mdi mdi-check-bold"><i/>`
			event.target.classList.add('correct')
			this.disableOptions()
			this.renderPoints.textContent = this.points
		} else {
			// this.renderAnsweredQuestions.textContent = this.currentAnswered
			this.renderAnsweredQuestions.textContent = this.currentAnswered
			event.target.innerHTML += `<i class="icon mdi mdi-close"><i/>`
			event.target.classList.add('incorrect')
			this.disableOptions()
			this.autoSelect()
			this.renderPoints.textContent = this.points
		}
	}
	disableOptions = () => {
		const disableChild = (n = 0) => {
			if(n < this.renderOptionsUl.childElementCount) {
				this.renderOptionsUl.children[n].classList.add('disabled')
				disableChild(n + 1)
			}
		}
		disableChild(0)
	}
	autoSelect = () => {
		const indexSearch = (r = 0) => {
			if(r < this.renderOptionsUl.childElementCount) {
				if(this.renderOptionsUl.children[r].textContent.trim() === questions[this.currentQuestionIndex].answer) {
					this.renderOptionsUl.children[r].innerHTML += `<i class="icon mdi mdi-check-bold"><i/>`
					this.renderOptionsUl.children[r].classList.add('correct')
				}
				indexSearch(r + 1)
			}
		}
		if(this.timeElapsed >= 15) {
			this.pointsLost++
		} else {
			this.pointsLost += 5
		}
		this.wrongQuestions++
		this.currentAnswered++
		this.renderAnsweredQuestions.textContent = this.currentAnswered
		indexSearch(0)
		if(this.currentQuestionNum < this.totalQuestions) {
			this.nextQuestionButton.classList.add('visible')
			// this.currentAnswered = this.currentAnswered + 1
		} else {
			this.finishQuizButton.classList.add('visible')
		}
	}
	awardBonus = () => {
		this.points += 5
	}
	nextQuestion = () => {
		if(this.currentQuestionNum < this.totalQuestions) {
			this.currentQuestionNum = this.currentQuestionNum + 1
			this.currentQuestionIndex = this.currentQuestionIndex + 1
			this.quiz()
		}
	}
	quiz = () => {
		this.nextQuestionButton.classList.remove('visible')
		this.renderAnsweredQuestions.textContent = this.currentAnswered
		this.renderTotalQuestions.textContent = this.totalQuestions
		this.renderTitleFunc()
		this.renderOptions()
		this.startTimer()
	}
	finishQuiz = () => {
		this.quizBox.classList.add('hidden')
		this.quizBox.style.display = 'none'
		this.finishedQuizBox.classList.remove('hidden')
		this.generateResults()
	}
	generateResults = () => {
		console.log(
			'Gotten:', this.points ,this.correctQuestions, 
			'| Lost:', this.pointsLost, this.wrongQuestions
		)
	}
}