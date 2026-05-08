export type WorkforceEventType =
  | 'RegionalEmploymentChanged'
  | 'SkillsGapMeasured'
  | 'TrainingCompletionRecorded'
  | 'ParticipantOutcomeRecorded';

export type CohortId = 'all' | 'youth' | 'matureAge' | 'firstNations' | 'participant';

export interface WorkforceEventRequest {
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

export interface SimulationStateDto {
  isRunning: boolean;
  tickIntervalMs: number;
  simulationTick: number;
  eventBatchSize: number;
  targetUrl: string;
  updatedAtUtc: string;
}

export interface SimulationSnapshotDto {
  simulation: SimulationStateDto;
  latestEvents: WorkforceEventRequest[];
  snapshotTakenAtUtc: string;
}

export interface SimulationCommandResponseDto {
  message: string;
  snapshot: SimulationSnapshotDto;
}
