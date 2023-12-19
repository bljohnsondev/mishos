import { IsNotEmpty } from 'class-validator';

export class UnfollowShowDto {
  @IsNotEmpty()
  showId: string;
}
