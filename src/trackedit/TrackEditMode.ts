import BaseEntity from "../core/entity/BaseEntity";

export class TrackEditMode extends BaseEntity {
  constructor() {
    super();
  }

  onAdd() {
    console.log("add your track");
  }
}
