export class NameOf {
    public static that<T>(key: keyof T): keyof T {
      return key;
    }
    public static those<T>(keys: (keyof T)[]): (keyof T)[] {
      return keys;
    }
}