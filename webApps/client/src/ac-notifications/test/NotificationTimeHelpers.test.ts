import { expect } from '@open-wc/testing';

import { getNotificationDateTime } from '../NotificationTimeHelpers.js';

describe('NotificationTimeHelpers', () => {
  it('prefers updated_at over created_at for grouped notification display time', () => {
    const createdAt = new Date('2024-01-01T08:00:00.000Z');
    const updatedAt = new Date('2024-01-01T12:30:00.000Z');
    const activityCreatedAt = '2024-01-01T10:15:00.000Z';

    const notification = {
      id: 1,
      type: 'notification.post.endorsement.new',
      domain_id: 1,
      created_at: createdAt,
      updated_at: updatedAt,
      viewed: false,
      AcActivities: [
        {
          id: 1,
          type: 'activity.post.endorsement.new',
          domain_id: 1,
          created_at: activityCreatedAt,
          User: {} as YpUserData,
        },
      ],
    } as AcNotificationData;

    expect(getNotificationDateTime(notification)?.toMillis()).to.equal(
      updatedAt.getTime()
    );
  });
});
