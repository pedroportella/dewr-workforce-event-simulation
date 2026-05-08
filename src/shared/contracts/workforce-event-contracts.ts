export type WorkforceEventType =
  | 'RegionalEmploymentChanged'
  | 'SkillsGapMeasured'
  | 'TrainingCompletionRecorded'
  | 'ParticipantOutcomeRecorded';

export type CohortId = 'all' | 'youth' | 'matureAge' | 'firstNations' | 'participant';

export interface WorkforceEventRequestDto {
  eventId: string;
  eventType: WorkforceEventType;
  occurredAt: string;
  regionId: string;
  regionName: string;
  state: string;
  primaryIndustry: string;
  cohort: CohortId;
  employmentRatePercent: number;
  vacancies: number;
  skillsGapIndex: number;
  trainingCompletions: number;
  sustainedOutcomeRatePercent: number;
  participantCount: number;
}

export interface WorkforceEventBatchRequestDto {
  events: WorkforceEventRequestDto[];
}
