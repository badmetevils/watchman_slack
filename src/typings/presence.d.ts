export interface IPresenceData {
  slackID: string;
  status: 'ACTIVE' | 'AWAY';
}

export interface IActiveAwayMinutes {
  awayInWorkingHours: number;
  activeInNonWorkingHours: number;
}
