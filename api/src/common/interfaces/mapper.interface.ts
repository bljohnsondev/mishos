export interface Mapper<Entity, Dto> {
  toDto: (item: Entity) => Dto;
}
