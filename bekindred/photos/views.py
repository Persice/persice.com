from django.core.urlresolvers import reverse_lazy, reverse
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import render_to_response, render
from django.template import RequestContext
from django.views.generic import DeleteView, CreateView, ListView
from open_facebook import OpenFacebook
from members.models import FacebookCustomUserActive
from .models import Photo, FacebookPhoto
from .forms import PhotoForm, FacebookPhotoCreateForm


def list(request):
    # Handle file upload
    if request.method == 'POST':
        form = PhotoForm(request.user, request.POST, request.FILES)
        if form.is_valid():
            newdoc = Photo(photo=request.FILES['photo'], user=request.user)
            newdoc.save()

            # Redirect to the document list after POST
            return HttpResponseRedirect(reverse_lazy('photo_list'))
    else:
        form = PhotoForm(user=request.user) # A empty, unbound form

    # Load documents for the list page
    documents = Photo.objects.filter(user=request.user)
    user = FacebookCustomUserActive.objects.get(pk=request.user.id)
    facebook_photos = FacebookPhoto.objects.filter(user=request.user)
    result_list = []
    for doc in documents:
        result_list.append(doc)

    for photo in facebook_photos:
        result_list.append(photo)

    # Render list page with the documents and the form
    return render_to_response(
        'photos/upload_photo.html',
        {'documents': result_list,
         'user': user,
         'form': form},
        context_instance=RequestContext(request)
    )


class PhotoListView(ListView):
    model = Photo
    template_name = 'photos/list.html'

    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)


class PhotoDeleteView(DeleteView):
    model = Photo
    template_name = 'photos/confirm_delete_photo.html'
    success_url = '/goals/'

    def get_object(self, queryset=None):
        """ Hook to ensure object is owned by request.user. """
        obj = super(PhotoDeleteView, self).get_object()
        if not obj.user == self.request.user:
            raise Http404
        return obj


class CreateFacebookPhoto(CreateView):
    model = FacebookPhoto
    template_name = 'photos/create_photo_form.html'
    form_class = FacebookPhotoCreateForm
    fields = ['photo']
    success_url = '/photo/create/'

    def get_form_kwargs(self):
        kwargs = super(CreateFacebookPhoto, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def form_valid(self, form):
        user = self.request.user
        form.instance.user = user
        return super(CreateFacebookPhoto, self).form_valid(form)

    def get_context_data(self, **kwargs):
        fb_user = FacebookCustomUserActive.objects.get(id=self.request.user.id)
        if fb_user.facebook_id and fb_user.access_token:
            facebook = OpenFacebook(fb_user.access_token)
            data = facebook.get('me/photos/uploaded', fields='picture')['data']
        else:
            data = {}
        kwargs['facebook_photos'] = data
        return super(CreateFacebookPhoto, self).get_context_data(**kwargs)
