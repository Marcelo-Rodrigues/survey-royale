export class Utils {
  public static generateGUID() {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    );
  }

  public static getObjectValues<T>(obj: any): T[] {
    return (Object as any).values(obj);
  }
}
