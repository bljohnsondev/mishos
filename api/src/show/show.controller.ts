import { Body, Controller, Get, Inject, Param, Post, Request } from '@nestjs/common';

import { EpisodeDto, SeasonDto, ShowDto, MessageDto } from '@/common/dto';
import { Episode, Season, Show } from '@/common/entity';
import { ShowException } from '@/common/exceptions';
import { TvProviderService } from '@/common/interfaces';
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
  constructor(
    @Inject('TvProviderService') private tvProviderService: TvProviderService,
    private showService: ShowService,
    private seasonMapper: SeasonMapper,
    private showMapper: ShowMapper
  ) {}

  @Post('search')
  async search(@Request() req, @Body() searchDto: SearchDto): Promise<ShowDto[]> {
    return await this.showService.search(req.user, searchDto.query);
  }

  @Get('preview/:providerId')
  async previewShow(@Param('providerId') providerId: string): Promise<ShowDto> {
    return this.showService.getProviderShow(providerId);
  }

  @Get('detail/:id')
  async findShowDetails(@Request() req, @Param('id') id: string): Promise<ShowDto> {
    return this.showService.findShowWithWatched(req.user, id);
  }

  @Post('add')
  async addShow(@Request() req, @Body() addShowDto: AddShowDto): Promise<ShowDto> {
    const isFollowed = await this.showService.isFollowedByProviderId(req.user, addShowDto.providerId);
    if (isFollowed) throw new ShowException('Already following that show');

    const show: Show | null = await this.showService.addShowOrFollow(req.user, addShowDto.providerId);
    return show ? this.showMapper.toDto(show) : {};
  }

  @Post('unfollow')
  async unfollowShow(@Request() req, @Body() unfollowShowDto: UnfollowShowDto): Promise<MessageDto> {
    const { showId } = unfollowShowDto;
    const isFollowed = await this.showService.isFollowed(req.user, showId);
    if (!isFollowed) return { message: 'You are not following that show' };

    await this.showService.unfollowShow(req.user, showId);
    return { message: 'Show unfollowed' };
  }

  @Get('followed')
  async followedShows(@Request() req): Promise<ShowDto[]> {
    const shows: Show[] = await this.showService.findFollowed(req.user.id);
    return shows.map(show => this.showMapper.toDto(show));
  }

  @Post('seasons')
  async findSeasons(@Body() findSeasonsDto: FindSeasonsDto): Promise<SeasonDto[]> {
    const seasons: Season[] = await this.showService.findSeasons(findSeasonsDto.showId);
    return seasons.map(season => this.seasonMapper.toDto(season));
  }

  @Post('episodes')
  async findEpisodes(@Request() req, @Body() findEpisodesDto: FindEpisodesDto): Promise<EpisodeDto[]> {
    const episodes: Episode[] = await this.showService.findEpisodesBySeasonId(req.user, findEpisodesDto.seasonId);
    return this.showService.filterEpisodesForWatched(req.user, episodes);
  }

  @Post('watch')
  async watchEpisode(@Request() req, @Body() watchEpisodeDto: WatchEpisodeDto): Promise<WatchResponseDto> {
    await this.showService.watchEpisode(req.user, watchEpisodeDto);
    return { watched: watchEpisodeDto.isWatched };
  }
}
