import { IBeachProps } from "./dtos/beach-props";

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