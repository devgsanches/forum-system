import { right, type Either } from '@/core/either'
import { Student } from '../../enterprise/entities/student'
import type { IStudentsRepository } from '../repositories/students-repository'

interface CreateStudentUseCaseRequest {
  name: string
}

type CreateStudentUseCaseResponse = Either<
  undefined,
  {
    student: Student
  }
>

export class CreateStudentUseCase {
  constructor(private studentsRepository: IStudentsRepository) {}

  async execute({
    name,
  }: CreateStudentUseCaseRequest): Promise<CreateStudentUseCaseResponse> {
    const student = Student.create({
      name,
    })

    await this.studentsRepository.create(student)

    return right({ student })
  }
}
