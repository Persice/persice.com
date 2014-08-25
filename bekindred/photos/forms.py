from django import forms
from interests.models import Interest
from photos.models import Photo


class PhotoForm(forms.Form):
    photo = forms.FileField()

    def __init__(self, user, *args, **kwargs):
        super(PhotoForm, self).__init__(*args, **kwargs)
        self.user = user

    def clean(self):
        cleaned_data = super(PhotoForm, self).clean()
        photo_count = Photo.objects.filter(user=self.user).count()
        if photo_count == 5:
            raise forms.ValidationError("Users can upload a max of 5 interests")
        return cleaned_data
