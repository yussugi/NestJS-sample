import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiedStatuses = this.reflector.get<string[]>(
      'statuses',
      ctx.getHandler(),
    );
    if (!requiedStatuses) {
      return true;
    }

    const { user } = ctx.switchToHttp().getRequest();
    return requiedStatuses.some((status) => user.status.includes(status));
  }
}
