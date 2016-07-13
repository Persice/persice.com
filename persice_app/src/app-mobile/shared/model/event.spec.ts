import {EventGenerator} from './event-generator';
import {Event} from './event';

describe('Event', () => {

  it('instantiates from dto', () => {
    // given
    let dto: any = EventGenerator.givenAnyEventDto();

    // when
    let event: Event = Event.fromDto(dto);

    // then
    expect(event.id).toEqual(dto.id);
    expect(event.name).toEqual(dto.name);
    expect(event.image).toEqual(dto.event_photo);
    expect(event.maxAttendees).toEqual(dto.max_attendees);
    expect(event.attendeesGoing).toEqual(dto.attendees_yes);
    expect(event.attendeesMaybe).toEqual(dto.attendees_maybe);
    expect(event.attendeesNotGoing).toEqual(dto.attendees_no);
    expect(event.spotsRemaining).toEqual(dto.spots_remaining);
    expect(event.locationName).toEqual(dto.location_name);
    expect(event.fullAddress).toEqual(dto.full_address);
    expect(event.description).toEqual(dto.description);
    expect(event.hostedBy).toEqual(dto.hosted_by);
    expect(event.accessLevel).toEqual(dto.access_level);
  });

  it('instantiates parses dates from dto', () => {
    // given
    let dto: any = EventGenerator.givenAnyEventDto();
    dto.starts_on = '2016-07-23T16:00:00';
    dto.ends_on = '2016-07-23T20:00:00';

    // when
    let event: Event = Event.fromDto(dto);

    // then
    expect(event.startDate.day).toEqual('23');
    expect(event.startDate.dayName).toEqual('Saturday');
    expect(event.startDate.hour).toEqual('6PM');
    expect(event.startDate.month).toEqual('Jul');
    expect(event.startDate.year).toEqual('2016');

    expect(event.endDate.day).toEqual('23');
    expect(event.endDate.dayName).toEqual('Saturday');
    expect(event.endDate.hour).toEqual('10PM');
    expect(event.endDate.month).toEqual('Jul');
    expect(event.endDate.year).toEqual('2016');
  });

  it('creates a preview of attendees', () => {
    // given
    let dto: any = EventGenerator.givenAnyEventDto();

    // when
    let event: Event = Event.fromDto(dto);

    // then
    expect(event.attendeesPreview).toEqual(
      [{image: dto.attendees_yes[0].image, isHost: dto.attendees_yes[0].is_organizer},
        {image: dto.attendees_yes[1].image, isHost: dto.attendees_yes[1].is_organizer},
        {image: dto.attendees_yes[2].image, isHost: dto.attendees_yes[2].is_organizer},
        {image: dto.attendees_yes[3].image, isHost: dto.attendees_yes[3].is_organizer}]
    );
  });
});
