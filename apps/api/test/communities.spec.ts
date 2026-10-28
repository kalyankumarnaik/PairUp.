import { describe, expect, it, beforeEach } from 'vitest';
import { CommunitiesService } from '../src/modules/communities/communities.service';
import { MemoryStoreService } from '../src/common/database/memory-store.service';

describe('CommunitiesService - Passion Clubs & Social Feeds', () => {
  let commService: CommunitiesService;
  let store: MemoryStoreService;

  beforeEach(() => {
    store = new MemoryStoreService();
    store.onModuleInit();
    commService = new CommunitiesService(store);
  });

  it('lists default metropolitan passion clubs', () => {
    const clubs = commService.getClubs('usr_demo_1');
    expect(clubs.length).toBeGreaterThan(0);
    expect(clubs[0].name).toContain('Filter Coffee');
    expect(clubs[0].memberCount).toBeGreaterThan(0);
  });

  it('allows joining and leaving a community club', () => {
    const clubs = commService.getClubs('usr_demo_1');
    const targetClubId = clubs[0].id;
    const initialCount = clubs[0].memberCount;

    // Join
    const joinRes = commService.toggleJoin(targetClubId, 'usr_demo_1');
    expect(joinRes.joined).toBe(true);
    expect(joinRes.memberCount).toBe(initialCount + 1);

    // Leave
    const leaveRes = commService.toggleJoin(targetClubId, 'usr_demo_1');
    expect(leaveRes.joined).toBe(false);
    expect(leaveRes.memberCount).toBe(initialCount);
  });

  it('creates a discussion post within a club', () => {
    const clubs = commService.getClubs('usr_demo_1');
    const clubId = clubs[0].id;

    const post = commService.createPost(
      clubId,
      'usr_demo_1',
      'Indiranagar vs Koramangala Cafes?',
      'Which neighborhood has the best calm cafes for remote work and meeting people?'
    );

    expect(post.id).toBeDefined();
    expect(post.title).toBe('Indiranagar vs Koramangala Cafes?');
    expect(post.authorName).toBe('Ananya Verma');

    const posts = commService.getPosts(clubId, 'usr_demo_1');
    expect(posts.some((p) => p.id === post.id)).toBe(true);
  });

  it('toggles upvotes on a post', () => {
    const clubs = commService.getClubs('usr_demo_1');
    const clubId = clubs[0].id;
    const post = commService.createPost(clubId, 'usr_demo_1', 'Title', 'Content');

    const upvote1 = commService.toggleUpvote(post.id, 'usr_demo_2');
    expect(upvote1.upvoted).toBe(true);

    const upvote2 = commService.toggleUpvote(post.id, 'usr_demo_2');
    expect(upvote2.upvoted).toBe(false);
  });

  it('adds and lists comments on a community post', () => {
    const clubs = commService.getClubs('usr_demo_1');
    const clubId = clubs[0].id;
    const post = commService.createPost(clubId, 'usr_demo_1', 'Post title', 'Post body');

    const comment = commService.addComment(
      post.id,
      'usr_demo_2',
      'Totally agree! Let us organize a group visit next weekend.'
    );

    expect(comment.id).toBeDefined();
    expect(comment.authorName).toBe('Aarav Sharma');

    const comments = commService.getComments(post.id);
    expect(comments.length).toBe(1);
    expect(comments[0].content).toContain('Totally agree');
  });
});
