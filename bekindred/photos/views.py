from django.core.urlresolvers import reverse_lazy, reverse
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.generic import DeleteView, CreateView, ListView
from django_facebook.models import FacebookCustomUser
from .models import Photo
from .forms import PhotoForm


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
    user = FacebookCustomUser.objects.get(pk=request.user.id)

    # Render list page with the documents and the form
    return render_to_response(
        'photos/upload_photo.html',
        {'documents': documents,
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