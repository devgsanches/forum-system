import { Answer } from '../../enterprise/entities/answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Student } from '../../enterprise/entities/student'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { CommentAnswerUseCase } from './create-answer-comment'

describe('Comment Answer UseCase', () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

  let author: Student
  let answer: Answer

  let sut: CommentAnswerUseCase

  async function createNewAnswer() {
    author = makeStudent({}, new UniqueEntityId('student-01'))
    answer = makeAnswer(
      {
        authorId: author.id,

        content: 'No content',
      },
      new UniqueEntityId('answer-01')
    )

    new InMemoryAnswersRepository().create(answer)
  }

  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentAnswerUseCase(inMemoryAnswerCommentsRepository) // system under test

    createNewAnswer()
  })

  it('should be able to comment a answer', async () => {
    const response = await sut.execute({
      content: 'What is the title of the answer?',
      answerId: answer.id,
      authorId: author.id,
    })

    if (response.isRight()) {
      const { answerComment } = response.result
      expect(inMemoryAnswerCommentsRepository.items[0]).toEqual(
        expect.objectContaining({
          id: answerComment.id,
          content: 'What is the title of the answer?',
          answerId: answer.id,
          authorId: author.id,
        })
      )
    }
  })
})
