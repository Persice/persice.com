from django import forms


class PhotoForm(forms.Form):
    photo = forms.FileField(
        label='Select a photo'
    )
