import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
// import { User } from '../users/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, fullName: string, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;
    console.log('user: ', email);

    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: fullName,
        url,
      },
    });
  }

  async sendUserOtp(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Your otp code',
      template: './otp', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        email: email,
        otp,
      },
    });
  }
}
