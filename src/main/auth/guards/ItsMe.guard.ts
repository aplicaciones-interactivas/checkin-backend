import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

export class ItsMeGuard implements CanActivate {

  private logger: Logger;

  constructor() {
    this.logger = new Logger(ItsMeGuard.name, true);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const id = request.params.id;
    const result = (user.id === id);
    if (!result) {
      this.logger.debug('The user does not have the necessary permissions');
    }
    return result;
  }

}
