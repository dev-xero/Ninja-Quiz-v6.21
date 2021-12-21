// Import Quiz Core
import { QuizCore } from './quiz-core/quiz-core.js'

// initialize
const quizCore = new QuizCore

// cache DOM selection

const startScreen = document.querySelector('#start-screen')
const beginGameBtn = document.querySelector('#begin-game')

const rulesBox = document.querySelector('#rules-box')
const rejectRulesBtn = document.querySelector('button#reject')
const acceptRulesBtn = document.querySelector('button#accept')

const quizLayout = document.querySelector('#quiz-layout')
const nextQuestionButton = document.querySelector('#next-question')
const finishQuizButton = document.querySelector('#finish-quiz')

const pointsLostRender = document.querySelector('#lost-points')
const wrongQuestionsAnswered = document.querySelector('#final-score-fail')
const pointsGainedRender = document.querySelector('#final-score')
const correctQuestionsAnswered = document.querySelector('#correct-questions')
const maxPointsRender = document.querySelector('#max-score')

const mainMenuBtn = document.querySelector('#main-menu')
const statsBtn = document.querySelector('#stats-home')
const renderScore = document.querySelector('#scores-regular')
const statScreen = document.querySelector('#stats-screen')
const emptyBoard = document.querySelector('#empty')
const returnMenuBtn = document.querySelector('#return-menu')
const renderHighScore = document.querySelector('#high-score')
const checkStats = document.querySelector('#stats')
const finishedQuizBox = document.querySelector('#finished-quiz-box')

const LOCAL_STORAGE_KEY = 'quiz-scores'
let highScore = 0
const scores = localStorage[LOCAL_STORAGE_KEY] 
? JSON.parse(localStorage[LOCAL_STORAGE_KEY]) 
: []

// generate stats function

const generateStats = () => {
	pointsLostRender.innerHTML = quizCore.pointsLost === 1 
	? `<i class="mdi mdi-close-thick"></i> You Lost ${quizCore.pointsLost} point`
	: `<i class="mdi mdi-close-thick"></i> You Lost ${quizCore.pointsLost} points`
	pointsGainedRender.innerHTML = quizCore.points === 1 
	? `<i class="mdi mdi-check-all"></i> You Got ${quizCore.points} point`
	: `<i class="mdi mdi-check-all"></i> You Got ${quizCore.points} points`
	wrongQuestionsAnswered.textContent = quizCore.wrongQuestions === 1
	? `You failed ${quizCore.wrongQuestions} question`
	: `You failed ${quizCore.wrongQuestions} questions`
	correctQuestionsAnswered.textContent = quizCore.correctQuestions === 1
	? `You answered ${quizCore.correctQuestions} question correctly`
	: `You answered ${quizCore.correctQuestions} questions correctly`
	maxPointsRender.textContent = `${quizCore.totalQuestions * 5}`
	scores.push(quizCore.points)
	localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(scores)
}

// When loaded attach click event to the question button and finish button

window.onload = () => {
	generateScores()
	nextQuestionButton.addEventListener('click', () => {
		quizCore.nextQuestion()
	}, false)
	finishQuizButton.addEventListener('click', () => {
		quizCore.finishQuiz()
		generateScores()
		generateStats()
	})
	statsBtn.addEventListener('click', () => {
		statsDisplay()
	}, false)
	checkStats.addEventListener('click', () => {
		renderScore.innerHTML = ''
		generateScores()
		statsDisplay()
		finishedQuizBox.classList.add('hidden')
	})
}

// Show rules box when the begin button is clicked

beginGameBtn.addEventListener('click', () => {
	rulesBox.classList.remove('hidden')
}, false)

// Hide the rules box when the reject button is clicked

rejectRulesBtn.addEventListener('click', () => {
	rulesBox.classList.add('hidden')
}, false)

// handle quiz functions

const handleQuizFunctions = () => {
	console.log('ready') /* confirmation message */
	quizLayout.style.display = 'flex'
	quizLayout.classList.remove('hidden')
	quizCore.quiz()
}

// stats display function

const statsDisplay = () => {
	rulesBox.classList.add('hidden')
	startScreen.classList.add('hidden')
	statScreen.classList.remove('hidden')
}

// remove stats

returnMenuBtn.addEventListener('click', () => {
	rulesBox.classList.add('hidden')
	startScreen.classList.remove('hidden')
	statScreen.classList.add('hidden')
	window.location.reload()
})

// When the accept button is clicked, hide both start screen and rules box

acceptRulesBtn.addEventListener('click', () => {
	rulesBox.classList.add('hidden')
	startScreen.classList.add('hidden')
	handleQuizFunctions()
}, false)

// Return to main menu 

mainMenuBtn.addEventListener('click', () => {
	window.location.reload()
}, false)

// Generate scores function

const generateScores = () => {
	if(scores.length > 0) {
		emptyBoard.classList.add('hidden')
		const sortedScores = scores.sort((a,b) => b - a)
		sortedScores.forEach(score => {
			renderScore.innerHTML += score === 1 
			? `
					<p class="score"><i class="mdi mdi-medal-outline"></i> ${score} point</p>
				`
		: `
				<p class="score"><i class="mdi mdi-medal-outline"></i> ${score} points</p>
			`
		})
		highScore = scores.sort((a, b) => b - a)
		renderHighScore.textContent = highScore[0] === 1 
		? `${highScore[0]} point` 
		: `${highScore[0]} points`
	} else {
		emptyBoard.classList.remove('hidden')
	}
}


