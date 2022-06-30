import axios = require('axios');
export class Utils {
  private static baseUrl = 'https://emailverification.whoisxmlapi.com/api/v2';

  static extractErrorMessage(error: any): string {
    return error.detail
      .replace('Key', '')
      .replace('(', '')
      .replace(')', '')
      .replace(' ', '');
  }

  static generateUsername(firstName: string, lastName: string): string {
    return (
      firstName.substring(0, 1) + lastName + Math.floor(10 + Math.random() * 90)
    );
  }

  static generateAccountNumber(): number {
    return Math.floor(10000000000000000 + Math.random() * 90000000000000000); //17 number
  }

  static async verifyEmail(email: string) {
    try {
      const response = await axios.default.get(
        `${this.baseUrl}?apiKey=${process.env.EMAIL_VERIFIER_KEY}&emailAddress=${email}&checkDisposable=0&checkFree=0`,
      );

      if (!response.data.smtpCheck) {
        throw 'Email is invalid, kindly check it and retry';
      }
    } catch (error) {
      throw error;
    }
  }
}
