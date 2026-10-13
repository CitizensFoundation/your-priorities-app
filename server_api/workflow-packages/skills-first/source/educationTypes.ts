interface EducationTypeInfo {
  code: string;
  phrases: string[];
}
// educationTypes.ts
export enum EducationType {
  HighSchool = "High school", // Type1: High school degree or completion.
  CollegeCoursework = "Some college", // Type2: College coursework or study at a college/university.
  AssociatesDegree = "Associate's degree", // Type3: Associate's degree or equivalent.
  BachelorsDegree = "Bachelor's degree", // Type4: Bachelor's degree or equivalent.
  MastersDegree = "Master's degree", // Type5: Master's degree or equivalent.
  DoctoralDegree = "Doctoral degree",
  None = "none",
}

export const EducationTypes: Record<EducationType, EducationTypeInfo> = {
  [EducationType.HighSchool]: {
    code: "High school",
    phrases: [
      "high school",
      "high school degree",
      "high school degree completion",
    ],
  },
  [EducationType.CollegeCoursework]: {
    code: "Some college",
    phrases: [
      "some college",
      "college coursework",
      "study at a college",
      "study at a university",
    ],
  },
  [EducationType.AssociatesDegree]: {
    code: "Associate's degree",
    phrases: [
      "associate’s degree",
      "associate degree",
      "associates degree",
      "two-year college degree",
      "community college degree",
      "associate's degree",
    ],
  },
  [EducationType.BachelorsDegree]: {
    code: "Bachelor's degree",
    phrases: [
      "bachelor's degree",
      "bachelor’s degree",
      "bachelor degree",
      "bachelors degree",
      "college degree",
      "university degree",
      "four-year college degree",
    ],
  },
  [EducationType.MastersDegree]: {
    code: "Master's degree",
    phrases: [
      "master’s degree",
      "master's degree",
      "master degree",
      "masters degree",
      "graduate degree",
      "post-bachelors degree",
    ],
  },
  [EducationType.DoctoralDegree]: {
    code: "Doctoral degree",
    phrases: [
      "juris doctor",
      "doctoral degree",
      "law degree",
      "doctor of philosophy",
      "Ph.D.",
      "Psy.D.",
      "medical degree",
      "MD",
      "dental degree",
    ],
  },
  [EducationType.None]: {
    code: "None",
    phrases: ["none", "no degree", "no degree required", "no degree needed"],
  },
};
