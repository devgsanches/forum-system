import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { ListAnswersByQuestionUseCase } from './list-answers-by-question-id'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import type { Question } from '../../enterprise/entities/question'

describe('List Answers By Question UseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository

  let oneQuestion: Question
  let twoQuestion: Question
  let sut: ListAnswersByQuestionUseCase

  beforeEach(async () => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()

    sut = new ListAnswersByQuestionUseCase(inMemoryAnswersRepository) // system under test

    oneQuestion = makeQuestion({}, new UniqueEntityId('1'))
    twoQuestion = makeQuestion({}, new UniqueEntityId('2'))

    async function createAnswersToOneQuestion() {
      // create 5 answers
      for (let i = 1; i <= 5; i++) {
        const newAnswer = makeAnswer({
          questionId: oneQuestion.id,
        })
        await inMemoryAnswersRepository.create(newAnswer)
      }
      return
    }

    async function createAnswersToTwoQuestion() {
      // create 5 answers
      for (let i = 1; i <= 5; i++) {
        const newAnswer = makeAnswer({
          questionId: twoQuestion.id,
        })
        await inMemoryAnswersRepository.create(newAnswer)
      }
      return
    }

    createAnswersToOneQuestion()
    createAnswersToTwoQuestion()
  })

  it('should be able to list all answers by question', async () => {
    const response = await sut.execute({
      questionId: oneQuestion.id,
      page: 1,
    })

    if (response.isRight()) {
      const { answers } = response.result

      expect(answers).toHaveLength(5)
      expect(answers).not.toContain(
        expect.objectContaining({ questionId: twoQuestion.id.toValue() })
      )
    }
  })
})
