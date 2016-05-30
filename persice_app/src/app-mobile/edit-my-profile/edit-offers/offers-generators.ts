export class OffersGenerators {
  public static givenAnOfferWithSubjectDto(subject: string): any {
    return {
      goal: "/api/v1/subject/3/",
      id: 3,
      resource_uri: "/api/v1/offer/3/",
      subject: subject,
      user: "/api/v1/auth/user/3/"
    };
  }
}
