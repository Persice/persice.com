from django.forms import ModelForm
from friends.models import Friend


class FriendForm(ModelForm):
    class Meta:
        model = Friend