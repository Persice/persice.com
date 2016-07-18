import { NumberGenerators } from '../generators/number-generators';
import { StringGenerators } from '../generators/string-generators';
import { NotificationModel } from './notification.model';

describe('Notification model', () => {

  it('instantiates', () => {
    // given
    let type: string = StringGenerators.givenAnyString();
    let title: string = StringGenerators.givenAnyString();
    let body: string = StringGenerators.givenAnyString();
    let autoclose: number = NumberGenerators.givenAnyNumber();

    // when
    let model: NotificationModel = new NotificationModel(
      type, title, body, autoclose
    );

    // then
    expect(model.type).toEqual(type);
    expect(model.title).toEqual(title);
    expect(model.body).toEqual(body);
    expect(model.autoclose).toEqual(autoclose);
  });
});
