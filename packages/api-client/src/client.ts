import { API_ROUTES, ApiResponse } from '@pairup/contracts';
import {
  AdminDashboardMetrics,
  AuthResponse,
  ChatMessage,
  Community,
  Conversation,
  DiscoveryCard,
  DiscoveryFilter,
  MatchSummary,
  ProfileSummary,
  ProfileUpdateRequest,
  ReportCategory,
  SocialEvent,
  SwipeAction,
  SwipeDecisionResponse,
  UserProfile,
  VoiceRoom
} from '@pairup/domain-types';

export interface ClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null;
  setAccessToken?: (token: string | null) => void;
  onUnauthorized?: () => void;
}

export class PairUpApiClient {
  private baseUrl: string;
  private getAccessToken: () => string | null;
  private setAccessToken?: (token: string | null) => void;
  private onUnauthorized?: () => void;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.getAccessToken = config.getAccessToken || (() => null);
    this.setAccessToken = config.setAccessToken;
    this.onUnauthorized = config.onUnauthorized;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = new Headers(options.headers || {});

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const token = this.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (response.status === 401) {
        if (this.onUnauthorized) this.onUnauthorized();
      }

      const json = await response.json();
      return json as ApiResponse<T>;
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          details: err.message
        }
      };
    }
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATION
  // ---------------------------------------------------------------------------
  async signup(data: {
    email?: string;
    phone?: string;
    password: string;
    displayName: string;
    birthDate: string;
    acceptedTerms: boolean;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_ROUTES.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async login(identifier: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_ROUTES.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
  }

  async verifyOtp(identifier: string, otp: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_ROUTES.AUTH.VERIFY_OTP, {
      method: 'POST',
      body: JSON.stringify({ identifier, otp })
    });
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: any; profile: UserProfile | null }>> {
    return this.request(API_ROUTES.AUTH.ME);
  }

  // ---------------------------------------------------------------------------
  // PROFILE
  // ---------------------------------------------------------------------------
  async getMyProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>(API_ROUTES.PROFILES.MY_PROFILE);
  }

  async updateProfile(updates: ProfileUpdateRequest): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>(API_ROUTES.PROFILES.UPDATE, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async uploadPhoto(file: File | Blob): Promise<ApiResponse<{ photoUrl: string }>> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.request<{ photoUrl: string }>(API_ROUTES.PROFILES.UPLOAD_PHOTO, {
      method: 'POST',
      body: formData
    });
  }

  async addPhotoUrl(url: string): Promise<ApiResponse<{ id: string; url: string }>> {
    return this.request(API_ROUTES.PROFILES.UPLOAD_PHOTO, {
      method: 'POST',
      body: JSON.stringify({ url })
    });
  }

  async deletePhoto(photoId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.request(API_ROUTES.PROFILES.DELETE_PHOTO(photoId), {
      method: 'DELETE'
    });
  }

  async reorderPhotos(photoIds: string[]): Promise<ApiResponse<{ reordered: boolean }>> {
    return this.request(API_ROUTES.PROFILES.REORDER_PHOTOS, {
      method: 'POST',
      body: JSON.stringify({ photoIds })
    });
  }

  // ---------------------------------------------------------------------------
  // LOCATION & NEARBY
  // ---------------------------------------------------------------------------
  async updateLocation(data: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
  }): Promise<ApiResponse<{ updated: boolean }>> {
    return this.request(API_ROUTES.LOCATION.UPDATE, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getNearbyProfiles(radiusKm: number = 25): Promise<ApiResponse<DiscoveryCard[]>> {
    return this.request<DiscoveryCard[]>(
      `${API_ROUTES.LOCATION.NEARBY_USERS}?radiusKm=${radiusKm}`
    );
  }

  // ---------------------------------------------------------------------------
  // DISCOVERY & MATCHING
  // ---------------------------------------------------------------------------
  async getDiscoveryFeed(filters?: DiscoveryFilter): Promise<ApiResponse<DiscoveryCard[]>> {
    const params = new URLSearchParams();
    if (filters?.minAge) params.append('minAge', String(filters.minAge));
    if (filters?.maxAge) params.append('maxAge', String(filters.maxAge));
    if (filters?.maxDistanceKm) params.append('maxDistanceKm', String(filters.maxDistanceKm));
    if (filters?.connectionMode) params.append('connectionMode', filters.connectionMode);

    return this.request<DiscoveryCard[]>(
      `${API_ROUTES.DISCOVERY.FEED}?${params.toString()}`
    );
  }

  async swipe(
    targetUserId: string,
    action: SwipeAction,
    connectionMode: string
  ): Promise<ApiResponse<SwipeDecisionResponse>> {
    return this.request<SwipeDecisionResponse>(API_ROUTES.DISCOVERY.SWIPE, {
      method: 'POST',
      body: JSON.stringify({ targetUserId, action, connectionMode })
    });
  }

  async rewind(): Promise<ApiResponse<{ rewound: boolean }>> {
    return this.request(API_ROUTES.DISCOVERY.REWIND, {
      method: 'POST'
    });
  }

  async getMatches(): Promise<ApiResponse<MatchSummary[]>> {
    return this.request<MatchSummary[]>(API_ROUTES.DISCOVERY.MATCHES);
  }

  // ---------------------------------------------------------------------------
  // CHAT & MESSAGING
  // ---------------------------------------------------------------------------
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return this.request<Conversation[]>(API_ROUTES.CHAT.CONVERSATIONS);
  }

  async getMessages(
    conversationId: string,
    limit: number = 50
  ): Promise<ApiResponse<ChatMessage[]>> {
    return this.request<ChatMessage[]>(
      `${API_ROUTES.CHAT.MESSAGES(conversationId)}?limit=${limit}`
    );
  }

  async sendMessage(
    conversationId: string,
    content: string,
    type: string = 'TEXT'
  ): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>(API_ROUTES.CHAT.SEND_MESSAGE(conversationId), {
      method: 'POST',
      body: JSON.stringify({ conversationId, content, type })
    });
  }

  // ---------------------------------------------------------------------------
  // VOICE ROOMS & EVENTS
  // ---------------------------------------------------------------------------
  async getVoiceRooms(): Promise<ApiResponse<VoiceRoom[]>> {
    return this.request<VoiceRoom[]>(API_ROUTES.ROOMS.LIST);
  }

  async createVoiceRoom(data: {
    title: string;
    category: string;
    emoji: string;
    isPrivate?: boolean;
  }): Promise<ApiResponse<VoiceRoom>> {
    return this.request<VoiceRoom>(API_ROUTES.ROOMS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getEvents(): Promise<ApiResponse<SocialEvent[]>> {
    return this.request<SocialEvent[]>(API_ROUTES.EVENTS.LIST);
  }

  async registerEvent(eventId: string): Promise<ApiResponse<{ registered: boolean }>> {
    return this.request(API_ROUTES.EVENTS.REGISTER(eventId), {
      method: 'POST'
    });
  }

  // ---------------------------------------------------------------------------
  // SAFETY & MODERATION
  // ---------------------------------------------------------------------------
  async reportUser(data: {
    reportedUserId: string;
    category: ReportCategory;
    reason: string;
  }): Promise<ApiResponse<{ reportId: string }>> {
    return this.request(API_ROUTES.SAFETY.REPORT, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async blockUser(targetUserId: string): Promise<ApiResponse<{ blocked: boolean }>> {
    return this.request(API_ROUTES.SAFETY.BLOCK, {
      method: 'POST',
      body: JSON.stringify({ targetUserId })
    });
  }

  // ---------------------------------------------------------------------------
  // CALLS & SIGNALING
  // ---------------------------------------------------------------------------
  async initiateCall(
    receiverId: string,
    type: 'AUDIO' | 'VIDEO' = 'AUDIO'
  ): Promise<ApiResponse<{ callId: string; status: string }>> {
    return this.request(API_ROUTES.CALLS.INITIATE, {
      method: 'POST',
      body: JSON.stringify({ receiverId, type })
    });
  }

  async respondCall(callId: string, accept: boolean): Promise<ApiResponse<any>> {
    return this.request(API_ROUTES.CALLS.RESPOND(callId), {
      method: 'POST',
      body: JSON.stringify({ accept })
    });
  }

  async endCall(callId: string): Promise<ApiResponse<{ ended: boolean }>> {
    return this.request(API_ROUTES.CALLS.END(callId), {
      method: 'POST'
    });
  }

  // ---------------------------------------------------------------------------
  // AI SERVICES
  // ---------------------------------------------------------------------------
  async getIcebreakers(targetUserId: string): Promise<ApiResponse<{ icebreakers: string[] }>> {
    return this.request(`${API_ROUTES.AI.ICEBREAKERS}?targetUserId=${targetUserId}`);
  }

  // ---------------------------------------------------------------------------
  // ADMIN DASHBOARD
  // ---------------------------------------------------------------------------
  async getAdminMetrics(): Promise<ApiResponse<AdminDashboardMetrics>> {
    return this.request<AdminDashboardMetrics>(API_ROUTES.ADMIN.METRICS);
  }

  async getAdminReports(): Promise<ApiResponse<any[]>> {
    return this.request(API_ROUTES.ADMIN.REPORTS);
  }

  async resolveReport(
    reportId: string,
    action: string,
    notes: string
  ): Promise<ApiResponse<{ resolved: boolean }>> {
    return this.request(API_ROUTES.ADMIN.RESOLVE_REPORT(reportId), {
      method: 'POST',
      body: JSON.stringify({ action, notes })
    });
  }
}
