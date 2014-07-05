import re
from django.contrib.auth.models import User
from django import forms
from django.forms import ModelForm, Textarea
from django_facebook.models import FacebookCustomUser
from .models import Subject, Goal, Offer


class GoalForm(forms.Form):
    description = forms.CharField(max_length=50)

    def __init__(self, user, *args, **kwargs):
        super(GoalForm, self).__init__(*args, **kwargs)
        self.user = user

    def clean(self):
        cleaned_data = super(GoalForm, self).clean()
        description = cleaned_data.get("description", False)

        sbj, dummy = Subject.objects.get_or_create(description=description)
        dummy, created = Goal.objects.get_or_create(user=self.user, goal=sbj)

        if not created:
            raise forms.ValidationError("Goal is already exists")
        return cleaned_data


class OfferForm(forms.Form):
    description = forms.CharField(max_length=50, required=True)

    def __init__(self, user, *args, **kwargs):
        super(OfferForm, self).__init__(*args, **kwargs)
        self.user = user

    def clean(self):
        cleaned_data = super(OfferForm, self).clean()
        description = cleaned_data.get("description")
        sbj, dummy = Subject.objects.get_or_create(description=description)

        goal = None
        try:
            goal = Goal.objects.get(user=self.user, goal=sbj)
        except Goal.DoesNotExist:
            pass
        if goal:
            raise forms.ValidationError("Goal could not equivalent to offer")

        dummy, created_offer = Offer.objects.get_or_create(user=self.user, offer=sbj)
        # TODO User A offer != User A goal
        if not created_offer:
            raise forms.ValidationError("Offer is already exists")
        return cleaned_data


class RegistrationForm(forms.Form):
    username = forms.CharField(label=u'Username', max_length=30)
    email = forms.EmailField(label=u'Email')
    password1 = forms.CharField(
        label=u'Password',
        widget=forms.PasswordInput()
    )
    password2 = forms.CharField(
        label=u'Password (Again)',
        widget=forms.PasswordInput()
    )

    def clean_password2(self):
        if 'password1' in self.cleaned_data:
            password1 = self.cleaned_data['password1']
            password2 = self.cleaned_data['password2']
        if password1 == password2:
            return password2
        raise forms.ValidationError('Passwords do not match.')

    def clean_username(self):
        username = self.cleaned_data['username']
        if not re.search(r'^\w+$', username):
            raise forms.ValidationError('Username can only contain '
                                        'alphanumeric characters and the underscore.')
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError('Username is already taken.')


class BiographyForm(ModelForm):
    class Meta:
        model = FacebookCustomUser
        fields = ['about_me']
        widgets = {
            'about_me': Textarea(attrs={'cols': 40, 'rows': 10}),
            }


class GoalUpdateForm(forms.Form):
    description = forms.CharField(max_length=50)


class OfferUpdateForm(forms.Form):
    description = forms.CharField(max_length=50)