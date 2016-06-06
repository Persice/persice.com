import {
  it,
  describe,
  expect
} from '@angular/core/testing';
import {ConversationGenerators} from './conversation.model.generators';
import {Conversation} from './conversation.model';

describe('Conversation model', () => {

  it('instantiates', () => {
    // given
    let dto: any = ConversationGenerators.givenAnyConversationDto();

    // when
    let conversation = new Conversation(dto);

    // then
    expect(conversation.id).toEqual(dto.id);
    expect(conversation.name).toEqual(dto.first_name);
  });
});
