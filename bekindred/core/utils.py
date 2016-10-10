from django.conf import settings
import sendgrid
from sendgrid.helpers.mail import Email, Content, Substitution, Mail
import urllib2 as urllib
from urlparse import parse_qs


def load_twitter_user_friends(social_user, *args, **kwargs):
    from friends.tasks import twitter_followers, twitter_friends

    if social_user:
        oauth_token = social_user.extra_data.get('oauth_token')
        oauth_secret = social_user.extra_data.get('oauth_token_secret')
        # Need for backward comparability
        if not (oauth_token and oauth_secret):
            access_token = social_user.extra_data['access_token']
            parsed_tokens = parse_qs(access_token)
            oauth_token = parsed_tokens['oauth_token'][0]
            oauth_secret = parsed_tokens['oauth_token_secret'][0]

        twitter_friends.apply_async(
            args=(social_user.user, oauth_token, oauth_secret), expires=600)
        twitter_followers.apply_async(
            args=(social_user.user, oauth_token, oauth_secret), expires=600)
    return None


def send_sg_mail(message_id, sender_name, body, to_email):
    sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)

    from_email = Email("do-not-reply@mail.persice.com")
    to_email = Email("andrii.soldatenko@gmail.com")
    body = Content("text/html",
                   body)
    subject = "I'm replacing the subject tag"
    mail = Mail(from_email, subject, to_email, body)
    mail.personalizations[0].add_substitution(
        Substitution("%pal_name%", sender_name)
    )
    mail.personalizations[0].add_substitution(
        Substitution("<%url%>",
                     "https://persice.com/messages/{}".format(message_id))
    )
    mail.set_template_id(settings.SENDGRID_TEMPLATE_ID)
    try:
        response = sg.client.mail.send.post(request_body=mail.get())
    except urllib.HTTPError as e:
        print e.read()
    print(response.status_code, response.body, response.headers)
