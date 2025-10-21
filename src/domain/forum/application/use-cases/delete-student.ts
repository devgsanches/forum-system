import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IStudentsRepository } from '../repositories/students-repository'
import type { Student } from '../../enterprise/entities/student'
import { right, type Either } from '@/core/either'

interface DeleteStudentUseCaseRequest {
  id: UniqueEntityId
}

type DeleteStudentUseCaseResponse = Either<
  undefined,
  {
    students: Student[]
  }
>

export class DeleteStudentUseCase {
  constructor(private studentsRepository: IStudentsRepository) {}

  async execute({
    id,
  }: DeleteStudentUseCaseRequest): Promise<DeleteStudentUseCaseResponse> {
    const students = await this.studentsRepository.delete(id)

    return right({ students })
  }
}
