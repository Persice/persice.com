import re
from tastypie import fields
from tastypie.constants import ALL
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from tastypie.validation import Validation
from interests.models import Interest
from photos.api.resources import UserResource


class InterestValidation(Validation):
    def is_valid(self, bundle, request=None):
        if not bundle.data:
            return {'__all__': 'Not quite what I had in mind.'}

        errors = {}

        description = bundle.data.get('description')
        user = re.findall(r'/(\d+)/', bundle.data['user'])[0]

        interests = Interest.objects.filter(description=description, user_id=user)

        if interests:
            errors['error'] = ['Interest already exists']

        return errors


class InterestResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        queryset = Interest.objects.all()
        resource_name = 'interest'
        always_return_data = True
        fields = ['description', 'id']
        validation = InterestValidation()
        authentication = SessionAuthentication()
        authorization = Authorization()

        filtering = {
            'description': ALL
        }

    def get_object_list(self, request):
        user = request.GET.get('user_id')
        if user:
            return super(InterestResource, self).get_object_list(request).filter(user_id=user)
        else:
            return super(InterestResource, self).get_object_list(request).distinct('description')

    def dehydrate_description(self, bundle):
        return bundle.data['description'].lower()