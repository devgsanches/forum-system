import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

describe('Create Question UseCase', () => {
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: CreateQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    )

    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository) // system under test
  })

  it('should be able to create a question', async () => {
    const response = await sut.execute({
      studentId: new UniqueEntityId('1'),
      title: 'Title',
      content: 'Content',
      attachmentsIds: [new UniqueEntityId('1'), new UniqueEntityId('2')],
    })

    if (response.isRight()) {
      const { question } = response.result

      expect(question).toMatchObject(
        expect.objectContaining({
          id: question.id,
          studentId: new UniqueEntityId('1'),
          title: 'Title',
          content: 'Content',
        })
      )
      expect(question.attachments.currentItems).toHaveLength(2)
      expect(question.attachments.currentItems).toEqual([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('2'),
        }),
      ])
    }
  })
})
