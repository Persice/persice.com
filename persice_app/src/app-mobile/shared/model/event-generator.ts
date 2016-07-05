import {Event} from "./event";

export class EventGenerator {

  public static givenAnyEventDto(): any {
    return {
      "access_level": "PUBLIC",
      "access_user_list": "",
      "attendees": [
      {
        "event": "/api/v1/event/112/",
        "id": 370,
        "is_invited": false,
        "is_organizer": true,
        "resource_uri": "/api/v1/member/370/",
        "rsvp": "yes",
        "updated": "2016-02-13T06:15:38",
        "user": "/api/v1/auth/user/58/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 442,
        "is_invited": false,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/442/",
        "rsvp": "yes",
        "updated": "2016-03-04T13:44:10.413619",
        "user": "/api/v1/auth/user/57/"
      }
    ],
      "attendees_maybe": [
      {
        "first_name": "Mirjana",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/03/08/fb_image_10207269494316005_1.jpg",
        "is_connection": false,
        "match_score": 5,
        "username": "minja10"
      },
      {
        "first_name": "Carol",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/06/09/fb_image_1377013529288779_1465499228.jpg",
        "is_connection": false,
        "match_score": 4,
        "username": "carol_flqmkqo_carolson"
      },
      {
        "first_name": "Goran",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2015/07/22/fb_image_10153458960662889.jpg",
        "is_connection": false,
        "match_score": 0,
        "username": "bajazetov"
      }
    ],
      "attendees_no": [

    ],
      "attendees_yes": [
      {
        "first_name": "SaÅ¡a",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/05/25/fb_image_560101450791647_1464153126.jpg",
        "is_connection": true,
        "match_score": 9,
        "username": "sasamacakanja"
      },
      {
        "first_name": "Thomas",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/03/17/fb_image_10152489084433844_1.jpg",
        "is_connection": false,
        "match_score": 6,
        "username": "thomasetracey"
      },
      {
        "first_name": "Katherine",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/06/16/fb_image_1665040063758720_1466114385.jpg",
        "is_connection": false,
        "match_score": 6,
        "username": "jdsmom28"
      },
      {
        "first_name": "Kranthi",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/06/09/fb_image_1377081385948668_1465499718.jpg",
        "is_connection": false,
        "match_score": 5,
        "username": "kranthi_mjhodgs_yemula"
      },
      {
        "first_name": "Tom",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/06/09/fb_image_103379010017189_1465498642.jpg",
        "is_connection": false,
        "match_score": 5,
        "username": "tom_jbzgasv_liman"
      },
      {
        "first_name": "Rishi",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/03/21/fb_image_10206602257517295.jpg",
        "is_connection": false,
        "match_score": 4,
        "username": "reesespieces"
      },
      {
        "first_name": "Amy",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/06/09/fb_image_1379086882402797_1465498961.jpg",
        "is_connection": false,
        "match_score": 3,
        "username": "amy_iazconr_shepard"
      },
      {
        "first_name": "Mike",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/05/27/fb_image_1374540312867775_1464358136.jpg",
        "is_connection": false,
        "match_score": 3,
        "username": "mike_vgkxitx_putnam"
      },
      {
        "first_name": "Bill",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/06/09/fb_image_1393761684271564_1465503259.jpg",
        "is_connection": false,
        "match_score": 3,
        "username": "bill_kmvtrvb_sharpeman"
      },
      {
        "first_name": "Ruth",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/06/09/fb_image_1381702852144104_1465497270.jpg",
        "is_connection": false,
        "match_score": 3,
        "username": "ruth_mlyyiff_fergiestein"
      },
      {
        "first_name": "John",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/06/09/fb_image_1378195659169926_1465502021.jpg",
        "is_connection": false,
        "match_score": 2,
        "username": "john_uopbema_johnson"
      },
      {
        "first_name": "Agnes",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2015/07/21/fb_image_10153526597374470.jpg",
        "is_connection": false,
        "match_score": 1,
        "username": "agnescasodi"
      },
      {
        "first_name": "Michael",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2015/05/27/fb_image_10153429822254363.jpg",
        "is_connection": false,
        "match_score": 1,
        "username": "michaelmoss"
      },
      {
        "first_name": "Zoran",
        "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2015/07/22/fb_image_10153110101807998.jpg",
        "is_connection": false,
        "match_score": 0,
        "username": "zoranu"
      },
      {
        "first_name": "Samantha",
        "image": null,
        "is_connection": false,
        "match_score": 0,
        "username": "samantha_gymxleo_james"
      },
      {
        "first_name": "SaÅ¡a",
        "image": null,
        "is_connection": false,
        "match_score": 0,
        "username": "sasamacakanja1"
      }
    ],
      "city": "",
      "country": "usa",
      "cumulative_match_score": 51,
      "description": "I'm taking a few colleagues mountain biking this weekend. All of us are passionate about tech startups and would love to connect with other startup geeks who like to mountain bike. We plan to meet at the base of China Camp at 9am. NOTE: The trail is pretty steep, so this ride is not for beginners. Afterwards, we'll grab lunch somewhere nearby in San Rafael. ",
      "distance": [
      6223,
      "miles"
    ],
      "ends_on": "2016-07-23T17:00:00",
      "event_photo": "https://d2v6m3k9ul63ej.cloudfront.net/event_photos/2016/05/13/mountain-biking.jpg",
      "friend_attendees_count": 2,
      "full_address": "sf",
      "hosted_by": "Thomas Tracey",
      "id": 112,
      "location": "38.0055977,-122.49670029999999",
      "location_name": "China Camp State Park",
      "max_attendees": 15,
      "members": [
      {
        "event": "/api/v1/event/112/",
        "id": 368,
        "is_invited": false,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/368/",
        "rsvp": "yes",
        "updated": "2016-02-13T06:15:35",
        "user": "/api/v1/auth/user/15/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 370,
        "is_invited": false,
        "is_organizer": true,
        "resource_uri": "/api/v1/member/370/",
        "rsvp": "yes",
        "updated": "2016-02-13T06:15:38",
        "user": "/api/v1/auth/user/58/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 346,
        "is_invited": false,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/346/",
        "rsvp": "yes",
        "updated": "2015-12-12T14:02:45",
        "user": "/api/v1/auth/user/5/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 279,
        "is_invited": true,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/279/",
        "rsvp": "yes",
        "updated": "2015-11-28T14:16:28",
        "user": "/api/v1/auth/user/27/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 280,
        "is_invited": true,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/280/",
        "rsvp": "yes",
        "updated": "2015-11-28T14:16:42",
        "user": "/api/v1/auth/user/17/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 281,
        "is_invited": true,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/281/",
        "rsvp": "yes",
        "updated": "2015-11-28T14:16:28",
        "user": "/api/v1/auth/user/30/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 282,
        "is_invited": true,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/282/",
        "rsvp": "yes",
        "updated": "2015-11-28T14:17:18",
        "user": "/api/v1/auth/user/25/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 283,
        "is_invited": true,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/283/",
        "rsvp": "yes",
        "updated": "2015-11-28T14:16:28",
        "user": "/api/v1/auth/user/24/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 284,
        "is_invited": true,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/284/",
        "rsvp": "yes",
        "updated": "2015-11-28T14:16:31",
        "user": "/api/v1/auth/user/21/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 285,
        "is_invited": true,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/285/",
        "rsvp": "yes",
        "updated": "2015-11-28T14:16:24",
        "user": "/api/v1/auth/user/31/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 286,
        "is_invited": true,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/286/",
        "rsvp": "yes",
        "updated": "2015-11-28T14:16:24",
        "user": "/api/v1/auth/user/11/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 287,
        "is_invited": false,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/287/",
        "rsvp": "maybe",
        "updated": "2015-11-28T14:16:42",
        "user": "/api/v1/auth/user/29/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 288,
        "is_invited": false,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/288/",
        "rsvp": "maybe",
        "updated": "2015-11-28T14:16:36",
        "user": "/api/v1/auth/user/28/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 385,
        "is_invited": false,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/385/",
        "rsvp": "yes",
        "updated": "2016-02-13T06:15:34",
        "user": "/api/v1/auth/user/13/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 277,
        "is_invited": false,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/277/",
        "rsvp": "yes",
        "updated": "2015-11-21T11:24:43.771470",
        "user": "/api/v1/auth/user/36/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 399,
        "is_invited": false,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/399/",
        "rsvp": "yes",
        "updated": "2016-02-13T06:15:26",
        "user": "/api/v1/auth/user/60/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 410,
        "is_invited": true,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/410/",
        "rsvp": "yes",
        "updated": "2016-02-21T15:24:08",
        "user": "/api/v1/auth/user/9/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 416,
        "is_invited": false,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/416/",
        "rsvp": "maybe",
        "updated": "2016-02-21T15:24:15",
        "user": "/api/v1/auth/user/7/"
      },
      {
        "event": "/api/v1/event/112/",
        "id": 442,
        "is_invited": false,
        "is_organizer": false,
        "resource_uri": "/api/v1/member/442/",
        "rsvp": "yes",
        "updated": "2016-03-04T13:44:10.413619",
        "user": "/api/v1/auth/user/57/"
      }
    ],
      "name": "Mountain Biking + Lunch with Startup Geeks",
      "point": "POINT (-122.4967002999999863 38.0055977000000027)",
      "repeat": "Y",
      "resource_uri": "/api/v1/event/112/",
      "spots_remaining": -1,
      "starts_on": "2016-07-23T16:00:00",
      "state": "",
      "street": "",
      "total_attendees": 16,
      "zipcode": ""
    };
  }

  public static givenAnyEvent(): Event {
    return new Event(this.givenAnyEventDto());
  }
}
