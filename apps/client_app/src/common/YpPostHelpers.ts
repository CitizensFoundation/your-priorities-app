export class YpPostHelpers {
  static structuredAnswersFormatted(post: YpPostData | undefined) {
    if (
      post &&
      post.public_data &&
      post.public_data.structuredAnswersJson &&
      post.Group.configuration &&
      post.Group.configuration.structuredQuestionsJson
    ) {
      const questionHash: Record<string, YpStructuredQuestionData> = {};
      let outText = '';
      post.Group.configuration.structuredQuestionsJson.forEach(
        question => {
          if (question.uniqueId) {
            questionHash[question.uniqueId] = question;
          }
        }
      );

      post.public_data.structuredAnswersJson.forEach(answer => {
        if (answer && answer.value) {
          const question = questionHash[answer.uniqueId];
          if (question) {
            outText += '<b>' + question.text + '</b>\n';
            outText += answer.value + '\n\n';
          }
        }
      });

      return outText;
    } else {
      return '';
    }
  }
}
