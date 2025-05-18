export interface Announcement {
  _id: string;
  title: string;
  content: string;
  postedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AnnouncementList {
  announcements: Announcement[];
}

export interface CreateAnnouncement {
  title: string;
  content: string;
  postedAt: string;
}

export interface UpdateAnnouncement {
  title: string;
  content: string;
  postedAt: string;
}
