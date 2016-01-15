import re
from tastypie import fields
from tastypie.constants import ALL
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from tastypie.validation import Validation
from interests.models import Interest, InterestSubject, ReligiousView, \
    ReligiousIndex, PoliticalIndex, PoliticalView
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
        queryset = InterestSubject.objects.order_by('description')
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
        interest_subject = bundle.data.get('interest_subject').lower()
        try:
            subject, created = InterestSubject.objects.get_or_create(description=interest_subject)
            return super(InterestResource, self).obj_create(bundle, interest=subject)
        except IndexError as err:
            print err
        return super(InterestResource, self).obj_create(bundle, **kwargs)

    def obj_update(self, bundle, skip_errors=False, **kwargs):
        interest_subject = bundle.data['interest_subject'].lower()
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


class AbstractIndex(object):
    def dehydrate_name(self, bundle):
        return bundle.data['name'].lower()


class ReligiousIndexResource(ModelResource, AbstractIndex):
    class Meta:
        always_return_data = True
        queryset = ReligiousIndex.objects.order_by('name')
        resource_name = 'religious_index'
        fields = ['name']

        filtering = {
            'name': ALL
        }
        authentication = SessionAuthentication()
        authorization = Authorization()


class ReligiousViewResource(ModelResource):
    user = fields.OneToOneField(UserResource, 'user')
    religious_index = fields.ForeignKey(ReligiousIndexResource,
                                        'religious_index')

    class Meta:
        queryset = ReligiousView.objects.all()
        fields = ['user', 'religious_index', 'id']
        always_return_data = True
        resource_name = 'religious_view'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.GET.get('user_id')
        if not isinstance(user, int):
            try:
                user = int(user)
            except (TypeError, ValueError):
                user = request.user.id
        return super(ReligiousViewResource, self).get_object_list(request).\
            filter(user_id=user)

    def obj_create(self, bundle, **kwargs):
        religious_index = bundle.data.get('religious_index').lower()
        try:
            subject, created = ReligiousIndex.objects.get_or_create(name=religious_index)
            bundle.data['religious_index'] = '/api/v1/religious_index/{0}/'.format(subject.id)
            return super(ReligiousViewResource, self).obj_create(bundle, religious_index=subject)
        except IndexError as err:
            print err
        return super(ReligiousViewResource, self).obj_create(bundle, **kwargs)

    def obj_update(self, bundle, skip_errors=False, **kwargs):
        religious_index = bundle.data['religious_index'].lower()
        try:
            subject, created = ReligiousIndex.objects.get_or_create(name=religious_index)
            bundle.data['religious_index'] = '/api/v1/religious_index/{0}/'.format(subject.id)
            return super(ReligiousViewResource, self).obj_update(
                    bundle,
                    religious_index='/api/v1/religious_index/{0}/'.format(subject.id)
            )
        except IndexError as err:
            print err
        return self.save(bundle, skip_errors=skip_errors)

    def dehydrate(self, bundle):
        bundle.data["religious_view"] = bundle.obj
        return bundle


class PoliticalIndexResource(ModelResource, AbstractIndex):
    class Meta:
        always_return_data = True
        queryset = PoliticalIndex.objects.order_by('name')
        resource_name = 'political_index'
        fields = ['name']

        filtering = {
            'name': ALL
        }
        authentication = SessionAuthentication()
        authorization = Authorization()


class PoliticalViewResource(ModelResource):
    user = fields.OneToOneField(UserResource, 'user')
    political_index = fields.ForeignKey(PoliticalIndexResource,
                                        'political_index')

    class Meta:
        queryset = PoliticalView.objects.all()
        fields = ['user', 'political_index', 'id']
        always_return_data = True
        resource_name = 'political_view'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def get_object_list(self, request):
        user = request.GET.get('user_id')
        if not isinstance(user, int):
            try:
                user = int(user)
            except (TypeError, ValueError):
                user = request.user.id
        return super(PoliticalViewResource, self).get_object_list(request). \
            filter(user_id=user)

    def obj_create(self, bundle, **kwargs):
        political_index = bundle.data.get('political_index').lower()
        try:
            subject, created = PoliticalIndex.objects.get_or_create(name=political_index)
            bundle.data['political_index'] = '/api/v1/political_index/{0}/'.format(subject.id)
            return super(PoliticalViewResource, self).obj_create(bundle, political_index=subject)
        except IndexError as err:
            print err
        return super(PoliticalViewResource, self).obj_create(bundle, **kwargs)

    def obj_update(self, bundle, skip_errors=False, **kwargs):
        political_index = bundle.data['political_index'].lower()
        try:
            subject, created = PoliticalIndex.objects.get_or_create(name=political_index)
            bundle.data['political_index'] = '/api/v1/political_index/{0}/'.format(subject.id)
            return super(PoliticalViewResource, self).obj_update(
                    bundle,
                    political_index='/api/v1/political_index/{0}/'.format(subject.id)
            )
        except IndexError as err:
            print err
        return self.save(bundle, skip_errors=skip_errors)

    def dehydrate(self, bundle):
        bundle.data["political_view"] = bundle.obj
        return bundle
