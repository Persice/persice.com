export class GoalsGenerators {
    public static givenAGoalWithSubjectDto(subject: string): any {
        return {
            goal: "/api/v1/subject/3/",
            id: 3,
            resource_uri: "/api/v1/goal/3/",
            subject: subject,
            user: "/api/v1/auth/user/3/"
        }
    }
}