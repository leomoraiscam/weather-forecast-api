import { v4 as uuidV4 } from "uuid";
import { IBeachProps } from "./dtos/beach-props";
import { Either, right } from "@src/shared/logic/Either";
import { InvalidNameError } from "./errors/invalid-name-error";
import { InvalidPositionError } from "./errors/invalid-position-error";
import { InvalidLatitudeError } from "./errors/invalid-latitude-error";
import { InvalidLongitudeError } from "./errors/invalid-longitude-error";

export class Beach {
  public readonly _id?: string;
  public readonly props: IBeachProps;

  constructor(props: IBeachProps, id?: string) {
    this.props = props;
    this._id = id || uuidV4()
  }

  static create( props: IBeachProps, id?: string): Either<
    InvalidNameError | 
    InvalidPositionError | 
    InvalidLatitudeError | 
    InvalidLongitudeError,
    Beach
  >  {
    return right (new Beach(props, id))
  }
}