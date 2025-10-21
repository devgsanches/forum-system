import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { Question } from '../../enterprise/entities/question'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'

describe('Delete Question UseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let questionToDelete: Question
  let sut: DeleteQuestionUseCase

  beforeEach(async () => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository) // system under test

    // create 5 questions
    async function createFiveQuestions() {
      for (let i = 0; i <= 4; i++) {
        const newQuestion = makeQuestion()
        await inMemoryQuestionsRepository.create(newQuestion)
      }
      return
    }

    await createFiveQuestions()

    // create more one question
    questionToDelete = makeQuestion()
    await inMemoryQuestionsRepository.create(questionToDelete)
  })

  it('should be able to delete a question', async () => {
    const response = await sut.execute({
      id: questionToDelete.id,
    })

    if (response.isRight()) {
      const { questions } = response.result
      expect(questions).toHaveLength(5)
      expect(questions).not.toContain(questionToDelete)
    }
  })
})
