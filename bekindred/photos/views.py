from django.core.urlresolvers import reverse_lazy
from django.http import Http404
from django.views.generic import DeleteView, CreateView, ListView
from .models import Photo
from .forms import PhotoForm


class PhotoAddView(CreateView):
    model = Photo
    form_class = PhotoForm
    success_url = reverse_lazy('photo_list')
    template_name = 'photos/upload_photo.html'

    def get_form_kwargs(self):
        kwargs = super(PhotoAddView, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def form_valid(self, form):
        user = self.request.user
        form.instance.user = user
        return super(PhotoAddView, self).form_valid(form)


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