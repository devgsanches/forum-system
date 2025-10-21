import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import type { Answer } from '../../enterprise/entities/answer'
import { makeAnswer } from 'test/factories/make-answer'

describe('Delete Answer UseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let answerToDelete: Answer
  let sut: DeleteAnswerUseCase

  beforeEach(async () => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository) // system under test

    // create 5 answers
    async function createFiveAnswers() {
      for (let i = 0; i <= 4; i++) {
        const newAnswer = makeAnswer()
        await inMemoryAnswersRepository.create(newAnswer)
      }
      return
    }

    await createFiveAnswers()

    // create more one question
    answerToDelete = makeAnswer()
    await inMemoryAnswersRepository.create(answerToDelete)
  })

  it('should be able to delete a answer', async () => {
    const response = await sut.execute({
      id: answerToDelete.id,
    })

    if (response.isRight()) {
      const { answers } = response.result
      expect(answers).toHaveLength(5)
      expect(answers).not.toContain(answerToDelete)
    }
  })
})
