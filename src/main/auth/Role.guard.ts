import { CanActivate } from '@nestjs/common/interfaces/features/can-activate.interface';
import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';

export class RoleGuard implements CanActivate {

  private readonly logger: Logger;

  constructor(private readonly roles: string[]) {
    this.logger = new Logger(RoleGuard.name, true);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const result = user.roles.filter(value => this.roles.includes(value)).length;
    if (!result) {
      this.logger.debug('The user does not have the necessary permissions');
    }
    return result;
  }
}
