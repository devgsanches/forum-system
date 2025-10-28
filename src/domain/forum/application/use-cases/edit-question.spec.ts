import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { Question } from '../../enterprise/entities/question'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Student } from '../../enterprise/entities/student'
import { makeStudent } from 'test/factories/make-student'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

describe('Edit Question UseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let student: Student
  let question: Question
  let attachments: QuestionAttachment[]
  let sut: EditQuestionUseCase

  async function createQuestionAndAttachments() {
    student = makeStudent({}, new UniqueEntityId('student-01'))

    question = makeQuestion({}, new UniqueEntityId('question-01'))
    await inMemoryQuestionsRepository.create(question)

    attachments = [
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId('1'),
        questionId: question.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId('2'),
        questionId: question.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId('3'),
        questionId: question.id,
      }),
    ]
    attachments.forEach(attachment => {
      inMemoryQuestionAttachmentsRepository.items.push(attachment)
    })
  }

  beforeEach(async () => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    )

    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository
    ) // system under test

    await createQuestionAndAttachments()
  })

  it('should be able to edit a question', async () => {
    const response = await sut.execute({
      id: inMemoryQuestionsRepository.items[0].id,
      studentId: student.id,
      title: 'New title',
      content: 'New content',
      attachmentsIds: [
        new UniqueEntityId('1'),
        new UniqueEntityId('3'),
        new UniqueEntityId('4'),
      ],
    })

    if (response.isRight()) {
      const { question } = response.result

      expect(question).toMatchObject(
        expect.objectContaining({
          id: inMemoryQuestionsRepository.items[0].id,
          title: 'New title',
          content: 'New content',
          slug: expect.objectContaining({ value: 'new-title' }),
        })
      )
      expect(question.attachments.currentItems).toEqual([
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
      expect(question.attachments.getRemovedItems()).toEqual([
        expect.objectContaining({
          attachmentId: expect.objectContaining({
            _value: '2',
          }),
        }),
      ])
      expect(question.attachments.getNewItems()).toEqual([
        expect.objectContaining({
          attachmentId: expect.objectContaining({
            _value: '4',
          }),
        }),
      ])
    }
  })
})
