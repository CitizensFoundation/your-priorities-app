interface AoiPromptData {
  id: number;
  left_choice_id: number;
  right_choice_id: number;
  created_at: string;
  updated_at: string;
  votes_count: number;
  left_choice_text: string;
  right_choice_text: string;
  appearance_id?: number;
}

interface AoiQuestionData {
  id: number;
  creator_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  choices_count: number;
  prompts_count: number;
  active: boolean;
  information: string;
  site_id: number;
  local_identifier: string;
  votes_count: number;
  it_should_autoactivate_ideas: boolean;
  inactive_choices_count: number;
  uses_catchup: boolean;
  show_results: boolean;
  version: string;
  appearance_id: string;
  picked_prompt_id: number;
  visitor_votes: number;
  visitor_ideas: number;
}

interface AoiEarlData {
  name?: string;
  question_id?: number;
  active: boolean;
  configuration?: AoiEarlConfigurationData;
  question?: AoiQuestionData;
}

interface AoiAnswerToVoteOnData {
  imageUrl?: string;
  content: string;
  choiceId: number;
  isGeneratingImage?: boolean;
}

interface AoiEarlConfigurationData {
  welcome_message?: string;
  accept_new_ideas?: boolean;
  external_goal_params_whitelist?: string;
  external_goal_trigger_url?: string;
  hide_results: boolean;
  hide_analysis: boolean;
  hide_explain: boolean;
  hide_skip: boolean;
  welcome_html: string;
  target_votes: number;
  lock_results_until_target_votes: boolean;
  theme_color: string;
  analysis_config: {
    analyses: AoiSurveyAnalysisData[];
  };
}

interface AoiEarlResponse {
  earlContainer: AoiEarlContainerData;
  prompt: AoiPromptData;
  question: AoiQuestionData;
  csrfToken: string;
  isAdmin: boolean;
}

interface AoiVoteResponse {
  prompt_id: number;
  question_id: number;
  appearance_lookup: string;
  left_choice_id: number;
  left_choice_url: string;
  message?: string;
  newleft: string;
  newright: string;
  right_choice_id: number;
  right_choice_url: string;
  csrfToken: string;
}

interface AoiVoteData {
  time_viewed: number;
  prompt_id: number;
  direction: string;
  appearance_lookup: string;
}

interface AoiVoteSkipData {
  time_viewed: number;
  cant_decide_reason: string;
  appearance_lookup: string;
}

interface AoiEarlContainerData {
  earl: AoiEarlData;
}

interface AnalysisTypeData {
  label: string;
  contextPrompt?: string;
  analysis?: string;
  ideaRowsFromServer?: AoiChoiceData[];
}


interface AoiAnalysisResponse {
  cachedAnalysis?: string;
  selectedChoices: AoiChoiceData[];
}

interface AoiSurveyAnalysisData {
  ideasLabel: string;
  ideasIdsRange: number;
  analysisTypes: AnalysisTypeData[]
  ideaRows?: AoiChoiceData[];
}

interface AoiAddIdeaResponse {
  error?: string;
  flagged: boolean;
  active: boolean;
  choice: AoiChoiceData;
}

interface AoiChoiceData {
  id: number;
  item_id: number;
  question_id: number;
  position: number;
  ratings: number;
  user_created?: boolean;
  created_at: Date;
  updated_at: Date;
  request_id: number;
  prompt_id: number;
  active: boolean;
  tracking: string;
  score: number;
  local_identifier: string;
  prompts_on_the_left_count: number;
  prompts_on_the_right_count: number;
  wins: number;
  losses: number;
  prompts_count: number;
  data: AoiAnswerToVoteOnData;
  creator_id: number;
  version: number;
}

interface AoiConfigurationData {
  earl?: AoiEarlData;
}

interface AoiTranslationAnswerInData {
  answerToTranslate: string;
}

interface AoiTranslationAnswerOutData {
  translatedContent: string;
  choiceId: number;
}

interface AoiTranslationQuestionInData {
  questionToTranslate: string;
}

interface AoiTranslationQuestionOutData {
  translatedContent: string;
}
