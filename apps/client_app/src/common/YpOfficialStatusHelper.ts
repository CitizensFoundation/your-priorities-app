export class YpOfficialStatusHelper {

  static officialStatusOptions(t: Function) {
    return [
      {name: 'published', official_value: 0, translatedName: t('status.published'), translatedNamePlural: t('pluralStatus.published')},
      {name: 'successful', official_value: 2, translatedName: t('status.successful'), translatedNamePlural: t('pluralStatus.successful')},
      {name: 'failed', official_value: -2, translatedName: t('status.failed'), translatedNamePlural: t('pluralStatus.failed')},
      {name: 'in_progress', official_value: -1, translatedName: t('status.inProgress'), translatedNamePlural: t('pluralStatus.inVoting')}
    ]
  }

  static officialStatusOptionsName(official_status: number, t: Function) {
    var statues = YpOfficialStatusHelper.officialStatusOptions(t);
    var foundName = "Not found";
    statues.forEach((status) => {
      if (status.official_value==official_status) {
        foundName = status.translatedName;
      }
    });
    return foundName;
  }

  static officialStatusOptionsNamePlural(official_status: number, t: Function) {
    var statues = YpOfficialStatusHelper.officialStatusOptions(t);
    var foundName = "Not found";
    statues.forEach(function (status) {
      if (status.official_value==official_status) {
        foundName = status.translatedNamePlural;
      }
    });
    return foundName;
  }
 }
