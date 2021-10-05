import {BadRequestException, Injectable} from '@nestjs/common';
import {IUser} from '../users/interfaces/user.interface';
import {ConfigService} from '@nestjs/config';
import {InjectSendGrid, SendGridService} from '@ntegral/nestjs-sendgrid';
import {ResetPassword} from '../auth/schemas/reset-pass.schema';

@Injectable()
export class EmailService {
  constructor(
    @InjectSendGrid() private readonly sendGridClient: SendGridService,
    private configService: ConfigService,
  ) {}

  public async sendEmailConfirmationCode(user: IUser, code: string) {
    // template/resetPassword.handlebars
    const msg = {
      to: user.email,
      from: this.configService.get('SENDGRID_EMAIL'),
      subject: `Confirm your ${this.configService.get('APP_NAME')} email account`,
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${user.firstName}</h2>
        <p>Thank you for registration. Please confirm your email by clicking on the following link:</p>
        <a href="https://localhost:3000/api/auth/email/confirm?code=${code}"> https://gagotapp.com?/${code}</a>
        </div>`,
    };
    try {
      return this.sendGridClient.send(msg);
    } catch (e) {
      throw new BadRequestException('Email sent Failed', e);
    }
  }

  public async sendResetToken(user: IUser, token: string) {
    // template/resetPassword.handlebars
    const msg = {
      to: user.email,
      from: this.configService.get('SENDGRID_EMAIL'),
      subject: `Resetting your ${this.configService.get('APP_NAME')} password`,
      html: `<h1>Resetting password</h1>
        <h2>Hello ${user.firstName}</h2>
        <p>To complete the password reset process, visit the following link: </p>
        <a href="https://localhost:3000/api/auth/reset-password/confirm?token=${token}">Confirm reset password by clicking this link</a>
        </div>`,
    };
    try {
      return this.sendGridClient.send(msg);
    } catch (e) {
      throw new BadRequestException('Email sent Failed', e);
    }
  }

  public async resetPasswordSuccess(user: IUser): Promise<BadRequestException | any> {
    // template/resetPassword.handlebars
    const msg = {
      to: user.email,
      from: this.configService.get('SENDGRID_EMAIL'),
      subject: `Password Reset ${this.configService.get('APP_NAME')} Successfully`,
      html: `<h1>Password Reset Done</h1>
        <h2>Hello ${user.firstName}</h2>
        <p>Your password reset successfully completed</p>
        </div>`,
    };
    try {
      return this.sendGridClient.send(msg);
    } catch (e) {
      throw new BadRequestException('Email sent Failed', e);
    }
  }
}
