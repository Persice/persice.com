import re
from tastypie import fields
from tastypie.constants import ALL
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from tastypie.validation import Validation
from interests.models import Interest, InterestSubject
from photos.api.resources import UserResource


class InterestValidation(Validation):
    def is_valid(self, bundle, request=None):
        if not bundle.data:
            return {'__all__': 'Not quite what I had in mind.'}

        errors = {}

        interest_subject = bundle.data.get('interest_subject').lower()
        if not interest_subject:
            errors['error'] = ['Please use goal_subject']

        subject = None
        try:
            subject = InterestSubject.objects.filter(description=interest_subject)[0]
        except IndexError as err:
            print err

        user = re.findall(r'/(\d+)/', bundle.data['user'])[0]
        interests = Interest.objects.filter(interest_id=subject.id, user_id=user)

        if interests:
            errors['error'] = ['Interest already exists']

        return errors


class InterestSubjectResource(ModelResource):
    class Meta:
        always_return_data = True
        queryset = InterestSubject.objects.order_by('-description')
        resource_name = 'interest_subject'
        fields = ['description']

        filtering = {
            'description': ALL
        }
        authentication = SessionAuthentication()
        authorization = Authorization()

    def dehydrate_description(self, bundle):
        return bundle.data['description'].lower()


class InterestResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    interest = fields.ForeignKey(InterestSubjectResource, 'interest')

    class Meta:
        queryset = Interest.objects.all()
        fields = ['user', 'interest', 'id']
        always_return_data = True
        resource_name = 'interest'
        authentication = SessionAuthentication()
        authorization = Authorization()
        validation = InterestValidation()

    def get_object_list(self, request):
        user = request.GET.get('user_id', request.user.id)
        return super(InterestResource, self).get_object_list(request).filter(user_id=user)

    def obj_create(self, bundle, **kwargs):
        interest_subject = bundle.data.get('interest_subject')
        try:
            subject, created = InterestSubject.objects.get_or_create(description=interest_subject)
            return super(InterestResource, self).obj_create(bundle, interest=subject)
        except IndexError as err:
            print err
        return super(InterestResource, self).obj_create(bundle, **kwargs)

    def obj_update(self, bundle, skip_errors=False, **kwargs):
        interest_subject = bundle.data['interest_subject']
        try:
            subject, created = InterestSubject.objects.get_or_create(description=interest_subject)
            bundle.data['interest'] = '/api/v1/interest_subject/{0}/'.format(subject.id)
            return super(InterestResource, self).obj_update(bundle, interest='/api/v1/interest_subject/{0}/'.format(subject.id))
        except IndexError as err:
            print err
        return self.save(bundle, skip_errors=skip_errors)

    def dehydrate(self, bundle):
        bundle.data["interest_subject"] = bundle.obj
        return bundle