import { CreateStudentUseCase } from './create-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

describe('Create Student UseCase', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: CreateStudentUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    sut = new CreateStudentUseCase(inMemoryStudentsRepository) // system under test
  })

  it('should be able to create a student', async () => {
    const response = await sut.execute({
      name: 'John',
    })

    if (response.isRight()) {
      const { student } = response.result

      expect(student).toMatchObject(expect.objectContaining({
        id: student.id,
        name: 'John',
      }))
    }
  })
})
