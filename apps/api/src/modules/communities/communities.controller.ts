import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CommunitiesService } from './communities.service';

@ApiTags('Communities & Passion Clubs')
@Controller('communities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommunitiesController {
  constructor(private readonly service: CommunitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List all interest communities and clubs with membership flags' })
  getClubs(@CurrentUser('id') userId: string) {
    return this.service.getClubs(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific community club' })
  getClubById(@CurrentUser('id') userId: string, @Param('id') clubId: string) {
    return this.service.getClubById(clubId, userId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join or leave a community club' })
  toggleJoin(@CurrentUser('id') userId: string, @Param('id') clubId: string) {
    return this.service.toggleJoin(clubId, userId);
  }

  @Get(':id/posts')
  @ApiOperation({ summary: 'Get feed of posts in a community' })
  getPosts(@CurrentUser('id') userId: string, @Param('id') clubId: string) {
    return this.service.getPosts(clubId, userId);
  }

  @Post(':id/posts')
  @ApiOperation({ summary: 'Create a new discussion post in a community' })
  createPost(
    @CurrentUser('id') userId: string,
    @Param('id') clubId: string,
    @Body('title') title: string,
    @Body('content') content: string
  ) {
    return this.service.createPost(clubId, userId, title, content);
  }

  @Post('posts/:postId/upvote')
  @ApiOperation({ summary: 'Upvote or remove upvote on a post' })
  toggleUpvote(@CurrentUser('id') userId: string, @Param('postId') postId: string) {
    return this.service.toggleUpvote(postId, userId);
  }

  @Get('posts/:postId/comments')
  @ApiOperation({ summary: 'Get discussion comments on a post' })
  getComments(@Param('postId') postId: string) {
    return this.service.getComments(postId);
  }

  @Post('posts/:postId/comments')
  @ApiOperation({ summary: 'Comment on a community post' })
  addComment(
    @CurrentUser('id') userId: string,
    @Param('postId') postId: string,
    @Body('content') content: string
  ) {
    return this.service.addComment(postId, userId, content);
  }
}
