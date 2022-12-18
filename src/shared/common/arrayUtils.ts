export default class ArrayUtils {
  public static extractRemovedElements(
    oldArray: string[] | number[],
    newArray: any[],
  ): any[] {
    const removedElements: any[] = [];

    oldArray.forEach((element: string | number) => {
      if (!newArray.includes(element)) {
        removedElements.push(element);
      }
    });

    return removedElements;
  }

  public static removeDuplicateValues(array: any[]): any[] {
    return [...new Set(array)];
  }

  public static extraceAddedElements(
    oldArray: any[],
    newArray: string[] | number[],
  ): any[] {
    const addedElements: any[] = [];

    newArray.forEach((element: string | number) => {
      if (!oldArray.includes(element)) {
        addedElements.push(element);
      }
    });

    return addedElements;
  }
}
