import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { ChooseBestAnswerUseCase } from './choose-best-answer'
import type { Question } from '../../enterprise/entities/question'
import type { Answer } from '../../enterprise/entities/answer'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

describe('Choose Best Answer UseCase', () => {
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository

  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let inMemoryAnswersRepository: InMemoryAnswersRepository

  let question: Question
  let answer: Answer
  let sut: ChooseBestAnswerUseCase

  beforeEach(async () => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    )

    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    )

    sut = new ChooseBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository
    ) // system under test

    question = makeQuestion({
      studentId: new UniqueEntityId('student-01'),
    })
    answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)
  })

  it('should be able to choose a best answer', async () => {
    const response = await sut.execute({
      answerId: answer.id,
      studentId: question.studentId,
    })

    if (response.isRight()) {
      const { question } = response.result
      expect(question).toMatchObject(
        expect.objectContaining({
          id: question.id,
          bestAnswerId: question.bestAnswerId,
        })
      )
    }
  })

  it('should not be able to choose a best answer from another student', async () => {
    const question = makeQuestion({
      studentId: new UniqueEntityId('student-02'),
    })

    await inMemoryQuestionsRepository.create(question)

    const response = await sut.execute({
      answerId: answer.id,
      studentId: question.studentId,
    })

    if (response.isLeft()) {
      expect(response.reason).toBeInstanceOf(NotAllowedError)
    }
  })
})
