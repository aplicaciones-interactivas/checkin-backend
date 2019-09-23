import * as bcrypt from 'bcryptjs';

export abstract class BCryptUtils {
  private static ROUNDS_SALT = 8;
  private static salt: string = bcrypt.genSaltSync(BCryptUtils.ROUNDS_SALT);

  public static hash(stringToHash: string): string {
    return bcrypt.hashSync(stringToHash, BCryptUtils.salt);
  }

  public static compare(
    stringToCompare: string,
    stringForCompare: string,
  ): boolean {
    return bcrypt.compareSync(stringToCompare, stringForCompare);
  }
}
