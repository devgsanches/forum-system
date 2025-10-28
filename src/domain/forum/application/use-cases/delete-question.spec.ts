import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { Question } from '../../enterprise/entities/question'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import type { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

describe('Delete Question UseCase', () => {
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let questionToDelete: Question
  let attachments: QuestionAttachment[]
  let sut: DeleteQuestionUseCase

  beforeEach(async () => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    )

    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository) // system under test

    // create 5 questions
    async function createFiveQuestions() {
      for (let i = 0; i <= 4; i++) {
        const newQuestion = makeQuestion({
          studentId: new UniqueEntityId('student-01'),
        })
        await inMemoryQuestionsRepository.create(newQuestion)
      }
      return
    }

    await createFiveQuestions()

    // create more one question
    questionToDelete = makeQuestion({
      studentId: new UniqueEntityId('student-02'),
    })
    await inMemoryQuestionsRepository.create(questionToDelete)

    attachments = [
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId('1'),
        questionId: questionToDelete.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId('2'),
        questionId: questionToDelete.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId('3'),
        questionId: questionToDelete.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId('4'),
        questionId: questionToDelete.id,
      }),
    ]
    questionToDelete.attachments = new QuestionAttachmentList(attachments)
  })

  it('should be able to delete a question', async () => {
    const response = await sut.execute({
      id: questionToDelete.id,
      studentId: new UniqueEntityId('student-02'),
    })

    if (response.isRight()) {
      expect(inMemoryQuestionsRepository.items).toHaveLength(5)
      expect(inMemoryQuestionsRepository.items).not.toContain(questionToDelete)
      expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
    }
  })
})
