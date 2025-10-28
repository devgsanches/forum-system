import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { Answer } from '../../enterprise/entities/answer'
import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Student } from '../../enterprise/entities/student'
import { makeStudent } from 'test/factories/make-student'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

describe('Edit Answer UseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let student: Student
  let answer: Answer
  let attachments: AnswerAttachment[]
  let sut: EditAnswerUseCase

  async function createAnswerAndAttachments() {
    student = makeStudent({}, new UniqueEntityId('student-01'))

    answer = makeAnswer(
      {
        authorId: student.id,
      },
      new UniqueEntityId('answer-01')
    )
    await inMemoryAnswersRepository.create(answer)

    attachments = [
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('1'),
        answerId: answer.id,
      }),
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('2'),
        answerId: answer.id,
      }),
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('3'),
        answerId: answer.id,
      }),
    ]
    attachments.forEach(attachment => {
      inMemoryAnswerAttachmentsRepository.items.push(attachment)
    })
  }

  beforeEach(async () => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository
    ) // system under test

    await createAnswerAndAttachments()
  })

  it('should be able to edit a answer', async () => {
    const response = await sut.execute({
      id: inMemoryAnswersRepository.items[0].id,
      authorId: student.id,
      content: 'New content',
      attachmentsIds: [
        new UniqueEntityId('1'),
        new UniqueEntityId('3'),
        new UniqueEntityId('4'),
      ],
    })

    if (response.isRight()) {
      const { answer } = response.result

      expect(answer).toMatchObject(
        expect.objectContaining({
          id: inMemoryAnswersRepository.items[0].id,
          content: 'New content',
        })
      )
      expect(answer.attachments.currentItems).toEqual([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('3'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('4'),
        }),
      ])
      expect(answer.attachments.getRemovedItems()).toEqual([
        expect.objectContaining({
          attachmentId: expect.objectContaining({
            _value: '2',
          }),
        }),
      ])
      expect(answer.attachments.getNewItems()).toEqual([
        expect.objectContaining({
          attachmentId: expect.objectContaining({
            _value: '4',
          }),
        }),
      ])
    }
  })
})
