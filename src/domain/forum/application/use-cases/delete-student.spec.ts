import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository-repository'
import { Student } from '../../enterprise/entities/student'
import { DeleteStudentUseCase } from './delete-student'
import { makeStudent } from 'test/factories/make-student'

describe('Delete Student UseCase', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let studentToDelete: Student
  let sut: DeleteStudentUseCase

  beforeEach(async () => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    sut = new DeleteStudentUseCase(inMemoryStudentsRepository) // system under test

    // create 5 students
    async function createFiveStudents() {
      for (let i = 0; i <= 4; i++) {
        const newStudent = makeStudent()
        await inMemoryStudentsRepository.create(newStudent)
      }
      return
    }

    await createFiveStudents()

    // create more one question
    studentToDelete = makeStudent()
    await inMemoryStudentsRepository.create(studentToDelete)
  })

  it('should be able to delete a student', async () => {
    const response = await sut.execute({
      id: studentToDelete.id,
    })

    if (response.isRight()) {
      const { students } = response.result
      expect(students).toHaveLength(5)
      expect(students).not.toContain(studentToDelete)
    }
  })
})
