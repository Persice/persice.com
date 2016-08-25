export function eventWidgetAsHtml(event) {
  return `
  <style type="text/css">
    .message__text a {
      color: #39c9f5;
      font-weight: 600;
    }
    
    .event-summary__meta {
      border-top: 1px solid hsla(0,0%,100%,.4);
      padding-top: 7px;
      font-family: Montserrat,sans-serif;
    }
    
    .event-summary__status {
      line-height: 79px;
      display: block;
      font-weight: 700;
      position: relative;
      z-index: 4;
      margin-left: -1px;
      // margin-right: -1px;
    }
   
   .event-summary__status.event-summary__status--label {
      position: absolute;
      width: 100%;
      z-index: 1;
      margin-left: 0;
      font-family: Montserrat,sans-serif;
    }
    
    .event-summary__status.event-summary__status--cannotgo {
      background: #ec8672;
      color: #fff;
    }
    
    .event-summary__status.event-summary__status--maybe {
      background: #63727a;
      color: #fff;
    }
    
    .event-summary__status.event-summary__status--going {
      background: #a6e16c;
      color: #395919;
    }
    
    .has-event-summary__status {
      position: relative;
      cursor: pointer;
    }
    
    .card__stat .event-summary__status .event-summary__status__vert span {
      font-size: 14px;
      font-family: Montserrat,sans-serif;
    }
    
    .card__stat .event-summary__status .event-summary__status__vert {
      display: inline-block;
      line-height: 15px;
      vertical-align: middle;
    }
    
    .card__stat .event-summary__status {
      height: 76px;
      line-height: 76px;
      font-size: 13px;
    }
  </style>
  <div class="mb-">
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
            <!--<div class="event-summary__status event-summary__status&#45;&#45;label">-->
              <!--<div class="card-stat__vert"> <span class="card-stat__value">RSVP</span> </div>-->
            <!--</div>-->
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
