import _ from 'lodash';
import { YpAccessHelpers } from './YpAccessHelpers';

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
      const showDescriptionBeforeIdHash: Record<string, YpStructuredQuestionData>  = {};
      const showDescriptionAfterIdHash: Record<string, YpStructuredQuestionData>  = {};
      let outText = '';
      post.Group.configuration.structuredQuestionsJson.forEach(
        question => {
          if (question.uniqueId) {
            questionHash[question.uniqueId] = question;
          } else {
            if (question.showBeforeAnswerId) {
              showDescriptionBeforeIdHash[question.showBeforeAnswerId] = question;
            }

            if (question.showAfterAnswerId) {
              showDescriptionAfterIdHash[question.showAfterAnswerId] = question;
            }
          }
        }
      );

      post.public_data.structuredAnswersJson.forEach(answer => {
        if (answer && answer.value) {
          const question = questionHash[answer.uniqueId];
          if (question) {
            if (showDescriptionBeforeIdHash[answer.uniqueId]) {
              outText+=showDescriptionBeforeIdHash[answer.uniqueId].text+"\n\n";
            }
            outText += '<b>' + question.text + '</b>\n';

            if (answer.value) {
              outText+=answer.value+"\n\n";
            } else {
              outText+="\n\n";
            }

            if (showDescriptionAfterIdHash[answer.uniqueId]) {
              outText+=showDescriptionAfterIdHash[answer.uniqueId].text+"\n\n";
            }
          }
        }
      });

      return outText;
    } else {
      return '';
    }
  }

  static uniqueInDomain (array: Array<YpGroupData>, domainId: number) {
    const newArray: Array<YpGroupData> = [];
    const ids: Record<number, YpGroupData> = {};
    _.each(array, (item) => {
      if (!ids[item.id]) {
        //@ts-ignore
        ids[item.id] = item.id;
        if (!item.configuration) {
          item.configuration = {canAddNewPosts: true}
        }
        if (item.Community && item.Community.domain_id==domainId &&
           (item.configuration.canAddNewPosts || YpAccessHelpers._hasAdminRights(item.id, window.appUser!.adminRights!.GroupAdmins))) {
          newArray.push(item);
        } else {
          console.log("Ignoring group:"+item.name);
        }
      }
    });
    return newArray;
  }
}
