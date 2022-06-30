import * as nodemailer from 'nodemailer';

export enum MailerResponse {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export class Mailer {
  private email: string;
  private subject: string;
  private text: string;

  constructor(email: string, subject: string, text: string) {
    this.email = email;
    this.subject = subject;
    this.text = text;
  }
  //nodemailer transporter
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendMail(): Promise<any> {
    const mail_options = {
      from: '"Banking System GH" <a@emil.com>', // sender address
      to: `${this.email}`, // list of receivers
      subject: this.subject, // Subject line
      // text: this.text, // plain text body
      html: `
            <head>
         <style>
          table, td, div, h1, p {font-family: Arial, sans-serif;}
        </style>
      </head>
      <body style="margin:0;padding:0;">
        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
          <tr>
            <td align="center" style="padding:0;">
              <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                <tr>
                  <td align="center" style="padding:40px 0 30px 0;background:#848889;">
                    <img src="https://images.unsplash.com/photo-1581349437898-cebbe9831942?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" width="300" style="height:auto;display:block;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 30px 42px 30px;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                      <tr>
                        <td style="padding:0 0 36px 0;color:#153643;">
                          <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Banking System GH</h1>
                          <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Kindly follow this link, <a href="${this.text}">ACCOUNT VERIFICATION</a> , to verify your account and activate it.</p>

                        </td>
                      </tr>

                  <td style="padding:30px;background:#ee4c50;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                      <tr>
                        <td style="padding:0;width:50%;" align="left">
                          <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                            &reg; Banking System, Ghana 2022<br/><a href="http://www.example.com" style="color:#ffffff;text-decoration:underline;">Unsubscribe</a>
                          </p>
                        </td>
                        <td style="padding:0;width:50%;" align="right">
                          <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                            <tr>
                              <td style="padding:0 0 0 10px;width:38px;">
                                <a href="http://www.twitter.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                              </td>
                              <td style="padding:0 0 0 10px;width:38px;">
                                <a href="http://www.facebook.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `, // html body
    };

    try {
      const mailerResponse = await this.transporter.sendMail(mail_options);
      // this.transporter.sendMail(mail_options, async (err, info) => {
      //   console.log(err);
      //   console.log(info);
      // });
      // console.log(`Mailer: ${mailerResponse}`);

      console.log(`Info: ${mailerResponse.accepted}`);
      console.log(`Info: ${mailerResponse.messageId}`);
      console.log(`Info: ${mailerResponse.pending}`);
      console.log(`Info: ${mailerResponse.response}`);
      console.log(`Info: ${mailerResponse.rejected}`);
      console.log(`Info: ${mailerResponse.rejected.length}`);

      if (mailerResponse.rejected.length == 0) {
        return MailerResponse.SUCCESS;
      }
      return MailerResponse.ERROR;
    } catch (error) {
      return MailerResponse.ERROR;
    }
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
