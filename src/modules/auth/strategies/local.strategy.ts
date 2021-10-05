import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {ContextIdFactory, ModuleRef} from '@nestjs/core';
import {AuthService} from '../auth.service';

export const LOCAL_STRATEGY_FIELD = 'mobilePhone';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      usernameField: LOCAL_STRATEGY_FIELD,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, mobilePhone: string, password: string): Promise<string> {
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    return authService.loginWithPhone(mobilePhone, password);
  }
}
