import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

@Injectable()
export class MeetingsService {
  private readonly logger = new Logger(MeetingsService.name);
  private graphClient: Client | null = null;

  constructor(private configService: ConfigService) {
    this.initializeGraphClient();
  }

  /**
   * Initialize Microsoft Graph client with Azure credentials
   */
  private initializeGraphClient() {
    const tenantId = this.configService.get<string>('AZURE_TENANT_ID');
    const clientId = this.configService.get<string>('AZURE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('AZURE_CLIENT_SECRET');

    if (!tenantId || !clientId || !clientSecret) {
      this.logger.warn(
        'Azure credentials not configured. Meeting links will use fallback placeholder URLs.',
      );
      return;
    }

    try {
      const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
      const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default'],
      });

      this.graphClient = Client.initWithMiddleware({
        authProvider,
      });

      this.logger.log('Microsoft Graph client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Microsoft Graph client:', error);
    }
  }

  /**
   * Generate a Microsoft Teams meeting link for a session
   * 
   * @param sessionId - The session ID
   * @param teacherEmail - Teacher's email
   * @param learnerEmail - Learner's email
   * @param courseCode - Course code
   * @param startTime - Session start time
   * @param durationMinutes - Duration in minutes
   * @returns Teams meeting link
   */
  async generateMeetingLink(
    sessionId: string,
    teacherEmail: string,
    learnerEmail: string,
    courseCode: string,
    startTime?: Date,
    durationMinutes?: number,
  ): Promise<string> {
    // If Graph client is not initialized, return fallback link
    if (!this.graphClient) {
      return this.generateFallbackLink(sessionId, courseCode);
    }

    try {
      const meetingSubject = `Swap Session: ${courseCode}`;
      const meetingStartTime = startTime || new Date();
      const meetingEndTime = new Date(meetingStartTime);
      meetingEndTime.setMinutes(meetingEndTime.getMinutes() + (durationMinutes || 60));

      // Create online meeting using Microsoft Graph API
      const onlineMeeting = await this.graphClient
        .api('/me/onlineMeetings')
        .post({
          startDateTime: meetingStartTime.toISOString(),
          endDateTime: meetingEndTime.toISOString(),
          subject: meetingSubject,
          participants: {
            attendees: [
              {
                identity: {
                  user: {
                    displayName: teacherEmail.split('@')[0],
                  },
                },
              },
              {
                identity: {
                  user: {
                    displayName: learnerEmail.split('@')[0],
                  },
                },
              },
            ],
          },
          // Allow anyone with link to join (no authentication required)
          allowedPresenters: 'everyone',
          allowAttendeeToEnableCamera: true,
          allowAttendeeToEnableMic: true,
          allowMeetingChat: 'enabled',
          allowTeamworkReactions: true,
        });

      this.logger.log(`Created Teams meeting for session ${sessionId}: ${onlineMeeting.joinUrl}`);
      return onlineMeeting.joinUrl;
    } catch (error) {
      this.logger.error(`Failed to create Teams meeting for session ${sessionId}:`, error);
      // Return fallback link if API call fails
      return this.generateFallbackLink(sessionId, courseCode);
    }
  }

  /**
   * Generate a fallback meeting link when API is unavailable
   * This creates a generic Teams meeting URL that users can use as a placeholder
   */
  private generateFallbackLink(sessionId: string, courseCode: string): string {
    // Generate a placeholder that looks like a Teams link
    // In production, you might want to direct users to create their own meeting
    const fallbackLink = `https://teams.microsoft.com/l/meetup-join/placeholder-${sessionId.substring(0, 8)}`;
    
    this.logger.warn(
      `Using fallback meeting link for session ${sessionId}. Configure Azure credentials for real Teams meetings.`,
    );
    
    return fallbackLink;
  }

  /**
   * Create a Teams meeting for an application user (requires user context)
   * This is an alternative approach if you want to create meetings on behalf of a specific user
   * 
   * @param userId - The Azure AD user ID
   * @param subject - Meeting subject
   * @param startTime - Start time
   * @param endTime - End time
   */
  async createMeetingForUser(
    userId: string,
    subject: string,
    startTime: Date,
    endTime: Date,
  ): Promise<string> {
    if (!this.graphClient) {
      throw new Error('Microsoft Graph client not initialized');
    }

    try {
      const onlineMeeting = await this.graphClient
        .api(`/users/${userId}/onlineMeetings`)
        .post({
          startDateTime: startTime.toISOString(),
          endDateTime: endTime.toISOString(),
          subject,
        });

      return onlineMeeting.joinUrl;
    } catch (error) {
      this.logger.error(`Failed to create Teams meeting for user ${userId}:`, error);
      throw error;
    }
  }
}
