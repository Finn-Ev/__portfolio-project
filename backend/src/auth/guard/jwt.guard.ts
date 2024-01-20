import { AuthGuard } from '@nestjs/passport';

// one could also use "AuthGuard('jwt')" directly
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
