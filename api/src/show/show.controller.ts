import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CurrentUser } from '@/common/decorators';
import { EpisodeDto, MessageDto, SeasonDto, ShowDto, UserDto } from '@/common/dto';
import { Episode, Season, Show } from '@/common/entity';
import { ShowException } from '@/common/exceptions';
import { SeasonMapper, ShowMapper } from '@/common/mapper';

import {
  AddShowDto,
  FindEpisodesDto,
  FindSeasonsDto,
  SearchDto,
  UnfollowShowDto,
  WatchEpisodeDto,
  WatchResponseDto,
} from './dto';
import { ShowService } from './show.service';

@Controller('/api/show')
export class ShowController {
  constructor(private showService: ShowService, private seasonMapper: SeasonMapper, private showMapper: ShowMapper) {}

  @Post('search')
  async search(@CurrentUser() user: UserDto, @Body() searchDto: SearchDto): Promise<ShowDto[]> {
    return await this.showService.search(user, searchDto.query);
  }

  @Get('preview/:providerId')
  async previewShow(@Param('providerId') providerId: string): Promise<ShowDto> {
    return await this.showService.getProviderShow(providerId);
  }

  @Get('detail/:id')
  async findShowDetails(@CurrentUser() user: UserDto, @Param('id') id: string): Promise<ShowDto> {
    return await this.showService.findShowWithWatched(user, id);
  }

  @Get('update/:id')
  async updateShowFromProvider(@Param('id') id: string): Promise<void> {
    return await this.showService.updateShowFromProvider(id);
  }

  @Post('add')
  async addShow(@CurrentUser() user: UserDto, @Body() addShowDto: AddShowDto): Promise<ShowDto> {
    const isFollowed = await this.showService.isFollowedByProviderId(user, addShowDto.providerId);
    if (isFollowed) throw new ShowException('Already following that show');

    const show: Show | null = await this.showService.addShowOrFollow(user, addShowDto.providerId);
    return show ? this.showMapper.toDto(show) : {};
  }

  @Post('unfollow')
  async unfollowShow(@CurrentUser() user: UserDto, @Body() unfollowShowDto: UnfollowShowDto): Promise<MessageDto> {
    const { showId } = unfollowShowDto;
    const isFollowed = await this.showService.isFollowed(user, showId);
    if (!isFollowed) return { message: 'You are not following that show' };

    await this.showService.unfollowShow(user, showId);
    return { message: 'Show unfollowed' };
  }

  @Get('followed')
  async followedShows(@CurrentUser() user: UserDto): Promise<ShowDto[]> {
    const shows: Show[] = await this.showService.findFollowed(user.id);
    return shows.map(show => this.showMapper.toDto(show));
  }

  @Post('seasons')
  async findSeasons(@Body() findSeasonsDto: FindSeasonsDto): Promise<SeasonDto[]> {
    const seasons: Season[] = await this.showService.findSeasons(findSeasonsDto.showId);
    return seasons.map(season => this.seasonMapper.toDto(season));
  }

  @Post('episodes')
  async findEpisodes(@CurrentUser() user: UserDto, @Body() findEpisodesDto: FindEpisodesDto): Promise<EpisodeDto[]> {
    const episodes: Episode[] = await this.showService.findEpisodesBySeasonId(findEpisodesDto.seasonId);
    return this.showService.filterEpisodesForWatched(user, episodes);
  }

  @Post('watch')
  async watchEpisode(
    @CurrentUser() user: UserDto,
    @Body() watchEpisodeDto: WatchEpisodeDto
  ): Promise<WatchResponseDto> {
    await this.showService.watchEpisode(user, watchEpisodeDto);
    return { watched: watchEpisodeDto.isWatched };
  }
}
