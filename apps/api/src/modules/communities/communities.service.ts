import { Injectable, NotFoundException } from '@nestjs/common';
import { MemoryStoreService } from '../../common/database/memory-store.service';

export interface CommunityClub {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  emoji: string;
  city: string;
  memberCount: number;
  coverImage: string;
  isJoined?: boolean;
}

export interface CommunityPostItem {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl?: string;
  title: string;
  content: string;
  upvotesCount: number;
  commentsCount: number;
  isUpvoted?: boolean;
  createdAt: string;
}

export interface CommunityCommentItem {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl?: string;
  content: string;
  createdAt: string;
}

const DEFAULT_CLUBS: CommunityClub[] = [
  {
    id: 'club_blr_coffee',
    name: 'Bengaluru Filter Coffee & Cafes',
    slug: 'blr-coffee',
    description: 'For early risers who appreciate artisanal pour-overs, classic filter coffee, and quaint garden cafe catchups across Indiranagar & Koramangala.',
    category: 'Food & Drink',
    emoji: '☕',
    city: 'Bengaluru',
    memberCount: 1420,
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800'
  },
  {
    id: 'club_mum_sunset',
    name: 'Mumbai Marine Drive & Sunsets',
    slug: 'mum-sunsets',
    description: 'Evening walkers, sunset chasers, sea breeze lovers, and casual acoustic jam sessions by Nariman Point and Bandra Bandstand.',
    category: 'Lifestyle',
    emoji: '🌇',
    city: 'Mumbai',
    memberCount: 2380,
    coverImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800'
  },
  {
    id: 'club_del_foodies',
    name: 'Delhi Street Food & Heritage Walks',
    slug: 'del-heritage',
    description: 'Exploring Chandni Chowk parathas, Humayun tomb photo walks, and late-night culinary expeditions in Majnu Ka Tilla.',
    category: 'Culture',
    emoji: '🕌',
    city: 'New Delhi',
    memberCount: 1890,
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'
  },
  {
    id: 'club_hyd_biryani_tech',
    name: 'Hyderabad Techies & Badminton Vibe',
    slug: 'hyd-badminton',
    description: 'Weekend badminton tourneys, biryani debates, board game evenings, and relaxed networking around Hitec City & Jubilee Hills.',
    category: 'Sports & Tech',
    emoji: '🏸',
    city: 'Hyderabad',
    memberCount: 1640,
    coverImage: 'https://images.unsplash.com/photo-1626245963283-79651c6c5ea3?w=800'
  }
];

@Injectable()
export class CommunitiesService {
  private clubs: Map<string, CommunityClub> = new Map();
  private joinedClubs: Map<string, Set<string>> = new Map(); // userId -> Set(clubIds)
  private posts: Map<string, CommunityPostItem[]> = new Map(); // clubId -> posts
  private comments: Map<string, CommunityCommentItem[]> = new Map(); // postId -> comments
  private upvotes: Map<string, Set<string>> = new Map(); // postId -> Set(userIds)

  constructor(private readonly store: MemoryStoreService) {
    DEFAULT_CLUBS.forEach((c) => {
      this.clubs.set(c.id, c);
      this.posts.set(c.id, [
        {
          id: `post_${c.id}_1`,
          communityId: c.id,
          authorId: 'usr_demo_1',
          authorName: 'Ananya Verma',
          authorPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
          title: `Anyone up for exploring new spots this Saturday morning? ✨`,
          content: `Planning a relaxed meetup around 10:30 AM. Drop your favorite suggestions below!`,
          upvotesCount: 24,
          commentsCount: 6,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ]);
    });
  }

  getClubs(userId: string): CommunityClub[] {
    const userJoined = this.joinedClubs.get(userId) || new Set();
    return Array.from(this.clubs.values()).map((club) => ({
      ...club,
      isJoined: userJoined.has(club.id)
    }));
  }

  getClubById(clubId: string, userId: string): CommunityClub {
    const club = this.clubs.get(clubId);
    if (!club) throw new NotFoundException('Community club not found');
    const userJoined = this.joinedClubs.get(userId) || new Set();
    return {
      ...club,
      isJoined: userJoined.has(club.id)
    };
  }

  toggleJoin(clubId: string, userId: string): { joined: boolean; memberCount: number } {
    const club = this.clubs.get(clubId);
    if (!club) throw new NotFoundException('Community club not found');

    let set = this.joinedClubs.get(userId);
    if (!set) {
      set = new Set();
      this.joinedClubs.set(userId, set);
    }

    let joined = false;
    if (set.has(clubId)) {
      set.delete(clubId);
      club.memberCount = Math.max(0, club.memberCount - 1);
      joined = false;
    } else {
      set.add(clubId);
      club.memberCount += 1;
      joined = true;
    }

    this.clubs.set(clubId, club);
    return { joined, memberCount: club.memberCount };
  }

  getPosts(clubId: string, userId: string): CommunityPostItem[] {
    const list = this.posts.get(clubId) || [];
    return list.map((p) => {
      const upvoteSet = this.upvotes.get(p.id) || new Set();
      return {
        ...p,
        upvotesCount: p.upvotesCount + upvoteSet.size,
        isUpvoted: upvoteSet.has(userId)
      };
    });
  }

  createPost(
    clubId: string,
    userId: string,
    title: string,
    content: string
  ): CommunityPostItem {
    const club = this.clubs.get(clubId);
    if (!club) throw new NotFoundException('Community not found');

    const profile = this.store.profiles.get(userId);
    const authorName = profile?.displayName || 'PairUp Member';
    const authorPhoto = profile?.photos?.[0]?.url || undefined;

    const newPost: CommunityPostItem = {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      communityId: clubId,
      authorId: userId,
      authorName,
      authorPhotoUrl: authorPhoto,
      title,
      content,
      upvotesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };

    const list = this.posts.get(clubId) || [];
    list.unshift(newPost);
    this.posts.set(clubId, list);

    return newPost;
  }

  toggleUpvote(postId: string, userId: string): { upvoted: boolean } {
    let set = this.upvotes.get(postId);
    if (!set) {
      set = new Set();
      this.upvotes.set(postId, set);
    }

    if (set.has(userId)) {
      set.delete(userId);
      return { upvoted: false };
    } else {
      set.add(userId);
      return { upvoted: true };
    }
  }

  getComments(postId: string): CommunityCommentItem[] {
    return this.comments.get(postId) || [];
  }

  addComment(postId: string, userId: string, content: string): CommunityCommentItem {
    const profile = this.store.profiles.get(userId);
    const authorName = profile?.displayName || 'PairUp Member';
    const authorPhoto = profile?.photos?.[0]?.url || undefined;

    const comment: CommunityCommentItem = {
      id: `comment_${Date.now()}`,
      postId,
      authorId: userId,
      authorName,
      authorPhotoUrl: authorPhoto,
      content,
      createdAt: new Date().toISOString()
    };

    const list = this.comments.get(postId) || [];
    list.push(comment);
    this.comments.set(postId, list);

    return comment;
  }
}
