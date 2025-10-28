import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

describe('Answer Question UseCase', () => {
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let sut: AnswerQuestionUseCase

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository) // system under test
  })

  it('should be able to answer a question', async () => {
    const response = await sut.execute({
      authorId: new UniqueEntityId('1'),
      questionId: new UniqueEntityId('2'),
      content: 'New answer',
      attachmentsIds: [
        new UniqueEntityId(),
        new UniqueEntityId(),
        new UniqueEntityId(),
      ],
    })

    if (response.isRight()) {
      const { answer } = response.result

      expect(inMemoryAnswersRepository.items[0]).toMatchObject(
        expect.objectContaining({
          id: answer.id,
          authorId: new UniqueEntityId('1'),
          questionId: new UniqueEntityId('2'),
          content: 'New answer',
        })
      )
      expect(answer.attachments.currentItems).toHaveLength(3)
      // expect(answer.attachments).toEqual([
      //   expect.objectContaining({
      //     attachmentId: new UniqueEntityId('1'),
      //   }),
      //   expect.objectContaining({
      //     attachmentId: new UniqueEntityId('2'),
      //   }),
      //   expect.objectContaining({
      //     attachmentId: new UniqueEntityId('3'),
      //   }),
      // ])
    }
  })
})
