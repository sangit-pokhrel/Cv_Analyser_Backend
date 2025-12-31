

export type CvAnalysisResponse = {
  success: boolean;
  data: {
    extractedData: {
      experience: string;
      education: string[];
      certifications: string[];
      languages: string[];
      totalYearsExperience: number;
    };
    _id: string;
    user: string;
    cvFileUrl: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    skillsDetected: string[];
    status: string;
    matchingTriggered: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    analysisResult: {
      overallScore: number;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
      skillsDetected: string[];
      extractedData: {
        experience: string;
        education: string[];
        certifications: string[];
        languages: string[];
        totalYearsExperience: number;
      };
      detailedAnalysis: {
        formatting: string;
        content: string;
        keywords: string;
        atsCompatibility: string;
      };
    };
    analyzedAt: string;
    overallScore: number;
  };
};
