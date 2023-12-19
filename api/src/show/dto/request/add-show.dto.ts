import { IsNotEmpty } from 'class-validator';

export class AddShowDto {
  @IsNotEmpty()
  providerId: string;
}
