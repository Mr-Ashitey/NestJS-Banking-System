import * as nodemailer from 'nodemailer';

export enum MailerResponse {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export class Mailer {
  //nodemailer transporter
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'techdev68@gmail.com',
      pass: 'jhqxmgpfjoshmhfb',
    },
  });

  mail_options = {
    from: '"Banking System GH👻" <aamarh17@gmail.com>', // sender address
    to: 'madcodein@gmail.com', // list of receivers
    subject: 'Verify Account Details', // Subject line
    text: 'We have sent you a verification link at madcodein@gmail.com. Please verify account', // plain text body
    // html: '<b>Hello world?</b>', // html body
  };

  async sendMail(): Promise<MailerResponse> {
    const mailerResponse = await this.transporter.sendMail(this.mail_options);

    if (mailerResponse.rejected.length == 0) {
      return MailerResponse.SUCCESS;
    }
    return MailerResponse.ERROR;

    console.log(`Info: ${mailerResponse.accepted}`);
    console.log(`Info: ${mailerResponse.messageId}`);
    console.log(`Info: ${mailerResponse.pending}`);
    console.log(`Info: ${mailerResponse.response}`);
    console.log(`Info: ${mailerResponse.rejected}`);
    console.log(`Info: ${mailerResponse.rejected.length}`);
  }

  // async sendMail(): Promise<MailerResponse> {
  //   let transportResponse: MailerResponse;

  //   this.transporter.sendMail(this.mail_options, async function (err, info) {
  //     if (err) {
  //       transportResponse = MailerResponse.ERROR;
  //       console.log(err);
  //       // return err;
  //     }
  //     console.log(info);
  //     console.log(transportResponse);
  //     transportResponse = MailerResponse.SUCCESS;
  //     // return info;
  //   });
  //   console.log(`Transport Response: ${transportResponse}`);
  //   return transportResponse;
  // }
}

// export const mailer = async function (): Promise<MailerResponse> {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   // const testAccount = await nodemailer.createTestAccount();

//   let mailerResponse;

//   // create reusable transporter object using the default SMTP transport
//   const transporter = nodemailer.createTransport({
//     host: 'gmail',
//     // port: 587,
//     // secure: false, // true for 465, false for other ports
//     auth: {
//       user: 'aamarh17@gmail.com', // generated ethereal user
//       pass: 'asdad', // generated ethereal password
//     },
//   });

//   const mail_options = {
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: 'bar@example.com, baz@example.com', // list of receivers
//     subject: 'Hello ✔', // Subject line
//     text: 'Hello world?', // plain text body
//     html: '<b>Hello world?</b>', // html body
//   };

//   // send mail with defined transport object
//   await transporter.sendMail(mail_options, async function (err, result) {
//     if (err) {
//       // console.log('err', err);

//       mailerResponse = MailerResponse.ERROR;
//     } else {
//       mailerResponse = MailerResponse.SUCCESS;
//     }
//   });

//   return mailerResponse;

//   // console.log('Message sent: %s', info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// };
