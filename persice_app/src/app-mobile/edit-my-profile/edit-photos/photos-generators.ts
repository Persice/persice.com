export class PhotosGenerators {
  public static givenPhotoWithDataDto(order: number): any {
    return {
      cropped_photo: '/assets/images/empty_avatar.png',
      id: 418,
      order: order,
      photo: 'https://scontent.xx.fbcdn.net/v/t1.0-9/10923304_583840381751087_1534826564773193173_n.jpg?oh=9eb9d5b42d4e6ec547216cf56d7c0a85&oe=57D1C287',
      resource_uri: '/api/v1/photo/418/',
      user: '/api/v1/auth/user/57/'
    };

  }
}
