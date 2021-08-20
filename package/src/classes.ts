// Node for hash tables
export class ListNode {
  val: string;
  next: ListNode | null;
  constructor(val: string, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }

  toString() {
    let res = `${this.val}`;
    let pt = this.next;
    while (pt !== null) {
      res = res.concat(` -> ${pt.val}`);
      pt = pt.next;
    }
    return res;
  }
}

// Hash table class
export class HashTable {
  size: number;
  nodes: (ListNode | null)[];

  constructor(size: number) {
    this.size = size;
    this.nodes = new Array(size).fill(null);
  }

  /**
   * Returns the hash value of a given string.
   */
  hash(str: string) {
    let hashFV = 0;
    str = str.toLowerCase();
    for (let c = 0; c < str.length; c++) {
      hashFV = str.charCodeAt(c);
    }
    return hashFV % this.size;
  }
  /**
   * Inserts a node into the hash table based on its hash value
   */
  insert(node: ListNode) {
    const value = node.val.trim();
    node.val = value;

    const index = this.hash(value);
    let head = this.nodes[index];

    if (head === null) {
      head = node;
    } else {
      const next = head.next;
      node.next = next;
      head.next = node;
    }
  }

  lookup(targetValue: string) {
    const index = this.hash(targetValue);
    let head = this.nodes[index];

    while (head && head.next !== null) {
      head = head.next;
      if (head.val === targetValue) {
        return index;
      }
    }
    return false;
  }
}
