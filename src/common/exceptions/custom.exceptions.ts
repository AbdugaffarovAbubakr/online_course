import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(entity: string, id?: string | number) {
    const message = id ? `${entity} with id ${id} not found` : `${entity} not found`;
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class DuplicateEntityException extends HttpException {
  constructor(entity: string, field: string, value: string) {
    const message = `${entity} with ${field} '${value}' already exists`;
    super(message, HttpStatus.CONFLICT);
  }
}

export class InsufficientPermissionsException extends HttpException {
  constructor(action: string, requiredRole?: string) {
    const message = requiredRole 
      ? `Insufficient permissions. ${action} requires ${requiredRole} role`
      : `Insufficient permissions to ${action}`;
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class InvalidOperationException extends HttpException {
  constructor(operation: string, reason: string) {
    const message = `Cannot ${operation}: ${reason}`;
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ResourceNotFoundException extends HttpException {
  constructor(resource: string) {
    const message = `${resource} not found`;
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ValidationFailedException extends HttpException {
  constructor(errors: string[]) {
    const message = `Validation failed: ${errors.join(', ')}`;
    super(message, HttpStatus.BAD_REQUEST);
  }
} 