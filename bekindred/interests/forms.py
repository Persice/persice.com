from django import forms
from .models import Interest


class InterestCreateForm(forms.ModelForm):
    class Meta:
        model = Interest
        fields = ('description',)
        unique_together = ('user', 'description')

    def __init__(self, user, *args, **kwargs):
        super(InterestCreateForm, self).__init__(*args, **kwargs)
        self.user = user

    def clean(self):
        cleaned_data = super(InterestCreateForm, self).clean()
        description = cleaned_data.get("description")
        interest_count = Interest.objects.filter(user=self.user).count()
        if interest_count == 5:
            raise forms.ValidationError("Users can enter a max of 5 interests")
        try:
            interest = Interest.objects.get(user=self.user, description=description.lower())
            if interest:
                raise forms.ValidationError("Interest is already exists")
        except Interest.DoesNotExist:
            pass

        return cleaned_data


class InterestUpdateForm(forms.ModelForm):
    class Meta:
        model = Interest
        fields = ('description',)
        unique_together = ('user', 'description')

    def __init__(self, user, *args, **kwargs):
        super(InterestUpdateForm, self).__init__(*args, **kwargs)
        self.user = user

    def clean(self):
        cleaned_data = super(InterestUpdateForm, self).clean()
        description = cleaned_data.get("description")
        try:
            interest = Interest.objects.get(user=self.user, description=description.lower())
            if interest:
                raise forms.ValidationError("Interest is already exists")
        except Interest.DoesNotExist:
            pass

        return cleaned_data