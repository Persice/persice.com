export function eventWidgetAsHtml(event) {
  return `<div class="mb-">
    <div class="event-summary">
      <div class="event-summary__details js-image-liquid imgLiquid_bgSize imgLiquid_ready" style="background-image: url(&quot;images/event-image.jpg&quot;); background-size: cover; background-position: center center; background-repeat: no-repeat;">
        <div class="event-summary__details__copy">
          <h3 class="event-summary__title">${event.name}</h3>
          <p class="event-summary__location">${event.location_name}</p>
          <p class="event-summary__date-n-time">Thursday, Nov 18, 10AM</p>
          <div class="layout layout--flush event-summary__meta ml0">
            <div class="layout__item 1/2">
              <div class="event-summary__meta__value">$50</div>
              <div class="event-summary__meta__label">Per person</div>
            </div>
            <div class="layout__item 1/2 text-right">
              <div class="event-summary__meta__value">${event.spots_remaining}</div>
              <div class="event-summary__meta__label">Spots left</div>
            </div>
          </div>
        </div> <img src="images/event-image.jpg" alt="Event title" style="display: none;"> </div>
      <div class="card__stat">
        <div class="layout layout--flush layout--middle text-center">
          <div class="layout__item 1/3">
            <div class="card-stat__vert"> <span class="card-stat__value">${event.cumulative_match_score}°</span> <span class="card-stat__label">Similar</span> </div>
          </div>
          <div class="layout__item 1/3 separated-left separated-right">
            <div class="card-stat__vert"> <span class="card-stat__value">${event.friend_attendees_count}</span> <span class="card-stat__label">Connections</span> </div>
          </div>
          <div class="layout__item 1/3 has-event-summary__status">
            <div class="event-summary__status event-summary__status--label">
              <div class="card-stat__vert"> <span class="card-stat__value">RSVP</span> </div>
            </div>
            <div class="event-summary__status event-summary__status--cannotgo hidden">
              <div class="event-summary__status__vert"> <span>Can't go</span> </div>
            </div>
            <div class="event-summary__status event-summary__status--maybe hidden">
              <div class="event-summary__status__vert"> <span>Maybe</span><br> </div>
            </div>
            <div class="event-summary__status event-summary__status--going">
              <div class="event-summary__status__vert"> <span>Going</span> </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
  <div class="message__system__hosted"> Event hosted by
    <a href=""><img class="avatar avatar--small" src="https://s3.amazonaws.com/uifaces/faces/twitter/sauro/128.jpg" alt="User profile">${event.hosted_by}</a>. 
  </div>`;
}
