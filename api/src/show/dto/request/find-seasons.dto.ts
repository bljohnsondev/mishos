import { IsNotEmpty } from 'class-validator';

export class FindSeasonsDto {
  @IsNotEmpty()
  showId: string;
}
