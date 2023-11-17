import { Name } from "../domain/beach/name"
import { Latitude } from "../domain/beach/latitude"
import { Longitude } from "../domain/beach/longitude"
import { Position } from "../domain/beach/position"
import { PersistenceBeachModel } from "./dtos/beach-model"
import { Beach } from "../domain/beach/beach"

export class BeachMapper {
  static toDomain(raw: PersistenceBeachModel[]): Beach[] {
    const beaches = raw.map((data) => {
      const nameOrError = Name.create(data.name)
      const latitudeOrError = Latitude.create(data.lat)
      const longitudeOrError = Longitude.create(data.lng)
      const positionOrError = Position.create(data.position)
  
      if (nameOrError.isLeft()) {
        throw new Error('Name value is invalid.')
      }
  
      if (latitudeOrError.isLeft()) {
        throw new Error('Latitude value is invalid.')
      }
  
      if (longitudeOrError.isLeft()) {
        throw new Error('Longitude value is invalid.')
      }

      if (positionOrError.isLeft()) {
        throw new Error('Position value is invalid.')
      }

      const beachOrError = Beach.create(
        {
          name: nameOrError.value,
          lat: latitudeOrError.value,
          lng: longitudeOrError.value,
          position: positionOrError.value,
          userId: data.userId
        },
        data.id
      )
  
      if (beachOrError.isRight()) {
        return beachOrError.value
      }

      return null
    })

    return beaches
  }
}
