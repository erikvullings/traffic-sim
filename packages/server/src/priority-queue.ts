export type Comparator<T> = (a: T, b: T) => number;

export class PriorityQueue<T> {
  private queue: T[];
  private comparator: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    this.queue = [];
    this.comparator = comparator;
  }

  public enqueue(item: T): void {
    this.queue.push(item);
    this.queue.sort(this.comparator);
  }

  public dequeue(): T | undefined {
    return this.queue.shift();
  }

  public remove(predicate: (item: T) => boolean): void {
    this.queue = this.queue.filter((item) => !predicate(item));
  }

  public forEach(callbackfn: (value: T, index: number, array: T[]) => void) {
    this.queue.forEach(callbackfn);
  }

  public map(callbackfn: (value: T, index: number, array: T[]) => void) {
    return this.queue.map(callbackfn);
  }

  public isEmpty(): boolean {
    return this.queue.length === 0;
  }

  public log(space?: number): string {
    return JSON.stringify(this.queue, null, space);
  }

  public clear(): void {
    this.queue.length = 0;
  }

  public peek(): T | undefined {
    return this.queue[0];
  }
}
