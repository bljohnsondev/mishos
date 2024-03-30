export interface FollowedShowDto {
  followedShowId: number;
  showId: number;
  userId: number;
  name: string;
  network?: string;
  imageMedium?: string;
}
