import {EventGenerator} from './event-generator';
import {Event} from './event';

describe('Event', () => {

  it('instantiates from dto', () => {
    // given
    let dto: any = EventGenerator.givenAnyEventDto();

    // when
    let event: Event = Event.fromDto(dto);

    // then
    expect(event.name).toEqual(dto.name);
    expect(event.description).toEqual(dto.description);
    expect(event.hostedBy).toEqual(dto.hosted_by);
    expect(event.accessLevel).toEqual(dto.access_level);
  });
});
