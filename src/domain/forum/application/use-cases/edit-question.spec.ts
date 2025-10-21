import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { Question } from '../../enterprise/entities/question'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Student } from '../../enterprise/entities/student'
import { makeStudent } from 'test/factories/make-student'

describe('Edit Question UseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let student: Student
  let newQuestion: Question
  let sut: EditQuestionUseCase

  async function createNewQuestion() {
    student = makeStudent({}, new UniqueEntityId('student-01'))

    newQuestion = makeQuestion({
      studentId: student.id,
    })
    await inMemoryQuestionsRepository.create(newQuestion)
  }

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository) // system under test

    createNewQuestion()
  })

  it('should be able to edit a question', async () => {
    const response = await sut.execute({
      id: newQuestion.id,
      studentId: student.id,
      title: 'New title',
      content: 'New content',
    })

    if (response.isRight()) {
      const { question } = response.result

      expect(question).toMatchObject(
        expect.objectContaining({
          id: question.id,
          title: 'New title',
          content: 'New content',
          slug: expect.objectContaining({ value: 'new-title' }),
        })
      )
    }
  })
})
