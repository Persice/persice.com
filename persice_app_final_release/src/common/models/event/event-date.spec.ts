import { EventDate } from './event-date';

describe('Even date', () => {

  it('instantiates', () => {
    // given
    var anyHour = '10pm';
    var anyDay = '13';
    var anyDayName = 'Monday';
    var anyDayNameShort = 'Mon'
    var anyMonth = 'July';
    var anyYear = '2016';

    // when
    let eventDate: EventDate = new EventDate(anyHour, anyDay, anyDayName, anyDayNameShort, anyMonth, anyYear);

    // then
    expect(eventDate.hour).toEqual(anyHour);
    expect(eventDate.day).toEqual(anyDay);
    expect(eventDate.dayName).toEqual(anyDayName);
    expect(eventDate.month).toEqual(anyMonth);
    expect(eventDate.year).toEqual(anyYear);
  });
});
