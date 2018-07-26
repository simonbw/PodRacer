// TODO: Why is this a class and not just an array somewhere?
export default class MenuStack {
  constructor() {
    this.list = [];
  }
  
  push(menu) {
    this.list.push(menu);
  }
  
  pop() {
    return this.list.pop();
  }
  
  peek() {
    return this.list[this.list.length - 1];
  }
}
