export class Utils {
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
}
