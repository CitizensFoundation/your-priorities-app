interface CsProjectData {
  id: number;
  user_id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;

  CsProjectRounds?: Array<CsProjectRoundData>;
}

interface CsProjectRoundData {
  id: number;
  user_id: number;
  cs_project_id: number;
  created_at: Date;
  updated_at: Date;
  starts_at: Date;
  ends_at: Date;
  CsProjectEvents?: Array<CsProjectEventData>;
}

interface CsProjectEventData {
  id: number;
  user_id: number;
  cs_project_event_id: number;
  created_at: Date;
  updated_at: Date;
  planned_start_at: Date;
  started_at: Date;
  planned_end_at: Date;
  ended_at: Date;
  type: string;
  CsAllQuestions?: Array<CsQuestionData>;
  CsFinalQuestions?: Array<CsQuestionData>;
}

interface CsLiveMeetingData extends CsProjectEventData {
  conferencing_info: string;
  date_options: Array<Date>;
  duration_minutes: number;
  CsUserDatePreferences: Array<CsUserDatePreferenceData>;
}

interface CsUserDatePreferenceData {
  id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  preferred_dates: Array<Date>;
}

interface CsQuestionData {
  id: number;
  user_id: number;
  type: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  counter_flags: number;
  counter_endorsements_up: number;
  counter_endorsements_down: number;
  counter_points: number;
  CsQuestionPoints?: Array<CsPointData>;
}

interface CsPointData {
  id: number;
  user_id: number;
  content: string;
  counter_quality_up: number;
  counter_quality_down: number;
  counter_flags: number;
  created_at: Date;
  updated_at: Date;
}

interface CsInformationPackageData {
  id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  CsInformationItems?: Array<CsInformationItemData>;
}

interface CsInformationItemData {
  id: number;
  type: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  content: string;
}

