import React, { useState } from 'react';
import {
  Compass,
  Heart,
  MessageCircle,
  Plus,
  Share2,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Users,
  X
} from 'lucide-react';

interface CommunityClub {
  id: string;
  name: string;
  category: string;
  emoji: string;
  memberCount: number;
  description: string;
  isJoined: boolean;
}

interface CommunityPost {
  id: string;
  clubId: string;
  clubName: string;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  title: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  hasLiked: boolean;
}

const MOCK_CLUBS: CommunityClub[] = [
  {
    id: 'c1',
    name: 'Bandra Coffee & Aesthetic Cafes',
    category: 'Food & Culture',
    emoji: '☕',
    memberCount: 342,
    description: 'Weekly weekend cafe hopping, pour-over debates, and finding the best hidden bakeries in Mumbai.',
    isJoined: true
  },
  {
    id: 'c2',
    name: 'Indie Vinyl & Live Music Jams',
    category: 'Music & Vibes',
    emoji: '🎸',
    memberCount: 289,
    description: 'For lovers of lo-fi, indie rock, classic Bollywood vinyl, and discovering gig buddies for NH7 / Lollapalooza.',
    isJoined: true
  },
  {
    id: 'c3',
    name: 'Weekend Sahyadri Trekkers',
    category: 'Outdoors',
    emoji: '🏔️',
    memberCount: 512,
    description: 'Monsoon fort treks, sunrise hikes near Lonavala, camping, and outdoor photography.',
    isJoined: false
  },
  {
    id: 'c4',
    name: 'Contemporary Art & Design Salon',
    category: 'Creative Arts',
    emoji: '🎨',
    memberCount: 195,
    description: 'Gallery walks in Kala Ghoda, urban sketching meetups, and design critique coffee sessions.',
    isJoined: false
  }
];

const MOCK_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    clubId: 'c1',
    clubName: 'Bandra Coffee & Aesthetic Cafes',
    authorName: 'Ananya Verma',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    timeAgo: '2h ago',
    title: 'Found a magical new courtyard cafe near Pali Hill! 🌿',
    content: 'Just discovered an artisanal micro-roastery tucked behind an old bungalow. They serve Ethiopian Yirgacheffe on batch brew with homemade almond croissants. Who wants to join for Sunday morning sketching?',
    likesCount: 24,
    commentsCount: 8,
    hasLiked: true
  },
  {
    id: 'p2',
    clubId: 'c2',
    clubName: 'Indie Vinyl & Live Music Jams',
    authorName: 'Rohan Mehra',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    timeAgo: '4h ago',
    title: 'Anyone heading to the acoustic open mic in Khar tonight?',
    content: 'Planning to check out the singer-songwriter showcase at 8 PM. Drop a comment if you are around and want to grab a table together!',
    likesCount: 15,
    commentsCount: 6,
    hasLiked: false
  }
];

export const CommunitiesPage: React.FC = () => {
  const [clubs, setClubs] = useState<CommunityClub[]>(MOCK_CLUBS);
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);
  const [selectedClubId, setSelectedClubId] = useState<string>('ALL');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  const toggleJoinClub = (clubId: string) => {
    setClubs((prev) =>
      prev.map((c) =>
        c.id === clubId
          ? {
              ...c,
              isJoined: !c.isJoined,
              memberCount: c.isJoined ? c.memberCount - 1 : c.memberCount + 1
            }
          : c
      )
    );
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              hasLiked: !p.hasLiked,
              likesCount: p.hasLiked ? p.likesCount - 1 : p.likesCount + 1
            }
          : p
      )
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      clubId: 'c1',
      clubName: 'Bandra Coffee & Aesthetic Cafes',
      authorName: 'You',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      timeAgo: 'Just now',
      title: postTitle.trim(),
      content: postContent.trim(),
      likesCount: 1,
      commentsCount: 0,
      hasLiked: true
    };

    setPosts([newPost, ...posts]);
    setPostTitle('');
    setPostContent('');
    setShowCreatePost(false);
  };

  const filteredPosts = posts.filter((p) =>
    selectedClubId === 'ALL' ? true : p.clubId === selectedClubId
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-borderSoft shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-light text-cyan-dark text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Shared Passions & Social Circles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink">
            PairUp Communities
          </h1>
          <p className="text-xs text-ink-muted mt-1 max-w-xl">
            Join local micro-communities based on real passions. Discuss topics, organize group meetups, and find friends who share your wavelength.
          </p>
        </div>

        <button
          onClick={() => setShowCreatePost(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-coral to-violet text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion Post</span>
        </button>
      </div>

      {/* Featured Clubs Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-display font-bold text-base text-ink">Discover Passion Clubs</h3>
          <span className="text-xs text-violet font-semibold">4 Active in Mumbai</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {clubs.map((club) => (
            <div
              key={club.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                club.isJoined ? 'bg-white border-violet shadow-sm' : 'bg-white border-borderSoft hover:border-violet/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl p-2 rounded-2xl bg-cloud">{club.emoji}</span>
                  <span className="px-2 py-0.5 rounded-full bg-cloud text-[10px] font-bold text-ink-muted">
                    {club.memberCount} members
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-ink leading-snug">{club.name}</h4>
                <p className="text-xs text-ink-muted mt-2 line-clamp-2 leading-relaxed">
                  {club.description}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-borderSoft/60 flex items-center justify-between">
                <button
                  onClick={() => setSelectedClubId(selectedClubId === club.id ? 'ALL' : club.id)}
                  className={`text-xs font-bold ${
                    selectedClubId === club.id ? 'text-violet underline' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {selectedClubId === club.id ? 'Viewing Posts' : 'View Feed'}
                </button>

                <button
                  onClick={() => toggleJoinClub(club.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    club.isJoined
                      ? 'bg-cloud text-ink font-semibold'
                      : 'bg-violet text-white shadow-xs hover:bg-violet-hover'
                  }`}
                >
                  {club.isJoined ? 'Joined ✓' : '+ Join Club'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discussion Forum Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display font-bold text-base text-ink">
            Community Discussions {selectedClubId !== 'ALL' && `(Filtered)`}
          </h3>
          {selectedClubId !== 'ALL' && (
            <button
              onClick={() => setSelectedClubId('ALL')}
              className="text-xs text-coral font-bold hover:underline"
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-violet/10"
                  />
                  <div>
                    <p className="text-xs font-bold text-ink">{post.authorName}</p>
                    <p className="text-[10px] text-ink-muted">
                      {post.clubName} • {post.timeAgo}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-cloud text-ink text-[10px] font-bold">
                  Discussion
                </span>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-display font-bold text-ink">
                  {post.title}
                </h4>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Engagement Bar */}
              <div className="pt-3 border-t border-borderSoft/60 flex items-center justify-between text-xs text-ink-muted">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-1.5 font-bold transition-colors ${
                      post.hasLiked ? 'text-coral' : 'hover:text-ink'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-current text-coral' : ''}`} />
                    <span>{post.likesCount} Likes</span>
                  </button>

                  <button className="flex items-center gap-1.5 font-bold hover:text-ink transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount} Comments</span>
                  </button>
                </div>

                <button className="p-1.5 hover:bg-cloud rounded-lg transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Discussion Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-borderSoft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-display font-bold text-ink">Start a Discussion</h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="p-1 rounded-full hover:bg-cloud text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Any coffee lovers visiting Bandra this Sunday?"
                  className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Discussion Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share details, suggest a meetup venue or ask the community..."
                  className="w-full px-4 py-2 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 py-2.5 rounded-xl bg-cloud text-ink text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-coral to-violet text-white text-xs font-bold shadow-md"
                >
                  Post to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
