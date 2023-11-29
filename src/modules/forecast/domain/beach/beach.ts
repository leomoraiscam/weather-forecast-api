import { v4 as uuidV4 } from 'uuid';

import { Either, right } from '@src/shared/logic/either';

import { IBeachProps } from './dtos/beach-props';
import { InvalidLatitudeError } from './errors/invalid-latitude-error';
import { InvalidLongitudeError } from './errors/invalid-longitude-error';
import { InvalidNameError } from './errors/invalid-name-error';
import { InvalidPositionError } from './errors/invalid-position-error';

export class Beach {
  public readonly _id?: string;
  public readonly props: IBeachProps;

  constructor(props: IBeachProps, id?: string) {
    this._id = id || uuidV4();
    this.props = props;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.props.name;
  }

  get lat() {
    return this.props.lat;
  }

  get lng() {
    return this.props.lng;
  }

  get position() {
    return this.props.position;
  }

  get userId() {
    return this.props.userId;
  }

  static create(
    props: IBeachProps,
    id?: string,
  ): Either<
    InvalidNameError | InvalidPositionError | InvalidLatitudeError | InvalidLongitudeError,
    Beach
  > {
    return right(new Beach(props, id));
  }
}
