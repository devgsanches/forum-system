import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { Answer } from '../../enterprise/entities/answer'
import { makeAnswer } from 'test/factories/make-answer'
import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import type { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

describe('Delete Answer UseCase', () => {
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let answerToDelete: Answer
  let attachments: AnswerAttachment[]
  let sut: DeleteAnswerUseCase

  beforeEach(async () => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    )

    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository) // system under test

    // create 5 answers
    async function createFiveAnswers() {
      for (let i = 0; i <= 4; i++) {
        const newAnswer = makeAnswer({
          authorId: new UniqueEntityId('student-01'),
        })
        await inMemoryAnswersRepository.create(newAnswer)
      }
      return
    }

    await createFiveAnswers()

    // create more one answer
    answerToDelete = makeAnswer({
      authorId: new UniqueEntityId('student-02'),
    })
    await inMemoryAnswersRepository.create(answerToDelete)

    attachments = [
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('1'),
        answerId: answerToDelete.id,
      }),
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('2'),
        answerId: answerToDelete.id,
      }),
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('3'),
        answerId: answerToDelete.id,
      }),
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('4'),
        answerId: answerToDelete.id,
      }),
    ]
    answerToDelete.attachments = new AnswerAttachmentList(attachments)
  })

  it('should be able to delete a answer', async () => {
    const response = await sut.execute({
      id: answerToDelete.id,
      authorId: new UniqueEntityId('student-02'),
    })

    if (response.isRight()) {
      expect(inMemoryAnswersRepository.items).toHaveLength(5)
      expect(inMemoryAnswersRepository.items).not.toContain(answerToDelete)
      expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
    }
  })
})