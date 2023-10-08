import { Name } from "./name";
import { Position } from "./position";
import { Latitude } from "./latitude";
import { Longitude } from "./longitude";

interface IBeachProps {
  name: Name;
  position: Position;
  lat: Latitude;
  lng: Longitude;
}

export class Beach {
  public readonly _id?: string;
  public readonly props: IBeachProps;

  constructor(props: IBeachProps, id?: string) {
    this.props = props;
    this._id = id || 'generic-id'
  }

  static create( props: IBeachProps, id?: string): Beach {
   return new Beach(props, id)
  }
}