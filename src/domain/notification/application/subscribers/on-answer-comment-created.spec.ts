import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { waitFor } from 'test/utils/wait-for'
import { OnAnswerCommentCreated } from './on-answer-comment-created'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sendNotificationExecuteSpy: any

describe('On Answer Comment Created', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    )

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute')

    new OnAnswerCommentCreated(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
      sut
    )
  })

  it('should be able to send a notification when a answer comment is created', async () => {
    const answer = makeAnswer()
    const comment = makeAnswerComment({
      answerId: answer.id,
    })

    inMemoryAnswersRepository.create(answer)
    inMemoryAnswerCommentsRepository.create(comment)

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled())
  })
})
