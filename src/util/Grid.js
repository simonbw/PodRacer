// A 2 dimensional map.
export default class Grid {
  constructor() {
    this.data = {};
  }
  
  set([x, y], value) {
    if (this.data[x] == null) {
      this.data[x] = {};
    }
    this.data[x][y] = value;
  }
  
  get([x, y]) {
    if (!this.data.hasOwnProperty(x)) {
      return undefined;
    }
    return this.data[x][y];
  }
}
